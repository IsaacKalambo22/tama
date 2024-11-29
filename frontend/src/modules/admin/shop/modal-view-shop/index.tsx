'use client';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ShopProps } from '@/lib/api';
import { BASE_URL } from '@/lib/utils';
import Image from 'next/image';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  shop: ShopProps;
};

const ModalViewShop = ({
  isOpen,
  onClose,
  shop,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        name={`${shop.name}`}
      >
        <div className='space-y-4'>
          {/* Shop Image */}
          {shop.imageUrl && (
            <div className='w-full h-64 relative rounded-lg overflow-hidden'>
              <Image
                src={`${BASE_URL}/uploads/${shop.imageUrl}`}
                alt={shop.name}
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            </div>
          )}

          {/* Shop Information */}
          <div>
            <h2 className='text-xl font-semibold'>
              {shop.name}
            </h2>
            <p className='text-sm text-gray-600'>
              {shop.address}
            </p>
          </div>

          {/* Open Hours */}
          {shop.openHours && (
            <div>
              <h3 className='text-sm font-medium text-gray-700'>
                Open Hours
              </h3>
              <p className='text-sm text-gray-800'>
                {shop.openHours}
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className='mt-6 flex justify-end'>
          <Button
            variant='ghost'
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </Modal>
    </Dialog>
  );
};

export default ModalViewShop;
