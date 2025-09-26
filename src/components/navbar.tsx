"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-white">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
        <Image
          src="/logo-full.png"
          alt="PublicAI"
          width={400}
          height={64}
          className="h-8 w-auto"
          priority
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          className="bg-red-500 text-white hover:bg-red-600 rounded-full px-6 py-2 font-medium"
          onClick={() => window.open('https://chat.publicai.co', '_blank')}
        >
          LOG IN
        </Button>
      </div>
    </nav>
  );
}