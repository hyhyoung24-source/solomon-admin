
import Link from 'next/link'
import { ArrowRight, Users, UserPlus } from "lucide-react"
import { createClient } from "@/utils/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const { count } = await supabase.from('users').select('*', { count: 'exact', head: true })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/users" className="block">
          <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
              <h3 className="tracking-tight text-sm font-medium">총 사용자</h3>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              현재 등록된 사용자 수
            </p>
          </div>
        </Link>
        <Link href="/users/create" className="block">
          <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
              <h3 className="tracking-tight text-sm font-medium">사용자 등록</h3>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              바로가기 <ArrowRight className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              새로운 계정을 생성합니다
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
