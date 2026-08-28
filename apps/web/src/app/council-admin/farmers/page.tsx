import { auth } from "@/auth"
import { fetchUsersByScope } from "@/lib/api"
import AddNewHeader from "@/modules/admin/add-new-header"
import DownloadTemplateDropdown from "@/modules/admin/user/download-template-dropdown"
import ScopedUsersTable from "@/modules/common/scoped-users-table"

export const dynamic = "force-dynamic"

const CouncilAdminFarmersPage = async () => {
  const session = await auth()
  const token = session?.accessToken

  let users = []
  try {
    users = await fetchUsersByScope(token)
  } catch (error) {
    console.error("Failed to fetch scoped users:", error)
    return (
      <div>
        <p className="text-red-500">Failed to load farmers for your council.</p>
      </div>
    )
  }

  const inScopeUsers = users.filter(
    (u) => u.role === "FARMER" || u.role === "DISTRICT_ADMIN"
  )

  return (
    <div className="flex flex-col w-full">
      <AddNewHeader
        name="Farmers & District Admins"
        buttonName="Add User"
        extraActions={<DownloadTemplateDropdown users={users} />}
      />
      <ScopedUsersTable
        users={inScopeUsers}
        allowedRoles={["FARMER", "DISTRICT_ADMIN"]}
      />
    </div>
  )
}

export default CouncilAdminFarmersPage
