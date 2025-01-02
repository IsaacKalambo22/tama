'use client';

import {
  Form,
  FormControl,
} from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import { handleFileUpload } from '@/lib/utils';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import { FileUploader } from '@/modules/common/file-uploader';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { createShop } from '../../actions';
import Modal from '../../modal';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewShop = ({
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);
  const formSchema = zod.object({
    name: zod.string().min(2, {
      message:
        'Name must be at least 2 characters.',
    }),
    address: zod.string().min(2, {
      message:
        'Address must be at least 2 characters.',
    }),
    openHours: zod.string().min(2, {
      message:
        'OpenHours must be at least 2 characters.',
    }),
    files: zod.custom<File[]>(),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      openHours: '',
      files: [],
    },
  });
  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    console.log({ values });

    try {
      // Upload the file separately to get the URL
      const file = values.files[0];
      const fileUrl = await handleFileUpload(
        file
      );

      console.log('File uploaded. URL:', fileUrl);

      // Create a JSON object to send
      const payload = {
        name: values.name,
        openHours: values.openHours,
        address: values.address,
        imageUrl: fileUrl, // Add the uploaded file URL
        size: file.size, // Add the uploaded file URL
      };

      const result = await createShop(
        payload,
        fullPath,
        `/tobacco-business/shops`,
        '/admin'
      );

      console.log('Upload result:', result);

      onClose();
      toast({
        title: 'Success',
        description:
          'New form or document has been created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An unexpected error has occurred',
        variant: 'destructive',
      });
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name='Add New Shop'
    >
      <Form {...form}>
        <form
          className='flex flex-col gap-5 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='name'
            label='Name'
            control={form.control}
            placeholder='Enter shop name'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='address'
            label='Address'
            control={form.control}
            placeholder='Enter address'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='openHours'
            label='Open Hours'
            control={form.control}
            placeholder='Enter shop open hours'
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name='files'
            label='Image'
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader
                  files={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            )}
          />

          <SubmitButton
            disabled={
              isLoading || !form.formState.isValid
            }
            isLoading={isLoading}
            className='w-full  h-9'
            loadingText='Saving...'
          >
            Save
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalNewShop;
