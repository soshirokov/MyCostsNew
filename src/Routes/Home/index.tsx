import React from 'react'
import { AddCosts } from '../../Components/AddCosts';
import NewCalendar from '../../Components/Calendar'



const Home = () => {
    return (
        <div className='home'>
            <NewCalendar />

            <AddCosts />
        </div>
    );
};




export {Home};