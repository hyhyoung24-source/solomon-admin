'use server'

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/users');
}

export type UpdateUserData = {
    name: string;
    email: string;
    dept_id: string; // Keep as string for now, matching current schema
    position: string;
};

export async function updateUser(userId: string, data: UpdateUserData) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/users');
}
