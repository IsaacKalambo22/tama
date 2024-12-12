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
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
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
import { createNews } from '../../actions';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewNews = ({
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);
  const formSchema = zod.object({
    title: zod.string().min(2, {
      message:
        'Title must be at least 2 characters.',
    }),
    content: zod.string().min(2, {
      message:
        'Content must be at least 2 characters.',
    }),
    author: zod.string().min(2, {
      message:
        'Author must be at least 2 characters.',
    }),
    files: zod.custom<File[]>(),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      author: '',
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
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('author', values.author);

      // Directly append the file
      const file = values.files[0];
      formData.append('file', file); // This will send the file as is, without converting it to Blob

      // Optionally, you can still append other fields (e.g., fileUrl, size)
      formData.append('imageUrl', file.name);

      // Log the FormData entries to verify
      for (const pair of formData.entries()) {
        console.log(pair); // Logs each key-value pair in the FormData object
      }

      // Call the createForm function to send data to the server
      const result = await createNews(
        formData,
        fullPath,
        `/news-updates${pathWithoutAdmin}`
      );

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
          <DialogTitle>Add New News</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex flex-col gap-5 w-full max-w-[400px]'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='title'
              label='Title'
              control={form.control}
              placeholder='Enter title'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='content'
              label='Content'
              control={form.control}
              placeholder='Enter content'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='author'
              label='Author'
              control={form.control}
              placeholder='Enter author'
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

export default ModalNewNews;
