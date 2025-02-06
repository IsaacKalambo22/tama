'use client';
import {
  Form,
  FormControl,
} from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import { NewsProps } from '@/lib/api';
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
import { toast } from 'sonner';
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
    let imageUrl = '';
    let size = undefined;

    if (values.files.length > 0) {
      const file = values.files[0];
      imageUrl = await handleFileUpload(file);
      size = Number(file.size);
    }

    const payload = {
      title: values.title ?? '',
      content: values.content ?? '',
      author: values.author ?? '',
      imageUrl,
      size: size,
    };

    const result = await updateNews(
      payload,
      news.id,
      fullPath,
      '/news-updates-news'
    );

    onClose();
    if (result.success) {
      toast.success('News updated successfully');
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
