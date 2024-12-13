import HeaderText from '@/modules/common/header-text';
import VacancyCard from './vacancy-card';

type Job = {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  status: string;
  applicationDeadline: string;
  salary?: string;
};

const Vacancies: React.FC = () => {
  const jobs: Job[] = [
    {
      id: 1,
      title: 'Farm Manager',
      description:
        'Responsible for overseeing farm operations, managing staff, ensuring the effective growth of crops, and monitoring overall farm activities to improve productivity and profitability.',
      company: 'Green Acres Inc.',
      location: 'California, USA',
      status: 'Open',
      applicationDeadline: '2024-12-20',
      salary: '$60,000 - $70,000 / year',
    },
    {
      id: 2,
      title: 'Agronomist',
      description:
        'Focus on soil management, crop production, and agricultural research. You will work closely with farmers to implement sustainable farming practices that promote crop growth and environmental health.',
      company: 'AgriTech Solutions',
      location: 'Texas, USA',
      status: 'Open',
      applicationDeadline: '2024-12-15',
      salary: '$50,000 - $60,000 / year',
    },
    {
      id: 3,
      title: 'Irrigation Specialist',
      description:
        'Design and maintain irrigation systems for large-scale farms. Ensure efficient water distribution for crops and help in water conservation methods to improve irrigation systems.',
      company: 'HydroFarm Ltd.',
      location: 'Florida, USA',
      status: 'Closed',
      applicationDeadline: '2024-12-25',
      salary: '$45,000 - $55,000 / year',
    },
    {
      id: 4,
      title: 'Farm Equipment Operator',
      description:
        'Operate tractors, plows, and other heavy machinery on the farm. Ensure equipment is properly maintained and operate it efficiently for various farming tasks like plowing and sowing.',
      company: 'FarmMachinery Co.',
      location: 'Ohio, USA',
      status: 'Open',
      applicationDeadline: '2024-12-18',
      salary: '$40,000 - $50,000 / year',
    },
  ];

  return (
    <div className='flex flex-col w-full max-w-7xl mx-auto items-center gap-10 mb-16'>
      <HeaderText
        title='Exciting Job Opportunities'
        subtitle='Explore Vacancies in the Agricultural Sector and Grow Your Career'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        {jobs.map((job) => (
          <VacancyCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Vacancies;
