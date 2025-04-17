import { useState, useEffect } from "react";

/**
 * När `isLoading` är true: vänta `delay` ms och sätt sedan showSkeleton = true.
 * När `isLoading` blir false: sätt showSkeleton = false direkt.
 */
export function useSkeleton(isLoading, delay = 2000) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => setShowSkeleton(true), delay);
    } else {
      setShowSkeleton(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return showSkeleton;
}
