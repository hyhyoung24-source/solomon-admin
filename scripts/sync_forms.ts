
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    const sqlPath = path.join(process.cwd(), "migration_sync_forms.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Split by STATEMENT if possible, but supabase-js rpc/sql execution is limited.
    // Actually, we can use pg directly or just try to execute via REST if we had a function.
    // But wait, we are using the admin client, so we might not be able to run raw SQL easily without a helper function.
    // Let's assume there is no exec_sql function exposed.
    // We will use the 'postgres' package if available, or just use the Supabase CLI if it worked (it failed).

    // Alternative: Read line and check if there is an existing 'exec_sql' rpc function?
    // Or just try to use a direct connection string if we had it.

    // Since we don't have direct SQL access easily from node without a connection string (which is not in .env.local usually, only URL/Key),
    // we will try to use the 'postgres' library connecting to the pooled connection string if we can guess it, 
    // OR we rely on the user to run the SQL in their dashboard.

    // BUT, we can try to install 'postgres' and use the connection string if we can derive it. 
    // Standard supabase connection string: postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
    // We don't have the password.

    // Pivot: We will create a simple API route in the admin app that runs the SQL, 
    // or better, we just instruct the user. 

    // Wait, I can use the 'supabase-js' client to insert data directly!
    // The SQL script is just inserts. I can parse it or just rewrite it in JS.
    // rewriting in JS is safer and works with the client I have.

    console.log("Syncing forms...");

    const forms = [
        { title: '기안서', form_id: 'draft', category: '기안서', description: '일반적인 업무 기안을 위한 기본 양식입니다.', sort_order: 10 },
        { title: '계약기안서', form_id: 'contract_draft', category: '인감(계약)', description: '계약 체결 및 관리를 위한 기안 양식입니다.', sort_order: 10 },
        { title: '채용기안서', form_id: 'hire_draft', category: '인사', description: '신규 채용을 위한 기안 양식입니다.', sort_order: 10 },
        { title: '인사기안서', form_id: 'hr_draft', category: '인사', description: '인사 이동 및 발령을 위한 기안 양식입니다.', sort_order: 20 },
        { title: '자기계발 지원신청서', form_id: 'self_development', category: '복리후생', description: '자기계발 비용 지원을 신청하는 양식입니다.', sort_order: 10 },
        { title: '경조금 신청서', form_id: 'condolence', category: '복리후생', description: '경조사 발생 시 지원금을 신청하는 양식입니다.', sort_order: 20 },
        { title: '연수보고서', form_id: 'training_report', category: '복리후생', description: '직무 연수 수행 후 결과를 보고하는 양식입니다.', sort_order: 30 },
        { title: '교육신청서', form_id: 'education_app', category: '교육', description: '외부/내부 교육 참가를 신청하는 양식입니다.', sort_order: 10 },
        { title: '도서구입신청서', form_id: 'book_purchase', category: '교육', description: '업무 관련 도서 구입을 신청하는 양식입니다.', sort_order: 20 },
        { title: '카쉐어링 이용신청서', form_id: 'car_share', category: '총무/구매', description: '업무용 차량 이용을 신청하는 양식입니다.', sort_order: 10 },
        { title: '구매기안서', form_id: 'purchase_draft', category: '총무/구매', description: '비품/자재 구매를 품의하는 양식입니다.', sort_order: 20 },
        { title: '주차신청서', form_id: 'parking_app', category: '총무/구매', description: '주차권 발급 및 변경을 신청하는 양식입니다.', sort_order: 30 },
        { title: '보안서약서', form_id: 'security_pledge', category: '보안', description: '보안 규정 준수를 서약하는 양식입니다.', sort_order: 10 },
    ];

    // 1. Get Categories Map
    const { data: categories, error: catError } = await supabase.from('form_categories').select('id, name');
    if (catError) {
        console.error("Error fetching categories:", catError);
        return;
    }

    const catMap = {};
    categories.forEach(c => catMap[c.name] = c.id);

    for (const form of forms) {
        const categoryId = catMap[form.category];
        if (!categoryId) {
            console.warn(`Category not found for form ${form.title}: ${form.category}`);
            continue;
        }

        const { error } = await supabase.from('document_forms').upsert({
            title: form.title,
            form_id: form.form_id,
            category: form.category, // Legacy
            category_id: categoryId,
            description: form.description,
            sort_order: form.sort_order,
            is_active: true
        }, { onConflict: 'form_id' });

        if (error) {
            console.error(`Error upserting form ${form.title}:`, error);
        } else {
            console.log(`Synced form: ${form.title}`);
        }
    }
}

runMigration().then(() => console.log("Done."));
