import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldError } from 'react-hook-form';

interface FormInputProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: FieldError;
  type?: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
}

/**
 * FormInput Component
 * Controlled input component with react-hook-form integration
 * Automatically displays validation errors
 */
const FormInput = ({
  name,
  control,
  label,
  error,
  type = 'text',
  multiline = false,
  rows = 1,
  placeholder,
  disabled = false,
  required = false,
  helperText,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  ...rest
}: FormInputProps & Partial<TextFieldProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          multiline={multiline}
          rows={multiline ? rows : undefined}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          fullWidth={fullWidth}
          size={size}
          variant={variant}
          error={!!error}
          helperText={error ? error.message : helperText}
          {...rest}
        />
      )}
    />
  );
};

export default FormInput;
