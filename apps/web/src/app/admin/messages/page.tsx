import { Card } from "@/components/ui/card" // Adjust the import if needed

const MessagesPage = () => {
  return (
    <div className="px-4 py-2">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>

      {/* Coming Soon Card */}
      <Card className="p-6 shadow-lg rounded-lg bg-gray-50">
        <h2 className="text-xl font-medium text-gray-700">
          This feature is coming soon
        </h2>
        <p className="text-gray-500 mt-2">
          We're working on it! Stay tuned for updates on the messaging feature.
        </p>
      </Card>
    </div>
  )
}

export default MessagesPage
