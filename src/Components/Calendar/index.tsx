import { Calendar } from 'antd';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import type { Moment } from 'moment';
import React from 'react';
import "./style/index.css";
import { getDate } from '../../Store/Calendar/actions';
import { useDispatch } from 'react-redux';




const NewCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const onPanelChange = (value: Moment, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const onSelect = (date: Moment)=>{
    let selectedDate:any = (date.format('YYYY-MM-DD'))
    dispatch(getDate(selectedDate));
  }



  return (
    <div className="site-calendar-demo-card">
      <Calendar fullscreen={false} onPanelChange={onPanelChange} onSelect={onSelect}/> 
    </div>
  ) 
  
};




export default NewCalendar