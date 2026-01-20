"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteUser, updateUser } from "@/app/users/actions";

interface User {
    id: string;
    name: string;
    email: string;
    dept_id: string;
    position: string;
}

interface Department {
    id: string;
    name: string;
}

interface UserActionsMenuProps {
    user: User;
    departments: Department[];
}

export function UserActionsMenu({ user, departments }: UserActionsMenuProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        dept_id: user.dept_id || "",
        position: user.position || "",
    });

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deleteUser(user.id);
                setIsDeleteAlertOpen(false);
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert("사용자 삭제에 실패했습니다.");
            }
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                await updateUser(user.id, formData);
                setIsEditOpen(false);
                router.refresh();
            } catch (error) {
                console.error("Failed to update user:", error);
                alert("사용자 정보 수정에 실패했습니다.");
            }
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">메뉴 열기</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>작업</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        수정
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteAlertOpen(true)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>사용자 정보 수정</DialogTitle>
                        <DialogDescription>
                            사용자 정보를 수정합니다. 완료되면 저장 버튼을 눌러주세요.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    이름
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    이메일
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dept_id" className="text-right">
                                    부서
                                </Label>
                                <div className="col-span-3">
                                    <Select
                                        value={formData.dept_id}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, dept_id: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="부서를 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="position" className="text-right">
                                    직책
                                </Label>
                                <Input
                                    id="position"
                                    value={formData.position}
                                    onChange={(e) =>
                                        setFormData({ ...formData, position: e.target.value })
                                    }
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                취소
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "저장 중..." : "저장"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                            이 작업은 되돌릴 수 없습니다.
                            <span className="font-bold"> {user.name} </span>
                            님의 정보가 영구적으로 삭제됩니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isPending}
                        >
                            {isPending ? "삭제 중..." : "삭제"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
