import { Card } from '@/components/ui/card';
import {
  VacancyProps,
  fetchVacancyById,
} from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default async function VacancyDetails({
  id,
}: {
  id: string;
}) {
  const vacancy: VacancyProps | null =
    await fetchVacancyById(id); // Fetch vacancy by ID

  if (!vacancy) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl font-semibold text-gray-800'>
          Vacancy Not Found
        </h1>
        <p className='text-gray-600'>
          We couldn't find the vacancy you were
          looking for.
        </p>
      </div>
    );
  }

  return (
    <Card className='max-w-4xl mx-auto px-10 bg-inherit rounded-3xl mt-5 py-8 mb-20'>
      <article>
        {/* Vacancy Header */}
        <header className='mb-8 flex justify-between items-start'>
          {/* Left Column: Title and Company, Location, Salary */}
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              {vacancy.title}
            </h1>
          </div>
        </header>
        <div className='flex justify-between mt-[-8px] mb-5'>
          <div className='text-sm  text-gray-600 mt-2 flex flex-col gap-1'>
            <div className='flex gap-2'>
              <span className='font-semibold'>
                Company:
              </span>{' '}
              {vacancy.company}
            </div>
            <div className='flex gap-2'>
              <span className='font-semibold'>
                Location:
              </span>{' '}
              {vacancy.location}
            </div>
            <div className='flex gap-2'>
              <span className='font-semibold'>
                Salary:
              </span>{' '}
              {vacancy.salary}
            </div>
          </div>

          {/* Right Column: Deadline and Status */}
          <div className='flex flex-col gap-2 items-end'>
            {vacancy.applicationDeadline && (
              <div className='inline-flex items-center px-6 py-2 text-white bg-red-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'>
                <span className='text-sm font-semibold'>
                  Due:{' '}
                  {formatDate(
                    vacancy.applicationDeadline.toString()
                  )}
                </span>
              </div>
            )}
            <div
              className={`inline-flex items-center px-6 py-2 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                vacancy.status === 'Open'
                  ? 'bg-green-700 hover:bg-green-700'
                  : 'bg-red-700 hover:bg-red-700'
              }`}
            >
              <span className='text-sm font-semibold'>
                {vacancy.status}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {vacancy.description && (
          <div className='text-lg text-gray-700 space-y-6 mb-8'>
            <h3 className='text-2xl font-semibold text-gray-900'>
              Description
            </h3>
            <p>{vacancy.description}</p>
          </div>
        )}

        {/* Duties Section */}
        {vacancy.duties && (
          <div className='text-lg text-gray-700 space-y-6 mb-8'>
            <h3 className='text-2xl font-semibold text-gray-900'>
              Duties
            </h3>
            <ul className='list-disc pl-5'>
              {vacancy.duties
                .split('.') // Split by period
                .map((duty) => duty.trim()) // Trim any excess space
                .filter((duty) => duty) // Remove empty duties
                .map((duty, index, array) => (
                  <li
                    key={index}
                    className='text-lg text-gray-700'
                  >
                    {duty}
                    {/* Only add period if it's not the last item */}
                    {index !== array.length - 1 &&
                      '.'}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* How to Apply Section */}
        {vacancy.howToApply && (
          <div className='text-lg text-gray-700 space-y-6 mb-8'>
            <h3 className='text-2xl font-semibold text-gray-900'>
              How to Apply
            </h3>
            <p>{vacancy.howToApply}</p>
          </div>
        )}

        {/* Footer Section */}
        <footer className='mt-12 pt-6 border-t border-gray-200'>
          <div className='flex justify-center text-center items-center'>
            <button className='px-6 py-2  text-white bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300'>
              Apply Now
            </button>
          </div>
        </footer>
      </article>
    </Card>
  );
}
