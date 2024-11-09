import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    email: string;
    token: string;
}
export async function GET(request: NextRequest, { params }: { params: IParams }) {
    const { email, token } = params
    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
        select: {
            verificationToken: true,
            emailVerified: true,
            id: true
        }
    })
    if (!user) {
        return new NextResponse("No user exists for such email");
    }
    if (user?.emailVerified)
        return new NextResponse("Email is already verified.")

    if (user?.verificationToken !== token)
        return new NextResponse("Token is not valid");

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