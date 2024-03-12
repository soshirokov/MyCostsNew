import { Button, Checkbox } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { Categories } from '../../utils/types'
import styles from './styles.module.scss'

type Props = {
  categories: Categories
  checkedCategories: Categories
  onSelect: (categories: Categories) => void
}

const CategoiesPicker = ({
  categories,
  checkedCategories,
  onSelect,
}: Props) => {
  const isAllSelected = categories.length === checkedCategories.length

  const onChangeHandler = (checkedValues: CheckboxValueType[]) => {
    onSelect(checkedValues.map((check) => check.toString()))
  }

  console.log(checkedCategories)

  return (
    <div className={styles.CategoiesPicker}>
      <Button
        size="middle"
        onClick={() => {
          isAllSelected ? onChangeHandler([]) : onChangeHandler(categories)
        }}
      >
        {isAllSelected ? 'Очистить все' : 'Выбрать все'}
      </Button>
      <Checkbox.Group
        className={styles.CategoiesListWrapper}
        onChange={onChangeHandler}
        value={checkedCategories}
      >
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
