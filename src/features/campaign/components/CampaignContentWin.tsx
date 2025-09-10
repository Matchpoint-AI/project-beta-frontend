import React, { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Post } from '../../../pages/UserDataPage';
import { ClearIcon } from '@mui/x-date-pickers/icons';
import DayContentGalery from './DayContentGalery';
import RawData from '../RawData';

interface CampaignContentWinProps {
  open: boolean;
  onClose: () => void;
  content: Post[][][];
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function CampaignContentWin({ open, onClose, content }: CampaignContentWinProps) {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{ zIndex: 10 }}
    >
      <div className="p-7 bg-gradient-to-b from-[#F1FDFF] to-[#F5D9FF] h-full overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            {Array.from({ length: content.length }, (_, i) => i).map((i) => (
              <button
                key={i}
                onClick={() => setSelectedWeek(i)}
                className={`mr-5 font-medium pb-2 ${
                  selectedWeek == i
                    ? 'text-[#5145CD] border-b-2 border-[#5145CD]'
                    : 'text-[#6B7280]'
                } hover:border-b-2 hover:border-[#5145CD] hover:text-[#5145CD] transition-all duration-75 `}
              >{`Week ${i + 1}`}</button>
            ))}
            <button
              type="button"
              className="py-2 px-5 bg-main-purple text-white font-medium rounded-lg ml-3"
              onClick={() => setOpenDrawer(true)}
            >
              Raw
            </button>
          </div>
          <button type="button" onClick={onClose}>
            <ClearIcon
              sx={{
                color: '#6B7280',
              }}
            />
          </button>
        </div>
        <div>
          {open &&
            content[selectedWeek].map((d, i) => {
              return <DayContentGalery key={i} num={i + 1} content={d} />;
            })}
        </div>
        <RawData state={openDrawer} onClose={() => setOpenDrawer(false)} data={content} />
      </div>
    </Dialog>
  );
}
