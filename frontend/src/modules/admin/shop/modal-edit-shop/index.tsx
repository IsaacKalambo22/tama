'use client';
import {
  Form,
  FormControl,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { ShopProps } from '@/lib/api';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import { FileUploader } from '@/modules/common/file-uploader';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { updateShop } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  shop: ShopProps;
};

const ModalEditShop = ({
  isOpen,
  onClose,
  shop,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);

  const formSchema = zod.object({
    name: zod.string().optional(),
    address: zod.string().optional(),
    openHours: zod.string().optional(),
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
      // Create FormData instance
      const formData = new FormData();
      formData.append('name', values.name ?? '');
      formData.append(
        'openHours',
        values.openHours ?? ''
      );
      formData.append(
        'address',
        values.address ?? ''
      );

      if (values.files.length > 0) {
        const file = values.files[0];
        formData.append('file', file);
        formData.append('imageUrl', file.name);
      } else {
        formData.append(
          'imageUrl',
          shop.imageUrl
        );
      }
      for (const pair of formData.entries()) {
        console.log(pair);
      }

      const result = await updateShop(
        formData,
        shop.id
      );

      console.log('Upload result:', result);
      onClose();
      toast({
        title: 'Success',
        description: `${shop.name} has been updated successfully`,
      });
      // Handle the result, such as showing success or error messages
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An unexpected error has occurred',
        variant: 'destructive',
      });
      console.log('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Edit ${shop.name}`}
    >
      <Form {...form}>
        <form
          className='flex flex-col gap-5 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='name'
            label='Shop name'
            control={form.control}
            placeholder='Enter file name'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='address'
            label='Address'
            control={form.control}
            placeholder='Enter file address'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='openHours'
            label='Open Hours'
            control={form.control}
            placeholder='Enter file openHours'
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
            loadingText='Updating...'
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalEditShop;
