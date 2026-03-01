import { useState, useEffect, useMemo } from 'react';

const ITEMS_PER_PAGE = 20;

export const EbookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [sortBy, setSortBy] = useState('author');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/ebooks-data.json')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading books:', err);
        setLoading(false);
      });
  }, []);

  const authors = useMemo(() => {
    const uniqueAuthors = [...new Set(books.map(b => b.author))];
    return uniqueAuthors.sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(term) || 
        b.author.toLowerCase().includes(term)
      );
    }
    
    if (selectedAuthor) {
      result = result.filter(b => b.author === selectedAuthor);
    }
    
    result.sort((a, b) => {
      if (sortBy === 'author') return a.author.localeCompare(b.author);
      return a.title.localeCompare(b.title);
    });
    
    return result;
  }, [books, searchTerm, selectedAuthor, sortBy]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <section style={{ paddingTop: '8rem', textAlign: 'center' }}>
        <div>Loading books...</div>
      </section>
    );
  }

  return (
    <section style={{ paddingTop: '8rem', minHeight: '100vh' }} className="container">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        E-Book <span className="gradient-text">Catalog</span>
      </h1>
      
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '3rem' }}>
        <div><strong>{authors.length.toLocaleString()}</strong> Authors</div>
        <div><strong>{books.length.toLocaleString()}</strong> Books</div>
        <div><strong>{filteredBooks.length.toLocaleString()}</strong> Results</div>
      </div>

      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search title or author..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ flex: 1, minWidth: '250px', padding: '0.5rem' }}
          />
          <select 
            value={selectedAuthor} 
            onChange={(e) => { setSelectedAuthor(e.target.value); setCurrentPage(1); }}
            style={{ minWidth: '200px', padding: '0.5rem' }}
          >
            <option value="">All Authors</option>
            {authors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '0.5rem' }}
          >
            <option value="author">Sort by Author</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {paginatedBooks.map(book => (
          <div key={book.id} className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{book.title}</div>
            <div style={{ color: 'var(--accent-teal)', marginBottom: '0.25rem' }}>{book.author}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>ID: {book.id}</div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>No books found matching your criteria.</div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <button 
            className="btn glass" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
            .map((p, idx, arr) => (
              <span key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && <span style={{ padding: '0.5rem' }}>...</span>}
                <button 
                  className={`btn ${p === currentPage ? 'btn-primary' : 'glass'}`}
                  onClick={() => setCurrentPage(p)}
                >{p}</button>
              </span>
            ))}
          <button 
            className="btn glass" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >→</button>
        </div>
      )}
    </section>
  );
};
