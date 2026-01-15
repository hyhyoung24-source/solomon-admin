
import Link from "next/link"
import { LayoutDashboard, Users, UserPlus, Settings, LogOut } from "lucide-react"

export function Sidebar() {
    return (
        <div className="flex h-screen w-64 flex-col border-r bg-zinc-900 text-white">
            <div className="flex h-16 items-center border-b border-zinc-800 px-6">
                <h1 className="text-xl font-bold">Solomon Admin</h1>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <div className="pt-4">
                    <p className="px-3 text-xs font-semibold uppercase text-zinc-500">User Management</p>
                    <div className="mt-2 space-y-1">
                        <Link
                            href="/users"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        >
                            <Users size={20} />
                            <span>Users</span>
                        </Link>
                        <Link
                            href="/users/create"
                            className="flex items-center gap-3 rounded-lg bg-zinc-800 px-3 py-2 text-white"
                        >
                            <UserPlus size={20} />
                            <span>Register Account</span>
                        </Link>
                    </div>
                </div>
            </nav>
            <div className="border-t border-zinc-800 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}
