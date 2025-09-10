import React, { useState } from 'react';
import PickColor from 'react-pick-color';

export default function HslColorPicker() {
  const [color, setColor] = useState('#9751F2');

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <PickColor
        color={color}
        onChange={(color) => setColor(color.hex)}
        theme={{
          background: 'transparent',
          inputBackground: '#ffffff',
          color: '#333333',
        }}
      />

      <style>{`
        /* Hide increment/decrement arrows on number inputs */
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type='number'] {
          -moz-appearance: textfield;
        }

        /* Move labels to top */
        .rpc-fields-element {
          flex-direction: column !important;
          align-items: center !important;
        }

        .rpc-fields-element-label {
          margin-bottom: 4px !important;
          margin-right: 0 !important;
        }
      `}</style>
    </div>
  );
}
