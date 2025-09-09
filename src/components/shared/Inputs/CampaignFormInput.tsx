import React, { useContext, ChangeEventHandler } from 'react';
import FormInputBox from '../FormInputBox';
import ClearIcon from '@mui/icons-material/Clear';
import { CampaignContext } from '../../../context/CampaignContext';

interface CampaignFormInputProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  error: boolean | null;
  setError: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function CampaignFormInput(props: CampaignFormInputProps) {
  const { campaignInfo, setCampaignInfo } = useContext(CampaignContext);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const input = e.target.value;
    props.setName(input);
    props.setError(input === '');
    // Also update the context immediately to avoid timing issues
    setCampaignInfo({ ...campaignInfo, name: input });
  };

  const clearInput = () => {
    props.setName('');
    setCampaignInfo({ ...campaignInfo, name: '' });
    props.setError(true);
  };

  const saveValue = () => {
    const finalValue = props.name; // Use the current name value directly
    props.setError(finalValue === '');
    setCampaignInfo({ ...campaignInfo, name: finalValue });
  };

  return (
    <div>
      <FormInputBox color={props.error === null ? '#d1d5db' : props.error ? '#F05252' : '#0E9F6E'}>
        <input
          value={props.name}
          type="text"
          placeholder="Campaign Name"
          onChange={handleChange}
          onBlur={saveValue}
          className="text-sm w-full bg-transparent outline-none"
          style={{
            color: `${props.error === null ? '#111827' : props.error ? '#6c0404' : '#046C4E'}`,
          }}
        />
        <button type="button" onClick={clearInput}>
          <ClearIcon
            sx={{
              color: `${props.error === null ? '#6B7280' : props.error ? '#6c0404' : '#046C4E'}`,
            }}
          />
        </button>
      </FormInputBox>
      {props.error !== null && props.error && (
        <p className="text-[#F05252] text-sm font-medium mt-1">Please provide a valid value</p>
      )}
    </div>
  );
}
