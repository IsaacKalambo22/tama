import Image from 'next/image';

const CustomLoader = () => {
  return (
    <div className='w-full h-full min-h-full flex justify-center items-center'>
      <Image
        src='/assets/icons/loader.svg'
        alt='loader'
        width={40}
        height={40}
        className='animate-spin'
      />
    </div>
  );
};

export default CustomLoader;
