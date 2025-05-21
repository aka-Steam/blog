import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../slices/auth';
import { postsReducer } from '../slices/posts';

describe('Store', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        posts: postsReducer,
      },
    });
  });

  it('должен иметь корректное начальное состояние', () => {
    const state = store.getState();
    expect(state).toEqual({
      auth: {
        data: null,
        status: 'loading',
      },
      posts: {
        posts: {
          items: [],
          status: 'loading',
        },
        tags: {
          items: [],
          status: 'loading',
        },
      },
    });
  });

  it('должен обрабатывать действия авторизации', () => {
    const action = {
      type: 'auth/fetchAuth/fulfilled',
      payload: { id: 1, fullName: 'Test User' },
    };
    store.dispatch(action);
    const state = store.getState();
    expect(state.auth).toEqual({
      data: { id: 1, fullName: 'Test User' },
      status: 'loaded',
    });
  });

  it('должен обрабатывать действия с постами', () => {
    const action = {
      type: 'posts/fetchPosts/fulfilled',
      payload: [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
      ],
    };
    store.dispatch(action);
    const state = store.getState();
    expect(state.posts.posts).toEqual({
      items: [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
      ],
      status: 'loaded',
    });
  });

  it('должен обрабатывать действия с тегами', () => {
    const action = {
      type: 'posts/fetchTags/fulfilled',
      payload: ['tag1', 'tag2'],
    };
    store.dispatch(action);
    const state = store.getState();
    expect(state.posts.tags).toEqual({
      items: ['tag1', 'tag2'],
      status: 'loaded',
    });
  });
}); 