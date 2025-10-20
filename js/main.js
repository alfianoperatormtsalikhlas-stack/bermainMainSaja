const sheetURL =
  "https://opensheet.elk.sh/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/Sheet1";

const container = document.getElementById("karyaContainer");

async function ambilData() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();
    tampilkanKarya(data);
  } catch (err) {
    console.error("Gagal mengambil data:", err);
  }
}

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

function tampilkanKarya(data) {
  container.innerHTML = "";

  data.forEach((karya) => {
    const card = document.createElement("div");
    card.className = "karya-card";

    const img = document.createElement("img");

    const driveLink = konversiDriveLink(karya.Gambar);
    const imgSrc = driveLink && driveLink.startsWith("http")
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
      <a href="detail.html?id=${encodeURIComponent(karya.No)}" class="btn">Baca Selengkapnya</a>
    `;

    card.appendChild(img);
    card.appendChild(info);
    container.appendChild(card);
  });
}

ambilData();
