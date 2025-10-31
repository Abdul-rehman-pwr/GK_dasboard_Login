import React from 'react'

const OrderPreviewSkeleton = () => {
  return (
    <div className='flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen animate-pulse'>
      {/* Left Content */}
      <div className='flex-1 space-y-4'>
        {/* Header */}
        <div className='flex justify-between bg-white p-4 rounded-md shadow'>
          <div className='space-y-2'>
            <div className='w-32 h-6 bg-gray-300 rounded'></div>
            <div className='w-40 h-4 bg-gray-200 rounded'></div>
          </div>
          <div className='space-y-2 text-right'>
            <div className='w-20 h-4 bg-gray-200 rounded'></div>
            <div className='w-28 h-4 bg-gray-200 rounded'></div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className='flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-md shadow'>
          <div className='space-y-2'>
            <div className='w-40 h-4 bg-gray-300 rounded'></div>
            <div className='w-32 h-3 bg-gray-200 rounded'></div>
            <div className='w-48 h-3 bg-gray-200 rounded'></div>
            <div className='w-36 h-3 bg-gray-200 rounded'></div>
            <div className='w-28 h-3 bg-gray-200 rounded'></div>
          </div>
          <div className='space-y-2'>
            <div className='w-40 h-4 bg-gray-300 rounded'></div>
            <div className='w-32 h-3 bg-gray-200 rounded'></div>
            <div className='w-40 h-3 bg-gray-200 rounded'></div>
          </div>
        </div>

        {/* Items Table */}
        <div className='bg-white rounded-md shadow p-4 space-y-3'>
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className='flex justify-between items-center gap-3'>
              <div className='w-1/4 h-4 bg-gray-200 rounded'></div>
              <div className='w-1/4 h-4 bg-gray-200 rounded'></div>
              <div className='w-1/6 h-4 bg-gray-200 rounded'></div>
              <div className='w-1/6 h-4 bg-gray-200 rounded'></div>
              <div className='w-1/6 h-4 bg-gray-200 rounded'></div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className='bg-white rounded-md shadow p-4 space-y-3 w-full max-w-md ml-auto'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='flex justify-between items-center'>
              <div className='w-32 h-3 bg-gray-200 rounded'></div>
              <div className='w-20 h-3 bg-gray-200 rounded'></div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className='w-full lg:w-72 flex flex-col gap-4'>
        {/* Doctor Approval Card */}
        <div className='bg-white p-4 rounded-md shadow space-y-4'>
          <div className='w-1/2 h-5 bg-gray-300 rounded'></div>
          <div className='h-3 w-3/4 bg-gray-200 rounded'></div>
          <div className='h-3 w-2/3 bg-gray-200 rounded'></div>
          <div className='h-10 w-full bg-gray-300 rounded'></div>
          <div className='h-10 w-full bg-gray-200 rounded'></div>
        </div>

        {/* Postal Code & Questionnaire */}
        <div className='bg-white p-4 rounded-md shadow space-y-4'>
          <div className='w-1/2 h-4 bg-gray-300 rounded'></div>
          <div className='w-2/3 h-3 bg-gray-200 rounded'></div>
          <div className='w-1/2 h-4 bg-gray-300 rounded'></div>
          <div className='w-2/3 h-3 bg-gray-200 rounded'></div>
          <div className='w-full h-10 bg-gray-300 rounded'></div>
        </div>
      </div>
    </div>
  )
}

export default OrderPreviewSkeleton
