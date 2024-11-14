"use client";

// 검색기능시 디바운싱을 사용하기 위함
import { useEffect, useState } from "react";

// 디바운싱을 위한 성능 최적화
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  //값이 변할 때마다 타이머 초기화
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);

      return () => {
        clearTimeout(timer);
      }; //value 변경될때마다 clear
    }, delay);
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
