"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/frontend/redux/store";
import { setUser } from "@/frontend/redux/Slice/UserSlice";

export default function SessionRestore() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only check once on mount
    if (hasChecked) return;

    const restoreSession = async () => {
      try {
        // Check if we have a session by calling the NextAuth session endpoint
        const sessionResponse = await fetch("/api/auth/session");
        const session = await sessionResponse.json();

        if (session?.user?.id && !user.isLoggedIn) {
          // Fetch full user data from API using the /me endpoint
          const response = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();

          if (response.ok && data.data) {
            const userData = data.data; // This is already PublicUserProfile
            
            // Map the user data to match Redux state structure
            const mappedUser = {
              id: userData._id || userData.id,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              avatar: userData.avatar || "", // Already a string URL from PublicUserProfile
              phoneNumber: userData.phoneNumber,
              address: userData.address,
              birthDate: userData.birthDate,
              gender: userData.gender,
              role: userData.role === "admin" ? "customer" : userData.role, // Map admin to customer for frontend
              points: userData.points,
              favoritesIds: userData.favoritesIds || [],
              cart: userData.cart || [],
              paymentHistory: userData.paymentHistory || [],
              subscriptionPeriod: userData.subscriptionPeriod ? 
                (typeof userData.subscriptionPeriod === 'string' ? userData.subscriptionPeriod : userData.subscriptionPeriod.toString()) 
                : undefined,
              // Restaurant/Shop specific fields
              name: userData.name,
              description: userData.description,
              location: userData.location,
              workingHours: userData.workingHours,
              hotline: userData.hotline,
            };

            // Restore user state
            dispatch(setUser({ ...mappedUser, isLoggedIn: true }));
          }
        } else if (!session?.user && user.isLoggedIn) {
          // If session is lost but Redux thinks user is logged in, clear Redux state
          dispatch(setUser({ isLoggedIn: false, role: null }));
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Failed to restore user session:", error);
      } finally {
        setHasChecked(true);
      }
    };

    restoreSession();
  }, [hasChecked, user.isLoggedIn, dispatch]);

  // This component doesn't render anything
  return null;
}

