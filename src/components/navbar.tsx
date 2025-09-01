"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
        <Image src="/logo-large.png" alt="PublicAI" className="h-8" width="120" height="48"/>
      </div>
      
      <div className="flex items-center gap-4 font-semibold">
          <Link href="/utility" className="text-sm text-gray-600 hover:text-black">Inference Utility</Link>
          <a href="https://platform.publicai.co" className="text-sm text-gray-600 hover:text-black">Developers</a>
          <Link href="/docs" className="text-sm text-gray-600 hover:text-black">Docs</Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-black">About</Link>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => window.open('https://app.publicai.company', '_blank')}
        >
          Log In
        </Button>
      </div>
    </nav>
  );
}