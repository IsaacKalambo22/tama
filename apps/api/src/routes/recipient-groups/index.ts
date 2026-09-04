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
import { verifyMessageSender } from "../../middlewares/verify-token"

const router = Router()

router.get("/", verifyMessageSender, getRecipientGroups)
router.post("/", verifyMessageSender, createRecipientGroup)
router.get("/:id", verifyMessageSender, getRecipientGroupById)
router.patch("/:id", verifyMessageSender, updateRecipientGroup)
router.delete("/:id", verifyMessageSender, deleteRecipientGroup)
router.post("/:id/members", verifyMessageSender, addRecipientGroupMembers)
router.delete(
  "/:id/members/:userId",
  verifyMessageSender,
  removeRecipientGroupMember
)

export default router
