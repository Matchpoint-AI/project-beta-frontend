import React, { useCallback, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

interface FormInputProps {
  saveInput: (key: 'name' | 'website', value: string) => void;
  subject: 'name' | 'website';
  initValue?: string;
  validateInput: (input: string) => boolean;
  parentError: boolean;
}

interface InputError {
  message?: string;
  error: boolean;
}

export default function FormInput({
  saveInput,
  subject,
  initValue,
  validateInput,
  parentError,
}: FormInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<InputError | null>(null);

  const clearInput = useCallback(() => {
    setInput('');
    setError({
      message: `please provide a valid ${subject}`,
      error: true,
    });
  }, [subject]);

  const handleSave = useCallback(
    (value: string) => {
      if (!validateInput(value)) {
        setError({
          message: `please provide a valid ${subject}`,
          error: true,
        });
      } else {
        setError({ error: false });
        console.log('subject === ', subject);
        console.log('value === ', value);
        saveInput(subject, value);
      }
    },
    [subject, validateInput, saveInput]
  );

  useEffect(() => {
    if (initValue) {
      setInput(initValue);
      handleSave(initValue);
    }
    if (parentError)
      setError({
        message: `please provide a valid ${subject}`,
        error: true,
      });
  }, [parentError, initValue, subject]);

  return (
    <div className="mb-5">
      <label title="name" className="block mb-2 text-xl font-medium text-gray-900">
        {subject === 'name' ? 'What are you called?' : 'Add you business website'}
      </label>
      {subject === 'website' && (
        <p className="text-[14px] mb-1">
          Import information on your brand, products and audience from your website
        </p>
      )}
      <div
        className="bg-gray-50 border rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 flex items-center justify-center gap-2"
        style={{
          borderColor: `${!error ? '#d1d5db' : error.error ? '#F05252' : '#0E9F6E'}`,
        }}
      >
        {subject === 'website' && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.6743 7.32746C10.3667 7.01928 10.0015 6.77478 9.59933 6.60796C9.1972 6.44114 8.76612 6.35527 8.33076 6.35527C7.89541 6.35527 7.46433 6.44114 7.0622 6.60796C6.66007 6.77478 6.29478 7.01928 5.98726 7.32746L2.63888 10.6751C2.33072 10.9827 2.08623 11.348 1.91942 11.7501C1.75261 12.1523 1.66675 12.5834 1.66675 13.0188C1.66675 13.4542 1.75261 13.8853 1.91942 14.2874C2.08623 14.6896 2.33072 15.0549 2.63888 15.3624C2.94641 15.6706 3.31169 15.9151 3.71382 16.0819C4.11595 16.2488 4.54703 16.3346 4.98239 16.3346C5.41774 16.3346 5.84883 16.2488 6.25096 16.0819C6.65309 15.9151 7.01837 15.6706 7.32589 15.3624L7.75988 14.9293M7.32589 10.6751C7.63342 10.9833 7.9987 11.2278 8.40083 11.3946C8.80296 11.5615 9.23404 11.6473 9.6694 11.6473C10.1048 11.6473 10.5358 11.5615 10.938 11.3946C11.3401 11.2278 11.7054 10.9833 12.0129 10.6751L15.3613 7.32746C15.6694 7.01992 15.9139 6.65461 16.0807 6.25246C16.2476 5.8503 16.3334 5.41919 16.3334 4.98381C16.3334 4.54843 16.2476 4.11732 16.0807 3.71516C15.9139 3.31301 15.6694 2.9477 15.3613 2.64016C15.0538 2.33198 14.6885 2.08748 14.2863 1.92066C13.8842 1.75384 13.4531 1.66797 13.0178 1.66797C12.5824 1.66797 12.1513 1.75384 11.7492 1.92066C11.3471 2.08748 10.9818 2.33198 10.6743 2.64016L10.0067 3.30773"
              stroke={`${!error ? '#6B7280' : error.error ? '#6c0404' : '#046C4E'}`}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        )}
        <input
          type="text"
          id="name"
          value={input === undefined ? '' : input}
          className="text-sm w-full bg-transparent outline-none"
          placeholder={subject === 'name' ? 'Company name' : 'Company website'}
          onChange={(e) => setInput(e.target.value)}
          onBlur={() => handleSave(input)}
          style={{
            color: `${!error ? '#111827' : error.error ? '#6c0404' : '#046C4E'}`,
          }}
        />
        <button type="button" onClick={clearInput}>
          <ClearIcon
            sx={{
              color: `${!error ? '#6B7280' : error.error ? '#6c0404' : '#046C4E'}`,
            }}
          />
        </button>
      </div>
      {error && error.error && (
        <p className="text-[#F05252] text-sm font-medium mt-1">{error.message}</p>
      )}
    </div>
  );
}
