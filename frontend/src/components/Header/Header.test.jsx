import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './index.jsx';
import { authReducer } from '../../redux/slices/auth'; // Измененный импорт

// Мок для модуля с подтверждением
window.confirm = jest.fn(() => true);

describe('Header Component', () => {
  let store;

  const createStore = (preloadedState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer, // Убедитесь, что authReducer - это действительно функция-редьюсер
      },
      preloadedState: {
        auth: {
          data: null,
          status: 'loaded',
          ...preloadedState.auth
        },
      },
    });
  };

  beforeEach(() => {
    // Мок для localStorage
    Storage.prototype.removeItem = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('корректно отображается, если пользователь НЕ авторизирован', () => {
    store = createStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('CoolStories')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Создать аккаунт')).toBeInTheDocument();
    expect(screen.queryByText('Написать статью')).not.toBeInTheDocument();
    expect(screen.queryByText('Выйти')).not.toBeInTheDocument();
  });

  it('корректно отображается, если пользователь авторизирован', () => {
    store = createStore({
      auth: {
        data: { _id: '1' },
        status: 'loaded'
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('CoolStories')).toBeInTheDocument();
    expect(screen.getByText('Написать статью')).toBeInTheDocument();
    expect(screen.getByText('Выйти')).toBeInTheDocument();
    expect(screen.queryByText('Войти')).not.toBeInTheDocument();
    expect(screen.queryByText('Создать аккаунт')).not.toBeInTheDocument();
  });
});