import { VacancyProps } from "@/lib/api"
import VacancyCard from "../vacancy-card"
interface Props {
  vacancies: VacancyProps[]
}
const VacancyList = ({ vacancies }: Props) => {
  return (
    <div className="grid gap-8 grid-cols-1  md:grid-cols-2">
      {vacancies.map((vacancy) => (
        <VacancyCard key={vacancy.id} vacancy={vacancy} />
      ))}
    </div>
  )
}

export default VacancyList
