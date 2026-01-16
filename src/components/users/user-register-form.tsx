
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { userSchema, UserFormValues } from "@/lib/validations/user"
import { useOrganizationStore } from "@/store/use-organization-store"
import { Department } from "@/data/organization"

import { useEffect } from "react";

export function UserRegisterForm() {
    const { departments, fetchDepartments } = useOrganizationStore();

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    // Flatten dictionary helper
    const getVisibleDepartments = (depts: Department[]): Department[] => {
        let result: Department[] = [];
        for (const dept of depts) {
            if (dept.isVisible) {
                result.push(dept);
                if (dept.children) {
                    result = [...result, ...getVisibleDepartments(dept.children)];
                }
            }
        }
        return result;
    };

    const visibleDepartments = getVisibleDepartments(departments);

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            deptId: "",
            position: "",
        },
    })

    async function onSubmit(data: UserFormValues) {
        try {
            console.log("Submitting:", data);

            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to create account");
            }

            console.log("Account created:", result);
            alert(`Account created successfully for ${data.email}`);

            // Optional: Reset form
            // form.reset();
        } catch (error: any) {
            console.error("Error", error);
            alert(error.message || "Something went wrong.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="홍길동" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="hong@test.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="deptId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {visibleDepartments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <FormControl>
                                        <Input placeholder="매니저" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full">
                    Create Account
                </Button>
            </form>
        </Form>
    )
}
