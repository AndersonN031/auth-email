"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useCallback, useRef, useState } from "react"
import axios from 'axios'
import { Loader } from "lucide-react"
import Link from "next/link"
import { LoginResponse } from "@/app/api/login/route"


export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    formSuccess;

    const handleLoginSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError("")
        setFormLoading(true);


        if (emailInputRef.current && passwordInputRef.current) {
            const email = emailInputRef.current.value;
            const pass1 = passwordInputRef.current.value;

            try {
                await axios.post<LoginResponse>("/api/login", {
                    email,
                    password: pass1
                })

                setFormSuccess(true);
            } catch (error) {
                setFormError("Login Invalid")
                setFormSuccess(false);
            } finally {
                setFormLoading(false);
            }
        }

    }, []);

    return (
        <>

            <div className={cn("flex justify-center items-center min-h-screen", className)} {...props}>
                <Card className="overflow-hidden w-full max-w-md">
                    <CardContent className="grid p-0">
                        <form className="p-6 md:p-8" onSubmit={(event) => handleLoginSubmit(event)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Login</h1>
                                    <p className="text-balance text-muted-foreground">
                                        Acesse sua conta!
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="exemplo@gmail.com"
                                        required
                                        ref={emailInputRef}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Senha</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        ref={passwordInputRef}
                                    />
                                </div>
                                {formError && (
                                    <div className="text-amber-600 mb-4">
                                        <p className="text-sm font-semibold">Erro no login</p>
                                        <p>Suas credenciais estão incorretas.</p>
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full flex items-center gap-2"
                                    disabled={formLoading}
                                >
                                    {formLoading && <Loader className="w-[18px] animate-spin" />}
                                    Entrar
                                </Button>
                                <div className="underline text-center">
                                    <Link href="/cadastro">
                                        Criar uma conta
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
