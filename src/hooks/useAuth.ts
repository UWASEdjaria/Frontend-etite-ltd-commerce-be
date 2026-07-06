'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setUserRole(null);
      setInitials("U");
      return;
    }

    setIsLoggedIn(true);

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      setUserRole(payload.role ?? "USER");
      setInitials(
        payload.email?.slice(0, 2).toUpperCase() ?? "U"
      );

    } catch {
      setUserRole("USER");
      setInitials("U");
    }

  }, []);

  
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserRole(null);
    router.replace("/login");
  };


  return {
    isLoggedIn,
    userRole,
    initials,
    logout
  };
}