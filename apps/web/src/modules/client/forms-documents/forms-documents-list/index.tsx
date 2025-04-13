import { FileProps } from "@/lib/api"
import FormsAndDocumentsCard from "../forms-documents-card"

type Props = {
  files: FileProps[]
}

const FormsAndDocumentsList = ({ files }: Props) => {
  return (
    <div className="flex flex-col items-center mb-16">
      {files.length > 0 ? (
        <div className="file-list w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {files.map((file: FileProps) => (
            <FormsAndDocumentsCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <p className="empty-list">No Reports and Publications</p>
      )}
    </div>
  )
}

export default FormsAndDocumentsList
