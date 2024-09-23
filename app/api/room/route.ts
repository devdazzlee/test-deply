import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { userId2 } = body;

  if (!userId2) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  // Ensure that the room is created between two distinct users
  if (currentUser.id === userId2) {
    return NextResponse.json(
      { error: "Cannot create a room between the same user" },
      { status: 400 }
    );
  }

  try {
    // Use a transaction to ensure atomicity
    const room = await prisma.$transaction(async prisma => {
      // Try to find an existing room
      let room = await prisma.room.findFirst({
        where: {
          OR: [
            { user1Id: currentUser.id, user2Id: userId2 },
            { user1Id: userId2, user2Id: currentUser.id }
          ]
        },
        include: {
          messages: true
        }
      });

      // If room doesn't exist, create it
      if (!room) {
        room = await prisma.room.create({
          data: {
            user1Id: currentUser.id,
            user2Id: userId2
          },
          include: {
            messages: true
          }
        });
      }

      return room;
    });

    return NextResponse.json(room);
  } catch (error: any) {
    if (error.code === "P2034") {
      return NextResponse.json(
        { error: "Room Already Exists" },
        { status: 200 }
      );
    }
    console.error("Error handling room creation/fetching:", error);
    return NextResponse.json(
      { error: "An error occurred while handling the room" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await prisma.room.findMany({
      where: {
        OR: [{ user1Id: currentUser.id }, { user2Id: currentUser.id }]
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
            // Add any other user fields you want to include
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
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
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching rooms" },
      { status: 500 }
    );
  }
}
