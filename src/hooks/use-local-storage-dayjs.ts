import dayjs from 'dayjs';
import useLocalStorage from './use-local-storage';

/**
 * Wrapper for dayjs objects which should be persisted to localstorage
 * with regular useLocalStorage hook, dayjs objects will not be deserialised correctly
 * @param key to save against in localstorage
 * @param initialValue
 * @returns dayjs
 */
const useLocalStorageDayjs = (key: string, initialValue: dayjs.Dayjs) => {
    const [value, setValue] = useLocalStorage<dayjs.Dayjs>(key, initialValue);
    const storedValue = dayjs(value);
    return [storedValue, setValue] as const;
}

export default useLocalStorageDayjs;
