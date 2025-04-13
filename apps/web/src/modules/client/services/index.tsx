import { fetchServices } from '@/lib/api';
import HeaderText from '@/modules/common/header-text';
import ServiceList from './service-list';

const Service = async () => {
  let services = [];
  try {
    services = await fetchServices(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch services:',
      error
    );
    return (
      <div className='flex flex-col w-full max-w-7xl mx-auto items-center gap-16 mb-16'>
        <HeaderText
          title='Our Services'
          subtitle='Empowering farmers with resources and support'
        />
        <p className='text-red-500'>
          Failed to load services and documents.
        </p>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-10 mb-16'>
      <HeaderText
        title='Our Services'
        subtitle='Empowering farmers with resources and support'
      />
      {services?.length === 0 ? (
        <p className='text-gray-500 text-center text-lg mt-5'>
          No services are currently available.
        </p>
      ) : (
        <ServiceList services={services} />
      )}
    </div>
  );
};

export default Service;
