"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CouncilProps, DistrictProps, Role, UserProps } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Loader2, MapPin, Pencil, Plus, Trash2, Users, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { createDistrict, deleteDistrict, updateDistrict } from "../../actions"
import { ROLE_LABELS } from "../../constants"
import Modal from "../../modal"
import ModalEditUser from "../../user/modal-edit-user"

interface DemarcationConsoleProps {
  councils: CouncilProps[]
  districts: DistrictProps[]
  users: UserProps[]
}

const roleBadgeStyles: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800",
  COUNCIL_ADMIN: "bg-blue-100 text-blue-800",
  DISTRICT_ADMIN: "bg-teal-100 text-teal-800",
  FARMER: "bg-green-100 text-green-800",
}

const UserRow = ({ user }: { user: UserProps }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false)

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-800">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            roleBadgeStyles[user.role] || "bg-gray-100 text-gray-800"
          )}
        >
          {ROLE_LABELS[user.role] || user.role}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-gray-500"
          title="Assign to council/district"
          onClick={() => setEditModalOpen(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
      {isEditModalOpen && (
        <ModalEditUser
          isOpen={isEditModalOpen}
          user={user}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  )
}

const DistrictBlock = ({
  district,
  users,
  onEdit,
  onDelete,
}: {
  district: DistrictProps
  users: UserProps[]
  onEdit: (district: DistrictProps) => void
  onDelete: (district: DistrictProps) => void
}) => {
  const actions = (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-gray-500 hover:text-gray-900"
        title="Edit district"
        onClick={() => onEdit(district)}
      >
        <Pencil className="h-3 w-3" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-gray-500 hover:text-red-600"
        title="Delete district"
        onClick={() => onDelete(district)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  )

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
        <span className="flex min-w-0 items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{district.name}</span>
        </span>
        {actions}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        <span className="truncate">{district.name}</span>
        <span className="shrink-0 text-xs font-normal text-muted-foreground">
          {users.length} user{users.length === 1 ? "" : "s"}
        </span>
        {actions}
      </div>
      <div className="space-y-2 pl-4">
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

const DemarcationConsole = ({
  councils,
  districts,
  users,
}: DemarcationConsoleProps) => {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [districtModal, setDistrictModal] = useState<{
    open: boolean
    editing: DistrictProps | null
    councilId: string
  }>({ open: false, editing: null, councilId: "" })
  const [districtName, setDistrictName] = useState("")
  const [districtError, setDistrictError] = useState("")

  const stats = useMemo(() => {
    const districtCount = districts.length
    const farmerCount = users.filter((u) => u.role === Role.FARMER).length
    const districtAdminCount = users.filter(
      (u) => u.role === Role.DISTRICT_ADMIN
    ).length
    const councilAdminCount = users.filter(
      (u) => u.role === Role.COUNCIL_ADMIN
    ).length
    const unassigned = users.filter((u) => !u.councilId && !u.districtId)
    return {
      districtCount,
      farmerCount,
      districtAdminCount,
      councilAdminCount,
      unassigned,
    }
  }, [councils, districts, users])

  const usersByCouncil = useMemo(() => {
    const map = new Map<
      string,
      {
        councilAdmins: UserProps[]
        farmers: UserProps[]
        districtAdmins: UserProps[]
      }
    >()
    for (const council of councils) {
      map.set(council.id, {
        councilAdmins: [],
        farmers: [],
        districtAdmins: [],
      })
    }
    for (const user of users) {
      if (!user.councilId) continue
      const bucket = map.get(user.councilId)
      if (!bucket) continue
      if (user.role === Role.COUNCIL_ADMIN) bucket.councilAdmins.push(user)
      else if (user.role === Role.DISTRICT_ADMIN)
        bucket.districtAdmins.push(user)
      else if (user.role === Role.FARMER) bucket.farmers.push(user)
    }
    return map
  }, [councils, users])

  const openAddDistrict = (councilId: string) => {
    setDistrictName("")
    setDistrictError("")
    setDistrictModal({ open: true, editing: null, councilId })
  }

  const openEditDistrict = (district: DistrictProps) => {
    setDistrictName(district.name)
    setDistrictError("")
    setDistrictModal({
      open: true,
      editing: district,
      councilId: district.councilId,
    })
  }

  const closeDistrictModal = () => {
    if (saving) return
    setDistrictModal((s) => ({ ...s, open: false }))
  }

  const handleSaveDistrict = async () => {
    const name = districtName.trim()
    if (!name) {
      setDistrictError("District name is required.")
      return
    }
    setSaving(true)
    setDistrictError("")
    const path = "/admin/demarcations"
    const result = districtModal.editing
      ? await updateDistrict({ name }, districtModal.editing.id, path)
      : await createDistrict({ name, councilId: districtModal.councilId }, path)
    setSaving(false)
    if (!result.success) {
      setDistrictError(result.error || "Unable to save district.")
      return
    }
    setDistrictModal((s) => ({ ...s, open: false }))
    router.refresh()
  }

  const handleDeleteDistrict = async (district: DistrictProps) => {
    if (!window.confirm(`Delete district "${district.name}"?`)) return
    setSaving(true)
    const result = await deleteDistrict(district.id, "/admin/demarcations")
    setSaving(false)
    if (!result.success) {
      window.alert(result.error || "Unable to delete district.")
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-none rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Councils (Areas)</p>
          <p className="mt-1 text-3xl font-bold">{councils.length}</p>
        </Card>
        <Card className="shadow-none rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Districts</p>
          <p className="mt-1 text-3xl font-bold">{stats.districtCount}</p>
        </Card>
        <Card className="shadow-none rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Farmers</p>
          <p className="mt-1 text-3xl font-bold">{stats.farmerCount}</p>
        </Card>
        <Card className="shadow-none rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Admins</p>
          <p className="mt-1 text-3xl font-bold">
            {stats.councilAdminCount + stats.districtAdminCount}
          </p>
        </Card>
      </div>

      {stats.unassigned.length > 0 && (
        <Card className="shadow-none rounded-xl p-5">
          <p className="flex items-center gap-2 font-semibold">
            <Users className="h-4 w-4" />
            Unassigned Users
            <Badge variant="destructive">{stats.unassigned.length}</Badge>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Users without a council or district assignment.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.unassigned.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {councils.map((council) => {
          const bucket = usersByCouncil.get(council.id)
          const councilUsers = bucket
            ? bucket.councilAdmins.length +
              bucket.districtAdmins.length +
              bucket.farmers.length
            : 0
          const councilDistricts = districts.filter(
            (d) => d.councilId === council.id
          )

          return (
            <Card key={council.id} className="shadow-none rounded-xl">
              <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
                <div className="min-w-0">
                  <p className="text-lg font-semibold truncate">
                    {council.name}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{councilDistricts.length} districts</span>
                    <span>·</span>
                    <span>{councilUsers} users</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant="secondary">Council Admin</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs"
                    onClick={() => openAddDistrict(council.id)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add District
                  </Button>
                </div>
              </div>

              <div className="space-y-4 p-5">
                {bucket && bucket.councilAdmins.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Council Admin
                      {bucket.councilAdmins.length > 1 ? "s" : ""}
                    </p>
                    <div className="space-y-2">
                      {bucket.councilAdmins.map((user) => (
                        <UserRow key={user.id} user={user} />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {councilDistricts.map((district) => {
                    const districtUsers = bucket
                      ? bucket.farmers.filter(
                          (u) => u.districtId === district.id
                        )
                      : []
                    const districtAdmins = bucket
                      ? bucket.districtAdmins.filter(
                          (u) => u.districtId === district.id
                        )
                      : []
                    const allUsers = [...districtAdmins, ...districtUsers]

                    return (
                      <DistrictBlock
                        key={district.id}
                        district={district}
                        users={allUsers}
                        onEdit={openEditDistrict}
                        onDelete={handleDeleteDistrict}
                      />
                    )
                  })}
                </div>

                {bucket &&
                  (bucket.farmers.filter((u) => !u.districtId).length > 0 ||
                    bucket.districtAdmins.filter((u) => !u.districtId).length >
                      0) && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        In council, district not set
                      </p>
                      <div className="space-y-2">
                        {[
                          ...bucket.farmers.filter((u) => !u.districtId),
                          ...bucket.districtAdmins.filter((u) => !u.districtId),
                        ].map((user) => (
                          <UserRow key={user.id} user={user} />
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </Card>
          )
        })}
      </div>

      <Modal
        isOpen={districtModal.open}
        onClose={closeDistrictModal}
        name={districtModal.editing ? "Edit District" : "Add District"}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSaveDistrict()
          }}
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">District Name</label>
            <Input
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              placeholder="e.g. Traditional Authority South"
              autoFocus
            />
            {districtError && (
              <p className="text-sm text-red-600">{districtError}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={closeDistrictModal}
              disabled={saving}
            >
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              {districtModal.editing ? "Save Changes" : "Add District"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default DemarcationConsole
