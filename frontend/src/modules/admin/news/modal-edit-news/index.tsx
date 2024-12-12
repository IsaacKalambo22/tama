'use client';
import {
  Form,
  FormControl,
} from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import { NewsProps } from '@/lib/api';
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
import { updateNews } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  news: NewsProps;
};

const ModalEditNews = ({
  isOpen,
  onClose,
  news,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);
  const formSchema = zod.object({
    title: zod.string().optional(),
    content: zod.string().optional(),
    author: zod.string().optional(),
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
      formData.append(
        'title',
        values.title ?? ''
      );
      formData.append(
        'content',
        values.content ?? ''
      );
      formData.append(
        'author',
        values.author ?? ''
      );

      if (values.files.length > 0) {
        const file = values.files[0];
        formData.append('file', file);
        formData.append('imageUrl', file.name);
      } else {
        formData.append(
          'imageUrl',
          news.imageUrl
        );
      }

      const result = await updateNews(
        formData,
        news.id,
        fullPath,
        pathWithoutAdmin
      );

      console.log('Upload result:', result);
      onClose();
      toast({
        title: 'Success',
        description: `${news.title} has been updated successfully`,
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
      name={`Edit ${news.title}`}
    >
      <Form {...form}>
        <form
          className='flex flex-col gap-5 w-full'
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

export default ModalEditNews;
