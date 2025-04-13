interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => {
  return (
    <div>
      <h1 className='font-light text-sm text-neutral-400 mb-1'>
        {label}
      </h1>
      <h2 className='font-normal text-sm'>
        {value}
      </h2>
    </div>
  );
};

export default DetailItem;
