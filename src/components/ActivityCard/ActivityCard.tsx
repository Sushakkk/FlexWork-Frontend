import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Не забудьте импортировать Link
import { T_Activity } from '../../utils/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { AddToSelfEmployed, fetchActivities } from '../../slices/activitiesSlice';



type ActivityCardProps = {
    activity: T_Activity; 
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => { 
    const dispatch = useAppDispatch()

    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
    const navigate=useNavigate()

    const handeAddToSelfEmployed = async () => {
        if(!isAuthenticated){
            navigate('/403/')

        }
        await dispatch(AddToSelfEmployed(String(activity.id)))
        await dispatch(fetchActivities())
    }

   
    return (
        <div className="services__column" key={activity.id}>
            <div className="services__card item-services">
                <h3 className="item-service__title">{activity.title}</h3>
                <div className="item-service__img">
                    
                    <img
                        src={activity.img_url || 'https://avatars.mds.yandex.net/i?id=284efc4987205a8f579db78365821d19_sr-8271622-images-thumbs&n=13'}
                        alt={activity.title}
                    />
                </div>
                <div className="item-service_buttons">
                    <Link 
                        to={`/activity/${activity.id}`}
                        className="item-service__button button-page"
                    >
                        Подробнее
                    </Link>
                        <button className="main-block__button__add" onClick={handeAddToSelfEmployed}>
                            +
                        </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
