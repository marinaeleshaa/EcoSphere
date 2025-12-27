"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/frontend/redux/hooks";
import { getFavorites, syncGuestFavorites } from "../redux/Slice/FavSlice";

export function AuthReduxBridge() {
  const { status } = useSession();
  const dispatch = useAppDispatch();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && !syncedRef.current) {
      syncedRef.current = true;
      dispatch(syncGuestFavorites());
      dispatch(getFavorites());
    }

    if (status === "unauthenticated") {
      syncedRef.current = false;
    }
  }, [status, dispatch]);

  return null;
}
