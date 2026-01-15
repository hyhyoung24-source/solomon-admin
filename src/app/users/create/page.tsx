
import { UserRegisterForm } from "@/components/users/user-register-form"

export default function UsersCreatePage() {
    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="flex flex-col space-y-2 mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
                <p className="text-muted-foreground">
                    Enter the user's details to create a new account. They will be able to log in to Solomon.
                </p>
            </div>
            <div className="border rounded-lg p-8 bg-card text-card-foreground shadow-sm">
                <UserRegisterForm />
            </div>
        </div>
    )
}
