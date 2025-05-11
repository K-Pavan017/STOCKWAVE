// SearchBar.js
import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/search?ticker=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter stock symbol..."
        className="p-2 border border-gray-400 rounded mr-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>

      <div className="mt-4">
        {results.map((item) => (
          <div key={item.symbol} className="p-2 border-b border-gray-300">
            <strong>{item.symbol}</strong> — {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
