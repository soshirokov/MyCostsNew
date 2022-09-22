import { List, Select, Typography } from 'antd'
import Button from 'antd/es/button'
import Input from 'antd/lib/input/Input'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import { get, onValue, orderByChild, query, set } from 'firebase/database'
import { useEffect, useState } from 'react'
import { auth, costByUserRef, userCategories } from '../../utils/firebase'
import { Categories, CostsServer } from '../../utils/types'
import styles from './styles.module.scss'

const { Title } = Typography
const { Option } = Select

export const CategoriesSetting = () => {
  const [categories, setCategories] = useState<Categories>([])
  const [newCategory, setNewCategory] = useState<string>()
  const [categoryToDelete, setCategoryToDelete] = useState<string>()
  const [categoryToMove, setCategoryToMove] = useState<string>()

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      onValue(userCategories(auth.currentUser.uid), (snapshot) => {
        setCategories(snapshot.val() ? snapshot.val() : [])
      })
    }
  }, [])

  const addCategoryHandler = () => {
    if (auth?.currentUser?.uid) {
      set(userCategories(auth?.currentUser?.uid), [...categories, newCategory])

      setNewCategory('')
    }
  }

  const swap = (arr: Array<string>, a: number, b: number) => {
    arr[a] = arr.splice(b, 1, arr[a])[0]
  }

  const toDeleteCategoryHandler = (categoryToDelete: string) => {
    setCategoryToDelete(categoryToDelete)
  }

  const toMoveToCategoryHandler = (categoryToMoveTo: string) => {
    setCategoryToMove(categoryToMoveTo)
  }

  const filterCategories = () => {
    return categories.filter((category) => category !== categoryToDelete)
  }

  const deleteCategoryHandler = () => {
    if (auth?.currentUser?.uid && categoryToMove && categoryToDelete) {
      const myQuery = query(
        costByUserRef(auth.currentUser.uid),
        orderByChild('dateTime')
      )

      get(myQuery).then((snapshot) => {
        const currentCosts: CostsServer = snapshot.val()

        Object.keys(currentCosts).forEach((key) => {
          if (currentCosts[key].details[categoryToDelete]) {
            const currentCategoryCost =
              currentCosts[key].details[categoryToMove] || 0
            currentCosts[key].details[categoryToMove] =
              currentCategoryCost + +currentCosts[key].details[categoryToDelete]

            delete currentCosts[key].details[categoryToDelete]
          }
        })

        if (auth?.currentUser?.uid) {
          set(costByUserRef(auth.currentUser.uid), currentCosts)
          set(userCategories(auth.currentUser.uid), filterCategories())
        }
      })
    }
  }

  const upCategoryHandler = (index: number) => {
    const newCategoriesList = [...categories]
    swap(newCategoriesList, index, index - 1)
    saveNewCategoriesList(newCategoriesList)
  }

  const downCategoryHandler = (index: number) => {
    const newCategoriesList = [...categories]
    swap(newCategoriesList, index, index + 1)
    saveNewCategoriesList(newCategoriesList)
  }

  const saveNewCategoriesList = (newList: string[]) => {
    if (auth?.currentUser?.uid) {
      set(userCategories(auth?.currentUser?.uid), newList)
    }
  }

  return (
    <>
      {categories.length > 0 && (
        <List
          className={styles.CategorySetting__List}
          header={
            <div className={styles.CategorySetting__Header}>
              <Title level={3}>Your categories</Title>
            </div>
          }
          bordered
          dataSource={categories}
          renderItem={(category, index) => (
            <List.Item className={styles.CategorySetting__Item} key={category}>
              <div className={styles.CategorySetting__Label}>{category}</div>
              <div className={styles.CategorySetting__Controls}>
                {categoryToDelete !== category ? (
                  <Button
                    type="link"
                    onClick={() => toDeleteCategoryHandler(category)}
                  >
                    remove
                  </Button>
                ) : (
                  <>
                    <Button
                      type="primary"
                      onClick={deleteCategoryHandler}
                      disabled={!categoryToMove}
                      style={{ marginRight: 20 }}
                    >
                      move costs here
                    </Button>
                    <Select
                      value={categoryToMove}
                      style={{ width: 180 }}
                      onChange={toMoveToCategoryHandler}
                    >
                      {filterCategories().map((categoryToMove) => (
                        <Option value={categoryToMove} key={categoryToMove}>
                          {categoryToMove}
                        </Option>
                      ))}
                    </Select>
                  </>
                )}
                <Button
                  type="text"
                  disabled={index === 0}
                  onClick={() => {
                    upCategoryHandler(index)
                  }}
                >
                  <CaretUpOutlined />
                </Button>
                <Button
                  type="text"
                  disabled={index === categories.length - 1}
                  onClick={() => {
                    downCategoryHandler(index)
                  }}
                >
                  <CaretDownOutlined />
                </Button>
              </div>
            </List.Item>
          )}
        />
      )}
      <Input
        placeholder="Type new category name"
        size="large"
        className={styles.CategorySetting__Input}
        onChange={(e) => setNewCategory(e.target.value)}
        value={newCategory}
      />
      <div className={styles.CategorySetting__AddButtonBox}>
        <Button
          type="primary"
          className={styles.CategorySetting__AddButton}
          onClick={addCategoryHandler}
          size="large"
        >
          Add new category
        </Button>
      </div>
    </>
  )
}
