import { getImage } from '@/lib/get-image';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const PlaiceholderImage = async ({
  src,
  alt,
  className,
  width,
  height,
  fill,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}) => {
  const { base64, img } = await getImage(src);
  console.log({ src });
  return (
    <Image
      src={img.src}
      alt={alt}
      placeholder='blur'
      blurDataURL={base64}
      unoptimized
      {
        ...(fill
          ? { fill: true } // Apply `fill` only if it's true
          : {
              width: width || img.width,
              height: height || img.height,
            }) // Otherwise, use width & height
      }
      className={cn(className)}
    />
  );
};

export default PlaiceholderImage;
