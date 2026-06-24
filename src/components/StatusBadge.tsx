import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TransactionStatus } from "@/models/transaction"

const STATUS_STYLES: Record<TransactionStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
  SUCCESS: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
  FAILED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
}

const STATUS_LABELS: Record<TransactionStatus, string> = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATUS_STYLES[status])}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
