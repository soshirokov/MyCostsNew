import { set } from 'firebase/database'
import moment, { Moment } from 'moment'
import { auth, costByUserRef, userCategories } from './firebase'
import { Categories, CostServer, CostsServer } from './types'

export const createDemoData = () => {
  const demoCategories: Categories = [
    'Автомобиль',
    'Аптека',
    'Еда',
    'Квартира',
    'Образование',
    'Спорт',
    'Одежда',
    'Хозтовары',
    'Путешествия',
    'Техника',
  ]

  const endDate: Moment = moment().startOf('day').startOf('year')

  const demoCosts: CostsServer = {}

  for (
    let i = moment().startOf('day');
    i.diff(endDate) > 0;
    i = i.subtract(1, 'days')
  ) {
    const key = i.format('DD-MM-YYYY')

    const demoCost: CostServer = {
      dateTime: i.format('x'),
      details: {},
      total: 0,
    }

    demoCategories.forEach((category) => {
      const rand =
        Math.floor(Math.random() * 10) * Math.floor(Math.random() * 10) * 50
      demoCost.details[category] = rand
      demoCost.total = +demoCost.total + rand
    })

    demoCosts[key] = demoCost
  }

  if (auth?.currentUser?.uid) {
    set(userCategories(auth.currentUser.uid), demoCategories)
    set(costByUserRef(auth.currentUser.uid), demoCosts)
  }
}
