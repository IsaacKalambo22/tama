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
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Control } from 'react-hook-form';
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
        <div className='flex rounded-md border border-gray-500 '>
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
    // case FormFieldType.DATE_PICKER:
    //   return (
    //     <FormControl>
    //       <FormItem className='flex flex-col'>
    //         <Popover>
    //           <PopoverTrigger asChild>
    //             <FormControl>
    //               <Button
    //                 variant={'outline'}
    //                 className={cn(
    //                   'w-full pl-3 text-left font-normal',
    //                   !field.value &&
    //                     'text-muted-foreground'
    //                 )}
    //               >
    //                 {field.value ? (
    //                   format(field.value, 'PPP')
    //                 ) : (
    //                   <span>Pick a date</span>
    //                 )}
    //                 <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
    //               </Button>
    //             </FormControl>
    //           </PopoverTrigger>
    //           <PopoverContent
    //             className='w-auto p-0'
    //             align='start'
    //           >
    //             <Calendar
    //               mode='single'
    //               selected={field.value}
    //               onSelect={(date) => {
    //                 console.log(
    //                   'clicked!!!',
    //                   date
    //                 );
    //                 field.onChange(date); // This line ensures the form state is updated
    //               }}
    //               initialFocus
    //             />
    //           </PopoverContent>
    //         </Popover>
    //       </FormItem>
    //     </FormControl>
    //   );

    case FormFieldType.DATE_PICKER:
      return (
        <div className='flex items-center  rounded-md border h-11 !important border-gray-500 pr-4'>
          {/* <Image
            src='/assets/icons/calendar.svg'
            height={10}
            width={10}
            alt='user'
            className='ml-2'
          /> */}

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
              wrapperClassName='date-picker'
            />
          </FormControl>
          <CalendarIcon className=' h-5 w-5 opacity-50' />
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
