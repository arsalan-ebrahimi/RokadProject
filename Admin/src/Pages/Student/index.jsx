// ==========================================
// Page Module: Student
// Parent route wrapper providing an Outlet for nested student routes (list, create, update)
// ==========================================

import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * Student module route outlet wrapper.
 */
export default function Student() {
  return (
    <>
      <Outlet/>
    </>
  )
}
