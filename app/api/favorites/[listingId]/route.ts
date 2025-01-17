import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currenUser = await getCurrentUser();

  if (!currenUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId != "string") {
    throw new Error("Invalid ID");
  }

  let favouriteIds = [...(currenUser.favouriteIds || [])];

  favouriteIds.push(listingId);

  const user = await prisma.user.update({
    where: {
      id: currenUser.id
    },
    data: {
      favouriteIds
    }
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId != "string") {
    throw new Error("Invalid ID");
  }

  let favouriteIds = [...(currentUser.favouriteIds || [])];

  favouriteIds = favouriteIds.filter(id => id != listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      favouriteIds
    }
  });

  return NextResponse.json(user);
}
