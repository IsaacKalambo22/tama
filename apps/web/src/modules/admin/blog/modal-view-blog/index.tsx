"use client"
import { Button } from "@/components/ui/button"
import { BlogProps } from "@/lib/api"
import { BASE_URL, formatDateTime } from "@/lib/utils"
import Image from "next/image"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  blog: BlogProps
}

const ModalViewBlog = ({ isOpen, onClose, blog }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`${blog.title}`}>
      <div className="space-y-4">
        {/* Blog Image */}
        <div className="w-full h-64 relative rounded-lg overflow-hidden">
          <Image
            src={`${BASE_URL}/uploads/${blog.imageUrl}`}
            alt={blog.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500">
            By <span className="font-semibold">{blog.author}</span> on{" "}
            <span>
              {blog.updatedAt
                ? formatDateTime(blog.updatedAt)
                : formatDateTime(blog.createdAt)}
            </span>
          </p>
        </div>
        <div className="text-gray-700 space-y-2">
          <p>{blog.content}</p>
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

export default ModalViewBlog
