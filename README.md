# Disbursement Dashboard

Mini dashboard disbursement adlah platform dengan autentikasi JWT lokal, tabel transaksi, dan form yang memiliki validasi yang ketat. Platform ini memiliki dua role (`operator` membuat pengajuan transfer, `admin` menyetujui/menolak)

## Cara Menjalankan

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — kamu akan diarahkan ke `/login`.

## Kredensial Login untuk Testing

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | admin |
| `operator` | `operator123` | operator |

## Fitur yang Berhasil Diimplementasikan

- **Login lokal** — validasi Zod (wajib diisi, tidak boleh spasi saja), error ditampilkan inline (bukan alert).
- **JWT palsu** — dibuat dengan `jose` (`HS256`, secret `test-secret`), payload `{ username, role, exp }`, disimpan di cookie. Decode dilakukan di [useAuth.ts](src/hooks/useAuth.ts) dan [proxy.ts](src/proxy.ts).
- **Protected route** — `src/proxy.ts` memverifikasi JWT di setiap request; redirect ke `/login` jika tidak invalid/expired, dan redirect ke `/` jika user berhasil login.
- **Axios interceptor 401** — [src/api/axios.ts](src/api/axios.ts) menghapus cookie dan redirect ke `/login` setiap kali response API 401.
- **Logout** — tombol di header menghapus cookie dan redirect ke `/login`.
- **Tabel transaksi** — kolom ID, Nama Pengirim, Bank, Jumlah (format `Rp 1.250.000`), Biaya Admin, Status (badge berwarna), Tanggal (format `12 Jun 2025, 14:30`), dan Aksi.
- **Server-side pagination & filter** — `page`/`limit` dikirim ke API; search (debounce 400ms) dan dropdown status dikirim sebagai query param, bukan filter client-side. Filter berubah → otomatis reset ke halaman 1.
- **Loading / empty / error state** — ditangani di [TransactionTable.tsx](src/components/TransactionTable.tsx) (skeleton rows, pesan "tidak ada transaksi", alert error).
- **Query invalidation** — `useMutation` + `invalidateQueries` (TanStack Query v5) setelah create maupun update status — tidak ada refetch manual.
- **Form buat transaksi** (hanya role `operator`) — validasi Zod lengkap sesuai spesifikasi, `admin_fee` dihitung otomatis di frontend dan ditampilkan sebagai field disabled (read-only) yang ikut update saat `amount` berubah, `status` otomatis `PENDING`, toast sukses/gagal, reset form setelah sukses.
- **Approve/Reject** (hanya role `admin`) — tombol hanya muncul untuk transaksi `PENDING`, dialog konfirmasi sebelum eksekusi, `useMutation` untuk `PUT`, toast setelah berhasil.
- **Role-based UI** — tombol yang tidak relevan dengan role **tidak dirender sama sekali** (bukan disabled).
- **Modal detail transaksi** — menampilkan seluruh field; `note` kosong ditampilkan sebagai `-`.

## Fitur Bonus yang Dikerjakan

- ✅ Responsif mobile (≤ 768px) — layout header, filter, dan tabel menyesuaikan ke layar kecil.
- ✅ Skeleton loading pada tabel (bukan spinner).
- ✅ Persist filter (`search`, `status`, `page`) ke URL query string — refresh halaman tetap mempertahankan filter aktif.
- ✅ Export transaksi yang sedang ditampilkan (setelah filter) ke CSV.
- ⬜ Sort kolom server-side (`sortBy`/`order`) — belum dikerjakan.