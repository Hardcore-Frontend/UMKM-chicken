// ====== DATA & PENGATURAN (silakan ubah) ======
const WA_NUMBER = "6281234567890"; // format internasional, tanpa + dan tanpa 0 di depan

const MENU = [
  { id: 1, nama: "Ayam Goreng Paha", kat: "Ayam", harga: 15000, emoji: "🍗", desc: "Paha ayam goreng bumbu rempah, renyah." },
  { id: 2, nama: "Ayam Goreng Dada", kat: "Ayam", harga: 14000, emoji: "🍗", desc: "Dada ayam tebal, empuk dan gurih." },
  { id: 3, nama: "Paket Hemat 1", kat: "Paket", harga: 20000, emoji: "🍱", desc: "Ayam + nasi + lalapan + sambal." },
  { id: 4, nama: "Paket Keluarga (8 pcs)", kat: "Paket", harga: 110000, emoji: "👨‍👩‍👧‍👦", desc: "8 potong ayam + 4 nasi + sambal." },
  { id: 5, nama: "Nasi Putih", kat: "Tambahan", harga: 5000, emoji: "🍚", desc: "Nasi putih hangat." },
  { id: 6, nama: "Sambal Bawang", kat: "Tambahan", harga: 3000, emoji: "🌶️", desc: "Pedas gurih, bikin nambah nasi." },
  { id: 7, nama: "Es Teh Manis", kat: "Minuman", harga: 4000, emoji: "🧋", desc: "Segar, manisnya pas." },
  { id: 8, nama: "Es Jeruk", kat: "Minuman", harga: 6000, emoji: "🍊", desc: "Jeruk peras asli." }
];

// ====== HELPER ======
const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const $ = s => document.querySelector(s);

let cart = {};          // { idMenu: jumlah }
let kategori = "Semua"; // filter aktif

// ====== MENU ======
function renderFilters() {
  const kats = ["Semua", ...new Set(MENU.map(m => m.kat))];
  $("#filters").innerHTML = kats
    .map(k => `<button class="chip ${k === kategori ? "active" : ""}" data-k="${k}">${k}</button>`)
    .join("");
}

function renderMenu() {
  const list = MENU.filter(m => kategori === "Semua" || m.kat === kategori);
  $("#menuGrid").innerHTML = list.map(m => `
    <div class="card">
      <div class="emoji">${m.emoji}</div>
      <h3>${m.nama}</h3>
      <p>${m.desc}</p>
      <div class="row">
        <span class="price">${rupiah(m.harga)}</span>
        <button class="add" data-id="${m.id}">+ Tambah</button>
      </div>
    </div>`).join("");
}

$("#filters").addEventListener("click", e => {
  if (e.target.dataset.k) {
    kategori = e.target.dataset.k;
    renderFilters();
    renderMenu();
  }
});

$("#menuGrid").addEventListener("click", e => {
  if (e.target.dataset.id) addToCart(+e.target.dataset.id);
});

// ====== KERANJANG ======
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function renderCart() {
  const ids = Object.keys(cart).map(Number);
  let total = 0, count = 0;

  $("#cartItems").innerHTML = ids.length
    ? ids.map(id => {
        const m = MENU.find(x => x.id === id);
        const q = cart[id];
        total += m.harga * q;
        count += q;
        return `
          <div class="item">
            <div><b>${m.nama}</b><br><small>${rupiah(m.harga)}</small></div>
            <div class="qty">
              <button data-id="${id}" data-d="-1">−</button>
              <span>${q}</span>
              <button data-id="${id}" data-d="1">+</button>
            </div>
          </div>`;
      }).join("")
    : `<p class="empty">Keranjang masih kosong 🍗</p>`;

  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = rupiah(total);
  updateCheckout(total);
}

function updateCheckout(total) {
  const lines = Object.keys(cart).map(id => {
    const m = MENU.find(x => x.id === +id);
    return `- ${m.nama} x${cart[id]} = ${rupiah(m.harga * cart[id])}`;
  });
  const alamat = $("#alamat").value.trim();
  const text =
    `Halo, saya ingin memesan:\n${lines.join("\n")}\n\nTotal: ${rupiah(total)}` +
    (alamat ? `\nAlamat/catatan: ${alamat}` : "");

  $("#checkout").href = lines.length
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
    : "#";
}

$("#cartItems").addEventListener("click", e => {
  if (e.target.dataset.id) changeQty(+e.target.dataset.id, +e.target.dataset.d);
});

$("#alamat").addEventListener("input", () => renderCart());

$("#checkout").addEventListener("click", e => {
  if (!Object.keys(cart).length) {
    e.preventDefault();
    alert("Keranjang masih kosong.");
  }
});

$("#cartFab").onclick = () => $("#cart").classList.add("open");
$("#closeCart").onclick = () => $("#cart").classList.remove("open");

// ====== FORM KONTAK ======
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const teks = `Halo, saya ${$("#nama").value}.\n${$("#pesan").value}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(teks)}`, "_blank", "noopener");
});

// ====== NAVIGASI & TEMA ======
$("#burger").onclick = () => $("#navLinks").classList.toggle("show");

$("#navLinks").addEventListener("click", e => {
  if (e.target.tagName === "A") $("#navLinks").classList.remove("show");
});

$("#themeBtn").onclick = () => {
  const root = document.documentElement;
  const sedangGelap =
    root.getAttribute("data-theme") === "dark" ||
    (!root.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
  root.setAttribute("data-theme", sedangGelap ? "light" : "dark");
};

$("#year").textContent = new Date().getFullYear();

// ====== JALANKAN ======
renderFilters();
renderMenu();
renderCart();