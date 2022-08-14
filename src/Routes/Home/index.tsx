import React from 'react';
import NewCalendar from '../../Components/Calendar';
import { CategoriesSetting } from '../../Components/CategoriesSetting';

const Home = () => {
    return (
        <div className='home'>
            <NewCalendar />

            <CategoriesSetting />
        </div>
    );
};

export {Home};