import { fetchVacancies } from '@/lib/api';
import HeaderText from '@/modules/common/header-text';
import VacancyCard from './vacancy-card';

const Vacancy = async () => {
  let vacancies = [];
  try {
    vacancies = await fetchVacancies(); // Fetch the vacancies from the API
  } catch (error) {
    console.error(
      'Failed to fetch vacancies:',
      error
    );
    return (
      <div className='flex flex-col w-full items-center gap-10 mb-16'>
        <HeaderText
          title='Your Next Big Opportunity Awaits'
          subtitle='Take the next step in building your career.'
        />
        <p className='text-red-500'>
          Failed to load vacancies. Please try
          again later.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full gap-10 mb-16'>
      <HeaderText
        title='Your Next Big Opportunity Awaits'
        subtitle='Take the next step in building your career.'
      />
      {vacancies?.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10'>
          {vacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
            />
          ))}
        </div>
      ) : (
        <p className='text-gray-500 mt-4'>
          No vacancies available. Stay tuned for
          upcoming vacancies!
        </p>
      )}
    </div>
  );
};

export default Vacancy;
