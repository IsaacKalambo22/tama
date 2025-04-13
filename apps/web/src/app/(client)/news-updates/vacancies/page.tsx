import Vacancies from "@/modules/client/vacancies"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vacancies - TAMA Farmers Trust",
  description:
    "Discover exciting career opportunities with TAMA Farmers Trust.",
}

const VacanciesPage = () => {
  return <Vacancies />
}

export default VacanciesPage
