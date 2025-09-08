import React, { useEffect, useRef, useState } from "react";

interface FileInputProps {
  accept: string;
  required: boolean;
  error: boolean;
  onChange?: (file: File) => void;
}

const FileInput = ({ accept, required, error, onChange }: FileInputProps) => {
  const [fileName, setFileName] = useState("No file chosen");
  const [requiredError, setRequiredError] = useState(required && error);
  const {current: inputColors} = useRef({
    validColors: "bg-[#5145CD] hover:bg-[#6875F5]",
    errorColors: "bg-[#F05252] hover:bg-[#f56868]"
  })
  const [inputStateColors, setStateColors] = useState(inputColors.validColors);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];

    setFileName(
      event.target.files?.length ? event.target.files[0].name : "No file chosen"
    );
    onChange && onChange(file);
    setRequiredError(false);
  };

  useEffect(() => {
    setRequiredError(required && error);
  }, [required, error]);

  useEffect(() => {
    if (requiredError)
      setStateColors(inputColors.errorColors);
    else
      setStateColors(inputColors.validColors);
  }, [requiredError]);
  // #f56868
  return (
    <>
      <div className="flex items-center space-x-4 border rounded-lg min-w-[250px] sm:w-3/5 w-4/5">
        <label
          className={`flex items-center px-4 py-2 ${inputStateColors} text-white rounded-l-lg cursor-pointer`}
        >
          <span className="font-medium">Choose file</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
          />
        </label>
        <span className="text-gray-500">{fileName}</span>
      </div>
      {requiredError && (
        <p className="font-medium text-[#F05252] capitalize mt-1 text-sm">
          required field
        </p>
      )}
    </>
  );
};

export default FileInput;
