import { endAt, get, orderByChild, query, startAt } from 'firebase/database'
import moment, { Moment } from 'moment'
import { costByUserRef } from '../../utils/firebase'
import { CostsServer } from '../../utils/types'

type Args = {
  userId: string
  currentDate: Moment
}

export const loadLastMonthCosts = ({
  userId,
  currentDate,
}: Args): Promise<number> => {
  const startDate = moment(currentDate).subtract(1, 'month').startOf('month')
  const endDate = moment(currentDate).subtract(1, 'month').endOf('month')

  return new Promise<number>((resolve) => {
    const myQuery = query(
      costByUserRef(userId),
      orderByChild('dateTime'),
      startAt(startDate.format('x')),
      endAt(endDate.format('x'))
    )

    get(myQuery)
      .then((snapshot) => {
        const costs = snapshot.val() as CostsServer
        if (!costs) {
          resolve(0)
        }

        const sum = Object.keys(costs).reduce(
          (sum, key) => (sum += costs[key].total),
          0
        )

        resolve(sum)
      })
      .catch(() => {
        resolve(0)
      })
  })
}
