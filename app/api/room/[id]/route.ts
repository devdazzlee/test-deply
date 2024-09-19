import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  id?: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = params;

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            image: true
            // Add any other user fields you want to include
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            image: true
            // Add any other user fields you want to include
          }
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true
                // Add any other sender fields you want to include
              }
            }
          },
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the room" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = params;

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Fetch the room to check if the current user is authorized to delete it
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        user1Id: true,
        user2Id: true
      }
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if the current user is either user1 or user2 of the room
    if (room.user1Id !== currentUser.id && room.user2Id !== currentUser.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this room" },
        { status: 403 }
      );
    }

    // First, delete all messages related to the room
    await prisma.message.deleteMany({
      where: {
        roomId: roomId
      }
    });

    // Then, delete the room
    await prisma.room.delete({
      where: { id: roomId }
    });

    return NextResponse.json("Room and related messages deleted successfully");
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the room" },
      { status: 500 }
    );
  }
}
