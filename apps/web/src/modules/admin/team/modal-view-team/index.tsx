"use client"
import { Button } from "@/components/ui/button"
import { TeamProps } from "@/lib/api"
import { BASE_URL } from "@/lib/utils"
import Image from "next/image"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  team: TeamProps
}

const ModalViewTeam = ({ isOpen, onClose, team }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`${team.id}`}>
      <div className="space-y-4">
        {/* Team Image */}
        <div className="w-full h-64 relative rounded-lg overflow-hidden">
          <Image
            src={`${BASE_URL}/uploads/${team.imageUrl}`}
            alt={team.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500">
            By <span className="font-semibold">{team.name}</span> a{" "}
            <span>{team.position}</span>
          </p>
        </div>
        <div className="text-gray-700 space-y-2">
          <p>{team.description}</p>
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

export default ModalViewTeam
