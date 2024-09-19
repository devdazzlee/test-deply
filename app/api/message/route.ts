import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { senderId, content, roomId } = body;

  if (!senderId || !content || !roomId) {
    return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
  }

  try {
    const message = await prisma.message.create({
      data: {
        senderId: currentUser.id,
        content: content,
        roomId: roomId
      }
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the message" },
      { status: 500 }
    );
  }
}
