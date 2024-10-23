"use client"
import { useParams } from 'next/navigation'
import React from 'react'

export default function Detail () {
    const params = useParams();
    const {id} = params;
  return (
    <div>
        <p>detail</p>
        <p>{id}</p>
    </div>
  )
}
