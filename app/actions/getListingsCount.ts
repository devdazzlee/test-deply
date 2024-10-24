import prisma from "@/app/libs/prismadb";

interface IParams {
    userId?: string;
}

export default async function getListingsCount(userId: string) {

    try {
        // const { userId } = userId;

        const query: any = {};


        if (userId) {
            query.userId = userId;
        }

        const listingsCount = await prisma.listing.count({
            where:
                query
            ,
        });
        return listingsCount
    } catch (error: any) {
        throw new Error(error);
    }
}