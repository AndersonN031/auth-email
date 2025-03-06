import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { PrismaGetInscante } from "@/lib/prisma-pg";
import { cookies } from "next/headers";
import { GenerateSession } from "@/lib/generate-session";
import { addHours } from "date-fns"

interface LoginProps {
    email: string;
    password: string;
}

export interface LoginResponse {
    session?: string;
}

export async function GET(request: Request) {
    const authCookie = (await cookies()).get("auth-session");

    const sessionToken = authCookie?.value || "";

    const prisma = PrismaGetInscante();
    const session = await prisma.sessions.findFirst({
        where: {
            token: sessionToken
        }
    });

    if (!session || !session.valid || session.expiresAt < new Date()) {
        return NextResponse.json({}, { status: 401 });
    }

    return NextResponse.json({}, { status: 200 });


}


export async function POST(request: Request) {
    const body = (await request.json()) as LoginProps;
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json<LoginResponse>(
            { session: "" },
            { status: 200 }
        );
    }

    try {
        const prisma = PrismaGetInscante();
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email
            }
        })

        const userPassword = user.password;
        const passwordResult = bcrypt.compareSync(password, userPassword);

        if (!passwordResult) {
            return NextResponse.json<LoginResponse>({ session: "" }, { status: 400 });
        }

        const sessionToken = GenerateSession({
            email,
            passwordHash: userPassword
        });

        await prisma.sessions.create({
            data: {
                userId: user.id,
                token: sessionToken,
                valid: true,
                expiresAt: addHours(new Date(), 24),
            }
        });

        (await cookies()).set({
            name: 'auth-session',
            value: sessionToken,
            httpOnly: true,
            path: '/',
        })

        return NextResponse.json({ session: "awdijawoid" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ session: "" }, { status: 400 });
    }

}

