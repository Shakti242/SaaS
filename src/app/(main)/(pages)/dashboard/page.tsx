import React from 'react'

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-4 relative h-screen">
      <h1 className="text-4xl font-bold sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b bg-gradient-to-r from-white via-purple-500 to-white text-transparent bg-clip-text">
        Dashboard
      </h1>
    </div>
  )
}

export default DashboardPage
