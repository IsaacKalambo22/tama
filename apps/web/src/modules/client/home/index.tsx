import { Card } from "@/components/ui/card"
import CommunityStats from "./community-stats"
import { CustomFaq } from "./custom-faq"
import CustomHomeImageText from "./custom-home-image-text"
import MainCarousel from "./main-carousel"
import OurTeam from "./our-team"

const Home = async () => {
  return (
    <div className="flex flex-col items-center gap-8 mb-16">
      <MainCarousel />
      <div className="w-full flex items-center justify-center ">
        <span className="home-text">Discover More</span>
      </div>
      <CustomHomeImageText />

      <div className="w-full flex items-center justify-center ">
        <span className="home-text">Community Stats</span>
      </div>
      <Card className="mx-auto bg-inherit w-full border-none h-auto shadow-none">
        <CommunityStats />
      </Card>

      <div className="w-full flex flex-col gap-2 items-center justify-center">
        <span className="home-text">Meet Our Management Team</span>
        <p className="text-gray-600 text-lg text-center">
          Our passionate and skilled team members work tirelessly to achieve our
          mission and vision.
        </p>
        <OurTeam />
      </div>

      <div className="flex flex-col gap-1">
        <span className="home-text">Frequently Asked Questions</span>
        <p className="text-gray-600 text-lg text-center">
          Have questions? We&apos;ve got answers to help you understand more
          about what we do and how we can assist you.
        </p>
      </div>
      <CustomFaq />
    </div>
  )
}

export default Home
