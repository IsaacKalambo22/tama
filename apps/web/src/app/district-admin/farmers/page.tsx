import { auth } from "@/auth"
import { fetchUsersByScope } from "@/lib/api"
import AddNewHeader from "@/modules/admin/add-new-header"
import DownloadTemplateDropdown from "@/modules/admin/user/download-template-dropdown"
import ScopedUsersTable from "@/modules/common/scoped-users-table"

export const dynamic = "force-dynamic"

const DistrictAdminFarmersPage = async () => {
  const session = await auth()
  const token = session?.accessToken

  let users = []
  try {
    users = await fetchUsersByScope(token)
  } catch (error) {
    console.error("Failed to fetch scoped users:", error)
    return (
      <div>
        <p className="text-red-500">
          Failed to load farmers for your district.
        </p>
      </div>
    )
  }

  const farmers = users.filter((u) => u.role === "FARMER")

  return (
    <div className="flex flex-col w-full">
      <AddNewHeader
        name="Farmers in My District"
        buttonName="Add User"
        extraActions={<DownloadTemplateDropdown users={users} />}
      />
      <ScopedUsersTable users={farmers} allowedRoles={["FARMER"]} />
    </div>
  )
}

export default DistrictAdminFarmersPage
