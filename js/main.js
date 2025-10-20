const sheetURL =
  "https://opensheet.elk.sh/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/Sheet1";

const container = document.getElementById("karyaContainer");
const searchInput = document.getElementById("searchInput");
const kelasFilter = document.getElementById("kelasFilter");
const sortSelect = document.getElementById("sortSelect");

let semuaKarya = [];

// Ambil data dari spreadsheet
async function ambilData() {
  try {
    const res = await fetch(sheetURL);
    semuaKarya = await res.json();
    isiDropdownKelas(semuaKarya);
    tampilkanKarya(semuaKarya);
  } catch (err) {
    console.error("Gagal mengambil data:", err);
  }
}

// Ubah link Google Drive jadi link langsung (uc?export=view)
function konversiDriveLink(link) {
  if (!link) return null;
  if (link.includes("drive.google.com")) {
    const match = link.match(/\/d\/(.*?)(\/|$|\?)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  return link;
}

// Isi dropdown kelas otomatis berdasarkan data spreadsheet
function isiDropdownKelas(data) {
  const kelasUnik = [
    ...new Set(data.map((k) => (k.Kelas || "").trim()).filter(Boolean)),
  ].sort();

  kelasFilter.innerHTML = '<option value="">Semua Kelas</option>';
  kelasUnik.forEach((kls) => {
    const opt = document.createElement("option");
    opt.value = kls;
    opt.textContent = kls;
    kelasFilter.appendChild(opt);
  });
}

// Tampilkan karya
function tampilkanKarya(data) {
  container.innerHTML = "";

  const sortedData = [...data].sort((a, b) => {
    if (sortSelect.value === "asc") {
      return new Date(a.TANGGAL) - new Date(b.TANGGAL);
    } else {
      return new Date(b.TANGGAL) - new Date(a.TANGGAL);
    }
  });

  sortedData.forEach((karya) => {
    const card = document.createElement("div");
    card.className = "karya-card";

    const img = document.createElement("img");
    const driveLink = konversiDriveLink(karya.Gambar);
    const imgSrc =
      driveLink && driveLink.startsWith("http")
        ? driveLink
        : "assets/placeholder.jpg";
    img.src = imgSrc;
    img.alt = karya.Judul || "Karya Siswa";

    const info = document.createElement("div");
    info.className = "karya-info";
    info.innerHTML = `
      <h3>${karya.Judul}</h3>
      <p><strong>${karya.Nama}</strong> (${karya.Kelas || "-"})</p>
      <p>${(karya.Deskripsi || "").substring(0, 100)}...</p>
      <a href="detail.html?id=${encodeURIComponent(
        karya.No
      )}" class="btn">Baca Selengkapnya</a>
    `;

    card.appendChild(img);
    card.appendChild(info);
    container.appendChild(card);
  });
}

// Event pencarian
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const hasil = semuaKarya.filter(
    (k) =>
      (k.Nama || "").toLowerCase().includes(q) ||
      (k.Judul || "").toLowerCase().includes(q) ||
      (k.Kelas || "").toLowerCase().includes(q)
  );
  tampilkanKarya(hasil);
});

// Event filter kelas
kelasFilter.addEventListener("change", () => {
  const kls = kelasFilter.value;
  const hasil = kls
    ? semuaKarya.filter((k) => (k.Kelas || "").trim() === kls)
    : semuaKarya;
  tampilkanKarya(hasil);
});

// Event urutan
sortSelect.addEventListener("change", () => tampilkanKarya(semuaKarya));

ambilData();
