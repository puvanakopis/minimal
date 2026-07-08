'use client';

import { useRouter } from 'next/navigation';

export function useNavigateHelper() {
  const router = useRouter();

  const navigate = (path: string, isTop: boolean = false) => {
    router.push(path);

    if (isTop) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }, 100); 
    }
  };

  return navigate;
}