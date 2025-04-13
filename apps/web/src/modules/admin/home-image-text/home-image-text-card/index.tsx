import { Card } from "@/components/ui/card"
import Image from "next/image"
import HomeImageTextActionDropdown from "../home-image-text-action-dropdown"

interface Props {
  homeImageText: HomeImageText
}

const HomeImageTextCard = ({ homeImageText }: Props) => {
  return (
    <Card className="h-full relative rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent flex flex-col gap-3">
      <div className="absolute z-50 top-5 right-5">
        <HomeImageTextActionDropdown homeImageText={homeImageText} />
      </div>

      <div className="relative w-full h-[12rem]">
        <Image
          src={homeImageText.imageUrl}
          alt={homeImageText.heading}
          layout="fill"
          objectFit="cover" // Keeps the image filling the space
          objectPosition="center"
          className="rounded-xl"
          unoptimized
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-2 ">
        <span className="font-sans font-bold text-neutral-600 dark:text-neutral-200 ">
          {homeImageText.heading}
        </span>
        <p className="text-gray-600 text-sm leading-relaxed ">
          {homeImageText.description}
        </p>
      </div>
    </Card>
  )
}
export default HomeImageTextCard
