import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from '../../../axios';
import { FullPost } from '../index';

// Mock axios
jest.mock('../../../axios', () => ({
  get: jest.fn(),
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '123' }),
}));

// Mock ReactMarkdown
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="markdown">{children}</div>,
}));

// Mock Post component
jest.mock('../../../components/Post', () => ({
  Post: ({ isLoading, children, ...props }) => (
    <div data-testid="post-component">
      {isLoading ? (
        <div data-testid="loading-skeleton">Loading...</div>
      ) : (
        <div>
          <h1>{props.title}</h1>
          <div>{props.user?.fullName}</div>
          <div>{children}</div>
        </div>
      )}
    </div>
  ),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={component} />
      </Routes>
    </BrowserRouter>
  );
};

describe('Компонент FullPost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockReset();
  });

  it('отображает скелетон при загрузке', () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<FullPost />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('загружает данные поста при монтировании', () => {
    axios.get.mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<FullPost />);
    expect(axios.get).toHaveBeenCalledWith('/posts/123');
  });

  // it('отображает данные поста после загрузки', async () => {
  //   const mockPost = {
  //     _id: '123',
  //     title: 'Test Post',
  //     imageUrl: '/test.jpg',
  //     user: { fullName: 'Test User' },
  //     createdAt: '2024-03-20T12:00:00.000Z',
  //     viewsCount: 100,
  //     tags: ['test', 'post'],
  //     text: '# Test Content\n\nThis is a test post.',
  //   };

  //   axios.get.mockResolvedValueOnce({ data: mockPost });

  //   renderWithRouter(<FullPost />);

  //   await waitFor(() => {
  //     expect(screen.getByText('Test Post')).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText('Test User')).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByTestId('markdown')).toBeInTheDocument();
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByTestId('markdown')).toHaveTextContent('# Test Content\n\nThis is a test post.');
  //   });
  // });

  it('обрабатывает ошибку при загрузке поста', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderWithRouter(<FullPost />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Ошибка при получении статьи');
    });

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('перезагружает данные при изменении id', async () => {
    const mockPost1 = {
      _id: '123',
      title: 'First Post',
      text: 'First post content',
    };

    const mockPost2 = {
      _id: '456',
      title: 'Second Post',
      text: 'Second post content',
    };

    axios.get
      .mockResolvedValueOnce({ data: mockPost1 })
      .mockResolvedValueOnce({ data: mockPost2 });

    const { rerender } = renderWithRouter(<FullPost />);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    // Имитируем изменение id
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ id: '456' });
    rerender(<FullPost />);

    await waitFor(() => {
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });
}); 