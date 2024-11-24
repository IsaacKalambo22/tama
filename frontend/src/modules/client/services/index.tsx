import HeaderText from '@/modules/common/header-text';
import CustomService from '../home/custom-service';

const Services = () => {
  return (
    <div className='flex flex-col items-center gap-10 mb-16'>
      <HeaderText
        title='Our Services'
        subtitle='Empowering farmers with resources and support'
      />
      <CustomService />
    </div>
  );
};

export default Services;
