import React from 'react'
import dynamic from 'next/dynamic'

const DashBoardLayout = dynamic(() => import("@/components/dashboard/settingLayout"))
const page = () => {
  return (
    <div className='flex flex-col pt-16'>
      <DashBoardLayout />
    </div>
  )
}

export default page
