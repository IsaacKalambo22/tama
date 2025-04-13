"use client"

import { Button } from "@/components/ui/button"
import { UserProps } from "@/lib/api"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  user: UserProps
}

const ModalViewUser = ({ isOpen, onClose, user }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} name={user.name || "User Details"}>
      <div className="space-y-6">
        {/* User Details */}
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600 text-sm mt-2">Email: {user.email}</p>
          <p className="text-gray-600 text-sm mt-2">
            Phone Number: {user.phoneNumber}
          </p>
        </div>

        {/* Role and Verification */}
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Role:</span> {user.role}
          </p>
          <p className="text-sm">
            <span className="font-medium">Verified:</span>{" "}
            {user.isVerified ? "Yes" : "No"}
          </p>
        </div>

        {/* Last Login */}
        <div>
          <h3 className="text-sm font-medium">Last Login</h3>
          <p className="text-sm text-gray-800">
            {user.lastLogin
              ? new Date(user.lastLogin).toLocaleString()
              : "Never logged in"}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <div className="mt-6 flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  )
}

export default ModalViewUser
