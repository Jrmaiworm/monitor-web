"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Home from './home/page';


export default function Index() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/home');
  }, [router]);

  return (
    <div>
      <main>
        <Home />
      </main>
    </div>
  );
}