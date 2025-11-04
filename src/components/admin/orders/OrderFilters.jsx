// components/OrderFilters.jsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Filter, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import useOrderStore from '@/store/useOrderStore'
import { OrderStatusBadge } from './OrderStatusBadge'

const statusOptions = ['PENDING', 'ACCEPTED', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED']
const paymentStatusOptions = ['PENDING', 'PAID', 'FAILED']
const paymentMethodOptions = ['cod', 'card']

export const OrderFilters = () => {
  const { filters, searchQuery, setFilters, setSearchQuery, clearFilters, orders } = useOrderStore()
  
  const cities = [...new Set(orders.map(order => order.city))]
  const [date, setDate] = useState({
    from: filters.dateRange.from,
    to: filters.dateRange.to,
  })

  const handleStatusToggle = (status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status]
    setFilters({ ...filters, status: newStatus })
  }

  const handlePaymentStatusToggle = (paymentStatus) => {
    const newPaymentStatus = filters.paymentStatus.includes(paymentStatus)
      ? filters.paymentStatus.filter(s => s !== paymentStatus)
      : [...filters.paymentStatus, paymentStatus]
    setFilters({ ...filters, paymentStatus: newPaymentStatus })
  }

  const handlePaymentMethodToggle = (method) => {
    const newPaymentMethod = filters.paymentMethod.includes(method)
      ? filters.paymentMethod.filter(m => m !== method)
      : [...filters.paymentMethod, method]
    setFilters({ ...filters, paymentMethod: newPaymentMethod })
  }

  const handleCityToggle = (city) => {
    const newCity = filters.city.includes(city)
      ? filters.city.filter(c => c !== city)
      : [...filters.city, city]
    setFilters({ ...filters, city: newCity })
  }

  const handleDateSelect = (range) => {
    setDate(range)
    setFilters({
      ...filters,
      dateRange: {
        from: range?.from || null,
        to: range?.to || null,
      },
    })
  }

  const hasActiveFilters = 
    filters.status.length > 0 ||
    filters.paymentStatus.length > 0 ||
    filters.paymentMethod.length > 0 ||
    filters.city.length > 0 ||
    filters.dateRange.from ||
    filters.dateRange.to

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search orders by order number, customer name, phone, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-2xl"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Status
              {filters.status.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onChange={() => handleStatusToggle(status)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`status-${status}`} className="text-sm">
                    <OrderStatusBadge status={status} />
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Payment Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Payment Status
              {filters.paymentStatus.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.paymentStatus.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              {paymentStatusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`payment-${status}`}
                    checked={filters.paymentStatus.includes(status)}
                    onChange={() => handlePaymentStatusToggle(status)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`payment-${status}`} className="text-sm">
                    <OrderStatusBadge status={status} type="payment" />
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Payment Method Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Payment Method
              {filters.paymentMethod.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.paymentMethod.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              {paymentMethodOptions.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`method-${method}`}
                    checked={filters.paymentMethod.includes(method)}
                    onChange={() => handlePaymentMethodToggle(method)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`method-${method}`} className="text-sm capitalize">
                    {method}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* City Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              City
              {filters.city.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.city.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 max-h-60 overflow-y-auto">
            <div className="space-y-2">
              {cities.map((city) => (
                <div key={city} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`city-${city}`}
                    checked={filters.city.includes(city)}
                    onChange={() => handleCityToggle(city)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`city-${city}`} className="text-sm">
                    {city}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status.map(status => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              Status: <OrderStatusBadge status={status} />
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStatusToggle(status)}
              />
            </Badge>
          ))}
          {filters.paymentStatus.map(status => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              Payment: <OrderStatusBadge status={status} type="payment" />
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handlePaymentStatusToggle(status)}
              />
            </Badge>
          ))}
          {filters.paymentMethod.map(method => (
            <Badge key={method} variant="secondary" className="flex items-center gap-1 capitalize">
              Method: {method}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handlePaymentMethodToggle(method)}
              />
            </Badge>
          ))}
          {filters.city.map(city => (
            <Badge key={city} variant="secondary" className="flex items-center gap-1">
              City: {city}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCityToggle(city)}
              />
            </Badge>
          ))}
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {filters.dateRange.from && format(filters.dateRange.from, "MMM dd, y")}
              {filters.dateRange.to && ` - ${format(filters.dateRange.to, "MMM dd, y")}`}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleDateSelect({ from: null, to: null })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}