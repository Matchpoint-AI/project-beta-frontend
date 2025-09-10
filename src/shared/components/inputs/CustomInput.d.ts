import React, { Dispatch } from 'react';
import PropTypes from 'prop-types';
interface CustomInputProps {
  options: string[];
  setOptions: Dispatch<React.SetStateAction<string[]>>;
  limit: number;
}
declare const CustomInput: {
  ({ options, setOptions, limit }: CustomInputProps): import('react/jsx-runtime').JSX.Element;
  propTypes: {
    options: PropTypes.Validator<(string | null | undefined)[]>;
    setOptions: PropTypes.Validator<(...args: any[]) => any>;
    limit: PropTypes.Validator<number>;
  };
};
export default CustomInput;
