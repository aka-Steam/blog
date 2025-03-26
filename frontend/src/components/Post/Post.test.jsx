import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import * as postsApi from '../../redux/slices/posts';
import { Post } from './index';

// Моки для компонентов
jest.mock('../UserInfo', () => ({
  UserInfo: () => <div>UserInfo Mock</div>
}));

jest.mock('./Skeleton', () => ({
  PostSkeleton: () => <div>PostSkeleton</div>,
}));

// Моки для иконок
jest.mock('@mui/icons-material/Clear', () => () => <div>DeleteIcon</div>);
jest.mock('@mui/icons-material/Edit', () => () => <div>EditIcon</div>);
jest.mock('@mui/icons-material/RemoveRedEyeOutlined', () => () => <div>EyeIcon</div>);
jest.mock('@mui/icons-material/ChatBubbleOutlineOutlined', () => () => <div>CommentIcon</div>);

describe('Post Component', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    createdAt: '2023-05-01',
    imageUrl: 'http://example.com/image.jpg',
    user: { id: '1', name: 'Test User' },
    viewsCount: 100,
    commentsCount: 5,
    tags: ['react', 'testing'],
    isFullPost: false,
    isLoading: false,
    isEditable: false,
  };

  let mockFetchRemovePost;

  beforeEach(() => {
    window.confirm = jest.fn(() => true);
    
    // Мокируем fetchRemovePost перед каждым тестом
    mockFetchRemovePost = jest.fn(() => ({ type: 'posts/removePost' }));
    jest.spyOn(postsApi, 'fetchRemovePost').mockImplementation(mockFetchRemovePost);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderPost = (props = {}) => {
    const store = configureStore({
      reducer: {
        posts: (state = {}, action) => state,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <Post {...mockPost} {...props} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('отображает PostSkeleton когда isLoading имеет значение true', () => {
    renderPost({ isLoading: true });
    expect(screen.getByText('PostSkeleton')).toBeInTheDocument();
  });

  it('корректный рендеринг публикации с основными реквизитами', () => {
    renderPost();
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('UserInfo Mock')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#testing')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  it('отправляет fetchRemovePost при нажатии кнопки удаления', () => {
    renderPost({ isEditable: true });

    fireEvent.click(screen.getByText('DeleteIcon'));
    
    expect(window.confirm).toHaveBeenCalledWith('Вы действительно хотите удалить статью?');
    expect(mockFetchRemovePost).toHaveBeenCalledWith(mockPost.id);
  });
});