// === URL Spreadsheet ===
// Ganti dengan ID spreadsheet kamu & nama sheet/tab yang sesuai
const sheetURL =
  "https://opensheet.elk.sh/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/Sheet1";

// === Elemen HTML ===
const container = document.getElementById("karya-container");
const searchInput = document.getElementById("search");
const filterKelas = document.getElementById("filter-kelas");
const sortTanggal = document.getElementById("sort-tanggal");

let semuaKarya = [];

// === Ambil Data dari Spreadsheet ===
fetch(sheetURL)
  .then((res) => res.json())
  .then((data) => {
    semuaKarya = data;
    tampilkanKarya(semuaKarya);
    isiDropdownKelas(data);
  })
  .catch((err) => {
    console.error("Gagal memuat data:", err);
    container.innerHTML =
      "<p style='color:red'>Gagal memuat data. Pastikan Spreadsheet publik.</p>";
  });

// === Fungsi Tampilkan Karya ===
function tampilkanKarya(data) {
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>Tidak ada karya ditemukan.</p>";
    return;
  }

  data.forEach((karya, index) => {
    const gambar = (karya.Gambar || "").trim();
    const imgSrc = gambar.startsWith("http")
      ? gambar
      : "https://namasite.netlify.app/assets/placeholder.jpg"; // ganti domain kamu

    const deskripsi = karya.Deskripsi || "";
    const ringkas =
      deskripsi.length > 100
        ? deskripsi.substring(0, 100) + "..."
        : deskripsi;

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${imgSrc}" alt="${karya.Judul}">
      <h3>${karya.Judul || "Tanpa Judul"}</h3>
      <p class="desc">${ringkas}</p>
      ${
        deskripsi.length > 100
          ? `<button class="baca" data-full="${deskripsi.replace(
              /"/g,
              "&quot;"
            )}">Baca Selengkapnya</button>`
          : ""
      }
      <small><b>${karya.Nama || ""}</b> | ${
      karya.Kelas || "-"
    } | ${karya.Tanggal || ""}</small>
    `;
    container.appendChild(card);
  });

  // Atur layout 4 kolom per baris dengan CSS Grid
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))";
  container.style.gap = "1rem";

  // Tambahkan event untuk tombol "Baca Selengkapnya"
  document.querySelectorAll(".baca").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(btn.getAttribute("data-full"));
    });
  });
}

// === Fungsi Dropdown Filter Kelas ===
function isiDropdownKelas(data) {
  const kelasUnik = [
    ...new Set(data.map((k) => (k.Kelas || "").trim()).filter((x) => x)),
  ];
  kelasUnik.forEach((kelas) => {
    const option = document.createElement("option");
    option.value = kelas;
    option.textContent = kelas;
    filterKelas.appendChild(option);
  });
}

// === Fungsi Pencarian ===
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const hasil = semuaKarya.filter(
    (k) =>
      k.Judul?.toLowerCase().includes(keyword) ||
      k.Nama?.toLowerCase().includes(keyword) ||
      k.Deskripsi?.toLowerCase().includes(keyword)
  );
  tampilkanKarya(hasil);
});

// === Fungsi Filter Berdasarkan Kelas ===
filterKelas.addEventListener("change", () => {
  const val = filterKelas.value;
  const hasil =
    val === "semua"
      ? semuaKarya
      : semuaKarya.filter((k) => (k.Kelas || "").trim() === val);
  tampilkanKarya(hasil);
});

// === Fungsi Urutkan Berdasarkan Tanggal ===
sortTanggal.addEventListener("change", () => {
  const arah = sortTanggal.value;
  const hasil = [...semuaKarya].sort((a, b) => {
    const tglA = new Date(a.Tanggal || "1970-01-01");
    const tglB = new Date(b.Tanggal || "1970-01-01");
    return arah === "baru" ? tglB - tglA : tglA - tglB;
  });
  tampilkanKarya(hasil);
});
