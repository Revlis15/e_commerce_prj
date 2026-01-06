import { FormControl, InputLabel, Select, MenuItem, FormHelperText, SelectProps } from '@mui/material';
import { Control, Controller, FieldError } from 'react-hook-form';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  name: string;
  control: Control<any>;
  label: string;
  options: SelectOption[];
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
}

/**
 * FormSelect Component
 * Controlled select component with react-hook-form integration
 * Automatically displays validation errors
 */
const FormSelect = ({
  name,
  control,
  label,
  options,
  error,
  disabled = false,
  required = false,
  helperText,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  ...rest
}: FormSelectProps & Partial<SelectProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl
          fullWidth={fullWidth}
          error={!!error}
          disabled={disabled}
          size={size}
          variant={variant}
        >
          <InputLabel required={required}>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            {...rest}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {(error || helperText) && (
            <FormHelperText>
              {error ? error.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default FormSelect;
