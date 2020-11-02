// Movie Class
class Movie {
    constructor(title, production, director, genre) {
      this.title = title;
      this.production = production;
      this.director = director;
      this.genre = genre;
    }
  }

  // UI Class
  class UI {
    static displayMovies() {
      const movies = Store.getMovies();

      movies.forEach((movie) => UI.addMovieToList(movie));
    }

    static addMovieToList(movie) {
      const list = document.querySelector('#movie-list');

      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${movie.title}</td>
        <td>${movie.production}</td>
        <td>${movie.director}</td>
        <td>${movie.genre}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
      `;

      list.appendChild(row);
    }

    static deleteMovie(el) {
      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();
      }
    }

    static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#movie-form');
      container.insertBefore(div, form);

      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
      document.querySelector('#title').value = '';
      document.querySelector('#production').value = '';
      document.querySelector('#director').value = '';
      document.querySelector('#genre').value = '';
    }
  }

  // Handles Storage
  class Store {
    static getMovies() {
      let movies;
      if(localStorage.getItem('movies') === null) {
        movies = [];
      } else {
        movies = JSON.parse(localStorage.getItem('movies'));
      }
      return movies;
    }

    static addMovie(movie) {
      const movies = Store.getMovies();
      movies.push(movie);
      localStorage.setItem('movies', JSON.stringify(movies));
    }

    static removeMovie(title) {
      const movies = Store.getMovies();

      movies.forEach((movie, index) => {
        if(movie.title === title) {
          movies.splice(index, 1);
        }
      });

      localStorage.setItem('movies', JSON.stringify(movies));
    }
  }

  // Display
  document.addEventListener('DOMContentLoaded', UI.displayMovies);

  // Add
  document.querySelector('#movie-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const production = document.querySelector('#production').value;
    const director = document.querySelector('#director').value;
    const genre = document.querySelector('#genre').value;

    // Validate
    if(title === '' || production === '' || director === '' || genre === '') {
      UI.showAlert('Please fill in all fields', 'danger');
    } else {
      // Instatiate
      const movie = new Movie(title, production, director, genre);

      // Add to UI
      UI.addMovieToList(movie);

      // Add to store
      Store.addMovie(movie);

      // Success
      UI.showAlert('Movie Added', 'success');

      // Clear fields
      UI.clearFields();
    }
  });

  // Event: Remove Movie
  document.querySelector('#movie-list').addEventListener('click', (e) => {
    // Remove movie from UI
    UI.deleteMovie(e.target);

    // Remove movie from store
    Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);

    // Success
    UI.showAlert('Movie Removed', 'success');
  });
