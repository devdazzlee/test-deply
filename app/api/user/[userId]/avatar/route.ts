import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function PATCH(
  request: Request,
  { params }: { params: { userId?: string } }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.id !== params.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await request.arrayBuffer());

    if (buffer.length === 0) {
      return NextResponse.json({ error: "Empty file buffer" }, { status: 400 });
    }

    const contentType = request.headers.get("Content-Type") || "image/jpeg";
    const dataUri = `data:${contentType};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "user_avatars",
      public_id: `avatar_${userId}`,
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: uploadResult.secure_url },
    });

    return NextResponse.json({
      message: "Avatar updated successfully",
      avatarUrl: updatedUser.image,
    });
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update avatar" },
      { status: 500 }
    );
  }
}
