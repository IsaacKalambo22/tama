import AddNewHeader from "@/modules/admin/add-new-header"
import CouncilListDataTable from "../council-list-data-table"

const CustomCouncilList = () => {
  return (
    <div className="w-full flex flex-col items-center mb-16">
      <AddNewHeader name="Council List" buttonName="New Council List" />
      <CouncilListDataTable />
    </div>
  )
}

export default CustomCouncilList
