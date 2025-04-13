'use client';
import {
  Form,
  FormControl,
} from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import { TeamProps } from '@/lib/api';
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
import { updateTeam } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  team: TeamProps;
};

const ModalEditTeam = ({
  isOpen,
  onClose,
  team,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);

  const formSchema = zod.object({
    name: zod.string().optional(),
    description: zod.string().optional(),
    position: zod.string().optional(),
    files: zod.custom<File[]>(),
  });

  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);
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
      let imageUrl = '';
      let size = undefined;

      if (values.files.length > 0) {
        const file = values.files[0];
        imageUrl = await handleFileUpload(file);
        size = Number(file.size);
      }

      const payload = {
        name: values.name ?? '',
        description: values.description ?? '',
        position: values.position ?? '',
        imageUrl,
        size: size,
      };

      const result = await updateTeam(
        payload,
        team.id,
        fullPath,
        pathWithoutAdmin
      );

      onClose();
      toast({
        title: 'Success',
        description: `${team.id} has been updated successfully`,
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Edit ${team.id}`}
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
              placeholder='Enter Name'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='description'
              label='Description'
              control={form.control}
              placeholder='Enter description'
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

export default ModalEditTeam;
