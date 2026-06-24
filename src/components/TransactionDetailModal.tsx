"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/StatusBadge"
import { formatDate, formatRupiah } from "@/lib/utils"
import type { Transaction } from "@/models/transaction"

interface TransactionDetailModalProps {
  transaction: Transaction | null
  onOpenChange: (open: boolean) => void
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

export function TransactionDetailModal({
  transaction,
  onOpenChange,
}: TransactionDetailModalProps) {
  return (
    <Dialog open={Boolean(transaction)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
        </DialogHeader>
        {transaction && (
          <div className="divide-y">
            <DetailRow label="ID" value={transaction.id} />
            <DetailRow label="Nama Pengirim" value={transaction.sender_name} />
            <DetailRow label="Nomor Rekening" value={transaction.account_number} />
            <DetailRow label="Bank" value={transaction.bank} />
            <DetailRow label="Jumlah" value={formatRupiah(transaction.amount)} />
            <DetailRow label="Biaya Admin" value={formatRupiah(transaction.admin_fee)} />
            <DetailRow label="Status" value={<StatusBadge status={transaction.status} />} />
            <DetailRow label="Catatan" value={transaction.note || "-"} />
            <DetailRow label="Tanggal" value={formatDate(transaction.created_at)} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
