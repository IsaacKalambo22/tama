import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { E164Number } from 'libphonenumber-js/core';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Control } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
export enum FormFieldType {
  INPUT = 'input',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
  DATE = 'DATE',
  TIME_PICKER = 'timePicker',
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (
    field: any
  ) => React.ReactNode;
  fieldType: FormFieldType;
  type?: string;
}

const RenderInput = ({
  field,
  props,
}: {
  field: any;
  props: CustomProps;
}) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
    case FormFieldType.NUMBER:
      return (
        <div className='flex rounded-md border border-green-500 '>
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || 'icon'}
              className='ml-2'
            />
          )}
          <FormControl>
            <Input
              type={
                props.fieldType ===
                FormFieldType.NUMBER
                  ? 'number'
                  : 'text'
              }
              placeholder={props.placeholder}
              {...field}
              value={
                props.fieldType ===
                FormFieldType.NUMBER
                  ? Number(field.value)
                  : field.value
              }
              onChange={(e) => {
                const value =
                  props.fieldType ===
                  FormFieldType.NUMBER
                    ? parseFloat(e.target.value) // Convert to number
                    : e.target.value;
                field.onChange(value);
              }}
              className='shad-input border-0'
            />
          </FormControl>
        </div>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className='flex relative items-center w-full h-10'>
          <FormControl>
            <DatePicker
              showTimeSelect={
                props.showTimeSelect ?? false
              }
              selected={field.value}
              onChange={(date: Date) =>
                field.onChange(date)
              }
              timeInputLabel='Time:'
              dateFormat={
                props.dateFormat ?? 'MM/dd/yyyy'
              }
              placeholderText={props.placeholder} // Use placeholderText here
              wrapperClassName='margin-0 padding-0 w-full '
              customInput={
                <Input // Custom Input with placeholder
                  placeholder={props.placeholder}
                  className='shad-input border-[1px] w-full border-green-500 pl-10'
                />
              }
            />
          </FormControl>
          <CalendarIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600 hover:text-gray-900' />
        </div>
      );
    case FormFieldType.TIME_PICKER:
      return (
        <div className='flex relative items-center w-full h-10'>
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(time: Date) =>
                field.onChange(time)
              }
              showTimeSelect
              showTimeSelectOnly // Ensures only time selection
              timeIntervals={15} // Interval in minutes
              timeCaption='Time'
              dateFormat='h:mm aa' // Customize time format
              placeholderText={props.placeholder} // Placeholder text
              wrapperClassName='margin-0 padding-0 w-full '
              customInput={
                <Input
                  placeholder={
                    props.placeholder ||
                    'Select time'
                  }
                  className='shad-input border-[1px] w-full border-green-500 pl-10'
                />
              }
            />
          </FormControl>
          <CalendarIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600 hover:text-gray-900' />
        </div>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            rows={4}
            placeholder={props.placeholder}
            {...field}
            className='shad-textArea'
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className='flex items-center gap-4'>
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label
              htmlFor={props.name}
              className='checkbox-label'
            >
              {props.label}
            </label>
          </div>
        </FormControl>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={(value) => {
              // Convert value to number if it's a valid number string
              const parsedValue = isNaN(
                Number(value)
              )
                ? value
                : Number(value);
              field.onChange(parsedValue);
            }}
            defaultValue={
              typeof field.value === 'number'
                ? field.value
                : field.value ?? ''
            } // Handle default values
          >
            <FormControl>
              <SelectTrigger className='shad-select-trigger'>
                <SelectValue
                  placeholder={props.placeholder}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent className='shad-select-content'>
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry='MW'
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={
              field.value as
                | E164Number
                | undefined
            }
            onChange={field.onChange}
            className='input-phone'
          />
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton
        ? props.renderSkeleton(field)
        : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex-1'>
          {props.fieldType !==
            FormFieldType.CHECKBOX &&
            label && (
              <FormLabel className='form_input shad-input-label'>
                {label}
              </FormLabel>
            )}
          <RenderInput
            field={field}
            props={props}
          />

          <FormMessage className='shad-error' />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
