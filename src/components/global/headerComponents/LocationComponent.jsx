"use client"

import { ChevronDown, MapPin, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AddressPopup from '../AddressPopup'
import { useAddressStore } from '@/store/useAddressStore'

export default function LocationComponent() {
  const {
    selectedAddress,
    setAddressPopupOpen
  } = useAddressStore()

  const getDisplayAddress = () => {
    if (!selectedAddress) return 'Select Delivery Address'
    
    const addressParts = selectedAddress.address.split(',')
    if (addressParts.length > 2) {
      return addressParts.slice(0, 2).join(', ').trim()
    }
    return selectedAddress.address
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div 
          className='flex items-center gap-2 cursor-pointer' 
          onClick={() => setAddressPopupOpen(true)}
        >
          <MapPin className="w-5 h-5 text-primary" />
          <div className='flex flex-col'>
            <div className='flex items-center gap-1'>
              <h4 className='text-sm font-semibold'>
                Deliver to
              </h4>
              <ChevronDown className="w-4 h-4" />
            </div>
            <span className='text-xs text-muted-foreground'>
              {getDisplayAddress()}
            </span>
          </div>
        </div>
        
        {selectedAddress && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAddressPopupOpen(true)}
            className="h-8 px-2"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </div>

      <AddressPopup />
    </>
  )
}