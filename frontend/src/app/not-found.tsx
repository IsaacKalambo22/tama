const NotFound = () => {
  return (
    <div className='flex flex-col justify-center items-center min-h-full px-4'>
      <div className='flex flex-col items-center space-y-6'>
        <h1 className='text-6xl font-extrabold text-gray-800'>
          404
        </h1>
        <h2 className='text-xl sm:text-2xl font-semibold text-gray-700'>
          Oops! The page you are looking for does
          not exist.
        </h2>
        <p className='text-sm sm:text-base text-gray-500 text-center max-w-lg'>
          Please check the URL or navigate back to
          the homepage.
        </p>
        <a
          href='/'
          className='mt-6 px-5 py-3 bg-green-600 text-white text-sm sm:text-base font-medium rounded-md shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105'
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFound;
