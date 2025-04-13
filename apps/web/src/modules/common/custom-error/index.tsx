import { Card } from '@/components/ui/card';

const CustomError = ({
  message,
}: {
  message: string;
}) => {
  return (
    <Card className='w-full h-full min-h-full flex justify-center shadow-none'>
      An error occurred while fetching {message}
    </Card>
  );
};

export default CustomError;
