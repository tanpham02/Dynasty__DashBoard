import { Select, SelectProps } from '@nextui-org/react';
import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

interface FormContextSelectProps extends SelectProps {
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
}

const FormContextSelect = (props: FormContextSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={props.name}
      rules={props.rules}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
        return (
          <Select
            {...props}
            ref={ref}
            selectedKeys={new Set([...(value || [])])}
            size="md"
            classNames={{
              label: 'font-semibold',
              value: 'text-primary-text-color',
              trigger: 'border hover:!border-primary',
            }}
            onSelectionChange={(value) => onChange([...value])}
            color={!!error ? 'danger' : 'primary'}
            variant="bordered"
            errorMessage={error?.message}
            isInvalid={!!error?.message}
          >
            {props.children}
          </Select>
        );
      }}
    />
  );
};

export default FormContextSelect;
