import { auth } from "@/auth"
import BulkUserImportPage from "@/modules/admin/user/bulk-import"

const CouncilAdminBulkImportPage = async () => {
  const session = await auth()
  const role = session?.role

  if (role !== "COUNCIL_ADMIN" && role !== "SUPER_ADMIN") {
    return (
      <div>
        <p className="text-red-500">
          You are not allowed to bulk-import users.
        </p>
      </div>
    )
  }

  return <BulkUserImportPage backPath="/council-admin/farmers" />
}

export default CouncilAdminBulkImportPage
