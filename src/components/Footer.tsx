import Link from "next/link";

export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-24 mt-16">
        <div className="space-y-16">
          <div className="flex space-x-12">
            <Link href="/tc" className="text-black hover:text-gray-600 transition-colors text-sm font-medium">
              TERMS & CONDITIONS
            </Link>
            <a href="mailto:hello@publicai.co" className="text-black hover:text-gray-600 transition-colors text-sm font-medium">
              CONTACT US
            </a>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              &copy; Public AI Inference Utility &nbsp;&nbsp; 2025
            </div>
            <div>
              All Rights Reserved
            </div>
          </div>
        </div>
    </footer>
  );
}