"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TransactionStatus } from "@/models/transaction"

const STATUS_OPTIONS: { label: string; value: TransactionStatus | "ALL" }[] = [
  { label: "Semua Status", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Success", value: "SUCCESS" },
  { label: "Failed", value: "FAILED" },
]

interface TransactionFilterProps {
  search: string
  status: TransactionStatus | "ALL"
  onSearchChange: (value: string) => void
  onStatusChange: (value: TransactionStatus | "ALL") => void
}

export function TransactionFilter({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TransactionFilterProps) {
  const [localSearch, setLocalSearch] = useState(search)

  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch)
      }
    }, 400)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="Cari nama pengirim..."
        value={localSearch}
        onChange={(event) => setLocalSearch(event.target.value)}
        className="sm:max-w-xs"
      />
      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value as TransactionStatus | "ALL")}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
