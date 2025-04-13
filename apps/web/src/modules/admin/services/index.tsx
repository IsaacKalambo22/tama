import { fetchServices } from "@/lib/api"
import AddNewHeader from "@/modules/admin/add-new-header"
import ServicesList from "./service-list"

const Services = async () => {
  let services: Service[]
  try {
    const response = await fetchServices()
    services = response || []
  } catch (error) {
    console.error("Failed to fetch services:", error)
    return (
      <div>
        <AddNewHeader name="Services" buttonName="New Service" />
        <p className="text-red-500">
          Failed to load services. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div>
      <AddNewHeader name="Services" buttonName="New Service" />
      {services.length > 0 ? (
        <ServicesList services={services} />
      ) : (
        <p className="text-gray-500 text-lg mt-5">
          No services available. Create a new service to get started!
        </p>
      )}
    </div>
  )
}

export default Services
