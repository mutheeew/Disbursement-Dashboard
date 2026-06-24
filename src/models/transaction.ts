export type Role = "admin" | "operator"

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED"

export const BANKS = [
  "BCA",
  "BRI",
  "BNI",
  "Mandiri",
  "BSI",
  "CIMB Niaga",
  "Permata",
  "Danamon",
  "BTN",
] as const

export type Bank = (typeof BANKS)[number]

export interface Transaction {
  id: string
  sender_name: string
  account_number: string
  bank: string
  amount: number
  admin_fee: number
  status: TransactionStatus
  note?: string
  created_at: string
}

export type CreateTransactionInput = Omit<Transaction, "id" | "created_at">

export interface TransactionListParams {
  page: number
  limit: number
  status?: TransactionStatus
  search?: string
  sortBy?: string
  order?: "asc" | "desc"
}

export interface TransactionListResult {
  data: Transaction[]
  total: number
}

export interface User {
  username: string
  role: Role
}
