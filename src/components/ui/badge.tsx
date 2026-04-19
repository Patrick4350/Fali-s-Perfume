import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
        secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)]',
        accent: 'bg-[var(--accent)] text-[var(--accent-foreground)]',
        outline: 'border border-[var(--border)] text-[var(--foreground)]',
        destructive: 'bg-[var(--destructive)] text-white',
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
