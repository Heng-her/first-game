import { useState, useEffect } from 'react';

export function useModelAvailability(url: string) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch(url, { method: 'HEAD' })
      .then((res) => {
        if (!isMounted) return;
        // Verify response is ok and is actually a binary or valid file (not an SPA html fallback)
        const contentType = res.headers.get('content-type') || '';
        const isValid = res.ok && !contentType.includes('text/html');
        setIsAvailable(isValid);
      })
      .catch(() => {
        if (isMounted) setIsAvailable(false);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return isAvailable;
}
