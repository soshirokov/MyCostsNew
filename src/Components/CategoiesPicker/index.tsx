import { Checkbox } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { Categories } from '../../utils/types'
import styles from './styles.module.scss'

type Props = {
  categories: Categories
  onSelect: (categories: Categories) => void
}

const CategoiesPicker = ({ categories, onSelect }: Props) => {
  const onChangeHandler = (checkedValues: CheckboxValueType[]) => {
    onSelect(checkedValues.map((check) => check + ''))
  }

  return (
    <div className={styles.CategoiesPicker}>
      <Checkbox.Group onChange={onChangeHandler} defaultValue={categories}>
        {categories.length > 0 &&
          categories.map((category) => (
            <div className={styles.CategoiesPicker__Item} key={category}>
              <Checkbox
                value={category}
                className={styles.CategoiesPicker__Checkbox}
              >
                {category}
              </Checkbox>
            </div>
          ))}
      </Checkbox.Group>
    </div>
  )
}

export { CategoiesPicker }
