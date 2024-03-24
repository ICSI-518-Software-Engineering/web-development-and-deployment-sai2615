import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Pagination.module.css'; // Adjust the path based on your file structure
import './MovieList.module.css'; // Ensure you have this CSS file with the styles provided

const TMDB_API_KEY = '75313e4e020915e6e3d01e8fb96dc607'; // Replace this with your TMDB API key
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(3);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(TMDB_API_URL);
                setMovies(response.data.results);
            } catch (error) {
                console.error('Failed to fetch movies:', error);
            }
        };

        fetchMovies();
    }, []);

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='movie-list-container'>
            <h2>Popular Movies</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Rating</th>
                        <th>Description</th>
                        <th>Poster</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMovies.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.title}</td>
                            <td>{movie.vote_average}</td>
                            <td>{movie.overview}</td>
                            <td>
                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <Pagination itemsPerPage={moviesPerPage} totalItems={movies.length} paginate={paginate} />
        </div>
    );
}

function Pagination({ itemsPerPage, totalItems, paginate }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <a onClick={(e) => {
                            e.preventDefault();
                            paginate(number);
                        }} href="#!" className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default MovieList;
