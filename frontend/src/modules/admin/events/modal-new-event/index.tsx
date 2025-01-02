'use client';

import { Form } from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { createEvent } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewEvent = ({
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  // Define the schema for event data
  const formSchema = zod.object({
    title: zod.string().min(2, {
      message:
        'Title must be at least 2 characters.',
    }),
    description: zod.string().min(10, {
      message:
        'Description must be at least 10 characters.',
    }),
    startDate: zod.date(),
    time: zod.date().optional(),
    endDate: zod.date().optional(),
    location: zod.string().optional(),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      title: '',
      description: '',
      startDate: undefined,
      time: undefined,
      endDate: undefined,
      location: '',
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    console.log({ values });
    try {
      const payload = {
        title: values.title,
        description: values.description,
        date: values.startDate,
        time: values.time || null,
        endDate: values.endDate || null,
        location: values.location,
      };

      console.log('JSON Payload:', payload);

      const result = await createEvent(
        payload,
        fullPath,
        `/tobacco-business/event-calendar`,
        '/admin'
      );
      console.log('Upload result:', result);

      onClose();
      toast({
        title: 'Success',
        description:
          'Event has been created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An unexpected error has occurred',
        variant: 'destructive',
      });
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name='Add New Event'
    >
      <Form {...form}>
        <form
          className='flex flex-col gap-5 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='title'
            label='Event Title'
            control={form.control}
            placeholder='Enter event title'
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name='description'
            label='Description'
            control={form.control}
            placeholder='Enter event description'
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            name='startDate'
            label='Start Date'
            control={form.control}
            placeholder='Select a start date'
            dateFormat='dd/MM/yyyy'
            showTimeSelect={false}
          />

          <CustomFormField
            fieldType={FormFieldType.TIME_PICKER}
            name='time'
            label='Time'
            control={form.control}
            placeholder='Select event time'
            dateFormat='h:mm aa'
            showTimeSelect
          />

          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            name='endDate'
            placeholder='Select a end date'
            control={form.control}
            dateFormat='dd/MM/yyyy'
            showTimeSelect={false}
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='location'
            label='Location (optional)'
            control={form.control}
            placeholder='Enter location'
          />

          <SubmitButton
            disabled={
              isLoading || !form.formState.isValid
            }
            isLoading={isLoading}
            className='w-full h-9'
            loadingText='Saving...'
          >
            Save
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalNewEvent;
