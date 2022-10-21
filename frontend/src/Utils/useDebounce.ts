import React from "react"

/**
 * Source: https://usehooks-typescript.com/react-hook/use-debounce and https://github.com/knaw-huc/micro-annotator/blob/055bf5a51a27c1b527f5583307577d91b4878ccc/gui/src/util/useDebounce.ts
 */

export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}