import { Button, Calendar, DatePicker, DatePickerProps } from 'antd'
import type { Moment } from 'moment'
import moment from 'moment'
import { setDate } from '../../Store/Calendar/actions'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import styles from './styles.module.css'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import 'moment/locale/ru'
import locale from 'antd/es/date-picker/locale/ru_RU'
import { useMediaQuery } from 'react-responsive'

type Props = {
  date: Moment
}

const customFormat: DatePickerProps['format'] = (value) =>
  value.format('DD.MM.YYYY')

const NewCalendar = ({ date }: Props) => {
  const dispatch = useDispatch()
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })

  const onSelect = (date: Moment) => {
    const selectedDate = date.format('DD-MM-YYYY')
    dispatch(setDate(selectedDate))
  }

  const isToday = moment().isSameOrBefore(moment(date).add(1, 'day'))

  useEffect(() => {
    const defaultDate = moment(new Date()).format('DD-MM-YYYY')
    dispatch(setDate(defaultDate))
  }, [dispatch])

  return (
    <div className={styles.calendarWrapper}>
      {!isMobile ? (
        <Calendar fullscreen={false} onSelect={onSelect} locale={locale} />
      ) : (
        <>
          <Button
            type="primary"
            icon={<LeftOutlined />}
            onClick={() => onSelect(moment(date).subtract(1, 'day'))}
            size="large"
          />
          <DatePicker
            value={date}
            allowClear={false}
            onChange={(v) => v && onSelect(v)}
            defaultValue={moment()}
            style={{ width: '100%' }}
            className={styles.datePicker}
            size="large"
            locale={locale}
            format={customFormat}
          />
          <Button
            type="primary"
            icon={<RightOutlined />}
            onClick={() => onSelect(moment(date).add(1, 'day'))}
            disabled={isToday}
            size="large"
          />
        </>
      )}
    </div>
  )
}

export default NewCalendar
