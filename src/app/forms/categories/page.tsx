'use client'

import { useEffect, useState } from "react"
import { getCategoriesAction, createCategoryAction, updateCategoryAction, deleteCategoryAction, type FormCategory } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog"
import { Pencil, Trash2, Plus } from "lucide-react"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<FormCategory[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<FormCategory | null>(null)

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        const data = await getCategoriesAction()
        setCategories(data)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("카테고리를 삭제하시겠습니까? 해당 카테고리에 속한 양식들도 영향을 받을 수 있습니다.")) return
        await deleteCategoryAction(id)
        loadCategories()
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">카테고리 관리</h2>
                    <p className="text-muted-foreground">결재 양식의 카테고리를 분류하고 순서를 정합니다.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus size={16} /> 카테고리 추가</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>카테고리 추가</DialogTitle></DialogHeader>
                        <form action={async (formData) => {
                            await createCategoryAction(formData)
                            setIsCreateOpen(false)
                            loadCategories()
                        }} className="space-y-4">
                            <div className="space-y-2">
                                <Label>카테고리명</Label>
                                <Input name="name" required placeholder="예: 인사" />
                            </div>
                            <div className="space-y-2">
                                <Label>정렬 순서</Label>
                                <Input name="sort_order" type="number" defaultValue="0" />
                            </div>
                            <DialogFooter><Button type="submit">저장</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">순서</TableHead>
                            <TableHead>카테고리명</TableHead>
                            <TableHead className="w-[150px] text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell>{cat.sort_order}</TableCell>
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => setEditingCategory(cat)}>
                                            <Pencil className="h-4 w-4 text-slate-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>카테고리 수정</DialogTitle></DialogHeader>
                    {editingCategory && (
                        <form action={async (formData) => {
                            await updateCategoryAction(editingCategory.id, formData)
                            setEditingCategory(null)
                            loadCategories()
                        }} className="space-y-4">
                            <div className="space-y-2">
                                <Label>카테고리명</Label>
                                <Input name="name" defaultValue={editingCategory.name} required />
                            </div>
                            <div className="space-y-2">
                                <Label>정렬 순서</Label>
                                <Input name="sort_order" type="number" defaultValue={editingCategory.sort_order} />
                            </div>
                            <DialogFooter><Button type="submit">수정</Button></DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
