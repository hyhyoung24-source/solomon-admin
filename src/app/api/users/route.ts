
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, deptId, position } = body;

        // Use the Service Role Key to bypass RLS and ensure we can write
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Insert into 'users' table
        const { data, error } = await supabaseAdmin
            .from("users")
            .insert({
                email,
                password: hashedPassword,
                name,
                dept_id: deptId, // mapping camelCase to snake_case
                position,
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ user: data }, { status: 200 });
    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
