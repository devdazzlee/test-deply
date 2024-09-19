import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

import cloudinary from "cloudinary";

// Configure Cloudinary with your account details
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { content, roomId, fileName, fileType, fileData } = body;

  if (!roomId) {
    return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
  }

  let fileUrl = fileData;

  try {
    if (fileData) {
      const res = await cloudinary.v2.uploader.upload(fileData, {
        folder: "/messages/attachments" // Optional folder in Cloudinary
      });

      fileUrl = res.secure_url;
    }

    const message = await prisma.message.create({
      data: {
        // senderId: currentUser.id,
        content: content || null,
        // roomId: roomId,
        fileName: fileName || null,
        fileType: fileType || null,
        fileData: fileUrl || null,
        sender: {
          connect: { id: currentUser.id } // Connecting to existing User by ID
        },
        room: {
          connect: { id: roomId } // Connecting to existing User by ID
        }
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
