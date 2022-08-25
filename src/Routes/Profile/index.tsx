import React from 'react'
import { CategoriesSetting } from '../../Components/CategoriesSetting'
import { UserInformation } from '../../Components/UserInformation'
import styles from './styles.module.scss'

export const Profile: React.FC = () => {
  return (
    <>
      <div className={styles.Profile}>
        <div className={styles.Profile__UserInformation}>
          <UserInformation />
        </div>
        <div className={styles.Profile__CategoriesSetting}>
          <CategoriesSetting />
        </div>
      </div>
    </>
  )
}
