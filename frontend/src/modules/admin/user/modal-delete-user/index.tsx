'use client';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import { UserProps } from '@/lib/api';
import CustomButton, {
  BUTTON_VARIANT,
} from '@/modules/common/custom-button';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { deleteUser } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: UserProps;
};

const ModalDeleteUser = ({
  isOpen,
  onClose,
  user,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      const result = await deleteUser(
        user.id,
        fullPath,
        '/admin'
      );

      onClose();
      toast({
        title: 'Success',
        description: `${user.name} has been deleted successfully`,
      });
      // Handle the result, such as showing success or error messages
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An unexpected error has occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Delete ${user.name}`}
    >
      <DialogDescription>
        Are you sure you want to delete{' '}
        {user.name}?
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

export default ModalDeleteUser;
