import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 focus-visible:ring-[var(--ring)]',
        destructive:
          'bg-[var(--destructive)] text-white hover:opacity-90 focus-visible:ring-[var(--destructive)]',
        outline:
          'border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] focus-visible:ring-[var(--ring)]',
        secondary:
          'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-80 focus-visible:ring-[var(--ring)]',
        ghost:
          'hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:ring-[var(--ring)]',
        link: 'text-[var(--foreground)] underline-offset-4 hover:underline focus-visible:ring-[var(--ring)]',
        accent:
          'bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 focus-visible:ring-[var(--accent)]',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-base tracking-wide uppercase',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { buttonVariants }
