import { Calendar } from 'antd';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { log } from 'console';
import type { Moment } from 'moment';
import React from 'react';
import "./style/index.css"



const NewCalendar: React.FC = () => {
  const onPanelChange = (value: Moment, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const onSelect = (date: Moment)=>{
    let selectedDate = (date.format('YYYY-MM-DD'))
    console.log(selectedDate)
  }



  return (
    <div className="site-calendar-demo-card">
      <Calendar fullscreen={false} onPanelChange={onPanelChange} onSelect={onSelect}/> 
    </div>
  ) 
  
};




export default NewCalendar