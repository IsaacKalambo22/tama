'use client';

import { Form } from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import { EventProps } from '@/lib/api';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { updateEvent } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event?: EventProps; // Preloaded event data for editing
};

const ModalEditEvent = ({
  isOpen,
  onClose,
  event,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);

  // Define the schema for event data
  const formSchema = zod.object({
    title: zod.string().optional(),
    description: zod.string().optional(),
    date: zod.date().optional(),
    time: zod.string().optional(),
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
      date: undefined,
      time: '',
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
        date: values.date,
        time: values.time || null,
        endDate: values.endDate || null,
        location: values.location,
      };

      console.log('JSON Payload:', payload);

      if (event?.id) {
        // Update event
        await updateEvent(
          payload,
          event?.id,
          fullPath,
          `/events${pathWithoutAdmin}`
        );
        onClose();
        toast({
          title: 'Event Updated',
          description:
            'Your event has been updated successfully!',
        });
      } else {
        toast({
          title: 'Error',
          description:
            'Event ID is required for updating the event.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An unexpected error has occurred while updating the event.',
        variant: 'destructive',
      });
      console.error(
        'Error updating event:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name='Edit Event'
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
            name='date'
            label='Date'
            control={form.control}
            placeholder='YYYY-MM-DD'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='time'
            label='Time (optional)'
            control={form.control}
            placeholder='HH:mm'
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            name='endDate'
            label='End Date (optional)'
            control={form.control}
            placeholder='YYYY-MM-DD'
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
            loadingText='Updating...'
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalEditEvent;
