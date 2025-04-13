import VacancyDetails from '@/modules/admin/vacancy/vacancy-details';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vacancy Details - TAMA Farmers Trust',
  description:
    'View the details of a specific vacancy at TAMA Farmers Trust.',
};

interface VacancyDetailsPageProps {
  params: {
    id: string; // The vacancy ID will be passed as a string in the params
  };
}

const VacancyDetailsPage = ({
  params,
}: VacancyDetailsPageProps) => {
  const id = params.id; // Extract the vacancy ID from the params

  return <VacancyDetails id={id} />;
};

export default VacancyDetailsPage;
