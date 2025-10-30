"use client"

import { useGetAllProducts } from '@/api/admin/product/useGetAllProducts'
import { Spinner } from '@/components/ui/spinner'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function Products() {

  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["items"],
    queryFn: useGetAllProducts
  })

  if (isPending) {
    return <div className="w-full min-h-screen flex flex-col gap-2 items-center justify-center">
      <Spinner className="size-8 text-primary" />
      <span className="text-primary text-lg font-semibold">Loading...</span>
    </div>
  }

  if (isSuccess) {
    console.log(data)
  }

  return (
    <div>Products</div>
  )
}
