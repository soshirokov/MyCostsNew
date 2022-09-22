import { Card, Typography } from 'antd'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'

const { Text } = Typography

type Props = {
  title: string
  sum: number
  additionalSum?: number
  type?: 'positive' | 'negative'
  more?: boolean
}

const CostStatElement = ({ sum, title, additionalSum, type, more }: Props) => {
  const moreIcon = more ? <CaretUpOutlined /> : <CaretDownOutlined />

  return (
    <>
      <Card
        className={styles.CostStatElem}
        title={title}
        bordered={false}
        headStyle={{ fontWeight: 'bold', fontSize: '14px' }}
      >
        <div className={styles.CostStatElem__Content}>
          <Text className={styles.CostStatElem__Sum} strong>
            {sum.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB',
            })}
          </Text>
          {type ? (
            <Text
              className={styles.CostStatElem__AdditionalSum}
              type={type === 'positive' ? 'success' : 'danger'}
            >
              {more !== undefined && moreIcon}
              {additionalSum &&
                additionalSum.toLocaleString('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                })}
            </Text>
          ) : (
            <Text className={styles.CostStatElem__AdditionalSum}>
              {more !== undefined && moreIcon}
              {additionalSum &&
                additionalSum.toLocaleString('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                })}
            </Text>
          )}
        </div>
      </Card>
    </>
  )
}

export { CostStatElement }
