const SHEET_URL = "https://opensheet.elk.sh/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/Sheet1";

async function loadKarya() {
  const res = await fetch(SHEET_URL);
  const data = await res.json();
  return data;
}

function createCard(karya) {
  const imgSrc = karya.Gambar && karya.Gambar.startsWith("http")
  ? karya.Gambar
  : "assets/placeholder.jpg";
  const shortDesc = karya.Deskripsi.length > 100 ? karya.Deskripsi.substring(0, 100) + "..." : karya.Deskripsi;

  return `
    <div class="card" data-kelas="${karya.Kelas}" data-tanggal="${karya.Tanggal}">
      <img src="${imgSrc}" alt="${karya.Judul}">
      <div class="card-content">
        <h3>${karya.Judul}</h3>
        <p><strong>${karya.Nama}</strong> - ${karya.Kelas}</p>
        <div class="description">
          <p class="short">${shortDesc}</p>
          <p class="full hidden">${karya.Deskripsi}</p>
          ${karya.Deskripsi.length > 100 ? `<button class="toggle-btn">Baca Selengkapnya</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderGallery(karyaList) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = karyaList.map(createCard).join("");
}

function initFilterOptions(data) {
  const filterKelas = document.getElementById("filterKelas");
  const kelasList = [...new Set(data.map(d => d.Kelas))];
  kelasList.forEach(k => {
    const opt = document.createElement("option");
    opt.value = k;
    opt.textContent = k;
    filterKelas.appendChild(opt);
  });
}

async function init() {
  let karyaList = await loadKarya();
  renderGallery(karyaList);
  initFilterOptions(karyaList);

  const searchInput = document.getElementById("searchInput");
  const filterKelas = document.getElementById("filterKelas");
  const sortTanggal = document.getElementById("sortTanggal");

  function applyFilters() {
    let filtered = karyaList;

    // Filter berdasarkan pencarian
    const search = searchInput.value.toLowerCase();
    if (search) {
      filtered = filtered.filter(k =>
        k.Nama.toLowerCase().includes(search) ||
        k.Judul.toLowerCase().includes(search)
      );
    }

    // Filter berdasarkan kelas
    const kelas = filterKelas.value;
    if (kelas) {
      filtered = filtered.filter(k => k.Kelas === kelas);
    }

    // Urutkan berdasarkan tanggal
    filtered.sort((a, b) => {
      const da = new Date(a.Tanggal);
      const db = new Date(b.Tanggal);
      return sortTanggal.value === "asc" ? da - db : db - da;
    });

    renderGallery(filtered);
  }

  [searchInput, filterKelas, sortTanggal].forEach(el => el.addEventListener("input", applyFilters));

  // Toggle "Baca Selengkapnya"
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("toggle-btn")) {
      const card = e.target.closest(".description");
      card.querySelector(".short").classList.toggle("hidden");
      card.querySelector(".full").classList.toggle("hidden");
      e.target.textContent =
        e.target.textContent === "Baca Selengkapnya" ? "Sembunyikan" : "Baca Selengkapnya";
    }
  });
}

init();

