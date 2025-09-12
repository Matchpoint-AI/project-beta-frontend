import React, { useState, useContext, useEffect } from 'react';
import { BrandContext } from '../context/BrandContext';
import EditBlock from '../../../shared/components/ui/EditBlock';
import ChipComponent from '../../../shared/components/ui/ChipComponent';
import { Chip } from '../../../helpers/convertToChips';
import BrandDetailsEditBlock from './BrandDetailsEditBlock';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { Selectable } from '../context/BrandContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface BrandDetailsBlockProps {
  category: 'mission' | 'persona' | 'values' | 'toneAndVoice';
}

export default function BrandDetailsBlock({ category }: BrandDetailsBlockProps) {
  const { businessInfo, setBusinessInfo } = useContext(BrandContext);
  // const isMounted = useRef(false);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const description = {
    mission: 'The goal you want to achieve as a company',
    values: 'The core beliefs that guide your interactions with customers',
    persona: 'The characteristics that identify who you are and how you behave',
    toneAndVoice: 'How your business speaks and verbally expresses its personality',
  };

  const handleChipClose = (chipId: number, arrayIndex: number) => {
    const newChips = Array.from((businessInfo[category] as Selectable[]) ?? []);
    newChips.splice(arrayIndex, 1);
    setBusinessInfo({ ...businessInfo, [category]: newChips });
    if (newChips.length === 0) setError(true);
  };

  const handleChipSelect = (chipId: number, arrayIndex: number) => {
    const newChips = Array.from((businessInfo[category] as Selectable[]) ?? []) as Chip[];
    
    // Find the chip by arrayIndex (if valid), or fallback to finding by chipId
    let targetIndex = -1;
    if (arrayIndex >= 0 && arrayIndex < newChips.length && newChips[arrayIndex]) {
      targetIndex = arrayIndex;
    } else {
      targetIndex = newChips.findIndex(chip => chip.id === chipId);
    }
    
    if (targetIndex === -1 || !newChips[targetIndex]) {
      console.warn(`Chip not found: chipId=${chipId}, arrayIndex=${arrayIndex}`);
      return;
    }
    
    newChips[targetIndex].selected = !newChips[targetIndex].selected;
    setBusinessInfo({ ...businessInfo, [category]: newChips });
    const selectedTags = newChips.filter((c) => c.selected);
    if (selectedTags.length === 0) setError(true);
    else setError(false);
  };

  const chips =
    Array.isArray(businessInfo[category]) && typeof businessInfo[category][0] === 'object'
      ? (businessInfo[category] as Chip[])
      : [];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isEdit = params.get('edit') === 'true';
    const isTarget = location.hash === `#${category}`;

    if (isEdit && isTarget) {
      const target = document.getElementById(`${category}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      setEdit(true);

      const newUrl = location.pathname;
      navigate(newUrl, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div
      id={category}
      style={{ backgroundColor: error ? '#FDE8E8' : '#F0F5FF' }}
      className="p-[20px] rounded-lg mt-7"
    >
      <div className="flex items-center">
        <h3 className="text-[#111928] font-semibold leading-6 capitalize">
          {category === 'toneAndVoice' ? 'Tone of Voice' : category}
        </h3>
        {error && (
          <span className="flex items-start gap-1 ml-3">
            <ReportProblemOutlinedIcon sx={{ color: '#F05252', fontSize: '18px' }} />
            <span className="text-sm text-[#F05252] font-medium">Select at least one tag</span>
          </span>
        )}
        <EditBlock disabled={edit} onClick={() => setEdit(true)} className="ml-auto" />
      </div>
      <p className="text-[#111928] font-medium text-xs mb-5">{description[category]}</p>
      {!edit && (
        <div>
          {chips.map((chip, index) => (
            <ChipComponent
              key={`${category}-${chip.id ?? index}`}
              label={chip.label}
              index={chip.id ?? index}
              selected={chip.selected}
              onClose={(chipId) => handleChipClose(chipId, index)}
              onSelect={(chipId) => handleChipSelect(chipId, index)}
            />
          ))}
        </div>
      )}
      {edit && (
        <BrandDetailsEditBlock
          initValues={chips}
          category={category}
          closeEdit={() => setEdit(false)}
        />
      )}
    </div>
  );
}
