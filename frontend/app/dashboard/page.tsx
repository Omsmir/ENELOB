"use client"
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import React from 'react'
import dynamic from 'next/dynamic'

const DashBoardLayout = dynamic(() => import("@/components/dashboard/settingLayout"))
const page = () => {
  const {update}= useSession()
  return (
    <div className='flex flex-col pt-16'>
      <DashBoardLayout />
    </div>
  )
}

export default page
