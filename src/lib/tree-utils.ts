
import { Department } from "@/data/organization";

export interface FlatDepartment {
    id: string;
    name: string;
    parent_id: string | null;
    code: string | null;
    sort_order: number | null;
    short_name: string | null;
    is_active: boolean;
    is_hr_linked: boolean;
    is_visible: boolean;
    children?: FlatDepartment[]; // For internal use if needed, but mainly for tree building
}

/**
 * Converts a flat list of departments from DB to a nested tree structure.
 */
export function buildTree(flatDepts: FlatDepartment[]): Department[] {
    const deptMap = new Map<string, Department>();
    const roots: Department[] = [];

    // 1. Initialize all nodes
    flatDepts.forEach(dept => {
        deptMap.set(dept.id, {
            id: dept.id,
            name: dept.name,
            parentId: dept.parent_id,
            children: [],
            // Preserve other fields if needed by the UI components (casting to Department extended type)
            code: dept.code || undefined,
            sortOrder: dept.sort_order || undefined,
            shortName: dept.short_name || undefined,
            isActive: dept.is_active,
            isHrLinked: dept.is_hr_linked,
            isVisible: dept.is_visible,
        } as Department);
    });

    // 2. Build relationships
    flatDepts.forEach(dept => {
        const node = deptMap.get(dept.id);
        if (!node) return;

        if (dept.parent_id) {
            const parent = deptMap.get(dept.parent_id);
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(node);
                // Sort children by sortOrder
                parent.children.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
            } else {
                // Parent not found, treat as root or orphan? Treat as root for safety
                roots.push(node);
            }
        } else {
            roots.push(node);
        }
    });

    // Sort roots
    return roots.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

/**
 * Flattens a tree structure into a list suitable for DB insertion.
 */
export function flattenTree(nodes: Department[]): any[] {
    let result: any[] = [];

    nodes.forEach(node => {
        result.push({
            id: node.id,
            name: node.name,
            parent_id: node.parentId || null,
            code: node.code || null,
            sort_order: node.sortOrder || 0,
            short_name: node.shortName || null,
            is_active: node.isActive ?? true,
            is_hr_linked: node.isHrLinked ?? true,
            is_visible: node.isVisible ?? true,
        });

        if (node.children) {
            result = [...result, ...flattenTree(node.children)];
        }
    });

    return result;
}
