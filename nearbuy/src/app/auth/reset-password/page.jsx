"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import Image from "next/image";
import { toast } from "react-hot-toast";
import logoImg from "@public/logos/logo2.png";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // 🔑 Key changed to 'newPassword' to match your backend Zod schema
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to reset password.");
            }

            toast.success("Password reset successfully! Please sign in.");
            router.push("/auth/login");
        } catch (err) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-body">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 relative z-10 px-4">
                <Link href="/" className="inline-flex flex-col items-center gap-3 group focus:outline-none">
                    <div className="flex items-center justify-center px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md">
                        <Image src={logoImg} alt="Nearbuy Logo" width={612} height={408} priority className="h-16 sm:h-20 w-auto object-contain" />
                    </div>
                </Link>
                <h2 className="text-3xl font-heading font-black text-slate-950 tracking-tight">
                    Set New Password
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                    Please enter your new password below.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <Card className="bg-white/95 backdrop-blur-md border border-slate-100/70 rounded-3xl shadow-xl">
                    <CardBody className="p-8 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="New Password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Input
                                label="Confirm New Password"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                            >
                                Reset Password
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}