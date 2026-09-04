import RecipientGroupList from "@/modules/admin/recipient-groups/recipient-group-list"
import RecipientGroupsHeader from "@/modules/admin/recipient-groups/recipient-groups-header"

const RecipientGroupsPage = () => {
  return (
    <div>
      <RecipientGroupsHeader />
      <RecipientGroupList />
    </div>
  )
}

export default RecipientGroupsPage
