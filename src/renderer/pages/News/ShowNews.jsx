import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchAllNews } from 'renderer/utils/fetch';
import { parseToDirectusLink } from 'renderer/utils/tools';
import './ShowNews.scss';
const ShowNews = () => {
  const { id } = useParams();
  const data = useQuery({ queryKey: ['news'], queryFn: fetchAllNews });
  const news = data.data
    ? data.data.find((item) => item.id === JSON.parse(id))
    : {
        name: 'Loading...',
        description: 'Loading...',
        preview: 'Loading...',
      };

  return (
    <div className="page show-news">
      <h1>{news.name}</h1>
      <img src={parseToDirectusLink(news.preview)} alt={news.name} />

      <p>{news.description}</p>
    </div>
  );
};

export default ShowNews;
