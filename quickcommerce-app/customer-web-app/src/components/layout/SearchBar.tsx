'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <label htmlFor="search" className="sr-only">Search products</label>
      
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
          <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#6B778C]" aria-hidden="true" />
        </div>
        <input
          type="search"
          name="search"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="block w-full rounded-lg border-0 py-2 pl-8 sm:pl-10 pr-2 sm:pr-4 text-[#172B4D] text-sm bg-[#F4F5F7] ring-1 ring-inset ring-[#DFE1E6] placeholder:text-[#6B778C] focus:outline-none focus:ring-1 focus:ring-[#0052CC] shadow-sm sm:text-sm sm:leading-6 transition-colors"
        />
      </div>
    </form>
  );
} 