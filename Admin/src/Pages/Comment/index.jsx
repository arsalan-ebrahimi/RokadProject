// ==========================================
// Page Module: Comment
// Parent route wrapper providing an Outlet for nested comment routes (list, create, update)
// ==========================================

import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * Comment module route outlet wrapper.
 */
export default function Comment() {
  return (
    <>
      <Outlet/>
    </>
  )
}
