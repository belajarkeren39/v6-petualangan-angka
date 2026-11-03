# Pemeriksaan Petualangan Angka

Versi angka-pid-1, 3 November 2026.

## Perubahan

- Game diubah dari latihan bahasa menjadi matematika dasar kelas 1–6.
- 180 soal baru: 30 per kelas, empat opsi unik, satu kunci, serta pembahasan.
- Pengacakan soal dan jawaban mempertahankan pasangan soal/kunci/pembahasan.
- Nama game, judul halaman, topik kelas, petunjuk, nama Raka, laporan hasil,
  dekorasi angka/operasi, nama bank dan jalur gambar diperbarui.
- Ilustrasi karakter dan latar memakai aset dari game sebelumnya, tanpa
  membuat ulang gambar. Tema visual petualangan tetap dipertahankan.
- Perbaikan PID versi sebelumnya dipertahankan: kontrol tahan 360 ms, mode
  pukulan opsional, CSS statis, target diam, batas input kamera 640 × 480,
  CPU awal pada Android, Worker dan satu bingkai aktif.

## Pengujian versi ini

- 45 tes otomatis: 14 materi/pengacakan, 12 kamera, 10 pukulan, 9 tahan telapak.
- Kunci 180 soal dibandingkan dengan daftar jawaban yang ditinjau terpisah.
- Empat opsi setiap soal berbeda; opsi pecahan tidak mengandung kunci kedua
  yang senilai. Soal setiap kelas memiliki ID dan teks yang unik.
- Setiap kelas dibuka dari menu browser. Semua 30 soal per kelas dan seluruh
  pilihan tampil sesuai bank; tidak ada luapan horizontal teks jawaban pada
  pemeriksaan 1920 × 1080.
- Jawaban benar dipilih dengan sentuhan pada setiap kelas; skor dan laporan
  pembahasan sesuai. Empat mode bermain berhasil diluncurkan.
- Uji regresi browser: tahan telapak memilih satu kali, bingkai berulang tidak
  memilih lagi, sentuh, keyboard, jeda/lanjut, hasil dan kembali ke menu.
- Tata letak solo 1920 × 1080 dan duel 1366 × 768, 3840 × 2160, 844 × 390.
- Model MediaPipe lokal asli menerima gambar kamera simulasi melalui
  CPU/Worker dengan input 640 × 480; kamera ditutup setelah kembali ke menu.
- Tidak ada galat JavaScript dalam pengujian browser.

## Batas pemeriksaan

Uji dilakukan pada browser desktop dengan rute aset lokal dan kamera simulasi.
Belum ada uji pada panel Hisense atau HP fisik; FPS, latensi dan akurasi tangan
nyata tidak dapat dipastikan dari uji ini. Materi disusun sebagai latihan
dasar, tanpa klaim mencakup seluruh kurikulum kelas 1–6.

Ulangi tes logika dengan Node.js: node --test tests/*.test.cjs
