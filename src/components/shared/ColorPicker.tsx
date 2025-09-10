import React from 'react';
import { ChangeEventHandler, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import * as convert from 'color-convert';
import { BusinessInfo } from '../../context/BrandContext';

interface ColorCodeInputProps {
  onChange: (value: string | number, type?: string) => void;
  value: string | number;
  type: string;
  className?: string;
}

function ColorCodeInput({ onChange, value, type, className }: ColorCodeInputProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (type === 'hex') onChange(e.target.value);
    else onChange(Number(e.target.value), type);
  };

  return (
    <>
      <label htmlFor={type} className="text-[12px]">
        {type.toUpperCase()}
      </label>
      <input
        type="text"
        value={value}
        name={type}
        id={type}
        onChange={handleChange}
        className={`text-[14px] py-1 px-2 outline-none border border-gray-400 ${className}`}
      />
    </>
  );
}

interface ColorPickerProps {
  selectedColors: string[];
  selectColor: (updater: (colors: string[]) => string[]) => void;
  saveColor: (updater: (businessInfo: BusinessInfo) => BusinessInfo) => void;
  className?: string;
  conseilPicker: (visible: boolean) => void;
}

export default function ColorPicker({
  selectedColors,
  selectColor,
  saveColor,
  className,
  conseilPicker,
}: ColorPickerProps) {
  // const [selectedColors, setSelectedColors] = useState<any>([]);
  const [rgbColor, setRgbColor] = useState<number[]>([255, 255, 255]);
  const [hexColor, setHexColor] = useState('#ffffff');

  const handleColorChange = (newColor: string) => {
    // setSelectedColors([...selectedColors, newColor]);
    const rgb = convert.hex.rgb(newColor);

    setHexColor(newColor);
    setRgbColor([...rgb]);
  };

  const handleRgbChange = (newColor: number, unit: 'r' | 'g' | 'b') => {
    const pos = 'rgb'.indexOf(unit);
    let newHex = '';

    setRgbColor((old) => {
      old[pos] = newColor >= 255 ? 255 : newColor;
      newHex = convert.rgb.hex(old[0], old[1], old[2]);
      return old;
    });
    setHexColor('#' + newHex);
  };

  const handleHexChange = (newHex: string) => {
    if (newHex.length > 7) return;
    if (!newHex.includes('#')) newHex = '#' + newHex;
    if (!/[0-9A-Fa-f#]/.test(newHex[newHex.length - 1])) newHex = hexColor + 'f';
    const rgb = convert.hex.rgb(newHex);
    setHexColor(newHex);
    setRgbColor([...rgb]);
  };

  const handleSaveColor = () => {
    if (selectedColors.length >= 2) return;

    saveColor((old: BusinessInfo) => {
      const businessObj = { ...old };

      if (businessObj.brandColors) businessObj.brandColors.push(hexColor);
      else businessObj.brandColors = [hexColor];
      return businessObj;
    });
    selectColor((old: string[]) => [...old, hexColor]);
    conseilPicker(false);
  };

  return (
    <div className={`w-fit bg-gray-50 p-2 rounded-md ${className}`}>
      <HexColorPicker color={hexColor || '#FFFFFF'} onChange={handleColorChange} />
      <div className="flex gap-2 mt-3">
        <div className="flex flex-col">
          <ColorCodeInput
            onChange={handleHexChange}
            value={hexColor}
            type="hex"
            className="w-[80px] rounded-md"
          />
        </div>
        <div className="flex">
          <span className="flex flex-col">
            <ColorCodeInput
              onChange={handleRgbChange}
              value={rgbColor[0]}
              type="r"
              className="w-[50px] rounded-tl-md rounded-bl-md"
            />
          </span>
          <span className="flex flex-col">
            <ColorCodeInput
              onChange={handleRgbChange}
              value={rgbColor[1]}
              type="g"
              className="w-[50px]"
            />
          </span>
          <span className="flex flex-col">
            <ColorCodeInput
              onChange={handleRgbChange}
              value={rgbColor[2]}
              type="b"
              className="w-[50px] rounded-tr-md rounded-br-md"
            />
          </span>
        </div>
      </div>
      <button
        type="button"
        className="bg-main-purple font-medium text-white w-full mt-3 p-2 rounded-md capitalize"
        onClick={handleSaveColor}
      >
        Choose
      </button>
    </div>
  );
}
