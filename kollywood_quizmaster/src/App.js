import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchKollywoodMovies } from './api';

// Main Container for Kollywood QuizMaster
function App() {
  // State to hold fetched Kollywood movies data
  const [kollywoodMovies, setKollywoodMovies] = useState([]);

  useEffect(() => {
    // Fetch Tamil movies from TMDb on mount
    async function loadMovies() {
      try {
        const data = await fetchKollywoodMovies();
        setKollywoodMovies(data.results || []);
        // For now, log movie data to demonstrate API integration
        // Later, this can be utilized in quiz game features
        // eslint-disable-next-line no-console
        console.log('Fetched Kollywood (Tamil) Movies:', data.results);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching Kollywood movies:', error);
      }
    }
    loadMovies();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn">Template Button</button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero">
            <div className="subtitle">AI Workflow Manager Template</div>
            <h1 className="title">kollywood_quizmaster</h1>
            <div className="description">
              Start building your application.<br />
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                {/* Demo: Show the number of Kollywood movies fetched from TMDb */}
                {kollywoodMovies.length > 0
                  ? `Fetched ${kollywoodMovies.length} Kollywood movies from TMDb!`
                  : 'Fetching Kollywood movie data from TheMovieDB API...'}
              </span>
            </div>
            <button className="btn btn-large">Button</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;