import { create } from "zustand";
import { Department, User } from "@/data/organization";
import { createClient } from "@/utils/supabase/client";
import { buildTree, FlatDepartment } from "@/lib/tree-utils";
import { deleteDepartmentsAction, updateDepartmentAction, createDepartmentAction, getUsersByDeptAction } from "@/app/organization/actions";

interface OrganizationStore {
    departments: Department[];
    selectedDeptId: string | null;
    isLoading: boolean;
    deptUsers: User[];

    // Actions
    fetchDepartments: () => Promise<void>;
    selectDepartment: (id: string) => void;
    fetchDeptUsers: (deptId: string) => Promise<void>;
    addDepartment: (parentId: string, dept: Partial<Department>) => Promise<void>;
    removeDepartment: (id: string) => Promise<void>;
    removeDepartments: (ids: string[]) => Promise<void>;
    updateDepartment: (id: string, updates: Partial<Department>) => Promise<void>;
    reorderDepartment: (id: string, direction: 'up' | 'down') => Promise<void>;
}

export const useOrganizationStore = create<OrganizationStore>((set, get) => ({
    departments: [],
    selectedDeptId: null,
    isLoading: false,
    deptUsers: [],

    fetchDepartments: async () => {
        set({ isLoading: true });
        const supabase = createClient();
        const { data, error } = await supabase
            .from('departments')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) {
            console.error("Failed to fetch departments:", error);
            set({ isLoading: false });
            return;
        }

        const tree = buildTree(data as any as FlatDepartment[]);
        set({ departments: tree, isLoading: false });
    },

    selectDepartment: (id) => {
        set({ selectedDeptId: id });
        get().fetchDeptUsers(id);
    },

    fetchDeptUsers: async (deptId) => {
        // Clear previous users first? Or keep them while loading?
        set({ deptUsers: [] });
        try {
            const users = await getUsersByDeptAction(deptId);
            const mappedUsers: User[] = (users || []).map((u: any) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                position: u.position,
                deptId: u.dept_id
            }));
            set({ deptUsers: mappedUsers });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    },

    addDepartment: async (parentId, deptToCreate) => {
        // ... (rest of addDepartment)
        const newId = crypto.randomUUID();
        const newDept = {
            id: newId,
            name: deptToCreate.name || "New Department",
            parent_id: parentId === 'root' ? null : parentId, // Handle root specially if needed
            code: deptToCreate.code || `NEW${Math.floor(Math.random() * 1000)}`,
            sort_order: deptToCreate.sortOrder || 99,
            short_name: deptToCreate.shortName || deptToCreate.name || "New Dept",
            is_active: deptToCreate.isActive ?? true,
            is_hr_linked: deptToCreate.isHrLinked ?? true,
            is_visible: deptToCreate.isVisible ?? true,
        };

        try {
            await createDepartmentAction(newDept);
            await get().fetchDepartments();
        } catch (error) {
            console.error("Failed to add department:", error);
        }
    },

    removeDepartment: async (id) => {
        // ...
        try {
            await deleteDepartmentsAction([id]);
            await get().fetchDepartments();
        } catch (error) {
            console.error("Failed to delete department:", error);
        }
    },

    removeDepartments: async (ids) => {
        try {
            await deleteDepartmentsAction(ids);
            await get().fetchDepartments();
        } catch (error) {
            console.error("Failed to delete departments:", error);
        }
    },

    updateDepartment: async (id, updates) => {
        // ...
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.code !== undefined) dbUpdates.code = updates.code;
        if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;
        if (updates.shortName !== undefined) dbUpdates.short_name = updates.shortName;
        if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
        if (updates.isHrLinked !== undefined) dbUpdates.is_hr_linked = updates.isHrLinked;
        if (updates.isVisible !== undefined) dbUpdates.is_visible = updates.isVisible;

        try {
            await updateDepartmentAction(id, dbUpdates);
            await get().fetchDepartments();
        } catch (error) {
            console.error("Failed to update department:", error);
        }
    },

    reorderDepartment: async (id, direction) => {
        // ...
        alert("Reorder implementation pending DB sync optimization.");
    }
}));

