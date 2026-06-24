import { api } from "@/api/axios"
import type {
  CreateTransactionInput,
  Transaction,
  TransactionListParams,
  TransactionListResult,
  TransactionStatus,
} from "@/models/transaction"

export async function fetchTransactions(
  params: TransactionListParams
): Promise<TransactionListResult> {
  const filters = {
    status: params.status,
    search: params.search || undefined,
  }

  const response = await api.get<Transaction[]>("/transactions", {
    params: {
      ...filters,
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      order: params.order,
    },
  })

  const totalCountHeader = response.headers["x-total-count"]

  let total: number
  if (totalCountHeader !== undefined) {
    total = Number(totalCountHeader)
  } else {
    const countResponse = await api.get<Transaction[]>("/transactions", {
      params: filters,
    })
    total = countResponse.data.length
  }

  return { data: response.data, total }
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const response = await api.post<Transaction>("/transactions", input)
  return response.data
}

export async function updateTransactionStatus(
  id: string,
  status: TransactionStatus
): Promise<Transaction> {
  const response = await api.put<Transaction>(`/transactions/${id}`, {
    status,
  })
  return response.data
}
