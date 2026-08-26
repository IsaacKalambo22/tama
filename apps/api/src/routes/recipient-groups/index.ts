import { Router } from "express"
import {
  addRecipientGroupMembers,
  createRecipientGroup,
  deleteRecipientGroup,
  getRecipientGroupById,
  getRecipientGroups,
  removeRecipientGroupMember,
  updateRecipientGroup,
} from "../../controllers/recipient-groups"
import { verifyNotificationSender } from "../../middlewares/verify-token"

const router = Router()

router.get("/", verifyNotificationSender, getRecipientGroups)
router.post("/", verifyNotificationSender, createRecipientGroup)
router.get("/:id", verifyNotificationSender, getRecipientGroupById)
router.patch("/:id", verifyNotificationSender, updateRecipientGroup)
router.delete("/:id", verifyNotificationSender, deleteRecipientGroup)
router.post("/:id/members", verifyNotificationSender, addRecipientGroupMembers)
router.delete(
  "/:id/members/:userId",
  verifyNotificationSender,
  removeRecipientGroupMember
)

export default router
