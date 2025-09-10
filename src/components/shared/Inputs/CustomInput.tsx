// import Close from "@mui/icons-material/Close";
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
import { MuiChipsInput } from 'mui-chips-input';
// import { IoClose } from "react-icons/io5";
import React, { Dispatch } from 'react';
import PropTypes from 'prop-types';

interface CustomInputProps {
  options: string[];
  setOptions: Dispatch<React.SetStateAction<string[]>>;
  limit: number;
}

const CustomInput = ({ options, setOptions, limit }: CustomInputProps) => {
  const handleChange = (newChips: string[]) => {
    if (newChips.length >= limit && limit !== -1) return;
    setOptions(newChips);
  };

  const handleDelete = (key: number) => {
    const newSelectedOption = [...options]; // Create a copy of the array
    newSelectedOption.splice(key, 1); // Remove the element at the specified index
    setOptions(newSelectedOption); // Update the state with the new array
  };

  return (
    <MuiChipsInput
      className="w-full rounded-md p-0 flex gap-2"
      placeholder=""
      value={options}
      onChange={handleChange}
      disableEdition
      sx={{
        '& .MuiOutlinedInput-root': {
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: '8px',
          minheight: '52px',
          // maxWidth: "300px", // Set a fixed width
          // overflowX: "auto", // Enable horizontal scrolling
          // flexWrap: "nowrap", // Prevent wrapping
          // minWidth: "50px", // Set a minimum width
          padding: '4px 8px', // Adjust padding as needed
        },
      }}
      renderChip={(Component, key, props: { index: number; label: string }) => {
        return (
          <div className="ml-1" key={key}>
            <Chip
              variant="solid"
              style={{
                backgroundColor: '#BCF0DA',
                color: 'black',
                borderRadius: '6px',
              }}
              key={key}
              endDecorator={
                <ChipDelete
                  variant="plain"
                  style={{
                    backgroundColor: '#BCF0DA',
                    color: 'gray',
                    fontSize: '1px',
                  }}
                  onDelete={() => {
                    handleDelete(props?.index);
                  }}
                >
                  {/* <Close /> */}
                </ChipDelete>
              }
            >
              {props?.label}
            </Chip>
          </div>
        );
      }}
    />
  );
};

CustomInput.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOptions: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
};

export default CustomInput;
