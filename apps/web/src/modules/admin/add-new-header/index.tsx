"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ModalNewBlog from "@/modules/admin/blog/modal-new-blog"
import ModalNewCouncilList from "@/modules/admin/council-list/modal-new-council-list"
import ModalNewEvent from "@/modules/admin/events/modal-new-event"
import ModalNewForm from "@/modules/admin/forms-documents/modal-new-form"
import ModalNewNews from "@/modules/admin/news/modal-new-news"
import ModalNewPublication from "@/modules/admin/reports-publications/modal-new-publication"
import ModalNewShop from "@/modules/admin/shop/modal-new-shop"
import ModalNewUser from "@/modules/admin/user/modal-new-user"
import ModalNewVacancy from "@/modules/admin/vacancy/modal-new-vacancy"
import { ChevronDown, PlusSquare, Upload, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactElement, useState } from "react"
import ModalNewHomeCarousel from "../home-carousel/modal-new-home-carousel"
import ModalNewHomeImageText from "../home-image-text/modal-new-home-image-text"
import ModalNewService from "../services/modal-new-service"
import ModalNewStat from "../status/modal-new-stat"
import ModalNewTeam from "../team/modal-new-team"

export enum AddNewType {
  NEW_FORM = "New Form",
  NEW_REPORT_OR_PUBLICATION = "New Report or Publication",
  NEW_SHOP = "New Shop",
  NEW_SERVICE = "New Service",
  NEW_CAROUSEL = "New Carousel",
  NEW_IMAGES = "New Images",
  NEW_BLOG = "New Blog",
  NEW_TEAM = "New Team",
  NEW_STAT = "New Stat",
  ADD_NEWS = "Add News",
  ADD_USER = "Add User",
  NEW_EVENT = "New Event",
  NEW_VACANCY = "New Vacancy",
  NEW_COUNCIL_LIST = "New Council List",
}

interface HeaderProps {
  name: string
  buttonName?: string
  extraActions?: ReactElement
}

const AddNewHeader = ({
  name,
  buttonName,
  extraActions,
}: HeaderProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className="mb-5 flex w-full items-center justify-between">
      <h1 className="text-lg font-semibold dark:text-white">{name}</h1>
      <div className="flex items-center gap-2">
        {extraActions}
        {buttonName && buttonName === AddNewType.ADD_USER ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <PlusSquare className="h-4 w-4" />
                {buttonName}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleButtonClick}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Single User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/admin/users/import")}
              >
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          buttonName && (
            <Button onClick={handleButtonClick}>
              <PlusSquare className="h-4 w-4" />
              {buttonName}
            </Button>
          )
        )}
      </div>

      {isOpen && buttonName === AddNewType.NEW_FORM && (
        <ModalNewForm isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_REPORT_OR_PUBLICATION && (
        <ModalNewPublication isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_SHOP && (
        <ModalNewShop isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_BLOG && (
        <ModalNewBlog isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_EVENT && (
        <ModalNewEvent isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_VACANCY && (
        <ModalNewVacancy isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.ADD_NEWS && (
        <ModalNewNews isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_COUNCIL_LIST && (
        <ModalNewCouncilList isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.ADD_USER && (
        <ModalNewUser isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_SERVICE && (
        <ModalNewService isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_CAROUSEL && (
        <ModalNewHomeCarousel isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_IMAGES && (
        <ModalNewHomeImageText isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_TEAM && (
        <ModalNewTeam isOpen={isOpen} onClose={handleClose} />
      )}
      {isOpen && buttonName === AddNewType.NEW_STAT && (
        <ModalNewStat isOpen={isOpen} onClose={handleClose} />
      )}
    </div>
  )
}

export default AddNewHeader
