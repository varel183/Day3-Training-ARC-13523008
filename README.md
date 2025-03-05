# Finance Tracker

Finance Tracker adalah aplikasi web sederhana untuk melacak pemasukan dan pengeluaran keuangan. Aplikasi ini memungkinkan pengguna untuk mencatat transaksi, mengedit atau menghapus transaksi, serta melihat ringkasan keuangan dalam bentuk grafik. Aplikasi ini juga mendukung konversi mata uang menggunakan API publik.

## Fitur

- **Catat Transaksi**: Tambahkan transaksi pemasukan atau pengeluaran dengan deskripsi, jumlah, mata uang, kategori, dan tanggal.
- **Edit dan Hapus Transaksi**: Ubah atau hapus transaksi yang sudah dicatat.
- **Ringkasan Keuangan**: Lihat total saldo dan ringkasan pemasukan vs pengeluaran dalam bentuk grafik.
- **Konversi Mata Uang**: Ubah tampilan transaksi ke mata uang yang diinginkan (IDR, USD, EUR) menggunakan API publik.
- **Filter Transaksi**: Filter transaksi berdasarkan jenis (pemasukan/pengeluaran).

## Teknologi yang Digunakan

- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Backend**: Node.js, Express.js
- **API**: [ExchangeRate-API](https://www.exchangerate-api.com/) untuk konversi mata uang.

## Cara Menjalankan Proyek

### Prasyarat

- Node.js dan npm terinstal di komputer Anda.
- API key dari [ExchangeRate-API](https://www.exchangerate-api.com/).

### Langkah-langkah

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/varel183/Day3-Training-ARC-13523008.git
   cd Day3-Training-ARD-13523008
   ```

2. **Instal Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Buat File `.env`**:
   Buat file `.env` di folder backend dan tambahkan API key Anda:
   ```env
   EXCHANGE_RATE_API_KEY=your_api_key_here
   ```

4. **Jalankan Server**:
   ```bash
   npm start
   ```
   Server akan berjalan di `http://localhost:5000`.

5. **Buka Aplikasi**:
   Buka file `index.html` di browser Anda untuk menggunakan aplikasi.

## Cara Menggunakan

1. **Tambahkan Transaksi**:
   - Buka aplikasi di browser.
   - Isi formulir untuk menambahkan transaksi baru.

2. **Edit atau Hapus Transaksi**:
   - Klik ikon edit (✏️) untuk mengubah transaksi.
   - Klik ikon hapus (🗑️) untuk menghapus transaksi.

3. **Lihat Ringkasan Keuangan**:
   - Grafik akan menampilkan ringkasan pemasukan dan pengeluaran.
   - Total saldo akan diperbarui secara otomatis.

4. **Konversi Mata Uang**:
   - Pilih mata uang yang diinginkan dari dropdown.
   - Transaksi akan dikonversi ke mata uang yang dipilih.

