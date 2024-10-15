// hooks/useSafePush.ts
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useSafePush = () => {
  const router = useRouter();
  const [onChanging, setOnChanging] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side

  useEffect(() => {
    setIsClient(true); // Set to true after the component mounts
  }, []);

  const handleRouteChange = () => {
    setOnChanging(false);
  };

  // safePush function to avoid routing errors
  const safePush = (path: string) => {
    if (onChanging || !isClient) {
      return; // Prevent pushing if already navigating or not client side
    }
    setOnChanging(true);
    router.push(path);
  };

  useEffect(() => {
    if (!isClient) return; // Prevent accessing router if not available
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, isClient]);

  return { safePush };
};

export default useSafePush;
