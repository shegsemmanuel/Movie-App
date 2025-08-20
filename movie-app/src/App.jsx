import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input to avoid too many API calls
  // This will update debouncedSearchTerm 500ms after the user stops typing
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
      console.log('Debounced search term updated:', searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query = "") => {
    console.log('Fetching movies for query:', query);
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query.trim()
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query.trim())}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      console.log('API endpoint:', endpoint);
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (!data.results || data.results.length === 0) {
        setErrorMessage(query.trim() ? "No movies found. Try another search." : "No movies available.");
        setMovieList([]);
        return;
      }

      setMovieList(data.results);
      setErrorMessage(""); // Clear any previous errors

      // Call the Appwrite function to update search count
      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Error fetching movies. Please try again later.");
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch trending movies on initial load
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  // Initial load - fetch popular movies when component mounts
  useEffect(() => {
    console.log('Component mounted, fetching initial movies');
    fetchMovies(""); // Fetch popular movies on initial load
  }, []);

  // Fetch whenever debounced search term changes
  useEffect(() => {
    console.log('Debounced search term changed:', debouncedSearchTerm);
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
               <h2>Trending Movies</h2>

               <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                       <p>{index + 1}</p>
                       <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
               </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-10">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
