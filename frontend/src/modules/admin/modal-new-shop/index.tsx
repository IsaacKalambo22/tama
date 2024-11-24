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
import { toast } from '@/hooks/use-toast';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import { FileUploader } from '@/modules/common/file-uploader';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { createForm } from '../actions';
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

  const formSchema = zod.object({
    filename: zod.string().min(2, {
      message:
        'Filename must be at least 2 characters.',
    }),
    files: zod.custom<File[]>(),
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
    console.log({ values });
    try {
      // Create FormData instance
      const formData = new FormData();
      formData.append(
        'filename',
        values.filename
      );

      // Directly append the file
      const file = values.files[0];
      formData.append('file', file); // This will send the file as is, without converting it to Blob

      // Optionally, you can still append other fields (e.g., fileUrl, size)
      formData.append('fileUrl', file.name);
      const size = Number(file.size);
      formData.append('size', size.toString()); // Ensure size is a number

      // Log the FormData entries to verify
      for (const pair of formData.entries()) {
        console.log(pair); // Logs each key-value pair in the FormData object
      }

      // Call the createForm function to send data to the server
      const result = await createForm(formData);

      console.log('Upload result:', result);
      onClose();
      toast({
        title: 'Success',
        description:
          'New form or document has been created successfully',
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
              label='File'
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
              loadingText='Saving...'
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

export default ModalNewShop;
