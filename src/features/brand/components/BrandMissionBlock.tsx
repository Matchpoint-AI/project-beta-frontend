import React, { useState, useContext, useEffect } from 'react';
import { BrandContext } from '../context/BrandContext';
import EditBlock from '../../../shared/components/ui/EditBlock';
import BrandDetailsInput from '../../../shared/components/inputs/BrandDetailsInput';
import PurpleButton from '../../../shared/components/buttons/PurpleButton';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BrandMissionBlock() {
  const { businessInfo, setBusinessInfo } = useContext(BrandContext);
  const [edit, setEdit] = useState(false);
  const [mission, setMission] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSave = () => {
    setBusinessInfo({ ...businessInfo, mission });
    setEdit(false);
  };

  useEffect(() => {
    if (businessInfo.mission) setMission(businessInfo.mission);
  }, [businessInfo]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isEdit = params.get('edit') === 'true';
    const isMissionHash = location.hash === '#mission';
    if (isEdit && isMissionHash) {
      const target = document.getElementById('mission');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      setEdit(true);

      // Clean the URL: remove ?edit=true
      const newUrl = location.pathname;
      navigate(newUrl, { replace: true });
    }
  }, [location, navigate]);
  return (
    <div id="mission" className="p-[20px] bg-[#F0F5FF] rounded-lg mt-7">
      <div className="flex items-center justify-between">
        <h3 className="text-[#111928] font-semibold leading-6 capitalize">mission</h3>
        <EditBlock disabled={edit} onClick={() => setEdit(true)} />
      </div>
      <p className="text-[#111928] font-medium text-xs mb-5">
        The goal you want to achieve as a company
      </p>
      {!edit && (
        <p className="mt-5 font-medium text-[#111928] leading-5 text-sm">{businessInfo.mission}</p>
      )}
      {edit && (
        <div className="mt-5">
          <BrandDetailsInput
            placeholder="Mission"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
          />
          <PurpleButton className="mt-4" onClick={handleSave}>
            Save
          </PurpleButton>
        </div>
      )}
    </div>
  );
}
