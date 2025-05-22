import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Login } from '../index';

// Mock Redux store
const createMockStore = (isAuth = false) => {
  return configureStore({
    reducer: {
      auth: (state = { isAuth }, action) => {
        if (action.type === 'auth/fetchAuth/fulfilled') {
          return { ...state, isAuth: true };
        }
        return state;
      },
    },
  });
};

// Mock dispatch function
const mockDispatch = jest.fn();

// Mock useDispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const renderWithProviders = (component, { isAuth = false } = {}) => {
  const store = createMockStore(isAuth);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('Компонент Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.setItem = jest.fn();
  });

  it('отображает форму входа', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Вход в аккаунт')).toBeInTheDocument();
    expect(screen.getByLabelText('E-Mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('перенаправляет на главную страницу, если пользователь авторизован', () => {
    renderWithProviders(<Login />, { isAuth: true });
    expect(window.location.pathname).toBe('/');
  });

  it('отображает ошибки валидации при пустых полях', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('E-Mail');
    const passwordInput = screen.getByLabelText('Пароль');
    
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    
    expect(await screen.findByText('Укажите почту')).toBeInTheDocument();
    expect(await screen.findByText('Укажите пароль')).toBeInTheDocument();
  });

  it('кнопка входа неактивна при невалидной форме', () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('E-Mail');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByText('Войти');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    
    expect(submitButton).toBeDisabled();
  });
});