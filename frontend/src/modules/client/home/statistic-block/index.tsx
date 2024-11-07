interface StatisticBlockProps {
  count: string | number;
  label: string;
}

const StatisticBlock = ({
  count,
  label,
}: StatisticBlockProps) => {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-[2.5rem] font-bold leading-snug'>
        {count}
      </h1>
      <p className='desc !mt-1'>{label}</p>
    </div>
  );
};

export default StatisticBlock;
