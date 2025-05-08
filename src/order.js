// Data produk
const products = [
  {
      id: 1,
      name: "Dimsum Original",
      description: "(6pcs) Authentic, original taste paired with rich chili oil",
      price: 27000,
      image: "/public/dimsum-ori.jpg"
  },
  {
      id: 2,
      name: "Dimsum Mentai",
      description: "(6pcs) A creamy twist to the classic, charred to perfection",
      price: 34000,
      image: "/public/not-found.jpg"
  },
];

// State untuk menyimpan jumlah pesanan
let orders = {};

// Inisialisasi orders
products.forEach(product => {
    orders[product.id] = 0;
});

// Render produk
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <p class="product-price">Rp ${product.price.toLocaleString()}</p>
                <div class="quantity-control">
                    <button class="quantity-btn" data-id="${product.id}" data-action="decrement" ${orders[product.id] === 0 ? 'disabled' : ''}>-</button>
                    <input type="number" class="quantity-input" value="${orders[product.id]}" min="0" readonly>
                    <button class="quantity-btn" data-id="${product.id}" data-action="increment">+</button>
                </div>
            </div>
        `;
        
        // Tambahkan event listener untuk card
        card.addEventListener('click', (e) => {
            // Jangan trigger modal jika mengklik tombol quantity
            if (!e.target.classList.contains('quantity-btn')) {
                openModal(product);
            }
        });
        
        productGrid.appendChild(card);
    });
    
    // Update total
    updateTotal();
    
    // Tambahkan event listener untuk tombol quantity
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
}

// Handle perubahan quantity
function handleQuantityChange(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const action = e.target.getAttribute('data-action');
    
    if (action === 'increment') {
        orders[productId]++;
    } else if (action === 'decrement' && orders[productId] > 0) {
        orders[productId]--;
    }
    
    renderProducts();
}

// Buka modal produk
function openModal(product) {
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalQuantity = document.getElementById('modalQuantity');
    
    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalDesc.textContent = product.description;
    modalPrice.textContent = `Rp ${product.price.toLocaleString()}`;
    modalQuantity.value = orders[product.id];
    
    // Update tombol modal
    document.getElementById('modalDecrement').onclick = () => {
        if (orders[product.id] > 0) {
            orders[product.id]--;
            modalQuantity.value = orders[product.id];
            updateTotal();
        }
    };
    
    document.getElementById('modalIncrement').onclick = () => {
        orders[product.id]++;
        modalQuantity.value = orders[product.id];
        updateTotal();
    };
    
    modal.style.display = 'flex';
}

// Tutup modal
document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
    renderProducts(); // Refresh tampilan setelah modal ditutup
});

// Hitung total harga
function updateTotal() {
    let total = 0;
    
    products.forEach(product => {
        total += product.price * orders[product.id];
    });
    
    document.getElementById('totalPrice').textContent = `Rp ${total.toLocaleString()}`;
}

// Submit ke WhatsApp
document.getElementById('submitBtn').addEventListener('click', () => {
    const nama = document.getElementById('nama').value.trim();
    const telpon = document.getElementById('telpon').value.trim();
    const catatan = document.getElementById('catatan').value.trim();
    
    // Validasi
    if (!nama || !telpon) {
        alert('Harap isi nama dan nomor WhatsApp Anda');
        return;
    }
    
    // Cek apakah ada produk yang dipesan
    let hasOrder = false;
    for (const id in orders) {
        if (orders[id] > 0) {
            hasOrder = true;
            break;
        }
    }
    
    if (!hasOrder) {
        alert('Harap pilih minimal 1 produk');
        return;
    }
    
    // Format pesan WhatsApp
    let message = `Halo, saya ${nama} ingin memesan:\n\n`;
    
    products.forEach(product => {
        if (orders[product.id] > 0) {
            message += `*${product.name}*\n`;
            message += `Jumlah: ${orders[product.id]}\n`;
            message += `Harga: Rp ${product.price.toLocaleString()} x ${orders[product.id]} = Rp ${(product.price * orders[product.id]).toLocaleString()}\n\n`;
        }
    });
    
    // Hitung total
    let total = 0;
    products.forEach(product => {
        total += product.price * orders[product.id];
    });
    
    message += `*Total Pesanan: Rp ${total.toLocaleString()}*\n\n`;
    
    if (catatan) {
        message += `Catatan: ${catatan}\n\n`;
    }
    
    message += `Silakan konfirmasi ketersediaan dan total pembayarannya. Terima kasih.`;
    
    // Encode message untuk URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '6281256775406';
    
    // Redirect ke WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
});

// Inisialisasi
renderProducts();