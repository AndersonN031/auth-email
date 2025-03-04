import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { PrismaGetInscante } from "@/lib/prisma-pg";
import { User } from "@prisma/client";
import { error } from "console";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface RegisterProps {
    email: string;
    password: string;
    password2: string;
}

export interface RegisterResponse {
    error?: string;
    user?: User
}


export async function POST(request: Request) {
    const body = (await request.json()) as RegisterProps;
    const { email, password, password2 } = body;

    if (!email || !password || !password2) {
        return NextResponse.json(
            { error: "missing required" },
            { status: 400 }
        );
    }


    const emailReg = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

    if (!emailReg.test(email)) {
        return NextResponse.json(
            { error: "invalid email" },
            { status: 400 }
        );
    }

    if (password.length < 8 || password !== password2) {
        return NextResponse.json(
            { error: "invalid password" },
            { status: 400 }
        );
    }

    const hash = bcrypt.hashSync(password, 12);
    const prisma = PrismaGetInscante();

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hash,
            },
        })

        return NextResponse.json(
            { user },
            { status: 201 }
        );

    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json(
                    { error: "Usuário já existe!" },
                    { status: 400 }
                );
            }
        }
    }

}

// VIDEO PAUSADO EM 57:54