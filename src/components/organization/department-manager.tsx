
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, ArrowUp, ArrowDown, Download, RefreshCw, Settings, FileSpreadsheet, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useOrganizationStore } from "@/store/use-organization-store";
import { Department } from "@/data/organization";
import { cn } from "@/lib/utils";

interface DepartmentManagerProps {
    selectedId: string | null;
}

export function DepartmentManager({ selectedId }: DepartmentManagerProps) {
    const { departments, addDepartment, removeDepartments, updateDepartment, reorderDepartment, deptUsers } = useOrganizationStore();
    const [selectedSubDeptIds, setSelectedSubDeptIds] = useState<string[]>([]);
    const [unsavedChanges, setUnsavedChanges] = useState<{ [key: string]: string }>({});

    // Reset selection when department changes or structure changes
    useEffect(() => {
        setSelectedSubDeptIds([]);
        setUnsavedChanges({});
    }, [selectedId, departments]);

    // Recursive helper to find the selected department
    const findDept = (depts: Department[], id: string): Department | null => {
        for (const dept of depts) {
            if (dept.id === id) return dept;
            if (dept.children) {
                const found = findDept(dept.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedDept = selectedId ? findDept(departments, selectedId) : null;
    const subDepartments = selectedDept?.children || [];
    const isLeaf = subDepartments.length === 0;

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedSubDeptIds(subDepartments.map(d => d.id));
        } else {
            setSelectedSubDeptIds([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedSubDeptIds(prev => [...prev, id]);
        } else {
            setSelectedSubDeptIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleRowClick = (id: string) => {
        // Toggle selection on row click
        if (selectedSubDeptIds.includes(id)) {
            setSelectedSubDeptIds(prev => prev.filter(item => item !== id));
        } else {
            setSelectedSubDeptIds(prev => [...prev, id]);
        }
    };

    const handleAdd = () => {
        if (!selectedId) return;
        const count = subDepartments.length + 1;
        addDepartment(selectedId, {
            name: `새 부서 ${count}`,
            sortOrder: count * 10,
            code: `NEW${Date.now()}`
        });
    };

    const handleDelete = async () => {
        if (selectedSubDeptIds.length === 0) return;
        if (confirm(`${selectedSubDeptIds.length}개의 부서를 삭제하시겠습니까?`)) {
            await removeDepartments(selectedSubDeptIds);
            setSelectedSubDeptIds([]);
        }
    };

    const handleReorder = (direction: 'up' | 'down') => {
        if (selectedSubDeptIds.length !== 1) return;
        const id = selectedSubDeptIds[0];
        reorderDepartment(id, direction);
    };

    const handleNameChange = (id: string, newName: string) => {
        setUnsavedChanges(prev => ({ ...prev, [id]: newName }));
    };

    const handleSaveChanges = async () => {
        const updates = Object.entries(unsavedChanges);
        if (updates.length === 0) return;

        // Process all updates
        await Promise.all(updates.map(([id, name]) => updateDepartment(id, { name })));

        // Clear unsaved changes
        setUnsavedChanges({});
        alert("변경사항이 저장되었습니다.");
    };

    if (!selectedId) {
        return (
            <div className="h-full flex items-center justify-center text-zinc-400">
                좌측 조직도에서 부서를 선택해주세요.
            </div>
        );
    }

    if (!selectedDept) {
        return (
            <div className="h-full flex items-center justify-center text-zinc-400">
                선택된 부서를 찾을 수 없습니다.
            </div>
        );
    }

    const hasChanges = Object.keys(unsavedChanges).length > 0;

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Toolbar */}
            <div className="p-2 border-b flex flex-wrap gap-2 items-center bg-zinc-50">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.reload()}>
                    <RefreshCw size={14} /> 새로고침
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings size={14} /> 속성
                </Button>
                <div className="h-4 w-px bg-zinc-300 mx-1" />
                <Button variant="outline" size="sm" className="gap-2" onClick={handleAdd}>
                    <Plus size={14} /> 추가
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDelete}
                    disabled={selectedSubDeptIds.length === 0}
                >
                    <Trash size={14} /> 삭제
                </Button>
                <div className="h-4 w-px bg-zinc-300 mx-1" />
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleReorder('up')}
                    disabled={selectedSubDeptIds.length !== 1}
                >
                    <ArrowUp size={14} /> 위로
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleReorder('down')}
                    disabled={selectedSubDeptIds.length !== 1}
                >
                    <ArrowDown size={14} /> 아래로
                </Button>
                <div className="flex-1" />
                {hasChanges && (
                    <Button
                        size="sm"
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white animate-in fade-in slide-in-from-right-5"
                        onClick={handleSaveChanges}
                    >
                        <Save size={14} /> 저장 ({Object.keys(unsavedChanges).length})
                    </Button>
                )}
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 overflow-auto">
                <div className="mb-4">
                    <h2 className="text-lg font-bold">{selectedDept.name} ({selectedDept.code || 'N/A'})</h2>
                    <p className="text-sm text-muted-foreground">
                        {isLeaf ? "부서원 목록" : "하위 부서 목록"}
                    </p>
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {isLeaf ? (
                                    <>
                                        <TableHead>이름</TableHead>
                                        <TableHead>직급</TableHead>
                                        <TableHead>이메일</TableHead>
                                    </>
                                ) : (
                                    <>
                                        <TableHead className="w-[40px] text-center">
                                            <Checkbox
                                                checked={subDepartments.length > 0 && selectedSubDeptIds.length === subDepartments.length}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>부서명</TableHead>
                                        <TableHead className="w-[100px] text-center">부서표시여부</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLeaf ? (
                                deptUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                            등록된 부서원이 없습니다.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    deptUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-zinc-50">
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.position}</TableCell>
                                            <TableCell>{user.email || "-"}</TableCell>
                                        </TableRow>
                                    ))
                                )
                            ) : (
                                subDepartments.map((dept) => (
                                    <TableRow
                                        key={dept.id}
                                        className="cursor-pointer hover:bg-zinc-50"
                                        onClick={() => handleRowClick(dept.id)}
                                    >
                                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedSubDeptIds.includes(dept.id)}
                                                onCheckedChange={(checked) => handleSelectOne(dept.id, checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Input
                                                className={cn(
                                                    "h-8 transition-colors",
                                                    unsavedChanges[dept.id] ? "border-blue-500 bg-blue-50" : ""
                                                )}
                                                value={unsavedChanges[dept.id] ?? dept.name}
                                                onChange={(e) => handleNameChange(dept.id, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                            <Switch
                                                checked={dept.isVisible}
                                                onCheckedChange={(checked) => updateDepartment(dept.id, { isVisible: checked })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
