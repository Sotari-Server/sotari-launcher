import { useQuery } from '@tanstack/react-query';
import './Home.scss';
import { BsFillPlayFill } from 'react-icons/bs';
import { fetchAllNews } from 'renderer/utils/fetch';
import NewCard from 'renderer/components/Card/NewCard';
import { IoMdHelp } from 'react-icons/io';
// add icon +
import { AiOutlinePlus } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
// download icon
import { BsDownload } from 'react-icons/bs';
const Home = ({
  setInDownload,
  inDownload,
  step,
  checkJava,
  isUpdate,
  progress,
}) => {
  const downloadAssets = () => {
    window.setTimeout(() => {}, 1500);
    setInDownload(true);
    console.log('sendIpcExample');
    window.electron.ipcRenderer.sendMessage('download-assets');
  };
  const onPlay = () => {
    window.electron.ipcRenderer.sendMessage('play');
  };
  // day format include hours

  const News = useQuery({ queryKey: ['news'], queryFn: fetchAllNews });
  return (
    <div className="Home page">
      <h1>
        Sotari <span className="accent">server</span>
      </h1>
      <p>
        Sotari is a <span className="accent">Minecraft</span> server that
        focuses on <span className="accent">community</span> and{' '}
        <span className="accent">fun</span>.
      </p>
      <h3>
        {inDownload && (
          <>
            {' '}
            <span className="accent">Downlad status</span> : {step}
          </>
        )}
      </h3>
      <div className="herro-button">
        <button
          style={
            inDownload
              ? {
                  width: 420,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  paddingLeft: 10,
                  paddingRight: 10,
                  cursor: 'default',
                  background: '#dd00ff',
                }
              : !checkJava
              ? {
                  width: 200,
                  height: 45,
                  background: 'gray',
                  cursor: 'default',
                }
              : {}
          }
          disabled={!checkJava || inDownload ? true : false}
          onClick={isUpdate ? onPlay : downloadAssets}
        >
          {inDownload ? (
            <>
              <div
                style={{
                  width: Math.round(JSON.parse(progress)) + '%',
                }}
                className="progress-bar"
              ></div>
            </>
          ) : (
            <>
              <span>{isUpdate ? <BsFillPlayFill /> : <BsDownload />}</span>
              {!checkJava ? 'Checking...' : isUpdate ? 'Play' : 'Update'}
            </>
          )}
        </button>

        <a target="_blank" href="https://wiki.sotari.eu" rel="noreferrer">
          <button>
            <span>
              <IoMdHelp />
            </span>
            Wiki
          </button>
        </a>
      </div>
      <div className="event">
        <div className="all-news">
          {News.data?.slice(0, 3).map((news) => (
            <NewCard
              key={news.id}
              id={news.id}
              title={news.name}
              preview={news.preview}
              description={news.description}
            />
          ))}{' '}
        </div>
        <NavLink to="/news">
          <button className="more-button">
            <AiOutlinePlus />
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Home;
