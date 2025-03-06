"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useCallback, useRef, useState } from "react"
import axios, { AxiosError } from 'axios'
import { RegisterResponse } from "@/app/api/register/route"
import { Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter()

    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const password2InputRef = useRef<HTMLInputElement>(null);

    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    const handleRegisterSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError("");
        setFormLoading(true);
        setFormSuccess(false);

        if (!emailInputRef.current || !passwordInputRef.current || !password2InputRef.current) {
            setFormLoading(false);
            return;
        }

        const email = emailInputRef.current.value;
        const pass1 = passwordInputRef.current.value;
        const pass2 = password2InputRef.current.value;

        const emailReg = new RegExp("[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

        if (!emailReg.test(email)) {
            setFormError("Formato de email inválido.");
            setFormLoading(false);
            return;
        }

        if (pass1.length < 8) {
            setFormError("A senha precisa ter pelo menos 8 caracteres.");
            setFormLoading(false);
            return;
        }

        if (pass1 !== pass2) {
            setFormError("As senhas não são iguais.");
            setFormLoading(false);
            return;
        }

        try {
            await axios.post<RegisterResponse>("/api/register", {
                email,
                password: pass1,
                password2: pass2,
            });

            setTimeout(() => {
                router.push("/")
            }, 3000)


            setFormSuccess(true);
        } catch (error) {
            if (error instanceof AxiosError) {
                const { error: errorMessage } = error.response?.data as RegisterResponse;
                if (errorMessage === "Usuário já existe!") {
                    setFormError("Esse e-mail já está registrado. Tente ir para login ou clique em esqueci minha senha.");
                } else {
                    setFormError(errorMessage || "Erro inesperado. Tente novamente.");
                }
            }
        } finally {
            setFormLoading(false);
        }
    }, []);

    return (
        <div className={cn("flex justify-center items-center min-h-screen", className)} {...props}>
            <Card className="overflow-hidden w-full max-w-md">
                <CardContent className="grid p-0">
                    <form className="p-6 md:p-8" onSubmit={handleRegisterSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Bem-vindo(a) de volta</h1>
                                <p className="text-balance text-muted-foreground">
                                    Crie uma conta.
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
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    ref={passwordInputRef}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password2">Confirmar senha</Label>
                                <Input
                                    id="password2"
                                    type="password"
                                    required
                                    ref={password2InputRef}
                                />
                            </div>
                            {formError && (
                                <div className="text-amber-600 mb-4">
                                    <p className="text-sm font-semibold">Erro no formulário</p>
                                    <p>{formError}</p>
                                </div>
                            )}
                            {formSuccess && (
                                <div className="text-green-600 mb-4">
                                    <p className="text-sm font-semibold">Cadastro feito com sucesso!</p>
                                    <p>Redirecionando para página principal.</p>
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full flex items-center gap-2"
                                disabled={formLoading}
                            >
                                {formLoading && <Loader className="w-[18px] animate-spin" />}
                                Cadastrar
                            </Button>
                            <div className="underline text-center">
                                <Link href="/login">Ir para o login</Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
