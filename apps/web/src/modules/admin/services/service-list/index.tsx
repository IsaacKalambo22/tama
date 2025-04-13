import ServiceCard from "../service-card"
interface Props {
  services: Service[]
}

const ServiceList = ({ services }: Props) => {
  return (
    <div className="w-full grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((service: Service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}

export default ServiceList
