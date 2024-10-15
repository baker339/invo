// components/ProtectedRoute.tsx
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import useSafePush from "@/hooks/useSafePush";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { safePush } = useSafePush();
  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted

  useEffect(() => {
    setIsMounted(true); // Set to true after the component mounts
  }, []);

  // Define paths that should be accessible without authentication
  const publicPaths = ["/", "/login", "/register"]; // Add other public paths as needed

  // If the user is not authenticated and the current path is not in publicPaths,
  // redirect to the login page
  useEffect(() => {
    if (!isMounted) return; // Wait until the component has mounted

    if (!user && !publicPaths.includes(router.pathname)) {
      console.log({ user });
      safePush("/login"); // Redirect to login page
      return; // Prevent rendering while redirecting
    }

    if (user && router.pathname === "/login") {
      console.log({ user });
      safePush("/"); // Redirect to homepage if already logged in
      return; // Prevent rendering while redirecting
    }
  }, [user, router.pathname, isMounted, safePush]);

  // Render children if the user is authenticated or the path is public
  return <>{children}</>;
};

export default ProtectedRoute;
