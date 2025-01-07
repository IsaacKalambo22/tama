'use client';

import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import HeaderText from '@/modules/client/header-text';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define the Zod schema
const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required'),
  lastName: z
    .string()
    .min(1, 'Last name is required'),
  email: z
    .string()
    .email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(
      /^\+?\d{10,15}$/,
      'Invalid phone number format'
    ),
  message: z
    .string()
    .min(1, 'Message is required'),
});

// Extract the TypeScript type for the form data
type ContactFormData = z.infer<
  typeof contactSchema
>;

const Contact = () => {
  const [isLoading, setIsLoading] =
    useState(false);
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      message: '',
    },
  });

  const onSubmit = async (
    data: ContactFormData
  ) => {
    console.log({ data });
    try {
      setIsLoading(true);
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        message: data.message,
      };
      const response = await fetch(
        '/api/emails',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      console.log({ response });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast({
        title: 'Success',
        description:
          'Message has been sent successfully',
      });
      form.reset();
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
    <div className='flex w-full flex-col gap-10 mb-16 max-w-3xl mx-auto items-center'>
      <HeaderText
        title='Let’s have a chat'
        subtitle='Questions about our products or services or just want to say hello? We are here to help.'
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid gap-6 w-full'
        >
          {/* First Name and Last Name in one row */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='firstName'
              label='First Name'
              control={form.control}
              placeholder='Enter your first name'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='lastName'
              label='Last Name'
              control={form.control}
              placeholder='Enter your last name'
            />
          </div>

          {/* Email and Phone Number in one row */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='email'
              label='Email'
              control={form.control}
              placeholder='Enter your email'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='phoneNumber'
              label='Phone Number'
              control={form.control}
              placeholder='Enter your phone number'
            />
          </div>

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name='message'
            label='Message'
            control={form.control}
            placeholder='Enter your message'
          />
          <SubmitButton
            disabled={
              isLoading || !form.formState.isValid
            }
            isLoading={isLoading}
            className='w-full h-9'
            loadingText='Sending message...'
          >
            Send Message
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default Contact;
