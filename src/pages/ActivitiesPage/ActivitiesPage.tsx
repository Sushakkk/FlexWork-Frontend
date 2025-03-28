import { useEffect, FormEvent, useState } from 'react'; 
import './ActivitiesPage.css';
import { fetchActivities, setTitle, useActivities, useTitle } from '../../slices/activitiesSlice';
import { useDispatch } from 'react-redux';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useAppDispatch, useAppSelector } from '../../store';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import { useActivityCount, useSelfEmployedID } from '../../slices/selfEmployedSlice';
import { Link } from 'react-router-dom';


const ActivitiesPage = () => {

  
    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
    const self_employed_id = useAppSelector((state) => state.selfEmployed.self_employed_id);




    const [selectedTitle, setSelectedTitle] = useState<string>(useTitle() || ''); 
    const isStaff = useAppSelector((state) => state.user.is_staff);

    const dispatch = useAppDispatch()
    const title= useTitle() || '';
    const activities =useActivities()

    const count = useActivityCount();





    

   
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(setTitle(selectedTitle));
    };
    
    const currentHost = window.location.hostname;


    useEffect(() => {
        dispatch(fetchActivities())

    }, [title])
    
  

    return (
        <main id="main" className="page">
            <Breadcrumbs/>
            <div className="page__services _container">
                <div className="services__content">
                    <div className="services__search">
                        <form onSubmit={handleSubmit}>
                            <div className="search-container">
                                <input
                                    type="text"
                                    name="activity"
                                    value={selectedTitle}
                                    onChange={(e) => setSelectedTitle(e.target.value)}
                                    placeholder="Поиск"
                                    className="search-input"
                                />
                                <button type="submit" className="search-button">
                                    <img src={`http://${currentHost}:9000/flexwork/Group.svg`} alt="Search" />
                                </button>
                            </div>
                        </form>
                        
                        {isAuthenticated && !isStaff && self_employed_id !== null ? (
                            <Link to={`/self-employed/${self_employed_id}`} className="basket-container">
                                <img
                                    className="basket__img"
                                    src={`http://${currentHost}:9000/flexwork/basket.svg`}
                                    alt="basket"
                                />
                                {count > 0 && (
                                    <div className="basket_amount">{count}</div>
                                )}
                            </Link>
                        ) : (
                            <div className="basket-container ">
                                <img
                                    className="basket__img disabled"
                                    src={`http://${currentHost}:9000/flexwork/basket.svg`}
                                    alt="basket"
                                />
                            </div>
                        )}
                    </div>

                    <div className="services__cards">
                        {activities.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity}/>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ActivitiesPage;