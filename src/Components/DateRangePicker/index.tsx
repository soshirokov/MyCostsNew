import { DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'

const { RangePicker } = DatePicker

type Props = {
  onSelect: (range: [Moment, Moment]) => void
  value: [Moment | null, Moment | null]
}

const DateRangePicker = ({ value, onSelect }: Props) => {
  const changeHandler = (dates: RangeValue<Moment>) => {
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
      <RangePicker value={value} onChange={changeHandler} />
    </>
  )
}

export { DateRangePicker }
