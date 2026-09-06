// ==========================================
// Page Module: Award
// Parent route wrapper providing an Outlet for nested award/honor routes (list, create, update)
// ==========================================

import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * Award module route outlet wrapper.
 */
export default function Award() {
  return (
    <>
      <Outlet/>
    </>
  )
}
