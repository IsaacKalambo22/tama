'use client';

import { Form } from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import {
  handleFileUploads,
  updateFileProgress,
} from '@/lib/utils';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import {
  FileState,
  MultiFileDropzone,
} from '@/modules/common/multiple-file-upload';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as zod from 'zod';
import { createService } from '../../actions';
import Modal from '../../modal';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewService = ({
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);
  const [fileStates, setFileStates] = useState<
    FileState[]
  >([]);

  const formSchema = zod.object({
    title: zod
      .string()
      .min(2, {
        message:
          'Title must be at least 2 characters.',
      })
      .max(50, {
        message:
          'Title must not be more than 50 characters.',
      }),
    description: zod.string().min(2, {
      message:
        'Description must be at least 2 characters.',
    }),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      title: '',
      description: '',
    },
  });
  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    if (fileStates.length === 0) {
      toast.error(
        'Please upload at least one image file.'
      );
      setIsLoading(false); // Stop the loading process
      return;
    }

    const uploadedImageUrls = await Promise.all(
      fileStates.map(async (fileState) =>
        handleFileUploads(
          fileState.file,
          (progress) =>
            updateFileProgress(
              fileState.key,
              progress,
              setFileStates
            )
        )
      )
    );

    // Create a JSON object to send
    const payload = {
      title: values.title,
      description: values.description,
      imageUrl: uploadedImageUrls[0],
    };
    console.log({ payload });

    const result = await createService(
      payload,
      fullPath,
      '/admin',
      '/'
    );

    if (result.success) {
      toast.success(
        'New service created successfully'
      );
      onClose();
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
      name='Add New Service'
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
            name='description'
            label='Description'
            control={form.control}
            placeholder='Enter description'
          />

          <div className='w-full flex flex-col gap-4'>
            <label className='font-medium text-gray-700'>
              Upload Image
            </label>
            <MultiFileDropzone
              value={fileStates}
              onChange={setFileStates}
              fileType='image/*'
              maxFiles={1}
            />
          </div>

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

export default ModalNewService;
