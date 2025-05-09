import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

import { TeamProps } from "@/lib/api"
import { Facebook, Linkedin, Twitter } from "lucide-react"

interface TeamCardProps {
  team: TeamProps
}

const TeamCard = ({ team }: TeamCardProps) => {
  return (
    <Card className="p-6 rounded-3xl shadow-none hover:shadow-lg transition-shadow cursor-pointer text-center relative space-y-4">
      {/* Action dropdown (positioned inside the padding) */}

      {/* Profile Image or Fallback Avatar */}
      <div className="flex justify-center">
        <Avatar className="h-[120px] w-[120px]">
          <AvatarImage
            src={team.imageUrl}
            alt={team.name}
            className="object-cover"
          />
          <AvatarFallback className="text-lg font-medium">
            {team.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Position */}
      <div>
        <h2 className="text-xl font-semibold line-clamp-1">{team.name}</h2>
        <p className="text-sm text-gray-500">{team.position}</p>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 text-gray-600 mt-2">
        {team.facebookUrl && (
          <a
            href={team.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600 transition-colors"
          >
            <Facebook className="h-5 w-5" />
          </a>
        )}
        {team.linkedInProfile && (
          <a
            href={team.linkedInProfile}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-700 transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}
        {team.twitterUrl && (
          <a
            href={team.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-sky-500 transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </a>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 px-4">{team.description}</p>
    </Card>
  )
}

export default TeamCard
