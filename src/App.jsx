import { useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api/games";
const MAX_RETRIES = 10; // prevents infinite loops if many attributes are banned

function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pull out a clean, consistent set of attributes from a RAWG game object
  const extractAttributes = (game) => ({
    genre: game.genres?.[0]?.name ?? "Unknown",
    platform: game.platforms?.[0]?.platform?.name ?? "Unknown",
    released: game.released ? game.released.slice(0, 4) : "Unknown",
    rating: game.rating ? game.rating.toString() : "N/A",
  });

  // Check whether a game contains ANY banned attribute value
  const isBanned = (game) => {
    const attrs = extractAttributes(game);
    return Object.values(attrs).some((value) => banList.includes(value));
  };

  // Fetch a single random game, retrying if it hits the ban list
  const discoverGame = async () => {
    setLoading(true);
    setError(null);

    try {
      let validGame = null;
      let attempts = 0;

      while (!validGame && attempts < MAX_RETRIES) {
        attempts++;

        // RAWG has ~870k+ games. Randomize via a random page of results.
        const randomPage = Math.floor(Math.random() * 500) + 1;
        const url = `${BASE_URL}?key=${API_KEY}&page_size=20&page=${randomPage}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        const results = data.results?.filter((g) => g.background_image) ?? [];
        if (results.length === 0) continue;

        // Pick a random game from the page
        const candidate = results[Math.floor(Math.random() * results.length)];

        if (!isBanned(candidate)) {
          validGame = candidate;
        }
      }

      if (!validGame) {
        setError(
          "Couldn't find a game that isn't banned. Try removing some items from your ban list!"
        );
        setLoading(false);
        return;
      }

      // Save previous game to history before showing the new one
      if (currentGame) {
        setHistory((prev) => [currentGame, ...prev]);
      }

      setCurrentGame(validGame);
    } catch (err) {
      console.error(err);
      setError("Something went wrong fetching a game. Check the console.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle an attribute value on/off the ban list
  const toggleBan = (value) => {
    if (value === "Unknown" || value === "N/A") return; // skip non-meaningful values
    setBanList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const attrs = currentGame ? extractAttributes(currentGame) : null;

  return (
    <div className="app">
      <header className="header">
        <h1>🎮 Veni Vici!</h1>
        <p>Discover your next favorite video game!</p>
      </header>

      <div className="layout">
        {/* HISTORY SIDEBAR (Stretch Feature) */}
        <aside className="history-panel">
          <h2>History</h2>
          {history.length === 0 ? (
            <p className="muted">No games viewed yet.</p>
          ) : (
            <ul>
              {history.map((game, index) => (
                <li key={`${game.id}-${index}`} className="history-item">
                  <img src={game.background_image} alt={game.name} />
                  <span>{game.name}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* MAIN DISPLAY */}
        <main className="main-content">
          <button
            className="discover-btn"
            onClick={discoverGame}
            disabled={loading}
          >
            {loading ? "Discovering..." : "Discover! 🔀"}
          </button>

          {error && <p className="error">{error}</p>}

          {currentGame && attrs && (
            <div className="game-card">
              <h2>{currentGame.name}</h2>
              <img
                className="game-image"
                src={currentGame.background_image}
                alt={currentGame.name}
              />
              <p className="hint">
                Click any attribute below to ban it from future results!
              </p>
              <div className="attributes">
                <span
                  className="attribute clickable"
                  onClick={() => toggleBan(attrs.genre)}
                >
                  🎯 Genre: {attrs.genre}
                </span>
                <span
                  className="attribute clickable"
                  onClick={() => toggleBan(attrs.platform)}
                >
                  🕹️ Platform: {attrs.platform}
                </span>
                <span
                  className="attribute clickable"
                  onClick={() => toggleBan(attrs.released)}
                >
                  📅 Released: {attrs.released}
                </span>
                <span className="attribute">
                  ⭐ Rating: {attrs.rating}
                </span>
              </div>
            </div>
          )}

          {!currentGame && !loading && (
            <p className="muted">Click "Discover!" to begin your journey.</p>
          )}
        </main>

        {/* BAN LIST */}
        <aside className="ban-panel">
          <h2>Ban List</h2>
          <p className="muted">Click an item to remove it.</p>
          {banList.length === 0 ? (
            <p className="muted">Nothing banned yet.</p>
          ) : (
            <div className="ban-list">
              {banList.map((item) => (
                <span
                  key={item}
                  className="ban-item"
                  onClick={() => toggleBan(item)}
                >
                  {item} ✕
                </span>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;