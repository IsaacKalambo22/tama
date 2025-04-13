import Event from "@/modules/admin/events"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Events - TAMA Farmers Trust",
  description:
    "Manage and oversee events for TAMA Farmers Trust through the admin panel.",
}

const EventsPage = () => {
  return <Event />
}

export default EventsPage
