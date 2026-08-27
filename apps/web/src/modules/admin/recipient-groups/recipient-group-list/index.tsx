import { auth } from "@/auth"
import { RecipientGroupProps } from "@/lib/notifications"
import { BASE_URL } from "@/lib/utils"
import { CustomDataTable } from "@/modules/common/custom-data-table"
import { recipientGroupColumns } from "../recipient-group-columns"

const RecipientGroupList = async () => {
  const session = await auth()

  let groups: RecipientGroupProps[] = []
  try {
    const response = await fetch(`${BASE_URL}/admin/recipient-groups`, {
      headers: { Authorization: `Bearer ${session?.accessToken}` },
      cache: "no-store",
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.message)
    groups = result.data
  } catch (error) {
    console.error("Failed to fetch recipient groups:", error)
    return <p className="text-red-500">Failed to load recipient groups.</p>
  }

  if (groups.length === 0) {
    return (
      <p className="text-gray-500 mt-4">
        No recipient groups yet. Create one to reuse it across notifications.
      </p>
    )
  }

  return (
    <CustomDataTable
      data={groups}
      columns={recipientGroupColumns}
      filterPlaceholder="Filter groups..."
      filterColumn="name"
    />
  )
}

export default RecipientGroupList
