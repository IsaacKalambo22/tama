import { auth } from "@/auth"
import { MessageBatchProps } from "@/lib/messaging"
import { BASE_URL } from "@/lib/utils"
import { CustomDataTable } from "@/modules/common/custom-data-table"
import { messageBatchColumns } from "../message-batch-columns"

const MessageBatchTable = async () => {
  const session = await auth()

  let batches: MessageBatchProps[] = []
  try {
    const response = await fetch(
      `${BASE_URL}/admin/messages/batches?limit=100`,
      {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
        cache: "no-store",
      }
    )
    const result = await response.json()
    if (!result.success) throw new Error(result.message)
    batches = result.data.batches
  } catch (error) {
    console.error("Failed to fetch message batches:", error)
    return <p className="text-red-500">Failed to load message history.</p>
  }

  return (
    <CustomDataTable
      data={batches}
      columns={messageBatchColumns}
      filterPlaceholder="Filter by message..."
      filterColumn="message"
    />
  )
}

export default MessageBatchTable
