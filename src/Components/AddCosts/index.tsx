import { Input } from 'antd'
import { onValue, set } from 'firebase/database'
import moment from 'moment'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { currentDateSelector } from '../../Store/Calendar/selectors'
import { auth, costByDateRef, userCategories } from '../../utils/firebase'
import styles from './styles.module.scss'

type Costs = {
    [key: string]: string
}

type CostsServer = {
    dateTime: string
    details: {
        [key: string]: string
    }
    total: string
}

//Используется только с календарем и авторизацией
export const AddCosts = () => { 
    const currentDate = useSelector(currentDateSelector)
    const [categories, setCategories] = useState<Array<string>>([])
    const [costs, setCosts] = useState<Costs>({})
    
    useEffect(() => {
        if (auth?.currentUser?.uid) {
            onValue(userCategories(auth.currentUser.uid), (snapshot) => {
                setCategories(snapshot.val() ? snapshot.val() : [])
            })

            onValue(costByDateRef(auth.currentUser.uid, currentDate.format('DD-MM-YYYY')), (snapshot) => { 
                const costsFromServer: CostsServer = snapshot.val()
                setCosts(prevState => ({...prevState, ...costsFromServer.details}))
            })
        }
    }, [currentDate]);

    const changeHandler = (e: ChangeEvent<HTMLInputElement>, category: string) => { 
        e.target.value = e.target.value.replace(/[^0-9+-]/g, '').replace('++', '+').replace('--', '-')
        if (+e.target.value === 0) {e.target.value = ''}

        setCosts((prevState) => ({
            ...prevState,
            [category]: e.target.value
        }));
    }

    const blurHandler = (e: ChangeEvent<HTMLInputElement>, category: string) => { 
        e.target.value = /[0-9]/g.test(e.target.value.slice(-1)) ? e.target.value : e.target.value + '0'

        // eslint-disable-next-line
        const toSave =  e.target.value ? eval(e.target.value) : ''

        const newCosts = {...costs, [category]: toSave}

        setCosts(newCosts)
        saveCostsToFirebase(newCosts)
    }

    const keyDowHandler = (e: any) => {
        if(e.keyCode === 13) {
            e.target.blur()
        }
    };

    const saveCostsToFirebase = (costsToSave: Costs) => {
        if (auth?.currentUser?.uid) {
            const info = {
                total: 0,
                dateTime: currentDate.format('x')
            };
    
            for (let prop in costsToSave) {
                if (!costsToSave[prop]) { costsToSave[prop] = '0' }
                else { info.total += +costsToSave[prop] }
            }
    
            set(costByDateRef(auth.currentUser.uid, currentDate.format('DD-MM-YYYY')), {...info, details: costsToSave });
        }
    };
    

    return <div className={ styles.AddCosts }>
        {categories.length > 0 && 
            categories.map(category => 
                <Input
                    value={costs[category]}
                    className={styles.AddCosts__Input}
                    onChange={e => changeHandler(e, category)}
                    onBlur={e => blurHandler(e, category)}
                    onKeyDown={keyDowHandler}
                    key={category}
                    suffix={<div className={styles.AddCosts__Label}>{ category }</div>}
                />
            )
        }
    </div>
}