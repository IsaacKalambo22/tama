'use client';

import { Button } from '@/components/ui/button';
import { CouncilListProps } from '@/lib/api';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  councilList: CouncilListProps;
};

const ModalViewCouncilList = ({
  isOpen,
  onClose,
  councilList,
}: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={
        councilList.demarcation ||
        'Council List Details'
      }
    >
      <div className='space-y-6'>
        {/* Demarcation */}
        <div>
          <h2 className='text-xl font-semibold'>
            {councilList.demarcation}
          </h2>
          <p className='text-gray-600 text-sm mt-2'>
            Tobacco Type:{' '}
            {councilList.tobaccoType}
          </p>
        </div>

        {/* Councillors */}
        <div className='space-y-2'>
          <p className='text-sm'>
            <span className='font-medium'>
              Councillor:
            </span>{' '}
            {councilList.councillor}
          </p>
          <p className='text-sm'>
            <span className='font-medium'>
              First Alternate Councillor:
            </span>{' '}
            {councilList.firstAlternateCouncillor}
          </p>
          <p className='text-sm'>
            <span className='font-medium'>
              Second Alternate Councillor:
            </span>{' '}
            {
              councilList.secondAlternateCouncillor
            }
          </p>
        </div>
      </div>

      {/* Close Button */}
      <div className='mt-6 flex justify-end'>
        <Button variant='ghost' onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ModalViewCouncilList;
