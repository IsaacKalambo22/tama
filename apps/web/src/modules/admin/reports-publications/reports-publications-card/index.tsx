import { Card } from "@/components/ui/card"
import { FileProps } from "@/lib/api"
import { constructFileUrl, convertFileSize } from "@/lib/utils"
import FormattedDateTime from "@/modules/common/formatted-date-time"
import Thumbnail from "@/modules/common/thumbnail"
import Link from "next/link"
import ReportsPublicationsActionDropdown from "../reports-action-dropdown"

type Props = {
  file: FileProps
}
const ReportsPublicationsCard = ({ file }: Props) => {
  return (
    <Link
      href={constructFileUrl(file.fileUrl)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className="file-card">
        <div className="flex justify-between">
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.fileUrl}
            className="!size-20"
            imageClassName="!size-11"
          />

          <div className="flex flex-col items-end justify-between">
            <ReportsPublicationsActionDropdown file={file} />
          </div>
        </div>
        <div className="file-card-details gap-2">
          <p className="subtitle-2 line-clamp-1">{file.filename}</p>
          <div className="flex justify-between w-full">
            <FormattedDateTime
              date={file.createdAt}
              className="body-2 text-light-100"
            />
            <p className="body-2 align-bottom">{convertFileSize(file.size)}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
export default ReportsPublicationsCard
