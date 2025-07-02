let db;

window.onload = () => {
  let request = window.indexedDB.open('DatabasePasien', 1);

  request.onerror = function () {
    console.error("Database gagal dibuka");
  };

  request.onsuccess = function () {
    db = request.result;
    tampilkanData();
  };

  request.onupgradeneeded = function (e) {
    db = e.target.result;
    let objectStore = db.createObjectStore("pasien", { keyPath: "id", autoIncrement: true });

    objectStore.createIndex("nama", "nama", { unique: false });
    objectStore.createIndex("jenis_kelamin", "jenis_kelamin", { unique: false });
    objectStore.createIndex("umur", "umur", { unique: false });
    objectStore.createIndex("alamat", "alamat", { unique: false });
  };

  document.getElementById('formPasien').addEventListener('submit', simpanPasien);
};

function simpanPasien(e) {
  e.preventDefault();

  const data = {
    nama: document.getElementById('nama').value,
    jenis_kelamin: document.getElementById('jenisKelamin').value,
    umur: parseInt(document.getElementById('umur').value),
    alamat: document.getElementById('alamat').value
  };

  let tx = db.transaction(["pasien"], "readwrite");
  let store = tx.objectStore("pasien");

  store.add(data);

  tx.oncomplete = () => {
    tampilkanData();
    document.getElementById('formPasien').reset();
  };

  tx.onerror = () => {
    alert("Gagal menyimpan data");
  };
}

function tampilkanData() {
  const list = document.getElementById('daftarPasien');
  list.innerHTML = '';

  let tx = db.transaction(["pasien"], "readonly");
  let store = tx.objectStore("pasien");

  store.openCursor().onsuccess = function (e) {
    let cursor = e.target.result;
    if (cursor) {
      let p = cursor.value;
      list.innerHTML += `<li>${p.nama} (${p.jenis_kelamin}, ${p.umur}) - ${p.alamat}</li>`;
      cursor.continue();
    }
  };
}
