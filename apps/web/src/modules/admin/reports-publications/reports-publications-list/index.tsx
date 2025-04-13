import { FileProps } from "@/lib/api"
import ReportsPublicationsCard from "../reports-publications-card"

type Props = {
  files: FileProps[]
}

const ReportsAndPublicationsList = ({ files }: Props) => {
  return (
    <div className="flex flex-col items-center mb-16">
      {files.length > 0 ? (
        <div className="file-list w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-8">
          {files.map((file: FileProps) => (
            <ReportsPublicationsCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg mt-5">
          No reports & publications are currently available.
        </p>
      )}
    </div>
  )
}

export default ReportsAndPublicationsList
