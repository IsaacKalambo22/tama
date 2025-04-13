import HomeCarouselCard from "../home-carousel-card"
interface Props {
  homeCarousel: HomeCarousel[]
}

const HomeCarouselList = ({ homeCarousel }: Props) => {
  return (
    <div className="w-full grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {homeCarousel.map((homeCarousel: HomeCarousel) => (
        <HomeCarouselCard key={homeCarousel.id} homeCarousel={homeCarousel} />
      ))}
    </div>
  )
}

export default HomeCarouselList
