document.addEventListener("DOMContentLoaded", async () => {
  const spreadsheetUrl =
    "https://opensheet.elk.sh/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/Sheet1";

  const karyaContainer = document.getElementById("karyaContainer");
  const searchInput = document.getElementById("searchInput");
  const filterKelas = document.getElementById("filterKelas");
  const sortTanggal = document.getElementById("sortTanggal");

  // Ambil data dari OpenSheet
  const response = await fetch(spreadsheetUrl);
  const data = await response.json();

  // Pastikan format kolom sama dengan spreadsheet
  const karyaList = data.map((row) => ({
    No: row.No,
    Nama: row.Nama,
    Judul: row.Judul,
    Deskripsi: row.Deskripsi || "",
    Gambar: row.Gambar || "",
    Kelas: row.Kelas || "",
    Tanggal: row.Tanggal || "",
  }));

  // Konversi link Google Drive ke link langsung
  function convertDriveLink(url) {
    const match = url.match(/\/d\/(.*?)\//);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  }

  // Format tanggal
  function formatTanggal(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date)) return value;
    return date.toISOString().split("T")[0];
  }

  // Render karya ke halaman
  function renderKarya(list) {
    karyaContainer.innerHTML = "";

    const grid = document.createElement("div");
    grid.className =
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center";

    list.forEach((karya) => {
      const imgSrc =
        karya.Gambar && karya.Gambar.startsWith("http")
          ? convertDriveLink(karya.Gambar)
          : "assets/placeholder.jpg";

      const deskripsiSingkat =
        karya.Deskripsi.length > 100
          ? karya.Deskripsi.substring(0, 100) + "..."
          : karya.Deskripsi;

      const card = document.createElement("div");
      card.className =
        "bg-white rounded-2xl shadow-md p-4 w-64 hover:shadow-lg transition";

      card.innerHTML = `
        <img src="${imgSrc}" alt="${karya.Judul}" class="rounded-xl w-full h-40 object-cover mb-2">
        <h3 class="text-lg font-bold">${karya.Judul}</h3>
        <p class="text-sm text-gray-600">${karya.Nama} | ${karya.Kelas}</p>
        <p class="text-xs text-gray-400 mb-2">${formatTanggal(karya.Tanggal)}</p>
        <p class="text-sm text-gray-700 mb-2">${deskripsiSingkat}</p>
        <a href="detail.html?no=${karya.No}" class="text-blue-500 text-sm hover:underline">Baca Selengkapnya</a>
      `;

      grid.appendChild(card);
    });

    karyaContainer.appendChild(grid);
  }

  // Isi dropdown kelas
  const kelasList = [...new Set(karyaList.map((d) => d.Kelas).filter(Boolean))];
  kelasList.forEach((kelas) => {
    const option = document.createElement("option");
    option.value = kelas;
    option.textContent = kelas;
    filterKelas.appendChild(option);
  });

  // Event: pencarian
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = karyaList.filter(
      (k) =>
        k.Nama.toLowerCase().includes(query) ||
        k.Judul.toLowerCase().includes(query) ||
        k.Deskripsi.toLowerCase().includes(query)
    );
    renderKarya(filtered);
  });

  // Event: filter kelas
  filterKelas.addEventListener("change", () => {
    const selected = filterKelas.value;
    const filtered = selected
      ? karyaList.filter((d) => d.Kelas === selected)
      : [...karyaList];
    renderKarya(filtered);
  });

  // Event: urutkan tanggal
  sortTanggal.addEventListener("change", () => {
    const order = sortTanggal.value;
    const sorted = [...karyaList].sort((a, b) => {
      const dateA = new Date(a.Tanggal);
      const dateB = new Date(b.Tanggal);
      return order === "terbaru" ? dateB - dateA : dateA - dateB;
    });
    renderKarya(sorted);
  });

  renderKarya(karyaList);
});
