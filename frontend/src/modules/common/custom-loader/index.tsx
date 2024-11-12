import Image from 'next/image';

const CustomLoader = () => {
  return (
    <div className='w-full h-full min-h-full flex justify-center items-center'>
      <Image
        src='/assets/icons/spinner.svg'
        alt='loader'
        width={150}
        height={150}
        className='animate-spin'
      />
    </div>
  );
};

export default CustomLoader;
