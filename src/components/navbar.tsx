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

      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-16">
        <button
          className="text-gray-700 hover:text-black hover:scale-105 font-semibold transition-all duration-200 ease-in-out"
          onClick={() => window.open('https://platform.publicai.co', '_blank')}
        >
          DEVELOPERS
        </button>
        <button
          className="text-gray-700 hover:text-black hover:scale-105 font-semibold transition-all duration-200 ease-in-out"
          onClick={() => router.push('/about')}
        >
          ABOUT
        </button>
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