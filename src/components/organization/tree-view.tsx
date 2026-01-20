
"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, User } from "lucide-react";
import { Department, User as UserType } from "@/data/organization";
import { cn } from "@/lib/utils";

interface TreeViewProps {
    departments: Department[];
    users: UserType[];
    selectedId?: string | null;
    onSelect?: (id: string) => void;
}

export function TreeView({ departments, users, selectedId, onSelect }: TreeViewProps) {
    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm w-full h-full overflow-auto">
            {departments.map((dept) => (
                <TreeNode
                    key={dept.id}
                    dept={dept}
                    users={users}
                    level={0}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}

interface TreeNodeProps {
    dept: Department;
    users: UserType[];
    level: number;
    selectedId?: string | null;
    onSelect?: (id: string) => void;
}

function TreeNode({ dept, users, level, selectedId, onSelect }: TreeNodeProps) {
    const [isOpen, setIsOpen] = useState(true);
    const deptUsers = users.filter((u) => u.deptId === dept.id);
    const hasChildren = (dept.children && dept.children.length > 0) || deptUsers.length > 0;
    const isSelected = selectedId === dept.id;

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(dept.id);
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
        onSelect?.(dept.id); // Also select when toggling
    };

    return (
        <div className="select-none text-sm">
            <div
                className={cn(
                    "flex items-center py-1 px-2 rounded cursor-pointer transition-colors",
                    isSelected ? "bg-blue-100 ring-1 ring-blue-300" : "hover:bg-zinc-100"
                )}
                onClick={handleToggle}
            >
                <span className="mr-1 text-zinc-400">
                    {hasChildren ? (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : <span className="w-[14px]" />}
                </span>

                <span className="mr-2 text-yellow-500">
                    {isOpen ? <FolderOpen size={16} fill="currentColor" /> : <Folder size={16} fill="currentColor" />}
                </span>

                <span className="font-medium whitespace-nowrap">{dept.name}</span>
            </div>

            {isOpen && hasChildren && (
                <div className="relative ml-4">
                    {/* Dotted vertical line for tree structure visual */}
                    {level > 0 && <div className="absolute left-[13px] top-0 bottom-0 w-px border-l border-dotted border-zinc-300 pointer-events-none" style={{ left: `${(level * 16) + 21}px` }}></div>}

                    {dept.children?.map((child) => (
                        <TreeNode
                            key={child.id}
                            dept={child}
                            users={users}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                    {/* Users rendering logic kept same if needed, or can be hidden for pure Dept management */}
                    {deptUsers.map((user) => (
                        <div
                            key={user.id}
                            className={cn(
                                "flex items-center py-1 px-2 hover:bg-zinc-100 rounded ml-4",
                                "ml-6 pl-8"
                            )}
                            style={{ paddingLeft: `${(level + 1) * 20 + 24}px` }}
                        >
                            <User size={14} className="mr-2 text-blue-500" />
                            <span>{user.name}</span>
                            <span className="ml-2 text-xs text-zinc-500 bg-zinc-100 px-1 rounded">{user.position}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
