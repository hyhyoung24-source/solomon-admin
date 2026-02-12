'use client'

import { useEffect, useState } from "react"
import { getDocumentFormsAction, createDocumentFormAction, deleteDocumentFormAction, updateDocumentFormAction, getCategoriesAction, getDepartmentsAction, type DocumentForm, type FormCategory, type Department } from "./actions"
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
    const [departments, setDepartments] = useState<Department[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [editingForm, setEditingForm] = useState<DocumentForm | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const [formsData, catsData, deptsData] = await Promise.all([
            getDocumentFormsAction(),
            getCategoriesAction(),
            getDepartmentsAction()
        ])
        setForms(formsData)
        setCategories(catsData)
        setDepartments(deptsData)
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
                                    <Label>기본 처리부서 (선택)</Label>
                                    <Select name="default_processing_dept_id">
                                        <SelectTrigger>
                                            <SelectValue placeholder="부서 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">선택 안함</SelectItem>
                                            {departments.map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-muted-foreground">이 양식으로 기안 작성 시 기본 설정될 처리부서입니다.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>2차 처리부서 (선택)</Label>
                                    <Select name="second_processing_dept_id">
                                        <SelectTrigger>
                                            <SelectValue placeholder="부서 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">선택 안함</SelectItem>
                                            {departments.map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-muted-foreground">필요 시 추가로 협조/처리가 필요한 부서입니다.</p>
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
                    <Card key={form.id} className="cursor-pointer hover:border-blue-500 transition-all" onClick={() => setEditingForm(form)}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600">
                                {form.category}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(form.id)
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                삭제
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{form.title}</div>
                            <div className="text-xs text-slate-400 mt-2">
                                ID: {form.form_id}
                            </div>
                            {form.default_processing_dept_name && (
                                <div className="text-xs text-slate-500 mt-1 font-medium bg-slate-100 p-1 rounded inline-block">
                                    처리부서: {form.default_processing_dept_name}
                                    {form.second_processing_dept_name && ` / ${form.second_processing_dept_name}`}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingForm} onOpenChange={(open) => !open && setEditingForm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>양식 수정</DialogTitle>
                    </DialogHeader>
                    {editingForm && (
                        <form action={async (formData) => {
                            await updateDocumentFormAction(formData)
                            setEditingForm(null)
                            loadData()
                        }} className="space-y-4">
                            <Input type="hidden" name="id" value={editingForm.id} />

                            <div className="space-y-2">
                                <Label>카테고리</Label>
                                <Select name="category_id" defaultValue={editingForm.category_id}>
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
                                <Input name="title" defaultValue={editingForm.title} required />
                            </div>

                            <div className="space-y-2">
                                <Label>양식 ID (영문 코드)</Label>
                                <Input name="form_id" defaultValue={editingForm.form_id} required />
                            </div>

                            <div className="space-y-2">
                                <Label>기본 처리부서 (선택)</Label>
                                <Select name="default_processing_dept_id" defaultValue={editingForm.default_processing_dept_id || "none"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="부서 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">선택 안함</SelectItem>
                                        {departments.map(d => (
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>2차 처리부서 (선택)</Label>
                                <Select name="second_processing_dept_id" defaultValue={editingForm.second_processing_dept_id || "none"}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="부서 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">선택 안함</SelectItem>
                                        {departments.map(d => (
                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>정렬 순서</Label>
                                <Input name="sort_order" type="number" defaultValue={editingForm.sort_order} />
                            </div>

                            <DialogFooter>
                                <Button type="submit">수정 저장</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {forms.length === 0 && (
                <div className="text-center py-10 text-slate-400 border rounded-lg bg-slate-50">
                    등록된 양식이 없습니다.
                </div>
            )}
        </div>
    )
}
