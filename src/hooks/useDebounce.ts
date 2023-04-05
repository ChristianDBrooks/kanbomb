import { useRef } from "react";

function useDebounce() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const debounce = (action: Function, debounceInMS = 500) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const ref = setTimeout(() => action(), debounceInMS)
    timeoutRef.current = ref;
  }
  return { debounce };
}

export default useDebounce;