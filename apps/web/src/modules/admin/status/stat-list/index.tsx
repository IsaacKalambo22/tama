import { StatProps } from "@/lib/api"
import StatCard from "../stat-card"
interface Props {
  stats: StatProps[]
}
const StatList = ({ stats }: Props) => {
  return (
    <div className="grid gap-8 grid-cols-1 ">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  )
}

export default StatList
