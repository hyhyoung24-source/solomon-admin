
import Link from "next/link"
import { LayoutDashboard, Users, UserPlus, LogOut, Network, FileText } from "lucide-react"

export function Sidebar() {
    return (
        <div className="flex h-screen w-64 flex-col border-r bg-zinc-900 text-white">
            <div className="flex h-16 items-center border-b border-zinc-800 px-6">
                <h1 className="text-xl font-bold">Solomon Admin</h1>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-zinc-800"
                >
                    <LayoutDashboard size={20} />
                    <span>대시보드</span>
                </Link>
                <div className="pt-4">
                    <p className="px-3 text-xs font-semibold uppercase text-zinc-500">사용자 관리</p>
                    <div className="mt-2 space-y-1">
                        <Link
                            href="/organization"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-zinc-800"
                        >
                            <Network size={20} />
                            <span>조직도</span>
                        </Link>
                        <Link
                            href="/users"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-zinc-800"
                        >
                            <Users size={20} />
                            <span>사용자 목록</span>
                        </Link>
                        <Link
                            href="/users/create"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-zinc-800"
                        >
                            <UserPlus size={20} />
                            <span>계정 등록</span>
                        </Link>
                    </div>
                </div>
                <div className="pt-4">
                    <p className="px-3 text-xs font-semibold uppercase text-zinc-500">양식 관리</p>
                    <div className="mt-2 space-y-1">
                        <Link
                            href="/forms"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-zinc-800"
                        >
                            <FileText size={20} />
                            <span>양식 목록</span>
                        </Link>
                    </div>
                </div>
            </nav >
            <div className="border-t border-zinc-800 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-white hover:bg-zinc-800">
                    <LogOut size={20} />
                    <span>로그아웃</span>
                </button>
            </div>
        </div >
    )
}
