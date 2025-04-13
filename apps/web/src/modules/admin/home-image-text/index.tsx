import { fetchHomeImageText } from "@/lib/api"
import AddNewHeader from "@/modules/admin/add-new-header"
import HomeImageTextList from "./home-image-text-list"

const HomeImageText = async () => {
  let homeImageText: HomeImageText[]
  try {
    const response = await fetchHomeImageText()
    homeImageText = response || []
  } catch (error) {
    console.error("Failed to fetch home images:", error)
    return (
      <div>
        <AddNewHeader name="Home Images" buttonName="New Images" />
        <p className="text-red-500">
          Failed to load home images. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div>
      <AddNewHeader name="Home Images" buttonName="New Images" />
      {homeImageText.length > 0 ? (
        <HomeImageTextList homeImageText={homeImageText} />
      ) : (
        <p className="text-gray-500 text-lg mt-5">
          No home images available. Create a new images to get started!
        </p>
      )}
    </div>
  )
}

export default HomeImageText
