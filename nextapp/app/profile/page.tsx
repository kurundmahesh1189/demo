import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { signOut } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex gap-3">
          <a href="/" className="text-sky-400 hover:text-sky-300 text-sm">← App</a>
          <a href="/progress" className="text-sky-400 hover:text-sky-300 text-sm">Progress</a>
        </div>
      </div>

      {/* User card */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex items-center gap-5 mb-8">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt="avatar"
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-xl font-semibold">{session.user.name}</p>
          <p className="text-slate-400 text-sm">{session.user.email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
          className="ml-auto"
        >
          <button className="px-4 py-2 rounded-xl text-sm bg-slate-700 hover:bg-slate-600 transition-colors">
            Sign out
          </button>
        </form>
      </div>

      {/* Generation history */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Generations ({generations.length})</h2>
        {generations.length === 0 ? (
          <p className="text-slate-400 text-sm">No generations yet. <a href="/" className="text-sky-400 hover:text-sky-300">Generate your first 3P →</a></p>
        ) : (
          <div className="space-y-3">
            {generations.map((g) => (
              <div key={g.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{g.domain}</span>
                  <span className="text-xs text-slate-400 capitalize">{g.category}</span>
                </div>
                <div className="text-slate-400 text-xs">
                  {new Date(g.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
