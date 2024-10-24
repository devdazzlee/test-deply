import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import FavoriteClient from "./FavoriteClient";
import { Suspense } from "react";
import SettingsClient from "./SettingsClient";
import getListings from "../actions/getListings";

const AccountSettingsPage = async () => {
    const favouriteListings = await getFavoriteListings();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState title='Unauthorised' subtitle='Please login' />
            </ClientOnly>
        );
    }
    const listings = await getListings({ userId: currentUser.id });



    return (
        <Suspense>
            <ClientOnly>
                <SettingsClient listings={listings} currentUser={currentUser} />
                <FavoriteClient listings={favouriteListings} currentUser={currentUser} />
            </ClientOnly>
        </Suspense>
    );
};

export default AccountSettingsPage;
