// components/AddressPopup.jsx
"use client"

import { useEffect, useRef } from 'react'
import { Navigation, MapPin, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAddressStore } from '@/store/useAddressStore'

const AddressPopup = () => {
  const {
    isAddressPopupOpen,
    setAddressPopupOpen,
    mapLocation,
    mapAddress,
    mapSuggestions,
    isMapLoading,
    isLocating,
    setMapLocation,
    setMapAddress,
    setMapSuggestions,
    setMapLoading,
    setLocating,
    addAddress
  } = useAddressStore()

  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    const hasAddress = localStorage.getItem('userAddress')
    if (!hasAddress) {
      setTimeout(() => setAddressPopupOpen(true), 1000)
    }
  }, [setAddressPopupOpen])

  useEffect(() => {
    if (isAddressPopupOpen && !window.L) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
        }
      }
    } else if (isAddressPopupOpen && window.L) {
      setTimeout(initMap, 100)
    }
  }, [isAddressPopupOpen])

  const initMap = () => {
    if (!window.L) {
      console.error('Leaflet not loaded')
      return
    }

    const defaultLat = 24.8607
    const defaultLng = 67.0011

    const map = window.L.map(mapRef.current).setView([defaultLat, defaultLng], 13)

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    const customIcon = window.L.divIcon({
      html: `<div style="background-color: #2563eb; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    })

    const marker = window.L.marker([defaultLat, defaultLng], {
      draggable: true,
      icon: customIcon
    }).addTo(map)

    marker.on('dragend', function() {
      const position = marker.getLatLng()
      reverseGeocode(position.lat, position.lng)
    })

    map.on('click', function(e) {
      marker.setLatLng(e.latlng)
      reverseGeocode(e.latlng.lat, e.latlng.lng)
    })

    mapInstanceRef.current = map
    markerRef.current = marker
  }

  // Get Current Location
  const getCurrentLocation = () => {
    setLocating(true)
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      setLocating(false)
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        setMapLocation({ lat, lng })
        
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16)
          markerRef.current.setLatLng([lat, lng])
        }

        reverseGeocode(lat, lng)
        setLocating(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        let errorMessage = 'Unable to get your current location. '
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.'
            break
          default:
            errorMessage += 'An unknown error occurred.'
        }
        alert(errorMessage)
        setLocating(false)
      },
      options
    )
  }

  // Reverse Geocoding
  const reverseGeocode = async (lat, lng) => {
    try {
      setMapLoading(true)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`
      )
      
      const data = await response.json()
      
      if (data && data.address) {
        const addr = data.address
        
        const building = addr.building || addr.house_number || ''
        const house = addr.house || ''
        const road = addr.road || ''
        const neighbourhood = addr.neighbourhood || addr.suburb || ''
        const city = addr.city || addr.town || addr.village || addr.county || ''
        const state = addr.state || ''
        
        let formattedAddress = ''
        if (building) formattedAddress += `${building}, `
        if (house) formattedAddress += `${house}, `
        if (road) formattedAddress += `${road}, `
        if (neighbourhood) formattedAddress += `${neighbourhood}, `
        if (city) formattedAddress += `${city}`
        if (state && city !== state) formattedAddress += `, ${state}`
        
        formattedAddress = formattedAddress.replace(/,\s*$/, '')
        
        setMapAddress(formattedAddress || data.display_name)
        setMapLocation({ lat, lng })
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      setMapAddress(`Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    } finally {
      setMapLoading(false)
    }
  }

  // Address Search
  const searchAddress = async (query) => {
    if (!query.trim()) return []

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=pk&limit=5&addressdetails=1`
      )
      
      const data = await response.json()
      return data.map(item => ({
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        address: item.address
      }))
    } catch (error) {
      console.error('Address search error:', error)
      return []
    }
  }

  // Handle address input change
  const handleAddressChange = (value) => {
    setMapAddress(value)
    setMapSuggestions([])
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    if (value.length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchAddress(value)
        setMapSuggestions(results)
      }, 500)
    }
  }

  // Select suggestion
  const selectSuggestion = (suggestion) => {
    setMapAddress(suggestion.display_name)
    setMapLocation({ lat: suggestion.lat, lng: suggestion.lon })
    setMapSuggestions([])
    
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([suggestion.lat, suggestion.lon], 16)
      markerRef.current.setLatLng([suggestion.lat, suggestion.lon])
    }
  }

  // Save Address
  const saveAddress = () => {
    if (!mapLocation || !mapAddress.trim()) {
      alert('Please select a location first')
      return
    }

    const addressData = {
      label: 'Home',
      address: mapAddress,
      longitude: mapLocation.lng,
      latitude: mapLocation.lat,
      isDefault: true
    }

    // Save to store
    addAddress(addressData)
    setAddressPopupOpen(false)
  }

  return (
    <Dialog open={isAddressPopupOpen} onOpenChange={setAddressPopupOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-xl font-bold">Select Your Delivery Address</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Map Section */}
          <Card className="py-0!">
            <CardContent className="p-0">
              <div className="h-64 bg-muted rounded-t-lg overflow-hidden">
                <div ref={mapRef} className="w-full h-full"></div>
              </div>
              <div className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin size={16} />
                  Click on the map to set your exact location or use current location below
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Address Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Address</label>
              <div className="relative">
                <Input
                  type="text"
                  value={mapAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="Enter your complete address (house number, street, area, city)..."
                  className="w-full"
                />
                
                {mapSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {mapSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0 transition-colors"
                      >
                        <div className="text-sm">
                          {suggestion.display_name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={getCurrentLocation}
              disabled={isLocating}
              variant="outline"
              className="w-full"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Your Precise Location...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Use My Current Precise Location
                </>
              )}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setAddressPopupOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={saveAddress}
              disabled={!mapLocation || !mapAddress.trim() || isMapLoading}
              className="flex-1"
            >
              {isMapLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Address & Continue'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddressPopup