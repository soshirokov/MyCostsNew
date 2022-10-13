import { DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { useState } from 'react'
import { RangeValue } from 'rc-picker/lib/interface'

const { RangePicker } = DatePicker

type Props = {
  onSelect: (range: [Moment, Moment]) => void
}

const DateRangePicker = ({ onSelect }: Props) => {
  const [dates, setDates] = useState<RangeValue<Moment>>()

  const changeHandler = (dates: RangeValue<Moment>) => {
    setDates(dates)

    if (
      Array.isArray(dates) &&
      moment.isMoment(dates[0]) &&
      moment.isMoment(dates[1])
    ) {
      onSelect([dates[0], dates[1]])
    }
  }

  return (
    <>
      <RangePicker value={dates} onChange={changeHandler} />
    </>
  )
}

export { DateRangePicker }
