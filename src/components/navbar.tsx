"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
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
      
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          className="text-foreground hover:bg-muted"
          onClick={() => router.push('/utility')}
        >
          Inference Utility
        </Button>
        <Button 
          variant="ghost" 
          className="text-foreground hover:bg-muted"
          onClick={() => window.open('https://platform.publicai.co', '_blank')}
        >
          Developers
        </Button>
        <Button 
          variant="ghost" 
          className="text-foreground hover:bg-muted"
          onClick={() => router.push('/docs')}
        >
          Docs
        </Button>
        <Button 
          variant="ghost" 
          className="text-foreground hover:bg-muted"
          onClick={() => router.push('/about')}
        >
          About
        </Button>
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