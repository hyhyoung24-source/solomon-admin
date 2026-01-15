import { z } from "zod"

export const userSchema = z.object({
    email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
    password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
    name: z.string().min(2, { message: "이름은 2자 이상이어야 합니다." }),
    deptId: z.string().min(1, { message: "부서를 선택해주세요." }),
    position: z.string().min(1, { message: "직급을 입력해주세요." }),
})

export type UserFormValues = z.infer<typeof userSchema>
