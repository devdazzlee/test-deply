import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "../types";

import useLoginModal from "./useLoginModal";

interface IUseFavourite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavourite = ({ listingId, currentUser }: IUseFavourite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavourited = useMemo(() => {
    const list = currentUser?.favouriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {

      e.preventDefault();
      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;

        if (hasFavourited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
          toast.success("Unliked post");
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
          toast.success("Liked post");
        }

        await request();
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    [currentUser, hasFavourited, listingId, loginModal, router]
  );

  return {
    hasFavourited,
    toggleFavorite
  };
};

export default useFavourite;
