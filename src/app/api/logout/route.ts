import { PrismaGetInscante } from "@/lib/prisma-pg";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const authCookie = (await cookies()).get("auth-session");

    if (!authCookie?.value) {
        return NextResponse.json({message: "No session to log out from"})
    }

    const sessionToken = authCookie.value;

    try {
        const prisma = PrismaGetInscante();

        await prisma.sessions.updateMany({
            where: {token: sessionToken},
            data: {valid: true},
        });

        (await cookies()).set({
            name: 'auth-session',
            value: '',
            httpOnly: true,
            path: '/',
            expires: new Date(0)
        });

        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error logging out" }, { status: 500 });
    }
}