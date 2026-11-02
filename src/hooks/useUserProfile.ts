"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { subscribeUser } from "@/lib/firebase/users";
import type { UserProfile } from "@/types/user";

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = subscribeUser(
      user.uid,
      (data) => {
        setProfile(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return {
    profile: user ? profile : null,
    loading: user ? loading : false,
    error,
  };
}

