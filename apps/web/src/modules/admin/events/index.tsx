import { fetchEvents } from "@/lib/api"
import AddNewHeader from "@/modules/admin/add-new-header"
import EventList from "./event-list"

const Event = async () => {
  let events = []
  try {
    events = await fetchEvents() // Fetch the data directly
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return (
      <div>
        <AddNewHeader name="Event List" buttonName="New Event" />
        <p className="text-red-500">Failed to load events.</p>
      </div>
    )
  }

  return (
    <div>
      <AddNewHeader name="Event List" buttonName="New Event" />
      {events?.length > 0 ? (
        <EventList events={events} />
      ) : (
        <p className="text-gray-500 mt-4">
          No events available. Create a new event to get started!
        </p>
      )}
    </div>
  )
}

export default Event
