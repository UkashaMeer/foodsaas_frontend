import { ChevronDown, MapPinCheck } from 'lucide-react'
import React from 'react'

export default function LocationComponent() {
  return (
    <div>
        {/* Button */}
        <div className='flex items-center gap-2 cursor-pointer'>
            <MapPinCheck size={30} strokeWidth={2} />
            <div className='flex flex-col'>
                <div className='flex items-center gap-1'>
                <h4 className='text-sm font-bold hover:underline'>
                    Deliver to
                </h4>
                    <ChevronDown size={18} />
                </div>
                <span className='text-xs hover:underline'>Karachi, Sindh</span>
            </div>
        </div>
    </div>
  )
}
