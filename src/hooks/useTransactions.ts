"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createTransaction,
  fetchTransactions,
  updateTransactionStatus,
} from "@/api/transactions"
import type {
  CreateTransactionInput,
  TransactionListParams,
  TransactionStatus,
} from "@/models/transaction"

const TRANSACTIONS_KEY = "transactions"

export function useTransactionsQuery(params: TransactionListParams) {
  return useQuery({
    queryKey: [TRANSACTIONS_KEY, params],
    queryFn: () => fetchTransactions(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] })
    },
  })
}

export function useUpdateTransactionStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TransactionStatus }) =>
      updateTransactionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] })
    },
  })
}
