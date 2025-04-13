import { ServiceProps } from "@/lib/api"
import ServiceCard from "../service-card"

interface Props {
  services: ServiceProps[]
}

const ServiceList = ({ services }: Props) => {
  return (
    <div>
      {services && services.length > 0 ? (
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center text-lg mt-5">
          No services available.
        </p>
      )}
    </div>
  )
}

export default ServiceList
