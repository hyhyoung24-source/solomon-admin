
import Link from 'next/link'
import { ArrowRight, Users, UserPlus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/users" className="block">
          <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Users</h3>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 from last month
            </p>
          </div>
        </Link>
        <Link href="/users/create" className="block">
          <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 mb-2">
              <h3 className="tracking-tight text-sm font-medium">Register User</h3>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              Go to Form <ArrowRight className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Create a new account
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
