const sheetURL =
  "https://opensheet.elk.sh/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/Sheet1";

const container = document.getElementById("karyaContainer");
const searchInput = document.getElementById("searchInput");
const kelasFilter = document.getElementById("kelasFilter");
const sortSelect = document.getElementById("sortSelect");

let semuaKarya = [];

async function ambilData() {
  try {
    const res = await fetch(sheetURL);
    semuaKarya = await res.json();
    tampilkanKarya(semuaKarya);
  } catch (err) {
    console.error("Gagal mengambil data:", err);
  }
}

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
    const imgSrc =
      karya.Gambar && karya.Gambar.startsWith("http")
        ? karya.Gambar
        : "assets/placeholder.jpg";
    img.src = imgSrc;
    img.alt = karya.Judul || "Karya Siswa";

    const info = document.createElement("div");
    info.className = "karya-info";
    info.innerHTML = `
      <h3>${karya.Judul}</h3>
      <p><strong>${karya.Nama}</strong> (${karya.Kelas || "-"})</p>
      <p>${karya.Deskripsi.substring(0, 100)}...</p>
      <a href="detail.html?id=${encodeURIComponent(karya.No)}" class="btn">Baca Selengkapnya</a>
    `;

    card.appendChild(img);
    card.appendChild(info);
    container.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const hasil = semuaKarya.filter(
    (k) =>
      k.Nama.toLowerCase().includes(q) ||
      k.Judul.toLowerCase().includes(q) ||
      (k.Kelas || "").toLowerCase().includes(q)
  );
  tampilkanKarya(hasil);
});

kelasFilter.addEventListener("change", () => {
  const kls = kelasFilter.value;
  const hasil = kls ? semuaKarya.filter((k) => k.Kelas === kls) : semuaKarya;
  tampilkanKarya(hasil);
});

sortSelect.addEventListener("change", () => tampilkanKarya(semuaKarya));

ambilData();
