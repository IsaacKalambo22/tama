const CustomLoader = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-full '>
      <div className='flex flex-col items-center space-y-4'>
        <svg
          className='animate-spin h-12 w-12 text-green-500'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z'
          ></path>
        </svg>
        <h2 className='text-sm font-semibold text-gray-800'>
          Loading, please wait...
        </h2>
      </div>
    </div>
  );
};

export default CustomLoader;
