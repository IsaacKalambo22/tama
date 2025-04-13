import { Form } from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import CustomFormField, { FormFieldType } from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as zod from 'zod';
import { createStat } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const formSchema = zod.object({
  registeredCustomers: zod
    .number({ required_error: 'Required' })
    .min(0, 'Must be at least 0'),
  shops: zod
    .number({ required_error: 'Required' })
    .min(0, 'Must be at least 0'),
  councilors: zod
    .number({ required_error: 'Required' })
    .min(0, 'Must be at least 0'),
  cooperatives: zod
    .number({ required_error: 'Required' })
    .min(0, 'Must be at least 0'),
});

const ModalNewStat = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      registeredCustomers: 0,
      shops: 0,
      councilors: 0,
      cooperatives: 0,
    },
  });

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true);

    const payload = {
      registeredCustomers: values.registeredCustomers,
      shops: values.shops,
      councilors: values.councilors,
      cooperatives: values.cooperatives,
    };

    const result = await createStat(payload, fullPath, '/home/stats', '/admin');
    onClose();

    if (result.success) {
      toast.success('Stat created successfully');
    } else {
      toast.error(result.error ?? 'An error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name='Add New Stat'>
    <Form {...form}>
      <form className='flex flex-col gap-5 w-full' onSubmit={form.handleSubmit(onSubmit)}>
        <CustomFormField
          fieldType={FormFieldType.NUMBER}
          name='registeredCustomers'
          label='Registered Customers'
          control={form.control}
          type='number'
        />
        <CustomFormField
          fieldType={FormFieldType.NUMBER}
          name='shops'
          label='Shops'
          control={form.control}
          type='number'
          placeholder='Enter number of shops'
        />
        <CustomFormField
          fieldType={FormFieldType.NUMBER}
          name='councilors'
          label='Councilors'
          control={form.control}
          type='number'
          placeholder='Enter number of councilors'
        />
        <CustomFormField
          fieldType={FormFieldType.NUMBER}
          name='cooperatives'
          label='Cooperatives'
          control={form.control}
          placeholder='Enter number of cooperatives'
        />

        <SubmitButton
          disabled={isLoading || !form.formState.isValid}
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

export default ModalNewStat;
