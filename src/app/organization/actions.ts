'use server'

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteDepartmentsAction(ids: string[]) {
    const supabase = createAdminClient();

    // Since we are deleting departments, we might need to handle children or users.
    // Assuming simple delete for now, or the DB has cascade.
    // But to be safe with RLS, we definitely need admin client.

    const { error } = await supabase
        .from('departments')
        .delete()
        .in('id', ids);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/organization');
}



// Also adding update for checking the checkbox issue if RLS related
export async function updateDepartmentAction(id: string, updates: any) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/organization');
}

export async function createDepartmentAction(dept: any) {
    const supabase = createAdminClient();
    const { error } = await supabase
        .from('departments')
        .insert(dept);



    if (error) {
        throw new Error(error.message);
    }
    revalidatePath('/organization');
}

export async function getUsersByDeptAction(deptId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('dept_id', deptId);

    if (error) throw new Error(error.message);
    return data;
}
