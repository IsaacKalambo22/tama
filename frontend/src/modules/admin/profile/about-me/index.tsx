import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AboutMe = () => {
  return (
    <Card className='gap-4 rounded-2xl shadow-none py-4'>
      <h1 className='text-lg font-medium px-4'>
        About Me
      </h1>
      <Separator className='my-4' />
      <p className='px-4 text-sm text-neutral-500'>
        Hello, I'm Isaac Kalambo, a Creative
        Graphic Designer & User Experience
        Designer. I create digital products to
        make the web a more beautiful and usable
        place.
      </p>
    </Card>
  );
};

export default AboutMe;
