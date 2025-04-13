import { fetchStat } from "@/lib/api"
import { FaStore, FaUsers, FaUsersCog, FaWarehouse } from "react-icons/fa"
import StatisticBlock from "../statistic-block"

const CommunityStats = async () => {
  let stat = []
  try {
    stat = await fetchStat() // Fetch the data directly
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return (
      <div>
        <p className="text-red-500">Failed to load status.</p>
      </div>
    )
  }

  return (
    <div>
      {stat?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 ">
          <StatisticBlock
            count={stat[0].registeredCustomers}
            label="Registered Growers"
            icon={<FaUsers />}
          />
          <StatisticBlock
            count={stat[0].councilors}
            label="Councilors"
            icon={<FaUsersCog />}
          />
          <StatisticBlock
            count={stat[0].cooperatives}
            label="Tobacco Grading Centers"
            icon={<FaWarehouse />}
          />
          <StatisticBlock
            count={stat[0].shops}
            label="Hessian & Tobacco Satellite Depots"
            icon={<FaStore />}
          />
        </div>
      ) : (
        <p className="text-gray-500 text-lg mt-5">
          No community stats available.
        </p>
      )}
    </div>
  )
}

export default CommunityStats
