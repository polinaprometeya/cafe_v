
import React from 'react'
import './Layout.css'

export default function Header() {
  return (
    <div className='header'>
      <div className='info'>
        <p>Café Vesuvius</p>
      </div>
      <div className='links'>
        <a href="/menu">Menu</a>
        <a href="/reservation">Table Reservation</a>
      </div>
    </div>
  )
}