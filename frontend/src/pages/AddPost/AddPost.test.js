import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { AddPost } from './index';
import axios from '../../axios';

// Mock axios
jest.mock('../../axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
}));

// Mock SimpleMDE editor
jest.mock('react-simplemde-editor', () => {
  return function MockSimpleMDE({ value, onChange }) {
    return (
      <textarea
        data-testid="mde-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

// Create mock store
const createMockStore = (isAuth = true) => {
  return configureStore({
    reducer: {
      auth: (state = { isAuth }, action) => state,
    },
  });
};

const renderWithProviders = (component, { isAuth = true } = {}) => {
  const store = createMockStore(isAuth);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('Компонент AddPost', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'mock-token');
  });

  it('корректно отображает компонент', () => {
    renderWithProviders(<AddPost />);
    
    expect(screen.getByPlaceholderText('Заголовок статьи...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Тэги')).toBeInTheDocument();
    expect(screen.getByTestId('mde-editor')).toBeInTheDocument();
    expect(screen.getByText('Опубликовать')).toBeInTheDocument();
    expect(screen.getByText('Отмена')).toBeInTheDocument();
  });

  it('перенаправляет на главную страницу, если пользователь не аутентифицирован', () => {
    renderWithProviders(<AddPost />, { isAuth: false });
    Storage.prototype.getItem = jest.fn(() => null);
    
    expect(window.location.pathname).toBe('/');
  });

  it('обрабатывает отправку формы для нового поста', async () => {
    const mockResponse = { data: { id: '123' } };
    axios.post.mockResolvedValueOnce(mockResponse);

    renderWithProviders(<AddPost />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Заголовок статьи...'), {
      target: { value: 'New Post' },
    });
    fireEvent.change(screen.getByPlaceholderText('Тэги'), {
      target: { value: 'test, blog' },
    });
    fireEvent.change(screen.getByTestId('mde-editor'), {
      target: { value: 'New Content' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Опубликовать'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/posts', {
        title: 'New Post',
        imageUrl: '',
        tags: ['test', 'blog'],
        text: 'New Content',
      });
    });
  });

  it('обрабатывает ошибку при создании поста', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    
    axios.post.mockRejectedValueOnce(new Error('API Error'));

    renderWithProviders(<AddPost />);

    fireEvent.click(screen.getByText('Опубликовать'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    expect(alertSpy).toHaveBeenCalledWith('Ошибка при создании статьи!');

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('корректно обрабатывает теги', async () => {
    const mockResponse = { data: { id: '123' } };
    axios.post.mockResolvedValueOnce(mockResponse);

    renderWithProviders(<AddPost />);

    // Test different tag formats
    fireEvent.change(screen.getByPlaceholderText('Тэги'), {
      target: { value: '#tag1, #tag2 #tag3' },
    });

    fireEvent.click(screen.getByText('Опубликовать'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/posts', expect.objectContaining({
        tags: ['tag1', 'tag2', 'tag3'],
      }));
    });
  });
}); 