import { List, Typography } from 'antd'
import Button from 'antd/es/button'
import Input from 'antd/lib/input/Input'
import { onValue, set } from 'firebase/database'
import { useEffect, useState } from 'react'
import { auth, userCategories } from '../../utils/firebase'
import { Categories } from '../../utils/types'
import styles from './styles.module.scss'

const { Title } = Typography

export const CategoriesSetting = () => {
  const [categories, setCategories] = useState<Categories>([])
  const [newCategory, setNewCategory] = useState<string>()

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

  const deleteCategoryHandler = (removeCategory: string) => {
    const newCategoriesList = categories.filter(
      (category) => category !== removeCategory
    )
    if (auth?.currentUser?.uid) {
      set(userCategories(auth?.currentUser?.uid), newCategoriesList)
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
          renderItem={(category) => (
            <List.Item className={styles.CategorySetting__Item} key={category}>
              <div className={styles.CategorySetting__Label}>{category}</div>
              <div className={styles.CategorySetting__Controls}>
                <Button
                  type="link"
                  onClick={() => deleteCategoryHandler(category)}
                >
                  remove
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
