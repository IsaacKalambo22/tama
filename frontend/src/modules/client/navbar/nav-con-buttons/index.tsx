import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';

import { useRouter } from 'next/navigation';

const NavIconButtons = () => {
  const router = useRouter();

  const handleFavoritesClick = () => {
    router.push('/favorites');
  };
  const handleSearchClick = () => {
    router.push('/favorites');
  };

  return (
    <div className='flex gap-1 justify-end items-center'>
      <Button
        className='w-8 h-7'
        variant='ghost'
        size='icon'
        onClick={handleSearchClick}
      >
        <Search className='h-4 w-4' />
      </Button>
      <Button
        className='w-8 h-7'
        variant='ghost'
        size='icon'
        onClick={handleFavoritesClick}
      >
        <Heart className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default NavIconButtons;
