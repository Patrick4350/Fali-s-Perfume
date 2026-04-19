'use client'

import { useEffect, useState } from 'react'
// useState is used by useRealtimeStock hook below
import { createClient } from '@/lib/supabase/client'

interface StockState {
  [variantId: string]: number
}

interface RealtimeStockProps {
  productId: string
  initialStock: StockState
  onStockChange?: (variantId: string, qty: number) => void
}

export function RealtimeStock({
  productId,
  onStockChange,
}: Omit<RealtimeStockProps, 'initialStock'> & { initialStock: StockState }) {
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`stock:${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'product_variants',
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          const { id, stock_quantity } = payload.new as { id: string; stock_quantity: number }
          setStock((prev) => ({ ...prev, [id]: stock_quantity }))
          onStockChange?.(id, stock_quantity)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [productId, onStockChange])

  return null
}

export function useRealtimeStock(productId: string, initialStock: StockState) {
  const [stock, setStock] = useState<StockState>(initialStock)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`stock:${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'product_variants',
          filter: `product_id=eq.${productId}`,
        },
        (payload) => {
          const { id, stock_quantity } = payload.new as { id: string; stock_quantity: number }
          setStock((prev) => ({ ...prev, [id]: stock_quantity }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [productId])

  return stock
}
