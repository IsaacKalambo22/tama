'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
} from '@/components/ui/form';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import { FileUploader } from '@/modules/common/file-uploader';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewForm = ({
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);

  const formSchema = zod.object({
    filename: zod.string().min(2, {
      message:
        'Filename must be at least 2 characters.',
    }),
    files: zod.custom<File[]>().optional(),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filename: '',
      files: [],
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);

    try {
      console.log({ values });
      // Create FormData instance
      const formData = new FormData();
      formData.append(
        'filename',
        values.filename
      );

      if (
        values.files &&
        values.files.length > 0
      ) {
        values.files.forEach((file, index) => {
          formData.append(
            `files[${index}]`,
            file
          ); // Append files to FormData
        });
      }

      // Simulate form data handling
      console.log('FormData entries:');
      for (const [
        key,
        value,
      ] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Example: Send FormData to an API endpoint
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();

      // Handle response here
    } catch (error) {
      console.error('Unexpected error:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            Add New Form or Document
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex flex-col gap-5 w-full max-w-[400px]'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='filename'
              label='Filename'
              control={form.control}
              placeholder='Enter file name'
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name='files'
              label='Files'
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
                isLoading ||
                !form.formState.isValid
              }
              isLoading={isLoading}
              className='w-full  h-9'
              loadingText='Saving in...'
            >
              Save
            </SubmitButton>
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNewForm;
