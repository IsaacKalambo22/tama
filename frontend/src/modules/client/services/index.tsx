import HeaderText from '@/modules/common/header-text';
import ServiceCard from './service-card';

const Services = () => {
  return (
    <div className='flex flex-col items-center gap-16 mb-16'>
      <HeaderText
        title='Our Services'
        subtitle='Empowering farmers with resources and support'
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 w-full  gap-12 '>
        <ServiceCard
          title='Satellite depot operations'
          points={[
            'Receiving centers of Tobacco haulage to Floors Markets',
            'Act as information centers to farmers in rural areas',
            'Outlets of service deliveries like Hessian distribution.',
            'Receiving centers of Tobacco haulage to Floors Markets',
            'Act as information centers to farmers in rural areas',
            'Outlets of service deliveries like Hessian distribution.',
          ]}
        />
        <ServiceCard
          title='Satellite depot operations'
          points={[
            'Receiving centers of Tobacco haulage to Floors Markets',
            'Act as information centers to farmers in rural areas',
            'Outlets of service deliveries like Hessian distribution.',
            'Receiving centers of Tobacco haulage to Floors Markets',
            'Act as information centers to farmers in rural areas',
            'Outlets of service deliveries like Hessian distribution.',
          ]}
        />
        <ServiceCard
          title='Satellite depot operations'
          points={[
            'Receiving centers of Tobacco haulage to Floors Markets',
            'Act as information centers to farmers in rural areas',
            'Outlets of service deliveries like Hessian distribution.',
          ]}
        />
        <ServiceCard
          title='Hessian Services'
          points={[
            'Offers a subsidized scheme to its members',
            "Collects Hessians from buyers on growers's behalf",
            'Replenishes ex-rated pieces and also buys for the scheme new pieces to meet growing numbers of voluntarily registered members',
          ]}
        />
      </div>
    </div>
  );
};

export default Services;
