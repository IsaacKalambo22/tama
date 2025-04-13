import Blog from "@/modules/admin/blog"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Blogs - TAMA Farmers Trust",
  description:
    "Manage and publish insightful blogs for TAMA Farmers Trust through the admin panel.",
}

const AdminBlogsPage = () => {
  return <Blog />
}

export default AdminBlogsPage
