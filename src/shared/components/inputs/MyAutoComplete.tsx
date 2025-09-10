/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';

const MyAutoComplete = ({
  options,
  currentValues,
  setCurrentValues,
  style = false,
}: {
  options: string[];
  currentValues: string[];
  setCurrentValues: (newValue: string[]) => void;
  style?: boolean;
}) => {
  return (
    <Autocomplete
      options={options}
      multiple
      className="w-full"
      value={currentValues}
      onChange={(event: React.SyntheticEvent, newValue: string[]) => {
        setCurrentValues(newValue);
      }}
      renderTags={(tags, getTagProps) => {
        return tags.map((item, index) => {
          const { ...rest } = getTagProps({ index });
          return (
            <Chip
              variant="solid"
              sx={
                style
                  ? {
                      margin: 0.5,
                      backgroundColor: '#E5EDFF',
                      color: '#4B5563',
                      borderRadius: '6px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      lineHeight: '18px',
                      textAlign: 'center',
                      textDecorationSkipInk: 'none',
                      textUnderlinePosition: 'from-font',
                    }
                  : null
              }
              style={
                !style
                  ? {
                      backgroundColor: '#BCF0DA',
                      color: 'black',
                      borderRadius: '6px',
                    }
                  : undefined
              }
              key={index}
              endDecorator={
                <ChipDelete
                  variant="plain"
                  style={!style ? { backgroundColor: '#BCF0DA', color: 'gray' } : undefined}
                  {...rest}
                >
                  {/* <Close /> */}
                </ChipDelete>
              }
            >
              {item}
            </Chip>
          );
        });
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            sx={{
              '& .MuiOutlinedInput-root': {
                minHeight: '52px',
                borderRadius: '8px',
                borderColor: 'gray.300',
                borderWidth: '1px',
                '& fieldset': {
                  borderColor: 'gray.300',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: 'gray.300',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'gray.300',
                },
              },
            }}
            label=""
          />
        );
      }}
    />
  );
};

export default MyAutoComplete;
