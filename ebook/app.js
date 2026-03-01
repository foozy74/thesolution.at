// E-Book Catalog Application
let allBooks = [];
let filteredBooks = [];
let currentPage = 1;
const itemsPerPage = 20;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof ebooksData !== 'undefined') {
        allBooks = ebooksData;
        filteredBooks = [...allBooks];
        populateAuthorFilter();
        displayBooks();
        updateStats();
    }
    
    // Event listeners
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    document.getElementById('authorFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
});

function populateAuthorFilter() {
    const authors = [...new Set(allBooks.map(b => b.author))].sort();
    const select = document.getElementById('authorFilter');
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        select.appendChild(option);
    });
}

function performSearch() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    filteredBooks = allBooks.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term)
    );
    currentPage = 1;
    displayBooks();
}

function applyFilters() {
    const author = document.getElementById('authorFilter').value;
    const sort = document.getElementById('sortBy').value;
    
    let result = [...allBooks];
    
    if (author) {
        result = result.filter(b => b.author === author);
    }
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        result = result.filter(b => 
            b.title.toLowerCase().includes(searchTerm) || 
            b.author.toLowerCase().includes(searchTerm)
        );
    }
    
    result.sort((a, b) => {
        if (sort === 'author') return a.author.localeCompare(b.author);
        return a.title.localeCompare(b.title);
    });
    
    filteredBooks = result;
    currentPage = 1;
    displayBooks();
}

function displayBooks() {
    const container = document.getElementById('booksContainer');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageBooks = filteredBooks.slice(start, end);
    
    if (pageBooks.length === 0) {
        container.innerHTML = '<div class="no-results">Keine Ergebnisse gefunden</div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    container.innerHTML = pageBooks.map(book => `
        <div class="book-card">
            <div class="book-title">${escapeHtml(book.title)}</div>
            <div class="book-author">${escapeHtml(book.author)}</div>
            <div class="book-id">ID: ${book.id}</div>
        </div>
    `).join('');
    
    updatePagination();
    updateResultsCount();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">←</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="page-btn">...</span>`;
        }
    }
    
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">→</button>`;
    pagination.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displayBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStats() {
    const authors = new Set(allBooks.map(b => b.author));
    document.getElementById('authorCount').textContent = authors.size;
    document.getElementById('bookCount').textContent = allBooks.length;
}

function updateResultsCount() {
    const countEl = document.getElementById('resultsCount');
    countEl.textContent = `Zeige ${filteredBooks.length} von ${allBooks.length} Büchern`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
