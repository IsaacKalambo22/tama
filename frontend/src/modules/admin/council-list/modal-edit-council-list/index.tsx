'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as zod from 'zod';
import { updateCouncilList } from '../../actions';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  councilList: {
    id: string;
    demarcation: string;
    tobaccoType: string;
    councillor: string;
    firstAlternateCouncillor: string;
    secondAlternateCouncillor: string;
  };
};

const ModalEditCouncilList = ({
  isOpen,
  onClose,
  councilList,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);

  const formSchema = zod.object({
    demarcation: zod.string().min(2, {
      message:
        'Demarcation must be at least 2 characters.',
    }),
    tobaccoType: zod.string().min(2, {
      message:
        'Tobacco type must be at least 2 characters.',
    }),
    councillor: zod.string().min(2, {
      message:
        'Councillor must be at least 2 characters.',
    }),
    firstAlternateCouncillor: zod
      .string()
      .min(2, {
        message:
          'First Alternate Councillor must be at least 2 characters.',
      }),
    secondAlternateCouncillor: zod
      .string()
      .min(2, {
        message:
          'Second Alternate Councillor must be at least 2 characters.',
      }),
  });

  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      demarcation: councilList.demarcation || '',
      tobaccoType: councilList.tobaccoType || '',
      councillor: councilList.councillor || '',
      firstAlternateCouncillor:
        councilList.firstAlternateCouncillor ||
        '',
      secondAlternateCouncillor:
        councilList.secondAlternateCouncillor ||
        '',
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    const {
      demarcation,
      tobaccoType,
      councillor,
      firstAlternateCouncillor,
      secondAlternateCouncillor,
    } = values;
    const payload = {
      demarcation,
      tobaccoType,
      councillor,
      firstAlternateCouncillor,
      secondAlternateCouncillor,
    };

    const result = await updateCouncilList(
      payload,
      councilList.id,
      fullPath,
      '/resources/council-list'
    );

    onClose();
    if (result.success) {
      toast.success(
        'Council list updated successfully'
      );
    } else {
      toast.error(
        result.error ??
          'An error occurred while updating council list.'
      );
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            Edit Council List
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex flex-col gap-5 w-full max-w-[400px]'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='demarcation'
              label='Demarcation'
              control={form.control}
              placeholder='Enter demarcation'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='tobaccoType'
              label='Tobacco Type'
              control={form.control}
              placeholder='Enter tobacco type'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='councillor'
              label='Councillor'
              control={form.control}
              placeholder='Enter councillor'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='firstAlternateCouncillor'
              label='First Alternate Councillor'
              control={form.control}
              placeholder='Enter first alternate councillor'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='secondAlternateCouncillor'
              label='Second Alternate Councillor'
              control={form.control}
              placeholder='Enter second alternate councillor'
            />

            <SubmitButton
              disabled={
                isLoading ||
                !form.formState.isValid
              }
              isLoading={isLoading}
              className='w-full h-9'
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

export default ModalEditCouncilList;
