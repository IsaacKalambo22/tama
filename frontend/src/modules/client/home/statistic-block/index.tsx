interface StatisticBlockProps {
  count: string | number;
  label: string;
  icon: JSX.Element; // Icon prop
}

const formatCount = (count: string | number) => {
  const number =
    typeof count === 'string'
      ? parseInt(count, 10)
      : count;
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

const StatisticBlock = ({
  count,
  label,
  icon,
}: StatisticBlockProps) => {
  return (
    <div className='flex flex-col items-center p-6 rounded-xl bg-gradient-to-r from-green-400 to-amber-400 shadow-lg'>
      <div className='text-white text-4xl mb-4'>
        {icon} {/* Display icon */}
      </div>
      <h1 className='text-[2.5rem] font-bold text-white'>
        {formatCount(count)}
      </h1>
      <p className='text-white mt-2 text-lg font-medium'>
        {label}
      </p>
    </div>
  );
};

export default StatisticBlock;
