"use client"
import { Button } from "@/components/ui/button"
import { NewsProps } from "@/lib/api"
import { BASE_URL, formatDateTime } from "@/lib/utils"
import Image from "next/image"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  news: NewsProps
}

const ModalViewNews = ({ isOpen, onClose, news }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`${news.title}`}>
      <div className="space-y-4">
        {/* News Image */}
        <div className="w-full h-64 relative rounded-lg overflow-hidden">
          <Image
            src={`${BASE_URL}/uploads/${news.imageUrl}`}
            alt={news.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500">
            By <span className="font-semibold">{news.author}</span> on{" "}
            <span>
              {news.updatedAt
                ? formatDateTime(news.updatedAt)
                : formatDateTime(news.createdAt)}
            </span>
          </p>
        </div>
        <div className="text-gray-700 space-y-2">
          <p>{news.content}</p>
        </div>
      </div>

      {/* Close Button */}
      <div className="mt-6 flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  )
}

export default ModalViewNews
