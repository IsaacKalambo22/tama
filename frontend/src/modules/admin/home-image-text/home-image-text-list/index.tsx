import HomeImageTextCard from '../home-image-text-card';

interface Props {
  homeImageText: HomeImageText[];
}

const HomeImageTextList = ({
  homeImageText,
}: Props) => {
  return (
    <div className='w-full grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
      {homeImageText.map(
        (homeImageText: HomeImageText) => (
          <HomeImageTextCard
            key={homeImageText.id}
            homeImageText={homeImageText}
          />
        )
      )}
    </div>
  );
};

export default HomeImageTextList;
