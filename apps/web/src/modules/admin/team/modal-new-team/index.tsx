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
import { createTeam } from '../../actions';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTeam = ({
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);
  const formSchema = zod.object({
    name: zod.string().min(2, {
      message:
        'Title must be at least 2 characters.',
    }),
    description: zod.string().min(2, {
      message:
        'Content must be at least 2 characters.',
    }),
    position: zod.string().min(2, {
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
      name: '',
      description: '',
      position: '',
      files: [],
    },
  });
  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    try {
      const file = values.files[0];
      const fileUrl = await handleFileUpload(
        file
      );
      const fileProps = getFileType(file.name);
      console.log({ fileProps });
      // Create a JSON object to send
      const payload = {
        name: values.name,
        description: values.description,
        position: values.position,
        size: file.size,
        imageUrl: fileUrl, // Add the uploaded file URL
      };

     await createTeam(
        payload,
        fullPath,
        pathWithoutAdmin,
        '/admin'
      );

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex flex-col gap-5 w-full max-w-[400px]'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='name'
              label='Name'
              control={form.control}
              placeholder='Enter Name'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='description'
              label='Description'
              control={form.control}
              placeholder='Enter content'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='position'
              label='Position'
              control={form.control}
              placeholder='Enter Position'
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

export default ModalNewTeam;
