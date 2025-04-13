import { fetchTeam } from "@/lib/api"
import AddNewHeader from "@/modules/admin/add-new-header"
import TeamList from "./team-list"

const Team = async () => {
  let teams = []
  try {
    teams = await fetchTeam() // Fetch the data directly
  } catch (error) {
    console.error("Failed to fetch team:", error)
    return (
      <div>
        <AddNewHeader name="Team List" buttonName="New Team" />
        <p className="text-red-500">Failed to load team.</p>
      </div>
    )
  }

  return (
    <div>
      <AddNewHeader name="Team List" buttonName="New Team" />
      {teams?.length > 0 ? (
        <TeamList team={teams} />
      ) : (
        <p className="text-gray-500 mt-4">
          No team available. Create a new team to get started!
        </p>
      )}
    </div>
  )
}

export default Team
