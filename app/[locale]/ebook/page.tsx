"use client";

import { useState, useEffect, useCallback } from "react";

interface Ebook {
  author: string;
  title: string;
  id: string;
}

const ITEMS_PER_PAGE = 20;

export default function EbookPage() {
  const [allBooks, setAllBooks] = useState<Ebook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Ebook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "author">("title");
  const [authors, setAuthors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEbooks = async () => {
      try {
        const response = await fetch("/ebooks-data.json");
        const data: Ebook[] = await response.json();
        setAllBooks(data);
        setFilteredBooks(data);
        
        const uniqueAuthors = [...new Set(data.map((b) => b.author))].sort();
        setAuthors(uniqueAuthors);
      } catch (error) {
        console.error("Error loading ebooks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEbooks();
  }, []);

  const performSearch = useCallback(() => {
    let result = [...allBooks];

    if (selectedAuthor) {
      result = result.filter((b) => b.author === selectedAuthor);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "author") {
        return a.author.localeCompare(b.author);
      }
      return a.title.localeCompare(b.title);
    });

    setFilteredBooks(result);
    setCurrentPage(1);
  }, [allBooks, selectedAuthor, searchTerm, sortBy]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageBooks = filteredBooks.slice(start, start + ITEMS_PER_PAGE);

  const uniqueAuthors = new Set(allBooks.map((b) => b.author));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-xl">Lade E-Book Katalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-200">
      {/* Header */}
      <section className="container" style={{ paddingTop: "8rem", paddingBottom: "2rem" }}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-5xl">📚</span>
          </div>
          <h1 style={{ fontSize: "3rem", marginBottom: "1.5rem", fontWeight: 800 }}>
            E-Book <span className="gradient-text">Katalog</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto" }}>
            Tausende von Büchern verschiedener Autoren – immer verfügbar
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-2 gap-6 max-w-2xl mx-auto mb-12">
          <div className="glass p-6 rounded-xl text-center">
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--accent-teal)" }}>
              {uniqueAuthors.size}
            </div>
            <div className="text-sm text-slate-400 font-semibold">Autoren</div>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--accent-teal)" }}>
              {allBooks.length}
            </div>
            <div className="text-sm text-slate-400 font-semibold">Bücher</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="glass p-6 rounded-xl max-w-4xl mx-auto mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Suche
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && performSearch()}
                placeholder="Titel oder Autor..."
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[var(--accent-teal)]"
              />
            </div>
            
            {/* Author Filter */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Autor
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[var(--accent-teal)]"
              >
                <option value="">Alle Autoren</option>
                {authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort & Reset */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Sortieren
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "title" | "author")}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[var(--accent-teal)]"
                >
                  <option value="title">Titel</option>
                  <option value="author">Autor</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedAuthor("");
                    setSortBy("title");
                  }}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-xs"
                  title="Filter zurücksetzen"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-center mb-6 text-slate-400">
          Zeige {filteredBooks.length} von {allBooks.length} Büchern
        </div>
      </section>

      {/* Books Grid */}
      <section className="container pb-20">
        {pageBooks.length === 0 ? (
          <div className="glass p-12 rounded-xl text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-slate-400">Keine Ergebnisse gefunden</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pageBooks.map((book, index) => (
                <div
                  key={`${book.id}-${index}`}
                  className="glass p-6 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-teal)]/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">📖</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-2 truncate">
                        {book.title}
                      </h3>
                      <p className="text-sm text-[var(--accent-teal)] font-semibold mb-2">
                        {book.author}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        ID: {book.id}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg glass disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
                >
                  ←
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (!showPage && page !== currentPage - 2 && page !== currentPage + 2) {
                    return null;
                  }
                  
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-slate-400">...</span>;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === page
                          ? "bg-[var(--accent-teal)] text-[var(--bg-color)] font-bold"
                          : "glass hover:bg-white/20"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg glass disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
