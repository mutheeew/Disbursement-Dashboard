"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { StatusBadge } from "@/components/StatusBadge"
import { formatDate, formatRupiah } from "@/lib/utils"
import type { Role, Transaction, TransactionStatus } from "@/models/transaction"
import { AlertCircle, Check, Eye, X } from "lucide-react"

interface TransactionTableProps {
  transactions: Transaction[]
  isLoading: boolean
  isError: boolean
  role: Role
  onViewDetail: (transaction: Transaction) => void
  onUpdateStatus: (transaction: Transaction, status: TransactionStatus) => void
}

export function TransactionTable({
  transactions,
  isLoading,
  isError,
  role,
  onViewDetail,
  onUpdateStatus,
}: TransactionTableProps) {
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Gagal memuat data</AlertTitle>
        <AlertDescription>Terjadi kesalahan saat mengambil data transaksi.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama Pengirim</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Biaya Admin</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                Tidak ada transaksi ditemukan.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="cursor-pointer"
                onClick={() => onViewDetail(transaction)}
              >
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.sender_name}</TableCell>
                <TableCell>{transaction.bank}</TableCell>
                <TableCell>{formatRupiah(transaction.amount)}</TableCell>
                <TableCell>{formatRupiah(transaction.admin_fee)}</TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(transaction.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className="flex items-center justify-end gap-1"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetail(transaction)}
                      title="Detail"
                    >
                      <Eye className="size-4" />
                    </Button>
                    {role === "admin" && transaction.status === "PENDING" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-emerald-600 hover:text-emerald-700"
                          onClick={() => onUpdateStatus(transaction, "SUCCESS")}
                          title="Setujui"
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => onUpdateStatus(transaction, "FAILED")}
                          title="Tolak"
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
