'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export type Department = {
    id: string
    name: string
}

export type FormCategory = {
    id: string
    name: string
    sort_order: number
}

// --- Category Actions ---

export async function getCategoriesAction() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('form_categories')
        .select('*')
        .order('sort_order', { ascending: true })

    if (error) {
        console.error("Error fetching categories:", error)
        return []
    }
    return data as FormCategory[]
}

export async function createCategoryAction(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const sort_order = parseInt(formData.get('sort_order') as string) || 0

    const { error } = await supabase
        .from('form_categories')
        .insert({ name, sort_order })

    if (error) return { error: error.message }
    revalidatePath('/forms')
    revalidatePath('/forms/categories')
    return { success: true }
}

export async function updateCategoryAction(id: string, formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const sort_order = parseInt(formData.get('sort_order') as string) || 0

    const { error } = await supabase
        .from('form_categories')
        .update({ name, sort_order })
        .eq('id', id)

    if (error) return { error: error.message }

    // also update document_forms denormalized column if any (optional based on architecture)
    await supabase.from('document_forms').update({ category: name }).eq('category_id', id)

    revalidatePath('/forms')
    revalidatePath('/forms/categories')
    return { success: true }
}

export async function deleteCategoryAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('form_categories').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/forms/categories')
    return { success: true }
}

export async function getDepartmentsAction() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .order('name')

    if (error) {
        return []
    }
    return data as Department[]
}

export type DocumentForm = {
    id: string
    category_id: string
    category?: string // legacy or joined name
    title: string
    form_id: string
    sort_order: number
    is_active: boolean
    default_processing_dept_id?: string
    form_categories?: { name: string } // joined
    departments?: { name: string } // joined processing dept
    default_processing_dept_name?: string
    second_processing_dept_id?: string
}

export async function getDocumentFormsAction() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('document_forms')
        .select(`
      *,
      form_categories ( name ),
      dept1:departments!default_processing_dept_id ( name ),
      dept2:departments!second_processing_dept_id ( name )
    `)
        .order('sort_order', { ascending: true })

    if (error) {
        console.error("Error fetching forms:", error)
        return []
    }

    // Flatten the joined category name
    return data.map((item: any) => ({
        ...item,
        category: item.form_categories?.name || item.category, // prefer joined name
        default_processing_dept_name: item.dept1?.name,
        second_processing_dept_name: item.dept2?.name
    })) as DocumentForm[]
}

export async function createDocumentFormAction(formData: FormData) {
    const supabase = await createClient()

    const category_id = formData.get('category_id') as string // Now using ID
    const title = formData.get('title') as string
    // Description removed
    const form_id = formData.get('form_id') as string
    const sort_order = parseInt(formData.get('sort_order') as string) || 0
    const default_processing_dept_id = formData.get('default_processing_dept_id') as string || null
    const second_processing_dept_id = formData.get('second_processing_dept_id') as string || null

    // We need the category name to populate the legacy 'category' column if we keep it
    const { data: catData } = await supabase.from('form_categories').select('name').eq('id', category_id).single()
    const categoryName = catData?.name || '기타'

    const { error } = await supabase
        .from('document_forms')
        .insert({
            category_id,
            category: categoryName,
            title,
            description: '', // Empty as requested
            form_id,
            sort_order,
            is_active: true,
            default_processing_dept_id,
            second_processing_dept_id
        })

    if (error) return { error: error.message }

    revalidatePath('/forms')
    return { success: true }
}

export async function deleteDocumentFormAction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('document_forms').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/forms')
    return { success: true }
}

export async function updateDocumentFormAction(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string // Document Form ID to update
    const category_id = formData.get('category_id') as string
    const title = formData.get('title') as string
    const form_id = formData.get('form_id') as string
    const sort_order = parseInt(formData.get('sort_order') as string) || 0
    let default_processing_dept_id = formData.get('default_processing_dept_id') as string | null
    if (default_processing_dept_id === 'none') {
        default_processing_dept_id = null
    }
    let second_processing_dept_id = formData.get('second_processing_dept_id') as string | null
    if (second_processing_dept_id === 'none') {
        second_processing_dept_id = null
    }

    // Fetch category name
    const { data: catData } = await supabase.from('form_categories').select('name').eq('id', category_id).single()
    const categoryName = catData?.name || '기타'

    const { error } = await supabase
        .from('document_forms')
        .update({
            category_id,
            category: categoryName,
            title,
            form_id,
            sort_order,
            default_processing_dept_id,
            second_processing_dept_id
        })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/forms')
    return { success: true }
}
