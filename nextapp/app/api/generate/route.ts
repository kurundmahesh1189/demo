import { auth } from "@/lib/auth";
import { anthropic, parseGenerationResult } from "@/lib/claude";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Simple in-memory rate limiter: max 10 requests per user per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { domain } = await req.json();

    if (!domain || typeof domain !== "string" || domain.trim().length === 0) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const cleanDomain = domain.trim().slice(0, 200);

    // Rate limit authenticated users; unauthenticated users get 3 per session via client
    if (session?.user?.id) {
      if (!checkRateLimit(session.user.id)) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again in a minute." },
          { status: 429 }
        );
      }
    }

    // Streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullText = "";

          const claudeStream = anthropic.messages.stream({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 512,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: buildUserPrompt(cleanDomain) }],
          });

          for await (const chunk of claudeStream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              fullText += chunk.delta.text;
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }

          // Parse and persist if user is signed in
          if (session?.user?.id) {
            try {
              const result = parseGenerationResult(fullText);
              await prisma.generation.create({
                data: {
                  userId: session.user.id,
                  domain: result.domain,
                  category: result.category,
                  output: result.properties,
                },
              });
            } catch {
              // Don't fail the stream if persistence fails
            }
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "AI generation failed";
          controller.enqueue(encoder.encode(`\n__ERROR__:${msg}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
