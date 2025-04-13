import { fetchTeam } from "@/lib/api"
import TeamList from "./team-list"

const Team = async () => {
  let teams = []
  try {
    teams = await fetchTeam() // Fetch the data directly
  } catch (error) {
    console.error("Failed to fetch team:", error)
    return (
      <div>
        <p className="text-red-500">Failed to load team.</p>
      </div>
    )
  }

  return (
    <div>
      {teams?.length > 0 ? (
        <TeamList team={teams} />
      ) : (
        <p className="text-gray-500 mt-4">No team available</p>
      )}
    </div>
  )
}

export default Team

// import Team, { TeamMember } from "./team"

// const teamMembers: TeamMember[] = [
//   {
//     name: "Nixon Lita",
//     role: "Chief Executive Officer",
//     description:
//       "Providing strategic direction and oversight, driving growth initiatives, and ensuring the overall success of the organization.",
//     linkedinUrl: "https://linkedin.com/in/nicksonlita",
//     facebookUrl: "https://facebook.com/nicksonlita",
//   },
//   {
//     name: "Sam Gift Kasambala",
//     role: "Head of Operations",
//     description:
//       "Overseeing day-to-day operational activities, optimizing processes, and ensuring efficient service delivery across all departments.",
//     linkedinUrl: "https://linkedin.com/in/samgiftkasambala",
//     facebookUrl: "https://facebook.com/samgiftkasambala",
//   },
//   {
//     name: "Jacqueline Chakwana Moleni",
//     role: "Head of Finance",
//     description:
//       "Managing financial planning, budgeting, and risk assessment while ensuring financial sustainability and compliance with regulations.",
//     linkedinUrl: "https://linkedin.com/in/jaquelinemoleni",
//     facebookUrl: "https://facebook.com/jaquelinemoleni",
//   },
// ]

// export default function OurTeam() {
//   return (
//     <div className="flex flex-col items-center gap-1">
//

//       <Team teamMembers={teamMembers} />
//     </div>
//   )
// }
