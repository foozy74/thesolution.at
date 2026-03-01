import { useState, useEffect, useMemo } from 'react';

const ITEMS_PER_PAGE = 24;

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
      <section style={{ paddingTop: '8rem', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading books...</div>
      </section>
    );
  }

  return (
    <section style={{ paddingTop: '7rem', minHeight: '100vh', paddingBottom: '4rem' }} className="container">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          E-Book <span className="gradient-text">Catalog</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Browse our collection of {books.length.toLocaleString()} books
        </p>
        
        {/* Stats Bar */}
        <div className="glass" style={{ 
          padding: '1rem 2rem', 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'center',
          gap: '4rem',
          flexWrap: 'wrap',
          borderRadius: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-teal)' }}>
              {authors.length.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Authors</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-teal)' }}>
              {books.length.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Books</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--accent-teal)' }}>
              {filteredBooks.length.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Results</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search title or author..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.2)',
                  color: 'white',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <div style={{ minWidth: '220px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                Author Filter
              </label>
              <select 
                value={selectedAuthor} 
                onChange={(e) => { setSelectedAuthor(e.target.value); setCurrentPage(1); }}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.2)',
                  color: 'white',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Authors</option>
                {authors.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div style={{ minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                Sort By
              </label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.2)',
                  color: 'white',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                <option value="author">Author (A-Z)</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '1.25rem' 
        }}>
          {paginatedBooks.map(book => (
            <div 
              key={book.id} 
              className="glass" 
              style={{ 
                padding: '1.5rem', 
                borderRadius: '12px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                lineHeight: '1.4',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)'
              }}>
                {book.title}
              </div>
              <div style={{ 
                color: 'var(--accent-teal)', 
                fontSize: '0.95rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                {book.author}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-secondary)',
                fontFamily: 'monospace',
                opacity: 0.7
              }}>
                ID: {book.id}
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            No books found matching your criteria.
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Try adjusting your search or filters
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '0.5rem', 
            marginTop: '3rem',
            flexWrap: 'wrap'
          }}>
            <button 
              className="btn glass" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
            >
              First
            </button>
            <button 
              className="btn glass" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
            >
              ← Prev
            </button>
            
            <div style={{ 
              display: 'flex', 
              gap: '0.3rem',
              margin: '0 0.5rem'
            }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .map((p, idx, arr) => (
                  <span key={p} style={{ display: 'flex', alignItems: 'center' }}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span style={{ padding: '0 0.5rem', color: 'var(--text-secondary)' }}>...</span>
                    )}
                    <button 
                      className={`btn ${p === currentPage ? 'btn-primary' : 'glass'}`}
                      onClick={() => setCurrentPage(p)}
                      style={{ 
                        padding: '0.6rem 1rem', 
                        fontSize: '0.9rem',
                        minWidth: '44px'
                      }}
                    >
                      {p}
                    </button>
                  </span>
                ))}
            </div>
            
            <button 
              className="btn glass" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
            >
              Next →
            </button>
            <button 
              className="btn glass" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}
            >
              Last
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
