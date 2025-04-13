"use client"

import { Button } from "@/components/ui/button"
import { FileProps } from "@/lib/api"
import {
  constructFileUrl,
  convertFileSize,
  formatDateTime,
  getFileType,
} from "@/lib/utils"
import Thumbnail from "@/modules/common/thumbnail"
import Link from "next/link"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  file: FileProps
}

const ModalViewForms = ({ isOpen, onClose, file }: Props) => {
  const fileProps = getFileType(file.fileUrl)

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={file.filename}>
      <div className="space-y-6">
        {/* Thumbnail Section */}
        <div className="flex justify-center">
          <Thumbnail
            type={fileProps.type}
            extension={fileProps.extension}
            url={file.fileUrl}
            className="!size-40 shadow-md rounded-md border"
            imageClassName="!size-28"
          />
        </div>

        {/* File Details Section */}
        <div className="flex flex-col space-y-2 text-center">
          <p className="font-semibold text-lg text-gray-800 line-clamp-1">
            {file.filename}
          </p>
          <p className="text-sm text-gray-500">
            {fileProps.type.toUpperCase()} • {convertFileSize(file.size)}
          </p>
          <p className="text-sm text-gray-500">
            Uploaded on: {formatDateTime(file.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Link
            href={constructFileUrl(file.fileUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="h-9">Open File</Button>
          </Link>
        </div>
      </div>
    </Modal>
  )
}

export default ModalViewForms
