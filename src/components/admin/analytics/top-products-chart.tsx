'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { Currency } from '@/lib/currency'

interface TopProductsChartProps {
  data: { name: string; revenue: number; units: number }[]
  currency: Currency
}

export function TopProductsChart({ data, currency }: TopProductsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => formatCurrency(v, currency)}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: string) => (v.length > 18 ? v.slice(0, 18) + '…' : v)}
        />
        <Tooltip
          formatter={(value: number, _: string, entry) => [
            `${formatCurrency(value, currency)} · ${entry.payload.units} units`,
            'Revenue',
          ]}
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="revenue" fill="var(--foreground)" radius={[0, 4, 4, 0]} opacity={0.85} />
      </BarChart>
    </ResponsiveContainer>
  )
}
