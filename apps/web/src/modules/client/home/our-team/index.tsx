import { fetchTeam } from "@/lib/api"
import TeamList from "./team-list"

const Team = async () => {
  let teams = []
  try {
    teams = await fetchTeam() // Fetch the data directly
  } catch (error) {
    console.error("Failed to fetch team:", error)
    return (
      <div className="w-full p-8 max-w-md mx-auto text-center border border-red-100 rounded-lg bg-red-50">
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
            Unable to load team
          </h3>
          <p className="text-sm text-red-600">
            We couldn't load our team members. Please refresh the page to try
            again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {teams?.length > 0 ? (
        <TeamList team={teams} />
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No team members available
            </h3>
            <p className="text-sm text-gray-600">
              Our team members will appear here once they are added.
            </p>
          </div>
        </div>
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
