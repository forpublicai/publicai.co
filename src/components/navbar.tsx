"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-white">
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <Image
          src="/logo-full.png"
          alt="PublicAI"
          width={400}
          height={64}
          className="h-8 w-auto"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:flex md:items-center md:gap-16">
        <Link
          href="/stories/utility"
          className="text-gray-700 hover:text-black hover:scale-105 font-semibold transition-all duration-200 ease-in-out cursor-pointer"
        >
          Utility
        </Link>
        <a
          href="https://platform.publicai.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-black hover:scale-105 font-semibold transition-all duration-200 ease-in-out cursor-pointer"
        >
          For Developers
        </a>
        <Link
          href="/about"
          className="text-gray-700 hover:text-black hover:scale-105 font-semibold transition-all duration-200 ease-in-out cursor-pointer"
        >
          About
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Desktop Login Button */}
        <a
          href="https://chat.publicai.co"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex bg-red-500 text-white hover:bg-red-600 rounded-full px-6 py-2 font-medium cursor-pointer items-center justify-center"
        >
          LOG IN
        </a>

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
                <Link
                  href="/stories/utility"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-colors cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  Utility
                </Link>
                <a
                  href="https://platform.publicai.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-colors cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  For Developers
                </a>
                <Link
                  href="/about"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-colors cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <a
                  href="https://chat.publicai.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-colors cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  LOG IN
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}