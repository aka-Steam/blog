import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Registration } from '../index';

// Mock Redux store
const createMockStore = (isAuth = false) => {
  return configureStore({
    reducer: {
      auth: (state = { isAuth }, action) => {
        if (action.type === 'auth/fetchRegister/fulfilled') {
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

describe('Компонент Registration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.setItem = jest.fn();
  });

  it('отображает форму регистрации', () => {
    renderWithProviders(<Registration />);
    
    expect(screen.getByText('Создание аккаунта')).toBeInTheDocument();
    expect(screen.getByLabelText('Полное имя')).toBeInTheDocument();
    expect(screen.getByLabelText('E-Mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
  });

  it('перенаправляет на главную страницу, если пользователь авторизован', () => {
    renderWithProviders(<Registration />, { isAuth: true });
    expect(window.location.pathname).toBe('/');
  });

  it('отображает ошибки валидации при пустых полях', async () => {
    renderWithProviders(<Registration />);
    
    const fullNameInput = screen.getByLabelText('Полное имя');
    const emailInput = screen.getByLabelText('E-Mail');
    const passwordInput = screen.getByLabelText('Пароль');
    
    fireEvent.change(fullNameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    
    fireEvent.blur(fullNameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    
    expect(await screen.findByText('Укажите полное имя')).toBeInTheDocument();
    expect(await screen.findByText('Укажите почту')).toBeInTheDocument();
    expect(await screen.findByText('Укажите пароль')).toBeInTheDocument();
  });

//   it('успешно регистрирует пользователя', async () => {
//     const mockRegisterResponse = {
//       payload: {
//         token: 'test-token',
//       },
//     };
    
//     mockDispatch.mockResolvedValueOnce(mockRegisterResponse);
    
//     renderWithProviders(<Registration />);
    
//     const fullNameInput = screen.getByLabelText('Полное имя');
//     const emailInput = screen.getByLabelText('E-Mail');
//     const passwordInput = screen.getByLabelText('Пароль');
//     const submitButton = screen.getByText('Зарегистрироваться');
    
//     fireEvent.change(fullNameInput, { target: { value: 'Вася Пупкин' } });
//     fireEvent.change(emailInput, { target: { value: 'vasya@test.ru' } });
//     fireEvent.change(passwordInput, { target: { value: '1234' } });
    
//     fireEvent.click(submitButton);
    
//     await waitFor(() => {
//       expect(mockDispatch).toHaveBeenCalledWith({
//         fullName: 'Вася Пупкин',
//         email: 'vasya@test.ru',
//         password: '1234',
//       });
//     });
    
//     expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
//   });

//   it('показывает ошибку при неудачной регистрации', async () => {
//     const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
//     mockDispatch.mockResolvedValueOnce({ payload: null });
    
//     renderWithProviders(<Registration />);
    
//     const fullNameInput = screen.getByLabelText('Полное имя');
//     const emailInput = screen.getByLabelText('E-Mail');
//     const passwordInput = screen.getByLabelText('Пароль');
//     const submitButton = screen.getByText('Зарегистрироваться');
    
//     fireEvent.change(fullNameInput, { target: { value: 'Вася Пупкин' } });
//     fireEvent.change(emailInput, { target: { value: 'vasya@test.ru' } });
//     fireEvent.change(passwordInput, { target: { value: '1234' } });
    
//     fireEvent.click(submitButton);
    
//     await waitFor(() => {
//       expect(alertSpy).toHaveBeenCalledWith('Не удалось регистрироваться!');
//     });
    
//     alertSpy.mockRestore();
//   });

  it('кнопка регистрации неактивна при невалидной форме', () => {
    renderWithProviders(<Registration />);
    
    const fullNameInput = screen.getByLabelText('Полное имя');
    const emailInput = screen.getByLabelText('E-Mail');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByText('Зарегистрироваться');
    
    fireEvent.change(fullNameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    
    expect(submitButton).toBeDisabled();
  });

//   it('отображает аватар', () => {
//     renderWithProviders(<Registration />);
//     expect(screen.getByRole('img')).toBeInTheDocument();
//   });
}); 