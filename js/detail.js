document.addEventListener("DOMContentLoaded", async () => {
  const spreadsheetUrl =
    "https://docs.google.com/spreadsheets/d/11jeNfwlrUw18Qbc0LVD6ZTcum-i63KuZ-N8Z4yMwQq8/gviz/tq?tqx=out:json";

  const params = new URLSearchParams(window.location.search);
  const no = params.get("no");

  const judulEl = document.getElementById("judul");
  const gambarEl = document.getElementById("gambar");
  const namaEl = document.getElementById("nama");
  const kelasEl = document.getElementById("kelas");
  const tanggalEl = document.getElementById("tanggal");
  const deskripsiEl = document.getElementById("deskripsi");

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
    Tanggal: row.c[6]?.v || ""
  }));

  const karya = data.find((d) => d.No == no);

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

  function convertDriveLink(url) {
    const match = url.match(/\/d\/(.*?)\//);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  }
});
