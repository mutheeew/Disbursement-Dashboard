"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useUpdateTransactionStatusMutation } from "@/hooks/useTransactions"
import type { Transaction, TransactionStatus } from "@/models/transaction"

interface UpdateStatusDialogProps {
  transaction: Transaction | null
  action: TransactionStatus | null
  onOpenChange: (open: boolean) => void
}

const ACTION_LABEL: Record<string, string> = {
  SUCCESS: "menyetujui",
  FAILED: "menolak",
}

export function UpdateStatusDialog({
  transaction,
  action,
  onOpenChange,
}: UpdateStatusDialogProps) {
  const mutation = useUpdateTransactionStatusMutation()

  if (!transaction || !action) {
    return null
  }

  async function handleConfirm() {
    if (!transaction || !action) return

    try {
      await mutation.mutateAsync({ id: transaction.id, status: action })
      toast.success(
        action === "SUCCESS" ? "Transaksi berhasil disetujui" : "Transaksi berhasil ditolak"
      )
      onOpenChange(false)
    } catch {
      toast.error("Gagal memperbarui status transaksi.")
    }
  }

  return (
    <Dialog open={Boolean(transaction && action)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogDescription>
            Apakah kamu yakin ingin {ACTION_LABEL[action]} transaksi{" "}
            <span className="font-medium text-foreground">{transaction.id}</span> dari{" "}
            <span className="font-medium text-foreground">{transaction.sender_name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            variant={action === "FAILED" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Memproses..." : "Konfirmasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
