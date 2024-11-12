import { useEffect, FormEvent, useState } from 'react'; 
import './ActivitiesPage.css';
import { ActivitiesMocks } from '../../modules/mocks';

import { T_Activity } from '../../modules/types';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import { setTitle, useTitle } from '../../slices/activitiesSlice';
import { useDispatch } from 'react-redux';

const ActivitiesPage = () => {
    const [activities, setActivities] = useState<T_Activity[]>([]);
    const [isMock, setIsMock] = useState(false);
  
    const [count, setCount] = useState(0);




    const [selectedTitle, setSelectedTitle] = useState<string>(useTitle() || ''); 

    const dispatch = useDispatch();
    const title= useTitle() || '';

   
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        dispatch(setTitle(selectedTitle));
    };
    



    const fetchData = async () => {
        try {
            const response = await fetch(`/api/activities/?title=${title.toLowerCase()}`, { signal: AbortSignal.timeout(1000) });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setActivities(result.activities);
            setCount( result.count || 0 );
            setIsMock(false);
        } catch (error) {
            if (!isMock){
                createMocks();

            }
            
        }
    };
    
    
    const createMocks = () => {
        setIsMock(true);
        setActivities(ActivitiesMocks.filter(activity => activity.title.toLowerCase().includes(title.toLowerCase())));
    }

   

    useEffect(() => {
        fetchData();
    }, [title]);

    return (
        <main id="main" className="page">
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
                                    <img src="http://127.0.0.1:9000/flexwork/Group.svg" alt="Search" />
                                </button>
                            </div>
                        </form>
                        <div className="basket-container">
                            <img
                                className="basket__img"
                                src="http://127.0.0.1:9000/flexwork/basket.svg"
                                alt="basket"
                            />
                            {count > 0 && (
                                <div className="basket_amount">{count}</div>
                            )} {/* Условный рендеринг здесь */}
                        </div>
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