import { fetchVacancies } from '@/lib/api';
import AddNewHeader from '@/modules/admin/add-new-header';
import VacancyList from './vacancy-list';

const Vacancy = async () => {
  let vacancies = [];
  try {
    vacancies = await fetchVacancies(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch vacancies:',
      error
    );
    return (
      <div>
        <AddNewHeader
          name='Vacancy List'
          buttonName='New Vacancy'
        />
        <p className='text-red-500'>
          Failed to load vacancies.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AddNewHeader
        name='Vacancy List'
        buttonName='New Vacancy'
      />
      {vacancies?.length > 0 ? (
        <VacancyList vacancies={vacancies} />
      ) : (
        <p className='text-gray-500 mt-4'>
          No vacancies available. Create a new
          vacancy to get started!
        </p>
      )}
    </div>
  );
};

export default Vacancy;
