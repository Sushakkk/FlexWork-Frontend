
import { useDispatch } from 'react-redux';
import { setTitle } from '../../slices/activitiesSlice';
import './HomePage.css'
import { useEffect } from 'react';

const HomePage = () => {
   const dispatch = useDispatch();
 
   useEffect(()=>{
    dispatch(setTitle(''))

   }, [])



    return (
        <div className='home'>
            Добро пожаловать!
        </div>
    );
};

export default HomePage;