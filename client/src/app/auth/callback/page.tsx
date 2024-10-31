"use client"
import React, { useEffect } from 'react'

export default function useOauth () {
  useEffect(() => {
    if (typeof window !== 'undefined') { // 클라이언트 측에서만 실행
      const params = new URLSearchParams(window.location.search);
      const token = params.get('accessToken');
      console.log(token);

      if (token) {
        sessionStorage.setItem('accessToken', token);
        window.location.href = '/toudeuk';
      }
    }
  }, []);
  return (
    <div>Loading</div>
  )
}
