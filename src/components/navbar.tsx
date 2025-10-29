"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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

      {/* Desktop Navigation */}
      <div className="hidden md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:flex md:items-center md:gap-16">
        <button
          className="text-gray-700 hover:text-black hover:scale-105 font-semibold transition-all duration-200 ease-in-out"
          onClick={() => router.push('/stories/utility')}
        >
          UTILITY
        </button>
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
        {/* Desktop Login Button */}
        <Button
          className="hidden md:flex bg-red-500 text-white hover:bg-red-600 rounded-full px-6 py-2 font-medium"
          onClick={() => window.open('https://chat.publicai.co', '_blank')}
        >
          LOG IN
        </Button>

        {/* Mobile Hamburger Menu */}
        <div className="relative md:hidden">
          <button
            className="flex flex-col gap-1 p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span className="block w-6 h-0.5 bg-gray-700 transition-transform"></span>
            <span className="block w-6 h-0.5 bg-gray-700 transition-transform"></span>
            <span className="block w-6 h-0.5 bg-gray-700 transition-transform"></span>
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
              <div className="py-2">
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-colors"
                  onClick={() => {
                    router.push('/stories/utility');
                    setIsOpen(false);
                  }}
                >
                  UTILITY
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-colors"
                  onClick={() => {
                    window.open('https://platform.publicai.co', '_blank');
                    setIsOpen(false);
                  }}
                >
                  DEVELOPERS
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-colors"
                  onClick={() => {
                    router.push('/about');
                    setIsOpen(false);
                  }}
                >
                  ABOUT
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-colors"
                  onClick={() => {
                    window.open('https://chat.publicai.co', '_blank');
                    setIsOpen(false);
                  }}
                >
                  LOG IN
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}