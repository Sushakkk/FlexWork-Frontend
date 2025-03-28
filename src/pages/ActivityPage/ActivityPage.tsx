
import React, { useEffect, useState } from 'react';
import './ActivityPage.css';
import '../ActivitiesPage/ActivitiesPage.css'
import { ActivitiesMocks } from '../../modules/mocks';
import { T_Activity } from '../../modules/types';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useAppDispatch } from '../../store';
import { fetchActivity, useActivity } from '../../slices/activitiesSlice';



const ActivityPage: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const [isMock, setIsMock] = useState(false);
  const dispatch = useAppDispatch();

  const currentHost = window.location.hostname;

  const activity=useActivity()



  const createMock = () => {
    setIsMock(true);
    // setActivity(ActivitiesMocks.find(activity => activity?.id == parseInt(id as string)) as T_Activity)
}

  useEffect(() => {
    if (!isMock) {
      dispatch(fetchActivity(String(id)))
    } else {
      createMock();
    }

    return () => {
      // setActivity(null);
    };
  }, [id, isMock]);



  if (!activity) {
    return <div>Активность не найдена</div>;
  }

  return (
  <main id="main" className="page">
    <Breadcrumbs/>
    <div className="page__main-block _container">
      <div className="main-content">
        <div className="main-block__body">
          <h1 className="main-block__title title_main">{activity.title}</h1>
          <div className="main-block__image">
            <img
              src={activity.img_url ||  'https://avatars.mds.yandex.net/i?id=284efc4987205a8f579db78365821d19_sr-8271622-images-thumbs&n=13'}
              alt={activity.title}
              onError={(e) => { e.currentTarget.src =  'https://avatars.mds.yandex.net/i?id=284efc4987205a8f579db78365821d19_sr-8271622-images-thumbs&n=13'; }}
            />
          </div>
          <div className="main-block__details">
            <div className="main-block__container-details">
              <div><span className="detail-label">Описание:</span>{activity.description}</div>
              {/* <div>{activity.description}</div> */}
            </div>
            <p><span className="detail-label">Категория:</span> {activity.category}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
  );
};

export default ActivityPage;