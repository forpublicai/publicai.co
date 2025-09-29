'use client';

import { useState } from 'react';
import { faqData, FAQItem } from './data';

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-24 mt-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-normal text-black leading-tight mb-4">
          FAQ
        </h2>
        <p className="text-lg text-gray-600">
          Common questions about the Public AI Inference Utility
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-medium text-black pr-4 flex-1">
                {item.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform flex-shrink-0 ${
                  openItems.includes(index) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openItems.includes(index) && (
              <div className="px-6 pb-4">
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}