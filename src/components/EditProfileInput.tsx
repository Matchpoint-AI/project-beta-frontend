import React, { ChangeEventHandler, useState } from 'react';
import FormInputBox from './shared/FormInputBox';
import ClearIcon from '@mui/icons-material/Clear';

interface EditProfileInputProps {
  type: 'text' | 'email' | 'password';
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  validateInput: (value: string) => boolean | null;
  placeholder: string;
  subject: 'name' | 'email' | 'password';
}

export default function EditProfileInput(props: EditProfileInputProps) {
  const [error, setError] = useState<boolean | null>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setError(props.validateInput(e.target.value));
    props.setValue(e.target.value);
  };

  const handleClear = () => {
    setError(true);
    props.setValue('');
  };
  return (
    <div className="sm:w-4/5 w-full max-w-[550px]">
      <FormInputBox color={error === null ? '#d1d5db' : error ? '#F05252' : '#0E9F6E'}>
        <input
          type={props.type}
          value={props.value}
          onChange={handleChange}
          placeholder={props.placeholder}
          className="text-sm w-full bg-transparent outline-none "
          style={{
            color: `${error === null ? '#111827' : error ? '#6c0404' : '#046C4E'}`,
          }}
        />
        <button type="button" onClick={handleClear}>
          <ClearIcon
            sx={{
              color: `${error === null ? '#6B7280' : error ? '#6c0404' : '#046C4E'}`,
            }}
          />
        </button>
      </FormInputBox>
      {error && (
        <p className="text-[#F05252] text-sm font-medium mt-1">
          {props.subject === 'password'
            ? 'Password must be at least 6 characters'
            : `Please provide a valid ${props.subject}`}
        </p>
      )}
    </div>
  );
}
