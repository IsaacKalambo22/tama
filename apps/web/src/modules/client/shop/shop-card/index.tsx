import { Card } from "@/components/ui/card"
import { ShopProps } from "@/lib/api"
import Image from "next/image"
import ShopActionDropdown from "../shop-action-dropdown"

interface Props {
  shop: ShopProps
}

const ShopCard = ({ shop }: Props) => {
  return (
    <Card className="p-6 shadow-none rounded-3xl hover:shadow-lg cursor-pointer transition-shadow relative">
      <div className="absolute top-5 right-5">
        <ShopActionDropdown shop={shop} />
      </div>
      <Image
        src={shop.imageUrl}
        alt={shop.name}
        width={200}
        height={150}
        unoptimized
        className="rounded-2xl w-full mb-4 h-[12rem]"
      />
      <div className="flex flex-col items-start">
        <h2 className="text-[1rem] font-semibold mb-2">{shop.name}</h2>
        <p className="text-gray-700">{shop.address}</p>
        <p className="text-gray-500">{shop.openHours}</p>
      </div>
    </Card>
  )
}

export default ShopCard
