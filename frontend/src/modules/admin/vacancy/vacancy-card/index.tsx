import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
  VacancyProps,
  VacancyStatus,
} from '@/lib/api';

interface Props {
  vacancy: VacancyProps;
}

// Utility function to convert yearly salaries to Malawi Kwacha monthly format
const formatSalaryToKwacha = (salary: string) => {
  const match = salary.match(
    /\$(\d+),\d+ - \$(\d+),\d+/
  );
  if (!match) return salary;
  const [_, minSalary, maxSalary] = match;
  const minMonthly = Math.round(
    (parseInt(minSalary) * 750) / 12
  );
  const maxMonthly = Math.round(
    (parseInt(maxSalary) * 750) / 12
  );
  return `MK${(minMonthly / 1000).toFixed(
    0
  )}k-MK${(maxMonthly / 1000).toFixed(0)}/month`;
};

const VacancyCard = ({ vacancy }: Props) => {
  // Destructuring the vacancy props
  const {
    title,
    company,
    location,
    status,
    applicationDeadline,
    salary,
    description,
  } = vacancy;

  return (
    <Card className='p-8 shadow-lg relative border rounded-3xl'>
      <div className='flex w-full justify-between items-center'>
        {/* Avatar with Job Title Initial */}
        <div className='flex gap-4 items-center'>
          <Avatar className='w-16 h-16'>
            <AvatarImage src='/assets/images/logo.png' />
            <AvatarFallback>
              {title[0]}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <h3 className='text-[1.1rem] font-semibold'>
              {title}
            </h3>
            <p className='text-gray-700 mt-1'>
              {company}
            </p>
            <span>{location}</span>
          </div>
        </div>

        {/* Status Chip */}
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            status === VacancyStatus.OPEN
              ? 'bg-green-200 text-green-700'
              : 'bg-red-200 text-red-700'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Job Details */}
      <div className='mt-4'>
        {description && (
          <p className='text-gray-600'>
            {description}
          </p>
        )}

        {/* Deadline & Salary */}
        <div className='text-sm flex justify-between items-center text-gray-600 mt-4'>
          {salary && (
            <div className='text-sm text-gray-700'>
              <strong>Salary: </strong>
              {formatSalaryToKwacha(salary)}
            </div>
          )}
          <span>
            <strong>Deadline: </strong>
            {applicationDeadline}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default VacancyCard;
