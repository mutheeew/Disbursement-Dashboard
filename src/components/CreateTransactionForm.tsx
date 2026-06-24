"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCreateTransactionMutation } from "@/hooks/useTransactions"
import { BANKS } from "@/models/transaction"
import { calculateAdminFee, formatRupiah } from "@/lib/utils"
import { Plus } from "lucide-react"

const createTransactionSchema = z.object({
  sender_name: z.string().trim().min(3, "Minimal 3 karakter").max(100, "Maksimal 100 karakter"),
  account_number: z
    .string()
    .trim()
    .regex(/^\d+$/, "Hanya boleh angka")
    .min(6, "Minimal 6 digit")
    .max(20, "Maksimal 20 digit"),
  bank: z.enum(BANKS, { message: "Pilih bank tujuan" }),
  amount: z
    .number({ message: "Jumlah transfer wajib diisi" })
    .int("Harus angka bulat")
    .positive("Harus lebih dari 0")
    .min(10000, "Minimum Rp 10.000"),
  note: z.string().trim().max(255, "Maksimal 255 karakter").optional(),
})

type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>

export function CreateTransactionForm() {
  const [open, setOpen] = useState(false)
  const mutation = useCreateTransactionMutation()

  const form = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      sender_name: "",
      account_number: "",
      bank: undefined,
      amount: undefined,
      note: "",
    } as unknown as CreateTransactionFormValues,
  })

  const amount = form.watch("amount")
  const adminFee = amount && amount > 0 ? calculateAdminFee(amount) : 0

  async function onSubmit(values: CreateTransactionFormValues) {
    try {
      await mutation.mutateAsync({
        sender_name: values.sender_name,
        account_number: values.account_number,
        bank: values.bank,
        amount: values.amount,
        admin_fee: calculateAdminFee(values.amount),
        note: values.note || undefined,
        status: "PENDING",
      })
      toast.success("Transaksi berhasil dibuat")
      form.reset()
      setOpen(false)
    } catch {
      toast.error("Gagal membuat transaksi. Silakan coba lagi.")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) form.reset()
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        Buat Transaksi
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buat Transaksi Baru</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sender_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pengirim</FormLabel>
                  <FormControl>
                    <Input placeholder="Budi Santoso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Rekening</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Tujuan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih bank" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BANKS.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Transfer</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1250000"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? undefined
                            : event.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Biaya Admin</FormLabel>
              <FormControl>
                <Input value={formatRupiah(adminFee)} disabled readOnly />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (opsional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Buat catatan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Menyimpan..." : "Simpan Transaksi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}