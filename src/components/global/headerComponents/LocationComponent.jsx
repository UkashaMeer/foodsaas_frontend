// components/headerComponents/LocationComponent.jsx
"use client"

import { ChevronDown, MapPin, Edit, MapPinCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAddressStore } from '@/store/useAddressStore'
import { cn } from '@/lib/utils'
import AddressPopup from '../AddressPopup'

export default function LocationComponent() {
  const {
    selectedAddress,
    setAddressPopupOpen
  } = useAddressStore()

  const getDisplayAddress = () => {
    if (!selectedAddress) return 'Select Delivery Address'
    
    const addressParts = selectedAddress.address.split(',')
    if (addressParts.length > 2) {
      // For mobile, show only the most important part
      return addressParts[0]?.trim() || selectedAddress.address
    }
    return selectedAddress.address
  }

  const getShortAddress = () => {
    if (!selectedAddress) return 'Select Address'
    
    const addressParts = selectedAddress.address.split(',')
    // For very small screens, show only first part
    return addressParts[0]?.trim() || 'Address'
  }

  return (
    <>
      {/* Desktop/Tablet Version */}
      <div className="hidden sm:flex items-center gap-2">
        <div 
          className='flex items-center gap-2 cursor-pointer group min-w-0 max-sm:flex-1' 
          onClick={() => setAddressPopupOpen(true)}
        >
          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
          <div className='flex flex-col min-w-0 flex-1'>
            <div className='flex items-center gap-1'>
              <h4 className='text-sm font-semibold whitespace-nowrap'>
                Deliver to
              </h4>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </div>
            <span className='text-xs text-muted-foreground truncate'>
              {getDisplayAddress()}
            </span>
          </div>
        </div>
        
        {selectedAddress && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAddressPopupOpen(true)}
            className="h-8 px-2 flex-shrink-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Mobile Version */}
      <div className="sm:hidden w-full">
        <div className="flex items-center justify-between gap-2">
          <div 
            className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0 bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg px-3 py-2"
            onClick={() => setAddressPopupOpen(true)}
          >
            <MapPinCheck className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  Delivering to
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </div>
              <span className={cn(
                "text-sm font-medium truncate",
                !selectedAddress && "text-muted-foreground"
              )}>
                {getShortAddress()}
              </span>
            </div>
          </div>

          {selectedAddress && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAddressPopupOpen(true)}
              className="h-9 px-2 flex-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <AddressPopup />
    </>
  )
}