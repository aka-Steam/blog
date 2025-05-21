import { postsReducer, fetchPosts, fetchTags, fetchRemovePost } from '../slices/posts';
import axios from '../../axios';

// Mock axios
jest.mock('../../axios', () => ({
  get: jest.fn(),
  delete: jest.fn(),
}));

describe('Posts Slice', () => {
  const initialState = {
    posts: {
      items: [],
      status: 'loading',
    },
    tags: {
      items: [],
      status: 'loading',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('асинхронные thunks', () => {
    it('должен успешно загрузить посты', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
      ];
      axios.get.mockResolvedValueOnce({ data: mockPosts });

      const thunk = fetchPosts();
      const dispatch = jest.fn();
      const getState = jest.fn();

      await thunk(dispatch, getState, undefined);

      expect(axios.get).toHaveBeenCalledWith('/posts');

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0].type).toBe('posts/fetchPosts/pending');
      expect(dispatch.mock.calls[1][0].type).toBe('posts/fetchPosts/fulfilled');
      expect(dispatch.mock.calls[1][0].payload).toEqual(mockPosts);
    });

    it('должен обрабатывать ошибку загрузки постов', async () => {
      const error = new Error('Failed to fetch');
      axios.get.mockRejectedValueOnce(error);

      const thunk = fetchPosts();
      const dispatch = jest.fn();
      const getState = jest.fn();

      await thunk(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0].type).toBe('posts/fetchPosts/pending');
      expect(dispatch.mock.calls[1][0].type).toBe('posts/fetchPosts/rejected');
    });

    it('должен успешно загрузить теги', async () => {
      const mockTags = ['tag1', 'tag2'];
      axios.get.mockResolvedValueOnce({ data: mockTags });

      const thunk = fetchTags();
      const dispatch = jest.fn();
      const getState = jest.fn();

      await thunk(dispatch, getState, undefined);

      expect(axios.get).toHaveBeenCalledWith('/tags');

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0].type).toBe('posts/fetchTags/pending');
      expect(dispatch.mock.calls[1][0].type).toBe('posts/fetchTags/fulfilled');
      expect(dispatch.mock.calls[1][0].payload).toEqual(mockTags);
    });

    it('должен успешно удалить пост', async () => {
      const postId = '123';
      axios.delete.mockResolvedValueOnce({ data: { success: true } });

      const thunk = fetchRemovePost(postId);
      const dispatch = jest.fn();
      const getState = jest.fn();

      await thunk(dispatch, getState, undefined);

      expect(axios.delete).toHaveBeenCalledWith(`/posts/${postId}`);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0].type).toBe('posts/fetchRemovePost/pending');
      expect(dispatch.mock.calls[1][0].type).toBe('posts/fetchRemovePost/fulfilled');
      expect(dispatch.mock.calls[1][0].payload).toBe(postId);
    });
  });

  describe('extraReducers', () => {
    it('должен обрабатывать состояние загрузки постов', () => {
      const action = { type: fetchPosts.pending.type };
      const state = postsReducer(initialState, action);
      expect(state.posts.status).toBe('loading');
    });

    it('должен обрабатывать успешную загрузку постов', () => {
      const mockPosts = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
      ];
      const action = { type: fetchPosts.fulfilled.type, payload: mockPosts };
      const state = postsReducer(initialState, action);
      expect(state.posts).toEqual({
        items: mockPosts,
        status: 'loaded',
      });
    });

    it('должен обрабатывать ошибку загрузки постов', () => {
      const action = { type: fetchPosts.rejected.type };
      const state = postsReducer(initialState, action);
      expect(state.posts.status).toBe('error');
    });

    it('должен обрабатывать состояние загрузки тегов', () => {
      const action = { type: fetchTags.pending.type };
      const state = postsReducer(initialState, action);
      expect(state.tags.status).toBe('loading');
    });

    it('должен обрабатывать успешную загрузку тегов', () => {
      const mockTags = ['tag1', 'tag2'];
      const action = { type: fetchTags.fulfilled.type, payload: mockTags };
      const state = postsReducer(initialState, action);
      expect(state.tags).toEqual({
        items: mockTags,
        status: 'loaded',
      });
    });

    it('должен обрабатывать ошибку загрузки тегов', () => {
      const action = { type: fetchTags.rejected.type };
      const state = postsReducer(initialState, action);
      expect(state.tags.status).toBe('error');
    });

    it('должен обрабатывать успешное удаление поста', () => {
      const initialState = {
        posts: {
          items: [
            { id: '123', title: 'Post 1' },
            { id: '456', title: 'Post 2' },
          ],
          status: 'loaded',
        },
        tags: {
          items: [],
          status: 'loaded',
        },
      };

      const action = { type: fetchRemovePost.fulfilled.type, payload: '123' };
      const state = postsReducer(initialState, action);
      expect(state.posts.items).toEqual([
        { id: '123', title: 'Post 1' },
        { id: '456', title: 'Post 2' },
      ]);
    });
  });
}); 