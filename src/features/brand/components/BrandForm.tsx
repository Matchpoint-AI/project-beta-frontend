/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEventHandler, useContext, useEffect, useState } from 'react';
import FileInput from '../../../shared/components/inputs/FileInput';
import { BrandContext } from '../context/BrandContext';
import ColorPicker from '../../../shared/components/ui/ColorPicker';
import FormsContainer from '../../../components/shared/FormsContainer';
import ColorSpan from '../../../shared/components/ui/ColorSpan';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker&url';
import CircularProgress from '@mui/material/CircularProgress';
import BackButton from '../../../shared/components/buttons/BackButton';
import NextButton from '../../../shared/components/buttons/NextButton';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { LuPlus } from 'react-icons/lu';
import { trackBrandGuideUpload } from '../../../helpers/analytics';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type BrandGuideLines = {
  colors: {
    primary: string[];
    secondary: string[];
  };
  typography: {
    primary: string[];
    secondary: string[];
  };
  photography: string[];
};

interface BrandFormProps {
  handleBack: () => void;
  handleNext: any;
}

const BrandForm = ({ handleBack, handleNext }: BrandFormProps) => {
  const { businessInfo, setBusinessInfo } = useContext(BrandContext);

  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [colorPickerVisibility, setColorPickerVisibility] = useState(false);

  const [analysePdf, setAnalysePdf] = useState(false);

  const [error, setError] = useState(false);

  const removeColor = (index: number) => {
    const updatedColors = selectedColors.filter((color) => color !== selectedColors[index]);
    setSelectedColors(updatedColors);
    setBusinessInfo({
      ...businessInfo,
      brandColors: updatedColors,
    });
  };

  const extractBrandInfo = async (guideLines: string) => {
    const endpointUrl = `${getServiceURL('llm')}/api/v1/llm/openai`;
    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `from this brand guidelines '${guideLines}' extract information about the brand and return anything you find in paired JSON output following this structure {
				colors: {
					primary: ['#000000', '#000000', '#000000', '#000000],
					secondary: ['#000000', '#000000', '#000000']
				},
				typography: {
					primary: ['arial', 'helvetica'],
					secondary: ['times new roman', 'roboto']
				},
				photography: ['candid', 'screenshots']
			  }`,
        json_mode: true,
      }),
    });

    const data = await res.json();
    const { choices } = data.response;
    const { content } = choices[0].message;
    const parsedContent = JSON.parse(content) as BrandGuideLines;
    const newColors = [
      ...selectedColors,
      ...(parsedContent?.colors?.primary ?? []),
      ...(parsedContent?.colors?.secondary ?? []),
    ];
    setSelectedColors(newColors);
    setBusinessInfo({
      ...businessInfo,
      brandColors: newColors,
    });
    setAnalysePdf(false);
    trackBrandGuideUpload('guide');
  };

  const handleGuidelines = async (file: File) => {
    setAnalysePdf(true);
    const arrayBuffer = await file.arrayBuffer();
    const typedarray = new Uint8Array(arrayBuffer);
    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
    let extractedText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      extractedText += pageText + '\n\n';
    }
    await extractBrandInfo(extractedText);
  };

  const handleLogo = async (file: File) => {
    setBusinessInfo({
      ...businessInfo,
      brandLogo: file,
    });
    setError(false);
    trackBrandGuideUpload('logo');
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    handleNext();
  };

  useEffect(() => {
    setSelectedColors(businessInfo.brandColors ?? []);
  }, [businessInfo]);

  return (
    <>
      <FormsContainer>
        <form onSubmit={handleSubmit} id="brand_form">
          <div className="mb-5">
            <label
              title="email"
              className="block mb-2 sm:text-xl text-lg font-medium text-gray-900 "
            >
              1. Add your brand guidelines (PDF, etc){' '}
            </label>
            <div className="flex items-center gap-2">
              <FileInput
                accept="application/pdf"
                onChange={handleGuidelines}
                required={false}
                error={error}
              />
              {analysePdf && <CircularProgress sx={{ color: '#5145CD' }} size={25} thickness={5} />}
            </div>
            <p className="py-1 text-xs text-[#6B7280]">
              Upload your brand guidelines. Supported files: pdf
            </p>
          </div>
          <div className="mb-5">
            <label
              title="password"
              className="block mb-2 sm:text-xl text-lg font-medium text-gray-900"
            >
              2. Upload your logo
            </label>
            <FileInput
              accept="image/png, image/jpeg"
              onChange={handleLogo}
              required={false}
              error={error}
            />
            <p className="py-1 text-xs text-[#6B7280]">Supported files: png, jpeg, jpg</p>
          </div>
          <div className="mb-5 w-full">
            <div className="flex items-center gap-2 mb-2">
              <label
                title="brand-colors"
                className="block sm:text-xl text-lg font-medium text-gray-900"
              >
                3. Pick brand colors
              </label>
              <img src="/info.svg" alt="info" className="w-4 h-4 inline-block mt-1" />
            </div>
            <p className="py-2 text-xs text-[#6B7280]">
              We&apos;ve detected these are your colors. If you&apos;d like to change these please
              click each color or add more up to 2 colors total
            </p>
            <div className="flex gap-3 mt-3 w-full">
              <div className="relative w-10">
                <button
                  type="button"
                  disabled={selectedColors.length >= 2}
                  onClick={() => setColorPickerVisibility((old) => !old)}
                  className={`w-10 aspect-square rounded-full ${
                    selectedColors.length >= 2 ? 'bg-gray-500' : 'bg-[#5145CD]'
                  } flex items-center justify-center`}
                >
                  <LuPlus color="#fff" size={20} />
                </button>
                {colorPickerVisibility && (
                  <ColorPicker
                    selectedColors={selectedColors}
                    saveColor={setBusinessInfo}
                    selectColor={setSelectedColors}
                    conseilPicker={setColorPickerVisibility}
                    className="mp-color-picker"
                  />
                )}
              </div>
              <div className="w-full overflow-x-auto whitespace-nowrap">
                {selectedColors.map((color: any, index: number) => (
                  <ColorSpan key={index} index={index} color={color} removeColor={removeColor} />
                ))}
              </div>
            </div>
          </div>
        </form>
      </FormsContainer>
      <div className="mb-5 md:min-w-[400px] w-full">
        <p className="text-xs text-[#6B7280]">
          By clicking &quot;Next&quot;, you represent and warrant that you own or have permission to
          use all the content from these websites and documents.
        </p>
      </div>
      <div className="flex justify-between mb-10 w-full">
        <BackButton text="Back" onClick={handleBack} />
        <NextButton text="Next" formId="brand_form" />
      </div>
    </>
  );
};

export default BrandForm;
