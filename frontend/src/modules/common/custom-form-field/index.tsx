import Image from 'next/image';
import { Control } from 'react-hook-form';

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
        <div className='flex rounded-md border border-dark-500 bg-dark-400'>
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

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
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
