"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear access token from localStorage
    localStorage.removeItem("accessToken");
    
    // Redirect to login page
    router.push("/login");
  }, [router]);

  return null;
}
