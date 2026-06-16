import Image from 'next/image'

interface PhotoFigureProps {
  src: string
  alt: string
  caption: string
}

export default function PhotoFigure({ src, alt, caption }: PhotoFigureProps) {
  return (
    <figure className="my-8 max-w-md mx-auto">
      <Image
        src={src}
        alt={alt}
        width={600}
        height={300}
        className="rounded-lg w-full"
      />
      <figcaption className="text-sm text-gray-500 text-center mt-1.5">
        {caption}
      </figcaption>
    </figure>
  )
}
