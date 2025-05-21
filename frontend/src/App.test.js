import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import { authReducer } from './redux/slices/auth';
import { postsReducer } from './redux/slices/posts';
import axios from './axios';

// Мокаем axios
jest.mock('./axios', () => ({
  get: jest.fn(),
}));

// Мокаем компоненты страниц
jest.mock('./pages', () => ({
  Home: () => <div data-testid="home-page">Home Page</div>,
  FullPost: () => <div data-testid="full-post-page">Full Post Page</div>,
  AddPost: () => <div data-testid="add-post-page">Add Post Page</div>,
  Login: () => <div data-testid="login-page">Login Page</div>,
  Registration: () => <div data-testid="registration-page">Registration Page</div>,
}));

// Мокаем Header компонент
jest.mock('./components', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

describe('App', () => {
  let store;

  beforeEach(() => {
    // Мокаем ответ от API
    axios.get.mockResolvedValueOnce({ data: { id: 1, fullName: 'Test User' } });

    store = configureStore({
      reducer: {
        auth: authReducer,
        posts: postsReducer,
      },
    });
    jest.clearAllMocks();
  });

  const renderWithProviders = (component) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  it('должен отрендерить Header', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('должен вызвать fetchAuthMe при монтировании', () => {
    renderWithProviders(<App />);
    expect(axios.get).toHaveBeenCalledWith('/auth/me');
  });

  it('должен отрендерить Home страницу на главном маршруте', () => {
    window.history.pushState({}, '', '/');
    renderWithProviders(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('должен отрендерить FullPost страницу на маршруте /posts/:id', () => {
    window.history.pushState({}, '', '/posts/123');
    renderWithProviders(<App />);
    expect(screen.getByTestId('full-post-page')).toBeInTheDocument();
  });

  it('должен отрендерить AddPost страницу на маршруте /add-post', () => {
    window.history.pushState({}, '', '/add-post');
    renderWithProviders(<App />);
    expect(screen.getByTestId('add-post-page')).toBeInTheDocument();
  });

  it('должен отрендерить AddPost страницу на маршруте /posts/:id/edit', () => {
    window.history.pushState({}, '', '/posts/123/edit');
    renderWithProviders(<App />);
    expect(screen.getByTestId('add-post-page')).toBeInTheDocument();
  });

  it('должен отрендерить Login страницу на маршруте /login', () => {
    window.history.pushState({}, '', '/login');
    renderWithProviders(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('должен отрендерить Registration страницу на маршруте /register', () => {
    window.history.pushState({}, '', '/register');
    renderWithProviders(<App />);
    expect(screen.getByTestId('registration-page')).toBeInTheDocument();
  });
}); 