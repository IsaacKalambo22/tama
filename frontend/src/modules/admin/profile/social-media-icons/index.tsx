import {
  Facebook,
  Linkedin,
  Twitter,
} from 'lucide-react';

const SocialMediaIcons = () => {
  return (
    <div className='flex gap-4 justify-center cursor-pointer'>
      <Facebook className='h-5 w-5' />
      <Twitter className='h-5 w-5' />
      <Linkedin className='h-5 w-5' />
    </div>
  );
};

export default SocialMediaIcons;
