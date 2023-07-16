import {useEffect, useState} from "react";

// функция извлечения или_записи значений в хранилище браузера,
export function useLocalStorage<T>(key: string, initValue: T | (()=>T)) {
    // за счет хука состояния при первом рендеринге получаем значение из хранилища, или запускаем переданную ф-цию
    const [value, setValue] = useState<T>(()=>{
        const jsonValue = localStorage.getItem(key);
        if (jsonValue == null) {
            if(typeof initValue === 'function') {
                return (initValue as ()=>T)()
            } else {
                return initValue
            }
        } else {
            return JSON.parse(jsonValue)
        }
    })
    useEffect(()=>{
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue] as [T, typeof setValue];
}
