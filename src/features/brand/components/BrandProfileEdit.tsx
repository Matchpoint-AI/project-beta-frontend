import React, { useContext, useState, useRef, useEffect } from 'react';
import { ButtonBase } from '@mui/material';
import { FaRegEdit } from 'react-icons/fa';
import { LuFileMinus } from 'react-icons/lu';
import { useAuth } from '../../auth/context/AuthContext';
import { BrandContext } from '../context/BrandContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import PurpleButton from '../../../shared/components/buttons/PurpleButton';
import BrandDetailsInput from '../../../shared/components/inputs/BrandDetailsInput';
import Sidebar from '../../../components/shared/Sidebar';

const description = {
  mission: 'The goal you want to achieve as a company',
  values: 'The core beliefs that guide your interactions with customers',
  persona: 'The characteristics that identify who you are and how you behave',
  toneAndVoice: 'How your business speaks and verbally expresses its personality',
  colors: 'Primary brand colors (max 2)',
  summary: 'Brief description of your business',
};

const mergeValues = (values: unknown) => {
  const result = [
    { id: 0, label: '', selected: false },
    { id: 1, label: '', selected: false },
    { id: 2, label: '', selected: false },
  ];

  if (values && Array.isArray(values)) {
    values.forEach((val, idx) => {
      if (idx < 3 && val) {
        result[idx] = {
          ...result[idx],
          label: val.label || val.name || val,
          selected: !!val.label || !!val.name || !!val,
        };
      }
    });
  }

  return result;
};

interface BrandProfileEditProps {
  hasBrand?: boolean;
}

export default function BrandProfileEdit({ hasBrand: _hasBrand }: BrandProfileEditProps) {
  const { businessInfo } = useContext(BrandContext);
  const [selected, setSelected] = useState('');
  const [pMission, setMission] = useState(businessInfo.mission || '');
  const [pValues, setValues] = useState(() => mergeValues(businessInfo.values || []));
  const [pPersona, setPersona] = useState(() => mergeValues(businessInfo.persona || []));
  const [pTov, setTOV] = useState(() => mergeValues(businessInfo.toneAndVoice || []));
  const [pColors, setColors] = useState<string[]>(businessInfo.brandColors || []);
  const [pSummary, setSummary] = useState(businessInfo.summary || '');
  const [isSaving, setIsSaving] = useState(false);

  const endpointUrl = getServiceURL('data');
  const { profile } = useAuth();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`${endpointUrl}/api/v1/data/brand/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${profile.token}`,
        },
        body: JSON.stringify({
          mission: pMission,
          values: pValues,
          persona: pPersona,
          toneAndVoice: pTov,
          colors: pColors,
          summary: pSummary,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setMission(result.updatedFields.mission);
        setValues(mergeValues(result.updatedFields.values));
        setPersona(mergeValues(result.updatedFields.persona));
        setTOV(mergeValues(result.updatedFields.toneAndVoice));
        setColors(result.updatedFields.colors || []);
        setSummary(result.updatedFields.summary || '');
        setSelected('');
      }
    } catch (_error) {
      // Error handled silently
    } finally {
      setIsSaving(false);
    }
  };
  const handleCardSelect = (cardType: string) => {
    setSelected(selected === cardType ? '' : cardType);
  };
  return (
    <div className="flex h-full flex-col max-w-2xl mx-auto gap-2 md:mt-auto mt-16">
      <Sidebar currentStep={0} />
      <div className="w-full bg-white rounded-xl p-5 md:p-10 my-5">
        <div className="flex flex-col gap-4">
          <p className="text-xl text-[#111928] font-semibold mb-5">
            Here&apos;s what Matchpoint knows about your business:
          </p>
        </div>

        {/* Logo Display */}
        {businessInfo?.logo && (
          <div className="mb-5">
            <div className="mb-5 flex items-center gap-3">
              <label className="block text-base font-medium text-gray-900">Logo</label>
            </div>
            <img
              src={`https://storage.googleapis.com/matchpoint-brands-logos/${businessInfo.logo}`}
              alt="logo"
              className="w-[150px] h-auto"
            />
          </div>
        )}

        {/* Colors Card */}
        <DetailsCard
          title="Brand Colors"
          description={description.colors}
          onClick={() => handleCardSelect('COLORS')}
          isSelected={selected === 'COLORS'}
        >
          {selected === 'COLORS' ? (
            <div className="mt-5">
              <div className="flex gap-3 mb-4">
                {[0, 1].map((index) => (
                  <div key={index} className="flex flex-col items-center">
                    <input
                      type="color"
                      value={pColors[index] || '#ffffff'}
                      onChange={(e) => {
                        const newColors = [...pColors];
                        newColors[index] = e.target.value;
                        setColors(newColors);
                      }}
                      className="w-12 h-12 cursor-pointer"
                    />
                    <span className="text-xs mt-1">Color {index + 1}</span>
                  </div>
                ))}
              </div>
              <PurpleButton onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Colors'}
              </PurpleButton>
            </div>
          ) : (
            <div className="flex gap-2">
              {pColors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full shadow-md"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </DetailsCard>

        {/* Summary Card */}
        <DetailsCard
          title="Business Summary"
          description={description.summary}
          onClick={() => handleCardSelect('SUMMARY')}
          isSelected={selected === 'SUMMARY'}
        >
          {selected === 'SUMMARY' ? (
            <div className="mt-5">
              <textarea
                value={pSummary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={4}
              />
              <PurpleButton className="mt-4" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Summary'}
              </PurpleButton>
            </div>
          ) : (
            <p className="whitespace-pre-line">{pSummary}</p>
          )}
        </DetailsCard>

        {/* Mission Card */}
        <DetailsCard
          title="Mission"
          description={description.mission}
          onClick={() => handleCardSelect('MISSION')}
          isSelected={selected === 'MISSION'}
        >
          {selected === 'MISSION' ? (
            <div className="mt-5">
              <BrandDetailsInput
                placeholder="Mission"
                value={pMission}
                onChange={(e) => setMission(e.target.value)}
              />
              <PurpleButton className="mt-4" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Mission'}
              </PurpleButton>
            </div>
          ) : (
            <p>{pMission}</p>
          )}
        </DetailsCard>

        {/* Values Card */}
        <DetailsCard
          title="Values"
          description={description.values}
          onClick={() => handleCardSelect('VALUES')}
          isSelected={selected === 'VALUES'}
        >
          <div className="flex flex-wrap gap-3">
            {selected === 'VALUES' ? (
              <EditableValuesCard
                values={pValues}
                onChange={setValues}
                onSave={handleSave}
                isSaving={isSaving}
              />
            ) : (
              <VariablesBadge values={pValues} />
            )}
          </div>
        </DetailsCard>

        {/* Persona Card */}
        <DetailsCard
          title="Persona"
          description={description.persona}
          onClick={() => handleCardSelect('PERSONA')}
          isSelected={selected === 'PERSONA'}
        >
          <div className="flex flex-wrap gap-3">
            {selected === 'PERSONA' ? (
              <EditableValuesCard
                values={pPersona}
                onChange={setPersona}
                onSave={handleSave}
                isSaving={isSaving}
              />
            ) : (
              <VariablesBadge values={pPersona} />
            )}
          </div>
        </DetailsCard>

        {/* Tone of Voice Card */}
        <DetailsCard
          title="Tone of Voice"
          description={description.toneAndVoice}
          onClick={() => handleCardSelect('TOV')}
          isSelected={selected === 'TOV'}
        >
          <div className="flex flex-wrap gap-3">
            {selected === 'TOV' ? (
              <EditableValuesCard
                values={pTov}
                onChange={setTOV}
                onSave={handleSave}
                isSaving={isSaving}
              />
            ) : (
              <VariablesBadge values={pTov} />
            )}
          </div>
        </DetailsCard>
      </div>
    </div>
  );
}

function DetailsCard({
  title,
  description,
  children,
  onClick,
  isSelected,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSelected && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClick(); // This will close the card
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelected, onClick]);

  return (
    <div
      ref={cardRef}
      className="p-5 mb-[14px] rounded-md w-full bg-[#F6F5FF] border border-[#D1D5DB]"
    >
      <div className="flex items-center justify-between">
        <h1 className="capitalize text-[#42389D] font-medium text-lg leading-7 mb-1">{title}</h1>
        <ButtonBase onClick={onClick}>
          <FaRegEdit color="#3F83F8" size={16} />
        </ButtonBase>
      </div>
      <p className="text-[#111928] font-medium text-xs mb-5">{description}</p>
      {children}
    </div>
  );
}
interface VariablesBadgeProps {
  values: Array<{ selected: boolean; label: string }>;
}

function VariablesBadge({ values }: VariablesBadgeProps) {
  return (
    <>
      {values.map((c) =>
        c.label.length ? (
          <div
            key={c.id}
            className="py-1 px-[10px] bg-[#D1D5DB] text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md"
          >
            {c.label}
          </div>
        ) : null
      )}
    </>
  );
}

interface EditableValuesCardProps {
  values: Array<{ selected: boolean; label: string }>;
  onChange: (values: Array<{ selected: boolean; label: string }>) => void;
  onSave: () => void;
  isSaving: boolean;
}

function EditableValuesCard({ values, onChange, onSave, isSaving }: EditableValuesCardProps) {
  const handleChange = (index: number, newValue: string) => {
    const updated = values.map((item, i: number) =>
      i === index ? { ...item, label: newValue } : { ...item }
    );
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = values.map((item, i: number) =>
      i === index ? { ...item, label: '', selected: false } : { ...item }
    );
    onChange(updated);
  };

  return (
    <div className="w-full">
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={values[index] ? values[index].label : ''}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={() => handleRemove(index)}
              className="text-purple-600 hover:text-purple-800"
              disabled={!values[index]?.label}
            >
              <LuFileMinus size={18} />
            </button>
          </div>
        ))}
      </div>

      <PurpleButton className="mt-5" onClick={onSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </PurpleButton>
    </div>
  );
}
