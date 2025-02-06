import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import useCustomPath from '@/hooks/use-custom-path';
import { VacancyStatus } from '@/lib/api';
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
import { createVacancy } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewVacancy = ({
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  // Define the schema for vacancy data
  const formSchema = zod.object({
    title: zod.string().min(2, {
      message:
        'Title must be at least 2 characters.',
    }),
    description: zod.string().min(10, {
      message:
        'Description must be at least 10 characters.',
    }),
    company: zod.string().min(10, {
      message:
        'Company must be at least 10 characters.',
    }),
    location: zod.string().min(2, {
      message:
        'Location must be at least 2 characters.',
    }),
    duties: zod.string().min(2, {
      message:
        'Duties must be at least 2 characters.',
    }),
    qualifications: zod.string().min(2, {
      message:
        'Qualifications must be at least 2 characters.',
    }),
    howToApply: zod.string().min(2, {
      message:
        'How to apply must be at least 2 characters.',
    }),
    salary: zod.string().optional(),
    applicationDeadline: zod.date(),
    status: zod.enum(['Open', 'Closed']),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      title: '',
      description: '',
      location: '',
      salary: '',
      company: '',
      qualifications: '',
      duties: '',
      howToApply: '',
      applicationDeadline: undefined,
      status: 'Open',
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    const payload = {
      title: values.title,
      description: values.description,
      location: values.location,
      company: values.company,
      duties: values.duties,
      qualifications: values.qualifications,
      howToApply: values.howToApply,
      salary: values.salary || null,
      applicationDeadline:
        values.applicationDeadline,
      status: values.status,
    };

    const result = await createVacancy(
      payload,
      fullPath,
      '/resources/vacancies',
      '/admin'
    );
    onClose();
    if (result.success) {
      toast.success(
        'Vacancy created successfully'
      );
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name='Add New Vacancy'
    >
      <div className='overflow-auto max-h-[80vh] p-4'>
        <Form {...form}>
          <form
            className='flex flex-col gap-5 w-full'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='title'
              label='Vacancy Title'
              control={form.control}
              placeholder='Enter vacancy title'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='description'
              label='Description'
              control={form.control}
              placeholder='Enter vacancy description'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='location'
              label='Location'
              control={form.control}
              placeholder='Enter location'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='salary'
              label='Salary (optional)'
              control={form.control}
              placeholder='Enter salary range'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='company'
              label='Company (optional)'
              control={form.control}
              placeholder='Enter company range'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='duties'
              label='Duties (optional)'
              control={form.control}
              placeholder='Enter duties range'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='qualifications'
              label='Qualifications (optional)'
              control={form.control}
              placeholder='Enter qualifications range'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='howToApply'
              label='How to apply (optional)'
              control={form.control}
              placeholder='Enter how to apply range'
            />
            <CustomFormField
              fieldType={
                FormFieldType.DATE_PICKER
              }
              name='applicationDeadline'
              label='Application Deadline'
              control={form.control}
              placeholder='YYYY-MM-DD'
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name='status'
              label='Status'
              control={form.control}
            >
              {Object.entries(VacancyStatus).map(
                ([key, value]) => (
                  <SelectItem
                    key={key}
                    value={value}
                  >
                    {value}
                  </SelectItem>
                )
              )}
            </CustomFormField>

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
      </div>
    </Modal>
  );
};

export default ModalNewVacancy;
