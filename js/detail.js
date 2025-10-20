const sheetURL =
  "https://opensheet.elk.sh/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/Sheet1";

const container = document.getElementById("detailContainer");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function tampilkanDetail() {
  const res = await fetch(sheetURL);
  const data = await res.json();
  const karya = data.find((k) => k.No === id);

  if (!karya) {
    container.innerHTML = "<p>Karya tidak ditemukan.</p>";
    return;
  }

  let imgSrc = "assets/placeholder.jpg";
    if (karya.Gambar && karya.Gambar.includes("drive.google.com")) {
      const match = karya.Gambar.match(/\/d\/(.*?)\//);
      if (match) {
        imgSrc = `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    } else if (karya.Gambar && karya.Gambar.startsWith("http")) {
      imgSrc = karya.Gambar;
    }

  container.innerHTML = `
    <h2>${karya.Judul}</h2>
    <p><strong>${karya.Nama}</strong> (${karya.Kelas || "-"})</p>
    <img src="${imgSrc}" alt="${karya.Judul}" class="detail-img" />
    <p>${karya.Deskripsi}</p>
    <p><em>Tanggal: ${karya.TANGGAL}</em></p>
  `;
}

tampilkanDetail();

