"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navigationItems = [
  {
    label: "Inference Utility",
    action: (router: ReturnType<typeof useRouter>) => router.push('/utility'),
    variant: "ghost" as const,
  },
  {
    label: "Developers",
    action: () => window.open('https://platform.publicai.co', '_blank'),
    variant: "ghost" as const,
  },
  {
    label: "About",
    action: (router: ReturnType<typeof useRouter>) => router.push('/about'),
    variant: "ghost" as const,
  },
];

const loginButton = {
  label: "Log in",
  action: () => window.open('https://chat.publicai.co', '_blank'),
  variant: "default" as const,
};

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = (item: typeof navigationItems[0] | typeof loginButton) => {
    item.action(router);
    setIsMenuOpen(false);
  };

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
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
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {navigationItems.map((item) => (
          <Button 
            key={item.label}
            variant={item.variant}
            className="text-foreground hover:bg-muted"
            onClick={() => item.action(router)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Desktop Login Button */}
      <div className="hidden md:flex items-center gap-4">
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => loginButton.action()}
        >
          {loginButton.label}
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMenu}
          className="p-2"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden z-50">
          <div className="flex flex-col py-4 px-6 gap-4">
            {navigationItems.map((item) => (
              <Button 
                key={item.label}
                variant={item.variant}
                className="text-foreground hover:bg-muted justify-start"
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </Button>
            ))}
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 justify-start"
              onClick={() => handleItemClick(loginButton)}
            >
              {loginButton.label}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}