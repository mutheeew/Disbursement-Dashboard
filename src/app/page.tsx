"use client"

import { Suspense, useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/Header"
import { TransactionFilter } from "@/components/TransactionFilter"
import { TransactionTable } from "@/components/TransactionTable"
import { TransactionDetailModal } from "@/components/TransactionDetailModal"
import { UpdateStatusDialog } from "@/components/UpdateStatusDialog"
import { CreateTransactionForm } from "@/components/CreateTransactionForm"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useTransactionsQuery } from "@/hooks/useTransactions"
import { formatDate, formatRupiah } from "@/lib/utils"
import type { Transaction, TransactionStatus } from "@/models/transaction"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"

const PAGE_SIZE = 10

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: isAuthLoading } = useAuth()

  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [status, setStatus] = useState<TransactionStatus | "ALL">(
    (searchParams.get("status") as TransactionStatus | null) ?? "ALL"
  )
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1))

  const [detailTransaction, setDetailTransaction] = useState<Transaction | null>(null)
  const [statusAction, setStatusAction] = useState<{
    transaction: Transaction
    status: TransactionStatus
  } | null>(null)

  const updateUrl = useCallback(
    (next: { search?: string; status?: TransactionStatus | "ALL"; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString())
      const nextSearch = next.search ?? search
      const nextStatus = next.status ?? status
      const nextPage = next.page ?? page

      if (nextSearch) params.set("search", nextSearch)
      else params.delete("search")

      if (nextStatus !== "ALL") params.set("status", nextStatus)
      else params.delete("status")

      if (nextPage > 1) params.set("page", String(nextPage))
      else params.delete("page")

      router.replace(`/?${params.toString()}`)
    },
    [router, search, status, page, searchParams]
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
    updateUrl({ search: value, page: 1 })
  }

  const handleStatusChange = (value: TransactionStatus | "ALL") => {
    setStatus(value)
    setPage(1)
    updateUrl({ status: value, page: 1 })
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    updateUrl({ page: nextPage })
  }

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search,
      status: status === "ALL" ? undefined : status,
    }),
    [page, search, status]
  )

  const { data, isLoading, isError, isFetching } = useTransactionsQuery(queryParams)

  const transactions = data?.data ?? []
  const total = data?.total ?? 0
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function handleExportCsv() {
    const header = [
      "ID",
      "Nama Pengirim",
      "Bank",
      "Jumlah",
      "Biaya Admin",
      "Status",
      "Tanggal",
    ]
    const rows = transactions.map((trx) => [
      trx.id,
      trx.sender_name,
      trx.bank,
      formatRupiah(trx.amount),
      formatRupiah(trx.admin_fee),
      trx.status,
      formatDate(trx.created_at),
    ])

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `transaksi-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isAuthLoading || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TransactionFilter
            search={search}
            status={status}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportCsv}
              disabled={transactions.length === 0}
            >
              <Download className="size-4" />
              Export CSV
            </Button>
            {user.role === "operator" && <CreateTransactionForm />}
          </div>
        </div>

        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          isError={isError}
          role={user.role}
          onViewDetail={setDetailTransaction}
          onUpdateStatus={(transaction, nextStatus) =>
            setStatusAction({ transaction, status: nextStatus })
          }
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {from}–{to} dari {total} transaksi
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="size-4" />
              Sebelumnya
            </Button>
            <span className="text-sm text-muted-foreground">
              Halaman {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => handlePageChange(page + 1)}
            >
              Selanjutnya
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </main>

      <TransactionDetailModal
        transaction={detailTransaction}
        onOpenChange={(open) => !open && setDetailTransaction(null)}
      />

      <UpdateStatusDialog
        transaction={statusAction?.transaction ?? null}
        action={statusAction?.status ?? null}
        onOpenChange={(open) => !open && setStatusAction(null)}
      />
    </div>
  )
}
