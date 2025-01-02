'use client';
import {
  Form,
  FormControl,
} from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import { FileProps } from '@/lib/api';
import {
  getFileType,
  handleFileUpload,
} from '@/lib/utils';
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
import { updateForm } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  file: FileProps;
};

const ModalEditForm = ({
  isOpen,
  onClose,
  file,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);
  const formSchema = zod.object({
    filename: zod.string().optional(),
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
      let fileUrl = '';
      let type = '';
      let extension = '';
      let size = undefined;

      if (values.files.length > 0) {
        const file = values.files[0];
        fileUrl = await handleFileUpload(file);
        size = Number(file.size);
        const fileProps = getFileType(file.name);
        type = fileProps.type;
        extension = fileProps.extension;
      }

      const payload = {
        filename: values.filename ?? '',
        fileUrl,
        type,
        extension,
        size,
      };

      const result = await updateForm(
        payload,
        file.id,
        fullPath,
        pathWithoutAdmin
      );

      console.log('Upload result:', result);
      onClose();
      toast({
        title: 'Success',
        description: `${file.filename} has been updated successfully`,
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
      name={`Edit ${file.filename}`}
    >
      <Form {...form}>
        <form
          className='flex flex-col gap-5 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='filename'
            label='Name'
            control={form.control}
            placeholder='Enter report name'
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

export default ModalEditForm;
