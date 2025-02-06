'use client';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import useCustomPath from '@/hooks/use-custom-path';
import { FileProps } from '@/lib/api';
import CustomButton, {
  BUTTON_VARIANT,
} from '@/modules/common/custom-button';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteReportAndPublication } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  file: FileProps;
};

const ModalDeleteReports = ({
  isOpen,
  onClose,
  file,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);
  const onSubmit = async () => {
    setIsLoading(true);

    const result =
      await deleteReportAndPublication(
        file.id,
        fullPath,
        pathWithoutAdmin,
        '/admin'
      );

    onClose();
    if (result.success) {
      toast.success(
        'Publication deleted successfully'
      );
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Delete ${file.filename}`}
    >
      <DialogDescription>
        Are you sure you want to delete{' '}
        {file.filename}?
      </DialogDescription>
      <DialogFooter className='flex flex-col gap-3 md:flex-row'>
        <DialogClose asChild>
          <Button
            type='button'
            className='h-9'
            variant='secondary'
          >
            Close
          </Button>
        </DialogClose>
        <CustomButton
          isLoading={isLoading}
          loadingText='Deleting...'
          variant={BUTTON_VARIANT.DESTRUCTIVE}
          className='h-9'
          onClick={onSubmit}
        >
          Confirm
        </CustomButton>
      </DialogFooter>
    </Modal>
  );
};

export default ModalDeleteReports;
