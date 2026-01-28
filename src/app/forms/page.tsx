'use client'

import { useEffect, useState } from "react"
import { getDocumentFormsAction, createDocumentFormAction, deleteDocumentFormAction, getCategoriesAction, type DocumentForm, type FormCategory } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { Settings, Plus } from "lucide-react"

export default function FormsPage() {
    const [forms, setForms] = useState<DocumentForm[]>([])
    const [categories, setCategories] = useState<FormCategory[]>([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const [formsData, catsData] = await Promise.all([
            getDocumentFormsAction(),
            getCategoriesAction()
        ])
        setForms(formsData)
        setCategories(catsData)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return
        await deleteDocumentFormAction(id)
        loadData()
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">양식 관리</h2>
                    <p className="text-muted-foreground">결재 양식을 등록하고 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/forms/categories">
                        <Button variant="outline" className="gap-2">
                            <Settings size={16} /> 카테고리 관리
                        </Button>
                    </Link>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2"><Plus size={16} /> 양식 등록</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>새 양식 등록</DialogTitle>
                            </DialogHeader>
                            <form action={async (formData) => {
                                await createDocumentFormAction(formData)
                                setIsOpen(false)
                                loadData()
                            }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>카테고리</Label>
                                    <Select name="category_id" defaultValue={categories[0]?.id}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>양식명</Label>
                                    <Input name="title" required placeholder="예: 휴가신청서" />
                                </div>

                                {/* Description removed as requested */}

                                <div className="space-y-2">
                                    <Label>양식 ID (영문 코드)</Label>
                                    <Input name="form_id" required placeholder="예: vacation_req" />
                                    <p className="text-[10px] text-muted-foreground">시스템 내부 식별용 ID입니다.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>정렬 순서</Label>
                                    <Input name="sort_order" type="number" defaultValue="0" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">등록</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {forms.map((form) => (
                    <Card key={form.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600">
                                {form.category}
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(form.id)} className="text-red-500 hover:text-red-700">
                                삭제
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{form.title}</div>
                            <div className="text-xs text-slate-400 mt-2">
                                ID: {form.form_id}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {forms.length === 0 && (
                    <div className="col-span-full text-center py-10 text-slate-400 border rounded-lg bg-slate-50">
                        등록된 양식이 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}
