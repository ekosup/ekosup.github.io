---
author: Eko Supriyono
pubDatetime: 2025-1-28T15:22:00Z
modDatetime: 2025-1-29T09:12:47.400Z
title: Instruksi - Memvisualisasikan data menggunakan Looker Studio
slug: instruksi-memvisualisasikan-data-menggunakan-looker-studio
featured: true
draft: false
tags:
  - pknstan
  - visualisation
  - looker
description: Instruksi praktik membuat visualisasi menggunakan looker studio
---

# DASHBOARD PENDAPATAN DAERAH

### A. Membuat visualisasi menggunakan Looker Studio

1. Siapkan halaman kerja dengan dimensi 1200 x 1450
2. Tambahkan data dari Google Sheet yang pernah dibuat pada pertemuan ‘Praktik mengelola data dengan Google sheet’. Yaitu Google sheet Pendapatan daerah dan gunakan sheet ‘view’ (gabungan anggaran daerah dan table daerah).
3. Membuat peta pendapatan kab/kota per provinsi
   1. Tambahkan Geo Chart (Referensi: https://www.youtube.com/watch?v=LZE_SJBjTXI)
   2. Ubah field nmprovinsi sebagai Country subdivision (1st level) dan nmsatker sebagai Country subdivision (2nd level)
   3. Pastikan field PAD, Dana Perimbangan, Lain-lain Pendapatan Daerah, dan Pendapatan lainnya bertipe ‘Numeric’
4. Gunakan beberapa parameter berikut pada property Geo Chart:

- Geo dimension: nmprovinsi
- Metric: Total
- Zoom area: Indonesia

5. Menambahkan Bar Chart untuk Komponen Pendapatan Daerah

- Dimension: Tahun
- Metric: PAD, Dana Perimbangan, Lain-Lain Pendapatan Daerah yang Sah dan Pendapatan Lainnya.

6. Menambahkan Tabel untuk 5 PAD Tertinggi

- Dimension: Nmsatker diubah label menjadi Nama Kab/Kota
- Metric: PAD ubah label menjadi Jumlah
- Number of Rows: Top N = 5

7. Menambahkan Tabel untuk 5 Dana Perimbangan Tertinggi

- Copy table 5 PAD Tertinggi (Poin 5)
- Metric: Dana Perimbangan

8. Menambahkan Tabel untuk 5 Lain-Lain Pendapatan

- Tambahkan kolom/field pada Property Data. Pilih Add Calculated Field. Field Name = Jumlah Pendapatan Lain-Lain. Formula = Lain-Lain Pendapatan Daerah yang Sah + Pendapatan Lainnya.
- Copy table 5 PAD Tertinggi (Poin 5)
- Metric: Jumlah Pendapatan Lain-Lain (Kolom baru yang dibuat pada butir a)

9. Tambahkan text ‘PENDAPATAN DAERAH KAB/KOTA DI INDONESIA PER PROVINSI’ di atas Geo Chart.
10. Klik kanan Geo Chart dan pilih Make Report Level agar semua chart saling terhubung.
11. Membuat dashboard level detail melalui menu Page >> New Page
12. Tambahkan table dengan parameter berikut:

- Dimension: nmsatker kemudian ubah text menjadi Nama Kab/Kota
- Metric: PAD, Dana Perimbangan, Lain-Lain Pendapatan Daerah yang Sah, Pendapatan Lainnya
- Number of Rows: Pagination, Per Page = 20

13. Tambahkan filter melalui fitur : Add a Control >> Drop-Downl List. Kemudian atur parameter berikut:

- Control Field: nmprovinsi kemudian ubah nama menjadi Provinsi
- Default Selection: Ketik ‘Provinsi Aceh’
- Order: nmprovinsi; Ascending
- Untuk Gaya/Style: Centang Single-Select dan Enable Search box. Kemudian sesuaikan ukuran label.
- Sesuaikan ukuran Drop Down

14. Atur halaman report melalui menu Pages >> Manage Pages.

- Halaman 1: Ganti nama mennjadi Ringkas. Tambahkan icon Home
- Halaman 2: Ganti nama menjadi Rinci: Tambahkan icon List.

15. Share Google Looker dan Copy Embed Report pada tombol Share.

### B. Membuat halaman dashboard di Google Site

1. Buka Google Site yang sudah dibuat sebelumnya.
2. Tambahkan halaman baru pada tab Menu Page dengan nama ‘Dashboard Pendapatan Daerah’
3. Insert Embed code yang sudah dicopy pada poin A.14
4. Sesuaikan ukuran dashboard

### C. Membuat Banner Dashboard Keuangan Daerah dan Tautan ke Halaman Dashboard

1. Mahasiswa membuat gambar/banner dengan tema ‘Dashboard Pendapatan Daerah’. Jika waktunya tidak memungkinkan, Mahasiswa dapat menggunakan banner yang terdapat pada: https://s.id/gsiteptik download gambar Dashboard Pendapatan Daerah
2. Masuk ke Google Site. Ubah text ‘Dashboard Keuangan Negara’ Menjadi ‘Dashboard Keuangan Daerah’
3. Ubah gambar/banner menjadi banner Dashboard Pendapatan Daerah yang sudah dibuat pada poin 1.
4. Tambahkan tautan/link ke Halaman Dashboard Pendapatan Daerah.
