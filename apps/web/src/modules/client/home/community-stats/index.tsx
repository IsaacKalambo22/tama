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
      <div className="w-full max-w-md mx-auto p-8 text-center border border-red-100 rounded-lg bg-red-50">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-red-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800">
            Unable to load statistics
          </h3>
          <p className="text-sm text-red-600">
            We couldn't load the community statistics. Please refresh the page
            to try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {stat?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
        <div className="w-full max-w-md mx-auto p-10 text-center border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="rounded-full bg-gray-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No community statistics available
            </h3>
            <p className="text-sm text-gray-600">
              Statistics about our community will appear here once they are
              available.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityStats
