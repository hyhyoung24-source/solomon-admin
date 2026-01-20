
import { createClient } from "@/utils/supabase/server";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserActionsMenu } from "@/components/users/user-actions-menu";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const supabase = await createClient();

    const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

    // Fetch departments for lookup and selection
    const { data: departments } = await supabase
        .from("departments")
        .select("id, name")
        .order("name");

    const deptMap = new Map(departments?.map(d => [d.id, d.name]) || []);

    if (error) {
        return (
            <div className="p-8 text-red-500">
                <h2 className="font-bold">Error loading users</h2>
                <p>{error.message}</p>
                <p className="text-sm mt-2 text-gray-500">
                    Tip: Ensure the 'users' table exists in your Supabase database.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-2 mb-8">
                <h1 className="text-2xl font-bold tracking-tight">사용자 목록</h1>
                <p className="text-muted-foreground">
                    등록된 모든 사용자 현황입니다.
                </p>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">프로필</TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>이메일</TableHead>
                            <TableHead>부서</TableHead>
                            <TableHead>직책</TableHead>
                            <TableHead>가입일</TableHead>
                            <TableHead className="text-right">상태</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage
                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                        />
                                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {deptMap.get(user.dept_id) || user.dept_id || "미배정"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user.position}</TableCell>
                                <TableCell>
                                    {user.created_at
                                        ? new Date(user.created_at).toLocaleDateString()
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge className="bg-green-600 hover:bg-green-700">
                                        활동중
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <UserActionsMenu user={user} departments={departments || []} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!users || users.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    등록된 사용자가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
