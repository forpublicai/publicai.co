import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'
import CallToAction from './src/components/CallToAction'
import Footer from './src/components/Footer'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom headings with lighter font weights
    h1: ({ children, ...props }) => (
      <h1 className="text-5xl font-normal text-black mb-8 leading-tight" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-medium text-black mb-4 mt-8" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-medium text-black mb-3 mt-6" {...props}>
        {children}
      </h3>
    ),
    // Better paragraph spacing
    p: ({ children, ...props }) => (
      <p className="text-gray-700 mb-6 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    // Custom components
    img: ({ src, alt, ...props }) => (
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={400}
        className="rounded-lg"
        {...props}
      />
    ),
    a: ({ href, children, ...props }) => (
      <Link href={href || ''} className="text-blue-600 hover:text-blue-800 underline" {...props}>
        {children}
      </Link>
    ),
    // Add wrapper styling with better line spacing
    wrapper: ({ children }) => (
      <div className="min-h-screen bg-white">
        <article className="px-6 py-12 max-w-4xl mx-auto">
          <div className="prose prose-lg prose-slate max-w-none leading-relaxed">
            {children}
          </div>
        </article>
        <CallToAction />
        <Footer />
      </div>
    ),
    ...components,
  }
}