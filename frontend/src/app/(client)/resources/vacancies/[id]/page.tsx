import VacancyDetails from '@/modules/admin/vacancy/vacancy-details';

interface VacancyDetailsPageProps {
  params: {
    id: string; // The product ID will be passed as a string in the params
  };
}
const VacancyDetailsPage = ({
  params,
}: VacancyDetailsPageProps) => {
  console.log({ params });
  const id = params.id; //

  return <VacancyDetails id={id} />;
};

export default VacancyDetailsPage;
