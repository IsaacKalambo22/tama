import { auth } from "@/auth"
import { NotificationBatchProps } from "@/lib/notifications"
import { BASE_URL } from "@/lib/utils"
import { CustomDataTable } from "@/modules/common/custom-data-table"
import { notificationBatchColumns } from "../notification-batch-columns"

const NotificationBatchTable = async () => {
  const session = await auth()

  let batches: NotificationBatchProps[] = []
  try {
    const response = await fetch(
      `${BASE_URL}/admin/notifications/batches?limit=100`,
      {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
        cache: "no-store",
      }
    )
    const result = await response.json()
    if (!result.success) throw new Error(result.message)
    batches = result.data.batches
  } catch (error) {
    console.error("Failed to fetch notification batches:", error)
    return <p className="text-red-500">Failed to load notification history.</p>
  }

  return (
    <CustomDataTable
      data={batches}
      columns={notificationBatchColumns}
      filterPlaceholder="Filter by title..."
      filterColumn="title"
    />
  )
}

export default NotificationBatchTable
