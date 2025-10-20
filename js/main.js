document.addEventListener("DOMContentLoaded", async () => {
  const spreadsheetUrl =
    "https://docs.google.com/spreadsheets/d/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/gviz/tq?tqx=out:json";

  const karyaContainer = document.getElementById("karyaContainer");
  const searchInput = document.getElementById("searchInput");
  const filterKelas = document.getElementById("filterKelas");
  const sortTanggal = document.getElementById("sortTanggal");

  // Ambil data dari Spreadsheet
  const response = await fetch(spreadsheetUrl);
  const text = await response.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));

  const data = json.table.rows.map((row) => ({
    No: row.c[0]?.v || "",
    Nama: row.c[1]?.v || "",
    Judul: row.c[2]?.v || "",
    Deskripsi: row.c[3]?.v || "",
    Gambar: row.c[4]?.v || "",
    Kelas: row.c[5]?.v || "",
    Tanggal: parseTanggal(row.c[6]?.v || "")
  }));

  let karyaList = [...data];

  // Fungsi parsing tanggal
  function parseTanggal(value) {
    if (!value) return null;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value);
    }
    return new Date(value);
  }

  // Konversi link Google Drive ke format tampil
  function convertDriveLink(url) {
    const match = url.match(/\/d\/(.*?)\//);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  }

  // Format tanggal
  function formatTanggal(date) {
    if (!(date instanceof Date) || isNaN(date)) return "-";
    return date.toISOString().split("T")[0];
  }

  // Render kartu karya
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
  const kelasList = [...new Set(data.map((d) => d.Kelas).filter(Boolean))];
  kelasList.forEach((kelas) => {
    const option = document.createElement("option");
    option.value = kelas;
    option.textContent = kelas;
    filterKelas.appendChild(option);
  });

  // Event: pencarian
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = data.filter(
      (k) =>
        k.Nama.toLowerCase().includes(query) ||
        k.Judul.toLowerCase().includes(query) ||
        k.Deskripsi.toLowerCase().includes(query)
    );
    karyaList = filtered;
    renderKarya(karyaList);
  });

  // Event: filter kelas
  filterKelas.addEventListener("change", () => {
    const selected = filterKelas.value;
    karyaList = selected
      ? data.filter((d) => d.Kelas === selected)
      : [...data];
    renderKarya(karyaList);
  });

  // Event: urutkan tanggal
  sortTanggal.addEventListener("change", () => {
    const order = sortTanggal.value;
    if (order === "terbaru") {
      karyaList.sort((a, b) => b.Tanggal - a.Tanggal);
    } else if (order === "terlama") {
      karyaList.sort((a, b) => a.Tanggal - b.Tanggal);
    }
    renderKarya(karyaList);
  });

  renderKarya(karyaList);
});

