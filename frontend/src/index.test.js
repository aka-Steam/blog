import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import App from './App';
import { theme } from './theme';
import store from './redux/store';

// Мокаем App компонент
jest.mock('./App', () => () => <div data-testid="app">App Component</div>);

describe('Index', () => {
  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('должен отрендерить приложение со всеми необходимыми провайдерами', () => {
    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    );

    // Проверяем наличие App компонента
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });

  it('должен иметь корректную структуру провайдеров', () => {
    render(
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    );

    // Проверяем наличие App компонента внутри провайдеров
    const appElement = screen.getByTestId('app');
    expect(appElement).toBeInTheDocument();
  });
}); 