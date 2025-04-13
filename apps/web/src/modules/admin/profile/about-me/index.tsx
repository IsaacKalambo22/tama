import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Props {
  about?: string;
}

const AboutMe = ({ about }: Props) => {
  return (
    <Card className='gap-4 rounded-2xl shadow-none py-4'>
      <h1 className='text-lg font-medium px-4'>
        About Me
      </h1>
      <Separator className='my-4' />
      <p className='px-4 text-sm text-neutral-500'>
        {about ||
          'Write something about yourself...'}
      </p>
    </Card>
  );
};

export default AboutMe;
