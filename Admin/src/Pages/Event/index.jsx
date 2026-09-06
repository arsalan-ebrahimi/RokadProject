// ==========================================
// Page Module: Event
// Parent route wrapper providing an Outlet for nested event routes (list, create, update)
// ==========================================

import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * Event module route outlet wrapper.
 */
export default function Event() {
  return (
    <>
      <Outlet/>
    </>
  )
}
