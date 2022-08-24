import { Calendar } from 'antd'
import type { Moment } from 'moment'
import moment from 'moment'
import './style/index.css'
import { setDate } from '../../Store/Calendar/actions'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

const NewCalendar = () => {
  const dispatch = useDispatch()

  const onSelect = (date: Moment) => {
    const selectedDate = date.format('DD-MM-YYYY')
    dispatch(setDate(selectedDate))
  }

  useEffect(() => {
    const defaultDate = moment(new Date()).format('DD-MM-YYYY')
    dispatch(setDate(defaultDate))
  }, [dispatch])

  return (
    <div className="site-calendar-demo-card">
      <Calendar fullscreen={false} onSelect={onSelect} />
    </div>
  )
}

export default NewCalendar
