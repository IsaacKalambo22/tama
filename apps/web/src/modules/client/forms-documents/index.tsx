import { fetchFormsAndDocuments } from "@/lib/api"
import HeaderText from "@/modules/common/header-text"
import FormsAndDocumentsList from "./forms-documents-list"

const Forms = async () => {
  let forms = []
  try {
    forms = await fetchFormsAndDocuments() // Fetch the data directly
  } catch (error) {
    console.error("Failed to fetch forms:", error)
    return (
      <div className="flex flex-col w-full items-center gap-10 mb-16">
        <HeaderText
          title="Downloads"
          subtitle="Download and access important documents"
        />

        <p className="text-red-500">Failed to load downloads.</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-10 mb-16">
      <HeaderText
        title="Downloads"
        subtitle="Download and access important documents"
      />

      {/* Render the files */}
      {forms?.length > 0 ? (
        <FormsAndDocumentsList files={forms} />
      ) : (
        <p className="text-gray-500 text-center text-lg mt-5">
          No downloads are currently available.
        </p>
      )}
    </div>
  )
}

export default Forms
