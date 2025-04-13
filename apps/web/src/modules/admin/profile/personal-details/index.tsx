"use client"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import DetailItem from "../detail-item"

interface PersonalDetailsProps {
  userDetails: {
    name: string
    phone: string
    email: string
    district: string
  }
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ userDetails }) => {
  return (
    <Card className="gap-4 rounded-2xl shadow-none py-4">
      <h1 className="text-lg font-bold text-gray-800 px-4">Personal Details</h1>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        <DetailItem label="Full Name" value={userDetails.name} />
        <DetailItem label="Phone" value={userDetails.phone || "N/A"} />
        <DetailItem label="Email" value={userDetails.email} />
        <DetailItem label="District" value={userDetails.district || "N/A"} />
      </div>
    </Card>
  )
}

export default PersonalDetails
