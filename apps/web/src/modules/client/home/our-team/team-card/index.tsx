"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TeamProps } from "@/lib/api"
import {
  ChevronDown,
  ChevronUp,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react"
import { useState } from "react"

interface TeamCardProps {
  team: TeamProps
}

const TeamCard = ({ team }: TeamCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if description is long enough to need truncation (more than 100 characters)
  const isLongDescription = team.description && team.description.length > 100
  const truncatedDescription = isLongDescription
    ? `${team.description.substring(0, 100)}...`
    : team.description
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
      <div className="text-sm text-gray-700 px-4">
        <p>{isExpanded ? team.description : truncatedDescription}</p>

        {/* Read More button - only show if description is long */}
        {isLongDescription && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-primary hover:text-primary-dark flex items-center gap-1 mx-auto"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Read More <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}

export default TeamCard
