import { DatePicker, DatePickerProps } from 'antd'
import moment, { Moment } from 'moment'
import { RangeValue } from 'rc-picker/lib/interface'
import 'moment/locale/ru'
import locale from 'antd/es/date-picker/locale/ru_RU'

const { RangePicker } = DatePicker

const customFormat: DatePickerProps['format'] = (value) =>
  value.format('DD.MM.YYYY')

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
      <RangePicker
        value={value}
        onChange={changeHandler}
        locale={locale}
        format={customFormat}
      />
    </>
  )
}

export { DateRangePicker }
