// ──────────────────────────────────────────────────────────────
//  HomePage — assembles all sections into the landing page.
//  Search + category filtering logic lives here so all
//  child components stay simple and receive only what they need.
// ──────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import { jobs, categories } from '../data/jobsData';
import HeroSection    from '../components/HeroSection';
import Categories     from '../components/Categories';
import FeaturedJobs   from '../components/FeaturedJobs';
import Footer         from '../components/Footer';

export default function HomePage() {
  // ── Filter State ──────────────────────────────────────────
  const [searchTitle,    setSearchTitle]    = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Called by HeroSection when the user submits the search form
  function handleSearch(title, location) {
    setSearchTitle(title);
    setSearchLocation(location);
    setActiveCategory('all'); // reset category filter on new search
  }

  // Called by Categories when a pill is clicked
  function handleCategorySelect(id) {
    setActiveCategory(id);
    setSearchTitle('');     // reset text search when filtering by category
    setSearchLocation('');
  }

  // ── Derived: filtered jobs list ───────────────────────────
  // useMemo avoids re-computing on every render unless filters change
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Category filter
      const matchesCategory =
        activeCategory === 'all' || job.category === activeCategory;

      // Text search: match title, company, or skills (case-insensitive)
      const q = searchTitle.toLowerCase();
      const matchesTitle =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.skills.some(s => s.toLowerCase().includes(q));

      // Location filter (case-insensitive partial match)
      const loc = searchLocation.toLowerCase();
      const matchesLocation =
        !loc || job.location.toLowerCase().includes(loc);

      return matchesCategory && matchesTitle && matchesLocation;
    });
  }, [searchTitle, searchLocation, activeCategory]);

  return (
    <main>
      {/* 1. Hero + Search */}
      <HeroSection onSearch={handleSearch} />

      {/* 2. Category filter pills */}
      <Categories
        categories={categories}
        activeCategory={activeCategory}
        onSelect={handleCategorySelect}
      />

      {/* 3. Job cards grid */}
      <FeaturedJobs jobs={filteredJobs} />

      {/* 4. Footer */}
      <Footer />
    </main>
  );
}
