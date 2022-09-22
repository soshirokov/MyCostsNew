import { Col, Row } from 'antd'
import { endAt, onValue, orderByChild, query, startAt } from 'firebase/database'
import { Moment } from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { CategoiesPicker } from '../../Components/CategoiesPicker'
import { PieChart } from '../../Components/PieChart'
import { ExportCSV } from '../../Components/ExportCSV'
import { StatsLineChart } from '../../Components/StatsLineChart'
import { DateRangePicker } from '../../DateRangePicker'
import { auth, costByUserRef, userCategories } from '../../utils/firebase'
import { Categories, Costs, CostsServer } from '../../utils/types'
import styles from './styles.module.scss'

type ExportCost = {
  [key: string]: string
}

const Analitics = () => {
  const [categories, setCategories] = useState<Categories>([])
  const [selectedCategories, setSelectedCategories] = useState<Categories>([])
  const [range, setRange] = useState<[Moment, Moment]>()
  const [costs, setCosts] = useState<CostsServer>({})
  const [filteredCosts, setFilteredCosts] = useState<CostsServer>({})

  const showGraphs =
    range &&
    range[0].isValid() &&
    range[1].isValid() &&
    selectedCategories.length > 0

  useEffect(() => {
    if (
      auth?.currentUser?.uid &&
      range &&
      range[0].isValid() &&
      range[1].isValid()
    ) {
      const myQuery = query(
        costByUserRef(auth.currentUser.uid),
        orderByChild('dateTime'),
        startAt(range[0].startOf('day').format('x')),
        endAt(range[1].endOf('day').format('x'))
      )

      onValue(myQuery, (snapshot) => setCosts(snapshot.val() || {}))
    }
  }, [range])

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      onValue(userCategories(auth.currentUser.uid), (snapshot) => {
        const result = snapshot.val() ? snapshot.val() : []
        setCategories(result)
        setSelectedCategories(result)
      })
    }
  }, [])

  const rangeSelectHandler = (dates: [Moment, Moment]) => {
    setRange(dates)
  }

  const categoriesSelectHandler = (categories: Categories) => {
    setSelectedCategories(categories)
  }

  const filename = 'for table'
  const filterCosts = useCallback(
    (costs: CostsServer) => {
      const filteredCosts: CostsServer = {}

      Object.keys(costs).forEach((key) => {
        const newDetails: Costs = {}

        selectedCategories.forEach((category) => {
          newDetails[category] = costs[key].details[category]
            ? costs[key].details[category]
            : 0
        })

        filteredCosts[key] = {
          dateTime: costs[key].dateTime,
          details: newDetails,
          total: Object.keys(newDetails).reduce(
            (acc, key) => acc + +newDetails[key],
            0
          ),
        }
      })

      setFilteredCosts(filteredCosts)
    },
    [selectedCategories]
  )

  useEffect(() => {
    filterCosts(costs)
  }, [selectedCategories, costs, filterCosts])

  const getCostsForExport = useCallback((): ExportCost[] => {
    return Object.keys(filteredCosts).map((key) => {
      const exportCost: ExportCost = {
        date: key,
        total: filteredCosts[key].total.toString(),
      }

      Object.keys(filteredCosts[key].details).forEach(
        (category) =>
          (exportCost[category] =
            filteredCosts[key].details[category].toString())
      )

      return exportCost
    })
  }, [filteredCosts])

  return (
    <div className={styles.Analitics}>
      <Row gutter={[0, 20]}>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <div className={styles.Analitics__Range}>
            <DateRangePicker onSelect={rangeSelectHandler} />
          </div>
          {categories.length > 0 && (
            <div className={styles.Analitics__Categories}>
              <CategoiesPicker
                categories={categories}
                onSelect={categoriesSelectHandler}
              />
            </div>
          )}
          {showGraphs && (
            <ExportCSV fileName={filename} csvData={getCostsForExport()} />
          )}
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          {showGraphs && <StatsLineChart costs={filteredCosts} />}
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          {showGraphs && (
            <PieChart categories={selectedCategories} costs={filteredCosts} />
          )}
        </Col>
      </Row>
    </div>
  )
}

export { Analitics }
