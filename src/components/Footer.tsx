import Link from "next/link";

export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-24 mt-16">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4 text-gray-500">
            <span>&copy; Public AI Inference Utility &nbsp;&nbsp; 2025 &nbsp;&nbsp; All Rights Reserved</span>
          </div>
          <div className="text-gray-500">
            <Link href="/tc" className="text-gray-500 hover:text-gray-600 transition-colors font-medium">
              Terms and Conditions
            </Link> &nbsp;&nbsp; 
            <a href="mailto:hello@publicai.co" className="text-gray-500 hover:text-gray-600 transition-colors font-medium">
              Contact Us
            </a>
          </div>
        </div>
    </footer>
  );
}