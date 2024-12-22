import Shop from '@/modules/client/shop';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shops - TAMA Farmers Trust',
  description:
    'Browse and shop for farming products and tools at TAMA Farmers Trust.',
};

const ShopsPage = () => {
  return <Shop />;
};

export default ShopsPage;
