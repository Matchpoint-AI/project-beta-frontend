import React, { useState, useContext, ChangeEventHandler, useEffect } from 'react';
import FormInputBox from '../FormInputBox';
import { LinkSymbol } from '../../LinkSymbol';
import ClearIcon from '@mui/icons-material/Clear';
import { BrandContext } from '../../../features/brand/context/BrandContext';
import { useAuth } from '../../../features/auth/context/AuthContext';

interface FormErrorState {
  count: number;
  error: boolean;
}

interface BusinessFormInputProps {
  subject: 'name' | 'website';
  title: string;
  description?: string;
  placeholder: string;
  type: 'text' | 'link';
  validateInput: (value: string) => boolean;
  runValidation: number;
  setFormError: React.Dispatch<React.SetStateAction<FormErrorState>>;
}

export default function BusinessFormInput(props: BusinessFormInputProps) {
  const { businessInfo, setBusinessInfo } = useContext(BrandContext);
  const { profile } = useAuth();
  const [error, setError] = useState<boolean | null>(null);
  const [value, setValue] = useState('');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (profile?.hasBrand) return;
    const input = e.target.value;
    setValue(input);
    setError(!props.validateInput(input));
  };

  const clearInput = () => {
    if (profile?.hasBrand) return;
    setValue('');
    setBusinessInfo({ ...businessInfo, [props.subject]: '' });
    setError(true);
  };

  const saveValue = () => {
    if (profile?.hasBrand) return;
    const finalValue = error ? '' : value;
    setError(!props.validateInput(finalValue));
    setBusinessInfo({ ...businessInfo, [props.subject]: finalValue });
  };

  useEffect(() => {
    if (props.runValidation === 0) return;
    const inputError = props.validateInput(value);
    setError(!inputError);
    props.setFormError((old: FormErrorState) => ({
      count: old.count + 1,
      error: !inputError,
    }));
  }, [props.runValidation]);

  useEffect(() => {
    if (businessInfo.name && props.subject === 'name') {
      setValue(businessInfo.name);
      setError(!props.validateInput(businessInfo.name));
    }
    if (businessInfo.website && props.subject === 'website') {
      setValue(businessInfo.website);
      setError(!props.validateInput(businessInfo.website));
    }
  }, [businessInfo]);

  return (
    <div>
      <h1 className="mb-3 text-xl font-semibold text-gray-900">{props.title}</h1>
      {props.description && <p className="text-[14px] mb-3">{props.description}</p>}
      <FormInputBox color={error === null ? '#d1d5db' : error ? '#F05252' : '#0E9F6E'}>
        {props.type === 'link' && (
          <LinkSymbol color={error === null ? '#6B7280' : error ? '#6c0404' : '#046C4E'} />
        )}
        <input
          value={value}
          type="text"
          disabled={profile?.hasBrand}
          placeholder={props?.placeholder}
          onChange={handleChange}
          onBlur={saveValue}
          className="text-sm w-full bg-transparent outline-none"
          style={{
            color: `${error === null ? '#111827' : error ? '#6c0404' : '#046C4E'}`,
          }}
        />
        <button
          disabled={profile?.hasBrand}
          type="button"
          onClick={clearInput}
          className="disabled:cursor-not-allowed"
        >
          <ClearIcon
            sx={{
              color: `${error === null ? '#6B7280' : error ? '#6c0404' : '#046C4E'}`,
            }}
          />
        </button>
      </FormInputBox>
      {error !== null && error && (
        <p className="text-[#F05252] text-sm font-medium mt-1">Please provide a valid value</p>
      )}
    </div>
  );
}
