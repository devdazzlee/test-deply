import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import FavoriteClient from "./FavoriteClient";
import { Suspense } from "react";
import SettingsClient from "./SettingsClient";

const AccountSettingsPage = async () => {
    const listings = await getFavoriteListings();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState title='Unauthorised' subtitle='Please login' />
            </ClientOnly>
        );
    }



    return (
        <Suspense>
            <ClientOnly>
                <SettingsClient listing={listings[0]} currentUser={currentUser} />
                <FavoriteClient listings={listings} currentUser={currentUser} />
            </ClientOnly>
        </Suspense>
    );
};

export default AccountSettingsPage;
