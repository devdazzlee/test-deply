import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    token?: string;
}
export async function GET(request: NextRequest, { params }: { params: IParams }) {
    const { token } = params
    const user = await prisma.user.findFirst({
        where: {
            verificationToken: token
        }
    })
    if (!user) {
        throw new Error("Invalid token");
    }
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            emailVerified: new Date(Date.now()),
            verificationToken: null
        }
    })
    return NextResponse.redirect(new URL("/", request.url));
}