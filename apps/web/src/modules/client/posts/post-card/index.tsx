import { Card } from "@/components/ui/card"
import { formatContent, formatDateTime } from "@/lib/utils"
import Image from "next/image"
import React, { useState } from "react"

export interface FacebookPostProps {
  id: string
  message?: string
  created_time: string
  attachments?: {
    data: {
      media?: {
        image?: {
          src: string
        }
      }
    }[]
  }
}

const PostCard: React.FC<FacebookPostProps> = ({
  message,
  created_time,
  attachments,
}) => {
  const [showFullText, setShowFullText] = useState(false)

  const handleToggleText = () => {
    setShowFullText((prev) => !prev)
  }

  const imageUrl = attachments?.data[0]?.media?.image?.src || ""
  const formattedContent = message ? formatContent(message) : []

  return (
    <Card className="p-6 shadow-none rounded-3xl hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="w-full mb-6">
          <Image
            src={imageUrl}
            alt="Post Attachment"
            width={900}
            height={600}
            unoptimized
            className="rounded-2xl object-fill h-auto max-h-[20rem] sm:max-h-[30rem]"
          />
        </div>
      )}
      <div className="text-gray-700 mb-4">
        {formattedContent.length ? (
          <>
            <div className={showFullText ? "" : "line-clamp-3"}>
              {formattedContent.map((content, index) => (
                <p key={index}>{content}</p>
              ))}
            </div>
            {formattedContent.join(" ").length > 100 && (
              <button
                className="text-blue-500 underline text-sm mt-2"
                onClick={handleToggleText}
              >
                {showFullText ? "See Less" : "See More"}
              </button>
            )}
          </>
        ) : (
          <p>No content available</p>
        )}
      </div>
      <span className="text-sm text-gray-500">
        {formatDateTime(created_time)}
      </span>
    </Card>
  )
}

export default PostCard
