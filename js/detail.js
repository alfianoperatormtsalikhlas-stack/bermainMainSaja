document.addEventListener("DOMContentLoaded", async () => {
  const spreadsheetUrl =
    "https://opensheet.elk.sh/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/Sheet1";

  const params = new URLSearchParams(window.location.search);
  const no = params.get("no");

  const judulEl = document.getElementById("judul");
  const gambarEl = document.getElementById("gambar");
  const namaEl = document.getElementById("nama");
  const kelasEl = document.getElementById("kelas");
  const tanggalEl = document.getElementById("tanggal");
  const deskripsiEl = document.getElementById("deskripsi");

  const response = await fetch(spreadsheetUrl);
  const data = await response.json();

  const karya = data.find((d) => d.No == no);

  function convertDriveLink(url) {
    const match = url.match(/\/d\/(.*?)\//);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  }

  if (karya) {
    const imgSrc =
      karya.Gambar && karya.Gambar.startsWith("http")
        ? convertDriveLink(karya.Gambar)
        : "assets/placeholder.jpg";

    judulEl.textContent = karya.Judul;
    gambarEl.src = imgSrc;
    namaEl.textContent = karya.Nama;
    kelasEl.textContent = karya.Kelas;
    tanggalEl.textContent = karya.Tanggal;
    deskripsiEl.textContent = karya.Deskripsi;
  }
});
