// ==========================================
// Page Module: Blog
// Parent route wrapper providing an Outlet for nested blog routes (list, create, update)
// ==========================================

import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * Blog module route outlet wrapper.
 */
export default function Blog() {
  return (
    <>
      <Outlet/>
    </>
  )
}
