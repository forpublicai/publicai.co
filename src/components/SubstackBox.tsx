"use client";

import { usePathname } from "next/navigation";

export default function SubstackBox() {
  const pathname = usePathname();
  
  // Only show on story pages (pages with /stories/ in the path)
  const isStoryPage = pathname?.startsWith('/stories/');
  
  if (!isStoryPage) {
    return null;
  }
  
  return (
    <div className="my-8 flex justify-center">
      <iframe 
        src="https://publicai.substack.com/embed" 
        width="480" 
        height="150" 
        style={{ border: '1px solid #FFFFFF', background: 'white', maxWidth: '100%', width: '100%' }} 
        frameBorder="0" 
        scrolling="no"
      />
    </div>
  );
}

