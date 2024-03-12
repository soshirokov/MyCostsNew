import { Card, Typography } from 'antd'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import { currentCurrency } from '../../Store/Currency/selectors'
import { currencyDisplay } from '../../utils/costConverters'

const { Text } = Typography

type Props = {
  title: string
  sum: number
  additionalSum?: number
  type?: 'positive' | 'negative'
  more?: boolean
  additionalDesc?: string
}

const CostStatElement = ({
  sum,
  title,
  additionalSum,
  type,
  more,
  additionalDesc,
}: Props) => {
  const moreIcon = more ? <CaretUpOutlined /> : <CaretDownOutlined />
  const currency = useSelector(currentCurrency)

  return (
    <>
      <Card
        className={styles.CostStatElem}
        title={title}
        bordered={false}
        headStyle={{ fontWeight: 'bold', fontSize: '14px' }}
        bodyStyle={{ minHeight: '95px' }}
      >
        <div className={styles.CostStatElem__Content}>
          <Text className={styles.CostStatElem__Sum} strong>
            {currencyDisplay(sum, currency)}
          </Text>
          {type ? (
            <Text
              className={styles.CostStatElem__AdditionalSum}
              type={type === 'positive' ? 'success' : 'danger'}
            >
              {more !== undefined && moreIcon}
              {additionalSum && currencyDisplay(additionalSum, currency)}
              {additionalDesc}
            </Text>
          ) : (
            <Text className={styles.CostStatElem__AdditionalSum}>
              {!!more && moreIcon}
              {additionalSum && currencyDisplay(additionalSum, currency)}
              {additionalDesc}
            </Text>
          )}
        </div>
      </Card>
    </>
  )
}

export { CostStatElement }
