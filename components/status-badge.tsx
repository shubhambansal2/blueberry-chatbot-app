import { CheckIcon as IconCheck, ClockIcon as IconClock, XIcon as IconX } from 'lucide-react'
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
  "absolute -right-2 -top-2 rounded-full p-1",
  {
    variants: {
      variant: {
        success: "bg-green-500",
        pending: "bg-yellow-500",
        error: "bg-red-500",
      },
    },
    defaultVariants: {
      variant: "pending",
    },
  }
)

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  status: 'none' | 'pending' | 'successful' | 'error'
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  if (status === 'none') return null

  return (
    <div className={cn(badgeVariants({ variant: variant || status === 'successful' ? 'success' : status === 'pending' ? 'pending' : 'error' }))}>
      {status === 'successful' && <IconCheck className="w-4 h-4 text-white" />}
      {status === 'pending' && <IconClock className="w-4 h-4 text-white" />}
      {status === 'error' && <IconX className="w-4 h-4 text-white" />}
    </div>
  )
}

