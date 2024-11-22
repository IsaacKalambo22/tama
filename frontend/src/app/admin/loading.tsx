import Image from 'next/image';

const Loading = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col  items-center gap-4'>
        <Image
          src='/assets/icons/loader.svg'
          alt='loader'
          width={40}
          height={40}
          className='animate-spin text-green-500'
          style={{
            filter:
              'invert(27%) sepia(78%) saturate(493%) hue-rotate(90deg) brightness(90%) contrast(85%)',
          }}
        />
        Please wait
      </div>
    </div>
  );
};

export default Loading;
