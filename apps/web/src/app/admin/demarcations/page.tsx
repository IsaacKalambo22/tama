import { auth } from "@/auth"
import { fetchAllDistricts, fetchCouncils, fetchUsers } from "@/lib/api"
import AddNewHeader from "@/modules/admin/add-new-header"
import DemarcationConsole from "@/modules/admin/demarcation/demarcation-console"

export const dynamic = "force-dynamic"

const AdminDemarcationPage = async () => {
  const session = await auth()
  const token = session?.accessToken

  const [councils, districts, users] = await Promise.all([
    fetchCouncils(token),
    fetchAllDistricts(token),
    fetchUsers(token),
  ])

  return (
    <div className="flex flex-col w-full">
      <AddNewHeader name="Demarcation Console" />
      <DemarcationConsole
        councils={councils}
        districts={districts}
        users={users}
      />
    </div>
  )
}

export default AdminDemarcationPage
