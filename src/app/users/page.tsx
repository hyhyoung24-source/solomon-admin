
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

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const supabase = await createClient();

    // Try to fetch users from the 'users' table
    const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

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
                <h1 className="text-2xl font-bold tracking-tight">Active Users</h1>
                <p className="text-muted-foreground">
                    A list of all users currently registered using the custom Postgres auth system.
                </p>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Status</TableHead>
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
                                    <Badge variant="outline">{user.dept_id || "N/A"}</Badge>
                                </TableCell>
                                <TableCell>{user.position}</TableCell>
                                <TableCell>
                                    {user.created_at
                                        ? new Date(user.created_at).toLocaleDateString()
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge className="bg-green-600 hover:bg-green-700">
                                        Active
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!users || users.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No users found in the database.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
