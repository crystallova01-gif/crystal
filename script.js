// Data awal (KOSONG)
let filmData = [];
let nextFilmId = 1; 

// Elemen DOM
const filmList = document.getElementById('film-list');
const totalFilmCount = document.getElementById('total-film-count');
const totalGenreCount = document.getElementById('total-genre-count');
const avgRatingValue = document.getElementById('avg-rating-value');
const tambahFilmBtn = document.getElementById('tambah-film-btn');
const filmModal = document.getElementById('film-modal');
const closeButton = document.querySelector('.close-button');
const filmForm = document.getElementById('film-form');
const modalTitle = document.getElementById('modal-title');
const filmIdInput = document.getElementById('film-id'); 

// --- UTILITY & RENDER FUNCTIONS ---

/**
 * Fungsi untuk me-render (menggambar) tabel dan mengupdate statistik.
 */
function renderTable() {
    filmList.innerHTML = '';
    
    // Hitung statistik
    const totalFilms = filmData.length;
    const sumRatings = filmData.reduce((sum, film) => sum + parseFloat(film.rating), 0);
    const avgRating = totalFilms > 0 ? (sumRatings / totalFilms).toFixed(1) : '0.0';
    const genres = new Set(filmData.map(film => film.genre.toLowerCase()));

    // Update elemen statistik
    totalFilmCount.textContent = totalFilms;
    totalGenreCount.textContent = genres.size;
    avgRatingValue.textContent = avgRating;

    // Isi tabel
    if (totalFilms === 0) {
        const row = filmList.insertRow();
        row.innerHTML = `<td colspan="5" style="text-align: center; color: #999;">Belum ada data film. Silakan tambahkan film pertama Anda!</td>`;
    } else {
        filmData.forEach(film => {
            const row = filmList.insertRow();
            row.innerHTML = `
                <td>${film.judul}</td>
                <td>${film.genre}</td>
                <td>${film.tahun}</td>
                <td>${film.rating}</td>
                <td class="action-buttons" data-id="${film.id}">
                    <button class="edit-btn" title="Edit Film"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" title="Hapus Film"><i class="fas fa-trash"></i></button>
                </td>
            `;
        });
    }
}


/**
 * Mengisi form modal dengan data film yang dipilih dan menampilkannya.
 */
function openModal(isEdit = false, film = {}) {
    if (isEdit) {
        modalTitle.textContent = 'Edit Film';
        filmIdInput.value = film.id;
        document.getElementById('judul').value = film.judul;
        document.getElementById('genre').value = film.genre;
        document.getElementById('tahun').value = film.tahun;
        document.getElementById('rating').value = parseFloat(film.rating).toFixed(1); 
    } else {
        modalTitle.textContent = 'Tambah Film Baru';
        filmIdInput.value = ''; 
        filmForm.reset(); 
    }
    filmModal.style.display = 'block';
}

function closeModal() {
    filmModal.style.display = 'none';
    filmForm.reset();
}


// --- EVENT DELEGATION: SOLUSI UNTUK TOMBOL DINAMIS ---
// Kita hanya pasang satu listener di tabel (elemen statis), bukan di setiap tombol.

filmList.addEventListener('click', (event) => {
    // Cari elemen terdekat yang memiliki kelas .edit-btn atau .delete-btn
    const button = event.target.closest('.edit-btn, .delete-btn');
    
    if (!button) return; // Bukan tombol Edit/Hapus

    // Cari elemen induk terdekat yang menyimpan ID film (yaitu <td> aksi)
    const actionCell = button.closest('.action-buttons');
    if (!actionCell) return;
    
    const filmId = parseInt(actionCell.dataset.id);
    
    // Logika Hapus
    if (button.classList.contains('delete-btn')) {
        if (confirm(`Anda yakin ingin menghapus film ini?`)) {
            filmData = filmData.filter(film => film.id !== filmId);
            renderTable(); 
        }
    } 
    
    // Logika Edit
    else if (button.classList.contains('edit-btn')) {
        const filmToEdit = filmData.find(f => f.id === filmId);
        if (filmToEdit) {
            openModal(true, filmToEdit);
        }
    }
});


// --- EVENT LISTENERS TAMBAHAN ---

// Tombol 'Tambah Film'
tambahFilmBtn.addEventListener('click', () => openModal(false));

// Tutup Modal
closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === filmModal) {
        closeModal();
    }
});

// Submit Form (Menangani TAMBAH dan EDIT)
filmForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = filmIdInput.value ? parseInt(filmIdInput.value) : null;
    const judul = document.getElementById('judul').value;
    const genre = document.getElementById('genre').value;
    const tahun = parseInt(document.getElementById('tahun').value);
    const rating = parseFloat(document.getElementById('rating').value).toFixed(1); 

    if (id) {
        // MODE EDIT
        const index = filmData.findIndex(f => f.id === id);
        if (index > -1) {
            filmData[index] = { id, judul, genre, tahun, rating: parseFloat(rating) };
        }
    } else {
        // MODE TAMBAH
        const newFilm = {
            id: nextFilmId++,
            judul,
            genre,
            tahun,
            rating: parseFloat(rating)
        };
        filmData.push(newFilm);
    }

    renderTable(); // Render ulang setelah perubahan data
    closeModal();
});


// Inisialisasi tampilan saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderTable);