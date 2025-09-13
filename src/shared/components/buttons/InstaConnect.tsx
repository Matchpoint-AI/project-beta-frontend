import React, { useEffect, useState } from 'react';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { useAuth } from '../../../features/auth/context/AuthContext';
import useAppContext from '../../context/appContext';
import useIntegrationApi, {
  authenticateApp,
  getAvailableIntegrations,
  revokeAuthApp,
} from '../../../api/api-integrations';
import { Box, CircularProgress, Modal } from '@mui/material';
import InstagramIcon from '../ui/InstagramIcon';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import ErrorToast from '../feedback/ErrorToast';
import { SparklesMessage } from '../ui/SparklesMessage';
import { FaCheckCircle } from 'react-icons/fa';
import { GoClock } from 'react-icons/go';
import { VscHome } from 'react-icons/vsc';
import { MdCalendarToday, MdClose, MdOutlineUpdate } from 'react-icons/md';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { FaRegCalendarDays } from 'react-icons/fa6';

const PLATFORMS = ['INSTAGRAM'];

interface Stats {
  approved: number;
  ready_for_review?: number;
  total_content?: number;
  published?: number;
}

interface InstaConnectProps {
  publish?: boolean;
  stats: Stats;
  startDate: string;
  duration: number;
}

interface PublishApprovedProps {
  stats: Stats;
  startDate: string;
  duration: number;
}

const InstaConnect: React.FC<InstaConnectProps> = ({
  publish = false,
  stats,
  startDate,
  duration,
}) => {
  const integrations = useIntegrationApi(getAvailableIntegrations());
  const { data } = integrations;
  const { profile } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || !profile.token) {
      setError('Authentication required');
      return;
    }

    const endpointUrl = getServiceURL('data');
    const redirectURI = `${endpointUrl}/api/v1/instagram/callback`;
    const baseurl =
      window.location.hostname === 'www.matchpointai.com'
        ? 'matchpointai.com'
        : window.location.hostname;

    fetch(`${endpointUrl}/api/v1/integrations/save_redirect_uri`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${profile.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: redirectURI,
        base_url: baseurl,
      }),
    })
      .then((response) => response.json())
      .then((_data: unknown) => {})
      .catch((_error) => {
        setError('Failed to save redirect URI');
      });
  }, [profile]);

  useEffect(() => {
    if (data && data.length) {
      setIsConnected(true);
    }
  }, [data]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      {isConnected || (data && data.length) ? (
        publish ? (
          <PublishApproved stats={stats} startDate={startDate} duration={duration} />
        ) : (
          <Connected onRevoke={() => setIsConnected(false)} />
        )
      ) : (
        PLATFORMS.map((platform) => (
          <Unconnected key={platform} onConnect={() => setIsConnected(true)} publish={publish} />
        ))
      )}
    </>
  );
};
interface EndPublishPopupProps {
  isPopupOpen: boolean;
  setIsPopupOpen: (open: boolean) => void;
  onNavigateToDashboard?: () => void;
  stats?: {
    approved: number;
    ready_for_review?: number;
  };
}

function EndPublishPopup({
  isPopupOpen,
  setIsPopupOpen,
  stats,
  onNavigateToDashboard,
}: EndPublishPopupProps) {
  if (!isPopupOpen) return null;

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const handleNavigateToDashboard = () => {
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
    setIsPopupOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg">
        {/* Close button */}
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
          aria-label="Close"
        >
          <MdClose className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="px-6 py-8 flex flex-col justify-center items-center text-center">
          {/* Success Icon */}
          <div className="mb-4">
            <FaCheckCircle className="w-9 h-9 text-[#0E9F6E]" />
          </div>

          {/* Title with gradient */}
          <h2 className="text-3xl font-semibold leading-[45px] text-transparent bg-clip-text bg-gradient-to-r from-[#681DBA] to-[#FF43E1] mb-4">
            Your {stats?.approved || 0} Posts Are Scheduled!
          </h2>

          {/* Subtitle */}
          {stats?.ready_for_review ? (
            <p className="text-[#374151] font-medium text-lg mb-6">
              For optimal campaign results, we suggest scheduling your remaining{' '}
              {stats.ready_for_review} posts
            </p>
          ) : null}

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-md">
            {stats?.ready_for_review ? (
              <button
                className="bg-[#FDF6B2] hover:bg-[#faef91] font-bold text-base flex flex-row rounded-lg justify-center items-center gap-2 px-5 py-3 text-[#8E4B10] transition-colors"
                onClick={handleClose}
              >
                <GoClock className="w-5 h-5" />
                Schedule Remaining Posts
              </button>
            ) : null}

            <button
              onClick={handleNavigateToDashboard}
              className="border-[1px] border-[#6B7280] bg-[#F9FAFB] hover:bg-[#deecfa] font-bold text-base flex flex-row rounded-lg justify-center items-center gap-2 px-5 py-3 text-[#630CC3] transition-colors"
            >
              <VscHome className="w-5 h-5" />
              Return to Dashboard
            </button>
          </div>
        </div>

        {/* Click outside to close - disabled to match original behavior */}
      </div>
    </div>
  );
}
interface DateSelectorProps {
  label: string;
  date: Dayjs;
  onDateChange: (value: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

const DateSelector = ({ label, date, onDateChange, minDate, maxDate }: DateSelectorProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 0,
        p: 2,
      }}
    >
      <p className="text-[#5145CD] font-normal text-sm">{label}</p>
      <DatePicker
        value={date}
        onChange={onDateChange}
        minDate={minDate}
        maxDate={maxDate}
        className="w-full"
        format="MMMM D, YYYY"
        slots={{
          openPickerIcon: FaRegCalendarDays,
        }}
        slotProps={{
          textField: {
            variant: 'standard',
            InputProps: {
              disableUnderline: true,
              sx: {
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                color: '#630CC3',
              },
            },
          },
          openPickerButton: {
            sx: {
              position: 'absolute',
              right: 24,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'grey.400',
            },
          },
        }}
      />
    </Box>
  );
};

interface ConfirmDateProps {
  isPopupOpen: boolean;
  setIsPopupOpen: (open: boolean) => void;
  stats: Stats;
  onClick: (date: dayjs.Dayjs) => void;
  loading: boolean;
  start_date: string;
  duration: number;
}

const ConfirmDate: React.FC<ConfirmDateProps> = ({
  isPopupOpen,
  setIsPopupOpen,
  stats,
  onClick,
  loading,
  start_date,
  duration,
}) => {
  const [startDate, setStartDate] = useState(dayjs(start_date)); // Use dayjs for correct format
  const [endDate, setEndDate] = useState(dayjs(start_date).add(duration, 'week'));

  useEffect(() => {
    // 1) Figure out if local time is past 9 AM
    const now = dayjs();
    const isPast9AM = now.hour() >= 9; // e.g. 9 means 9:00 AM

    // 2) If it's past 9 AM, clamp earliest start to tomorrow (same time next day)
    // otherwise, clamp earliest start to "today" (just a dayjs() date with current time).
    const earliestAllowedStart = isPast9AM ? now.add(1, 'day').startOf('day') : now.startOf('day');

    if (start_date !== '') {
      const initialStartFromProps = dayjs(start_date); // just an example

      // 1) If initialStartFromProps is in the past relative to today,
      //    clamp it so that we start from today instead.
      const actualInitialStart = initialStartFromProps.isBefore(earliestAllowedStart, 'day')
        ? earliestAllowedStart
        : initialStartFromProps;
      setStartDate(actualInitialStart);
      setEndDate(actualInitialStart.add(duration, 'week'));
    }
  }, [isPopupOpen, start_date, duration]);

  // Handle start date changes
  const handleStartDateChange = (newStart: Dayjs | null) => {
    if (!newStart) return;
    setStartDate(newStart);

    // Automatically recalc the end date based on the new start date
    const newMinimumEnd = newStart.add(duration, 'week');

    // If the current end date is before newMinimumEnd, clamp it
    if (endDate.isBefore(newMinimumEnd)) {
      setEndDate(newMinimumEnd);
    }
  };

  // Handle end date changes
  const handleEndDateChange = (newEnd: Dayjs | null) => {
    if (!newEnd) return;

    // The earliest allowed end date is startDate + duration
    const minAllowedEnd = startDate.add(duration, 'week');
    if (newEnd.isBefore(minAllowedEnd)) {
      // Either clamp it automatically:
      setEndDate(minAllowedEnd);
      // OR just ignore the change or show an error/snackbar if you prefer:
      // e.g., alert("End date can't be earlier than start date + duration!");
    } else {
      setEndDate(newEnd);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal onClose={() => setIsPopupOpen(false)} open={isPopupOpen} className="">
        <Box
          style={{
            outline: 'none',
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 flex flex-col justify-center items-center bg-white rounded-xl shadow-xl  w-[90%] h-fit lg:w-[600px] lg:h-[400px] xl:w-[750px] xl:h-[466px] border-[1px] border-[#E5E7EB] text-center"
        >
          <div className="w-full h-fit flex flex-col justify-center items-center gap-3">
            <div style={{ color: '#6C2BD9', width: 36, height: 36 }}>
              <MdCalendarToday />
            </div>
            <h2 className="text-3xl font-semibold leading-[45px] text-transparent bg-clip-text bg-gradient-to-r from-[#681DBA] to-[#FF43E1]">
              Please confirm campaign dates
            </h2>

            <div className="flex w-full flex-col justify-center gap-4 mt-2 border-[1px] border-[#E5E7EB] rounded-lg p-4">
              <DateSelector
                label="Start Date"
                date={startDate}
                onDateChange={handleStartDateChange}
                minDate={startDate}
              />
              <DateSelector
                label="End Date"
                date={endDate}
                onDateChange={handleEndDateChange}
                minDate={startDate.add(duration, 'week')}
              />
            </div>
            <button
              onClick={() => onClick(startDate)}
              disabled={loading}
              className={`${
                loading ? 'cursor-not-allowed bg-[#82FFC9]' : 'bg-[#82FFC9] hover:bg-[#6dfabd]'
              }  font-bold text-base flex flex-row rounded-lg justify-center items-center gap-2 px-5 py-3 text-[#046C4E]`}
            >
              {loading ? (
                <CircularProgress sx={{ color: '#046C4E' }} size={25} thickness={5} />
              ) : (
                <>
                  <img src="/src/assets/icons/publish.svg" className="w-4 h-4 text-[#046C4E]" />
                  <h3 className="text-base font-bold text-[#046C4E]">
                    Confirm & Publish {stats.approved} of {stats.total_content}
                  </h3>
                </>
              )}
            </button>
          </div>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

const PublishApproved: React.FC<PublishApprovedProps> = ({ stats, startDate, duration }) => {
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDateOpen, setDateOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const endpointUrl = getServiceURL('content-gen');
  const { profile } = useAuth();
  const { id } = useParams();
  const [status, setStatus] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const validateTimezone = (timezone: string) => {
    return moment.tz.zone(timezone) !== null;
  };
  const navigate = useNavigate();

  const updatePostingDate = async (startDate: Dayjs) => {
    const endpointUrl = getServiceURL('content-gen');
    // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formattedDate = dayjs(startDate).format('M/D/YYYY');
    const response = await fetch(`${endpointUrl}/api/v1/campaign/updatePostingDate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${profile?.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaign_id: id,
        // timezone: userTimezone,
        postingDate: formattedDate, // The new property you want to store
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update postingDate');
    }

    const data = await response.json();
    return data;
  };
  useEffect(() => {
    const checkPublishedStatus = async () => {
      try {
        const response = await fetch(
          `${endpointUrl}/api/v1/contentgen/get-publish-status?campaign_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${profile?.token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPublished(data.published || false);
        }
      } catch (_error) {
        // Error handled silently
      }
    };

    if (id && profile?.token) {
      checkPublishedStatus();
    }
  }, [id, profile?.token]);

  const handlePublish = async (newStartDate: Dayjs) => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const validTimezone = validateTimezone(userTimezone) ? userTimezone : 'UTC';
    setLoading(true);

    try {
      await updatePostingDate(newStartDate);
      const response = await fetch(`${endpointUrl}/api/v1/campaign/publish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${profile?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: id,
          timezone: validTimezone,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await fetch(`${endpointUrl}/api/v1/contentgen/update-publish-status`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${profile?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaign_id: id,
            published: true,
          }),
        }).then(async (res) => (res.ok ? setPublished(true) : null));

        setStatus(true);
        if (result.message) {
          setMessage(result.message);
        } else {
          setMessage('Approved Posts have been published');
        }
        setIsOpen(true);
      } else {
        setStatus(false);
        setMessage('Something Went Wrong! Try again Later');
        setIsOpen(true);
      }
    } catch (_error) {
      // Error handled silently
    } finally {
      setLoading(false);
      setDateOpen(false);
      setIsPopupOpen(true);
    }
  };

  const checkApproved = () => {
    // 1) Destructure stats if you like:
    const { total_content = 0, approved = 0, published = 0 } = stats;

    // 2) Check if all content is approved or published
    if (approved + published !== total_content) {
      // Not all content is approved/published, block the user
      setMessage('Please approve all content before proceeding.');
      setStatus(false); // false = show error style
      setIsOpen(true); // show the Snackbar
      return;
    }
    setDateOpen(true);
  };

  return (
    <>
      {published ? (
        <button
          onClick={() => setDateOpen(true)}
          className={`flex relative flex-row w-fit items-center gap-2 rounded-lg px-5 py-3 bg-[#82FFC9] hover:bg-[#59fab4]`}
        >
          <MdOutlineUpdate />
          <h3 className="text-base font-bold text-green-700">Update Scheduled Posts</h3>
          <div className="absolute -top-3 -right-2 text-center w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#046C4E]">
            <span className="text-[#82FFC9] text-base font-bold">{stats.approved}</span>
          </div>
        </button>
      ) : (
        <button
          onClick={checkApproved}
          className={`flex relative flex-row w-fit items-center gap-2 rounded-lg px-5 py-3 bg-[#82FFC9] hover:bg-[#59fab4]`}
        >
          <img src="/src/assets/icons/publish.svg" className="w-4 h-4" />
          <h3 className="text-base font-bold text-green-700">Publish Approved Posts</h3>
          <div className="absolute -top-3 -right-2 text-center w-[30px] h-[30px] flex justify-center items-center rounded-full bg-[#046C4E]">
            <span className="text-[#82FFC9] text-base font-bold">{stats.approved}</span>
          </div>
        </button>
      )}
      <EndPublishPopup
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        stats={stats}
        onNavigateToDashboard={() => navigate('/dashboard')}
      />

      <ConfirmDate
        isPopupOpen={isDateOpen}
        setIsPopupOpen={setDateOpen}
        stats={stats}
        onClick={handlePublish}
        loading={loading}
        start_date={startDate}
        duration={duration}
      />
      {!status ? (
        <ErrorToast
          message={message}
          open={isOpen}
          success={status}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
};

function Connected({
  onRevoke,
}: // publish,
{
  onRevoke: () => void;
  // publish: boolean;
}) {
  const {
    integrations: { triggerRequest: refetch, loading: refetchLoading },
  } = useAppContext();
  const { triggerRequest: requestRevoke, loading: revokeLoading } = useIntegrationApi(
    revokeAuthApp('instagram'),
    'TRIGGER'
  );

  const handleRevoke = () => {
    requestRevoke().then(() => {
      refetch();
      onRevoke(); // Inform parent that the integration was revoked
    });
  };

  // const { data } = useIntegrationApi(getAppUser("instagram"));

  // FIX: refactor the loading state
  return (
    <>
      <button
        onClick={handleRevoke}
        disabled={revokeLoading || refetchLoading}
        className={`mt-5 mb-3 flex flex-row w-fit items-center gap-2 rounded-lg px-5 py-4 ${
          revokeLoading || refetchLoading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-indigo-700 hover:bg-[#6875F5]'
        }`}
      >
        <InstagramIcon />
        {revokeLoading || refetchLoading ? (
          <>
            <CircularProgress sx={{ color: '#ffffff' }} size={25} thickness={5} />
            <h3 className="text-sm font-semibold text-white">Revoking...</h3>
          </>
        ) : (
          <h3 className="text-sm font-semibold text-white">Connected</h3>
        )}
      </button>
      <SparklesMessage>
        Once your campaign content is ready, you can post it directly to Instagram or Facebook
      </SparklesMessage>
    </>
  );
}

const openAuthPopup = (url: string, windowName: string = 'auth-popup') => {
  return new Promise((resolve, reject) => {
    const popup = window.open(url, windowName, 'width=600,height=700,left=200,top=200');

    if (!popup) {
      reject(new Error('Failed to open authentication popup'));
      return;
    }

    const timer = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(timer);
          reject(new Error('Authentication popup closed by user'));
        }

        if (popup.location.href.includes('/profile/integrations')) {
          clearInterval(timer);
          popup.close();
          resolve('hello');
        }
      } catch (err: unknown) {
        // Ignore cross-origin errors
      }
    }, 1000);
  });
};

function Unconnected({ onConnect, publish }: { onConnect: () => void; publish: boolean }) {
  const { data, triggerRequest: requestURL } = useIntegrationApi(
    authenticateApp('instagram'),
    'TRIGGER'
  );

  useEffect(() => {
    if (data && data.auth_url) {
      handleAuthPopup(data.auth_url);
    }
  }, [data]);

  const handleAuthPopup = async (authUrl: string) => {
    try {
      const token = await openAuthPopup(authUrl);
      if (token) {
        onConnect(); // Inform parent component that authentication succeeded
      }
    } catch (err: unknown) {
      // Error handled silently
    }
  };

  return (
    <>
      <div
        onClick={requestURL}
        className={`mt-5  ${
          publish ? '' : 'mb-3'
        } flex flex-row w-fit items-center gap-2 rounded-lg ${
          publish ? 'px-3 py-[9px]' : 'px-5 py-4'
        } hover:cursor-pointer bg-indigo-700 hover:bg-[#6875F5]`}
      >
        <InstagramIcon />
        <h3 className="text-sm font-semibold text-white">Connect with Meta</h3>
      </div>
      {publish === false && (
        <SparklesMessage>
          Once your campaign content is ready, you can post it directly to Instagram or Facebook
        </SparklesMessage>
      )}
    </>
  );
}

export default InstaConnect;
