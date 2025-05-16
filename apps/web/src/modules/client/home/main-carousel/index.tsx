import { fetchHomeCarousel } from "@/lib/api"
import { CustomCarousel } from "./custom-carousel"

const MainCarousel = async () => {
  let homeCarousel = []
  try {
    homeCarousel = await fetchHomeCarousel() // Fetch the data directly
  } catch (error) {
    console.error("Failed to fetch homeCarousel:", error)
    return (
      <div className="w-full mt-4 max-w-md mx-auto p-8 text-center border border-red-100 rounded-lg bg-red-50">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-red-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800">
            Unable to load carousel
          </h3>
          <p className="text-sm text-red-600">
            We couldn't load the featured images. Please refresh the page to try
            again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full mt-4 flex-col gap-10 mb-16">
      {homeCarousel?.length === 0 ? (
        <div className="w-full max-w-md mx-auto p-10 text-center border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="rounded-full bg-gray-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No carousel images available
            </h3>
            <p className="text-sm text-gray-600">
              Featured images will appear here when they become available.
            </p>
          </div>
        </div>
      ) : (
        <CustomCarousel homeCarousel={homeCarousel} />
      )}
    </div>
  )
}

export default MainCarousel
