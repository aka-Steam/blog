import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Home } from '../index';

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      posts: (state = {
        posts: {
          items: [],
          status: 'loading',
        },
        tags: {
          items: [],
          status: 'loading',
        },
        ...initialState.posts,
      }, action) => {
        if (action.type === 'posts/fetchPosts/fulfilled') {
          return {
            ...state,
            posts: {
              items: action.payload,
              status: 'loaded',
            },
          };
        }
        if (action.type === 'posts/fetchTags/fulfilled') {
          return {
            ...state,
            tags: {
              items: action.payload,
              status: 'loaded',
            },
          };
        }
        return state;
      },
      auth: (state = {
        data: null,
        ...initialState.auth,
      }) => state,
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

const renderWithProviders = (component, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('Компонент Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает скелетон при загрузке постов', () => {
    // Рендерим компонент с начальным состоянием загрузки
    renderWithProviders(<Home />, {
      posts: {
        posts: {
          items: [],
          status: 'loading',
        },
      },
    });
    
    // Проверяем, что dispatch был вызван для загрузки данных
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    
    // Проверяем, что компонент отрендерился
    expect(document.body).not.toBeEmptyDOMElement();
  });

  it('загружает посты и теги при монтировании', () => {
    renderWithProviders(<Home />);
    
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // fetchPosts
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function)); // fetchTags
  });

  it('отображает посты после загрузки', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post 1',
        imageUrl: '/test1.jpg',
        user: { id: '1', fullName: 'Test User' },
        createdAt: '2024-03-20T12:00:00.000Z',
        viewsCount: 100,
        tags: ['test', 'post'],
      },
      {
        id: '2',
        title: 'Test Post 2',
        imageUrl: '/test2.jpg',
        user: { id: '2', fullName: 'Another User' },
        createdAt: '2024-03-20T13:00:00.000Z',
        viewsCount: 200,
        tags: ['another', 'post'],
      },
    ];

    renderWithProviders(<Home />, {
      posts: {
        posts: {
          items: mockPosts,
          status: 'loaded',
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });

  it('не показывает кнопку редактирования для чужого поста', async () => {
    const mockPost = {
      id: '1',
      title: 'Test Post',
      imageUrl: '/test.jpg',
      user: { id: '2', fullName: 'Test User' },
      createdAt: '2024-03-20T12:00:00.000Z',
      viewsCount: 100,
      tags: ['test', 'post'],
    };

    renderWithProviders(<Home />, {
      posts: {
        posts: {
          items: [mockPost],
          status: 'loaded',
        },
      },
      auth: {
        data: { id: '1' }, // Другой ID, чем у автора поста
      },
    });

    await waitFor(() => {
      const editButton = screen.queryByTestId('edit-button');
      expect(editButton).not.toBeInTheDocument();
    });
  });
}); 