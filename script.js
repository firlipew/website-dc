
// Mengambil elemen HTML menggunakan DOM
const inputTugas = document.getElementById("inputTugas");
const tombolTambah = document.getElementById("tombolTambah");
const daftarTugas = document.getElementById("daftarTugas");
const pesanKosong = document.getElementById("pesanKosong");

const jumlahSemua = document.getElementById("jumlahSemua");
const jumlahSelesai = document.getElementById("jumlahSelesai");
const jumlahBelum = document.getElementById("jumlahBelum");

const tombolHapusSemua =
    document.getElementById("tombolHapusSemua");

// Mengambil data dari LocalStorage
let tugas = JSON.parse(localStorage.getItem("dataTugas")) || [];

// Fungsi menyimpan data
function simpanData() {
    localStorage.setItem("dataTugas", JSON.stringify(tugas));
}

// Fungsi menampilkan daftar tugas
function tampilkanTugas() {

    // Mengosongkan daftar sebelum ditampilkan ulang
    daftarTugas.innerHTML = "";

    // Menampilkan pesan jika belum ada tugas
    pesanKosong.style.display =
        tugas.length === 0 ? "block" : "none";

    // Perulangan untuk menampilkan setiap tugas
    tugas.forEach(function(item) {

        // Membuat elemen LI
        const li = document.createElement("li");
        li.className = "task-item";

        // Menambahkan class jika tugas selesai
        if (item.selesai) {
            li.classList.add("selesai");
        }

        // Membuat checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.selesai;

        // Event ketika checkbox diklik
        checkbox.addEventListener("change", function() {
            item.selesai = checkbox.checked;

            simpanData();
            tampilkanTugas();
        });

        // Membuat teks tugas
        const span = document.createElement("span");
        span.textContent = item.nama;

        // Membuat tombol hapus
        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.className = "tombol-hapus";

        // Event menghapus satu tugas
        tombolHapus.addEventListener("click", function() {

            tugas = tugas.filter(function(data) {
                return data.id !== item.id;
            });

            simpanData();
            tampilkanTugas();
        });

        // Memasukkan elemen ke dalam LI
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(tombolHapus);

        // Memasukkan LI ke dalam UL
        daftarTugas.appendChild(li);
    });

    // Memperbarui statistik
    updateStatistik();
}

// Fungsi menambahkan tugas
function tambahTugas() {

    const namaTugas = inputTugas.value.trim();

    // Validasi input
    if (namaTugas === "") {
        alert("Tugas tidak boleh kosong!");
        inputTugas.focus();
        return;
    }

    // Membuat objek tugas baru
    const tugasBaru = {
        id: Date.now(),
        nama: namaTugas,
        selesai: false
    };

    // Menambahkan tugas ke array
    tugas.push(tugasBaru);

    // Menyimpan dan menampilkan data
    simpanData();
    tampilkanTugas();

    // Mengosongkan input
    inputTugas.value = "";
    inputTugas.focus();
}

// Fungsi memperbarui statistik
function updateStatistik() {

    const total = tugas.length;

    const selesai = tugas.filter(function(item) {
        return item.selesai === true;
    }).length;

    const belum = total - selesai;

    jumlahSemua.textContent = total;
    jumlahSelesai.textContent = selesai;
    jumlahBelum.textContent = belum;
}

// Event tombol tambah
tombolTambah.addEventListener("click", tambahTugas);

// Event tombol Enter pada input
inputTugas.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        tambahTugas();
    }
});

// Event tombol hapus semua
tombolHapusSemua.addEventListener("click", function() {

    if (tugas.length === 0) {
        alert("Belum ada tugas yang dapat dihapus!");
        return;
    }

    const konfirmasi = confirm(
        "Apakah Anda yakin ingin menghapus semua tugas?"
    );

    if (konfirmasi) {
        tugas = [];

        simpanData();
        tampilkanTugas();
    }
});