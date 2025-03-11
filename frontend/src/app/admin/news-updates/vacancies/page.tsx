import Vacancy from '@/modules/admin/vacancy';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vacancies - TAMA Farmers Trust',
  description:
    'Discover exciting career opportunities with TAMA Farmers Trust.',
};

const VacanciesPage = () => {
  return <Vacancy />;
};

export default VacanciesPage;
