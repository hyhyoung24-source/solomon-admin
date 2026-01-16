"use client";

import { TreeView } from "@/components/organization/tree-view";
import { DepartmentManager } from "@/components/organization/department-manager";
import { useOrganizationStore } from "@/store/use-organization-store";
import { users } from "@/data/organization";
import { useEffect } from "react";

export default function OrganizationPage() {
    const { departments, selectedDeptId, selectDepartment, fetchDepartments } = useOrganizationStore();

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    return (
        <div className="container mx-auto py-10 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex flex-col space-y-2 mb-6 shrink-0">
                <h1 className="text-2xl font-bold tracking-tight">부서/사용자 관리</h1>
                <p className="text-muted-foreground">
                    조직도를 통해 부서를 관리하고 사용자를 조회합니다.
                </p>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Left Panel: Tree View */}
                <div className="w-1/3 min-w-[300px] flex flex-col relative">
                    <TreeView
                        departments={departments}
                        users={users}
                        selectedId={selectedDeptId}
                        onSelect={selectDepartment}
                    />
                    {departments.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                            <button
                                onClick={() => useOrganizationStore.getState().addDepartment('root', { name: 'New Corporation' })}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-lg"
                            >
                                + Create Root Department
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Panel: Manager */}
                <div className="flex-1 flex flex-col">
                    <DepartmentManager selectedId={selectedDeptId} />
                </div>
            </div>
        </div>
    );
}
