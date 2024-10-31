import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { v2 as cloudinary } from "cloudinary";
import stream from "stream";
import { promisify } from "util";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pipeline = promisify(stream.pipeline);

interface IParams {
  userId?: string;
}

const readStreamToBuffer = async (stream: ReadableStream<Uint8Array> | null): Promise<Buffer> => {
  if (!stream) throw new Error("No stream provided");

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: isDone } = await reader.read();
    if (isDone) {
      done = true;
    } else {
      chunks.push(value!);
    }
  }
  return Buffer.concat(chunks);
};

export async function PATCH(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.id !== params.userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  const { userId } = params;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { error: "Invalid user ID" },
      { status: 400 }
    );
  }

  try {
    const buffer = await readStreamToBuffer(request.body);

    const uploadStream = cloudinary.uploader.upload_stream({
      folder: "user_avatars",
      public_id: `avatar_${userId}`,
    }, async (error: any, result: any) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload avatar to Cloudinary");
      }

      if (result) {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { image: result.secure_url },
        });

        return NextResponse.json({
          message: "Avatar updated successfully",
          avatarUrl: updatedUser.image,
        });
      }
    });

    const passthrough = new stream.PassThrough();
    passthrough.end(buffer);
    await pipeline(passthrough, uploadStream);

  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}
