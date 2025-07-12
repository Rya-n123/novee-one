// hooks/useDebounce.ts
import { useEffect } from 'react'

export default function useDebounce<T>(value: T, delay: number, callback: (val: T) => void) {
    useEffect(() => {
        const handler = setTimeout(() => {
            callback(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value])
}
