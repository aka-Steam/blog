import { authReducer, fetchAuth, fetchRegister, fetchAuthMe, logout } from '../slices/auth';
import axios from '../../axios';

// Mock axios
jest.mock('../../axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('Auth Slice', () => {
  const initialState = {
    data: null,
    status: 'loading',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('редьюсеры', () => {
    it('должен обрабатывать начальное состояние', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('должен обрабатывать выход из системы', () => {
      const state = {
        data: { id: 1, fullName: 'Test User' },
        status: 'loaded',
      };
      expect(authReducer(state, logout())).toEqual({
        data: null,
        status: 'loaded',
      });
    });
  });

  describe('асинхронные thunks', () => {
    it('должен успешно авторизовать пользователя', async () => {
      const mockUser = { id: 1, fullName: 'Test User' };
      axios.post.mockResolvedValueOnce({ data: mockUser });

      const thunk = fetchAuth({ email: 'test@test.com', password: '123456' });
      const dispatch = jest.fn();
      const getState = jest.fn();

      await thunk(dispatch, getState, undefined);

      expect(axios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: '123456',
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0].type).toBe('auth/fetchAuth/pending');
      expect(dispatch.mock.calls[1][0].type).toBe('auth/fetchAuth/fulfilled');
      expect(dispatch.mock.calls[1][0].payload).toEqual(mockUser);
    });

    it('должен обрабатывать ошибку авторизации', async () => {
      const error = new Error('Failed to fetch');
      axios.post.mockRejectedValueOnce(error);

      const thunk = fetchAuth({ email: 'test@test.com', password: '123456' });
      const dispatch = jest.fn();
      const getState = jest.fn();

      await thunk(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0].type).toBe('auth/fetchAuth/pending');
      expect(dispatch.mock.calls[1][0].type).toBe('auth/fetchAuth/rejected');
    });

    it('должен успешно зарегистрировать пользователя', async () => {
      const mockUser = { id: 1, fullName: 'Test User' };
      axios.post.mockResolvedValueOnce({ data: mockUser });

      const thunk = fetchRegister({
        fullName: 'Test User',
        email: 'test@test.com',
        password: '123456',
      });
      const dispatch = jest.fn();
      const getState = jest.fn();

      await thunk(dispatch, getState, undefined);

      expect(axios.post).toHaveBeenCalledWith('/auth/register', {
        fullName: 'Test User',
        email: 'test@test.com',
        password: '123456',
      });

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0].type).toBe('auth/fetchRegister/pending');
      expect(dispatch.mock.calls[1][0].type).toBe('auth/fetchRegister/fulfilled');
      expect(dispatch.mock.calls[1][0].payload).toEqual(mockUser);
    });

    it('должен успешно получить данные авторизованного пользователя', async () => {
      const mockUser = { id: 1, fullName: 'Test User' };
      axios.get.mockResolvedValueOnce({ data: mockUser });

      const thunk = fetchAuthMe();
      const dispatch = jest.fn();
      const getState = jest.fn();

      await thunk(dispatch, getState, undefined);

      expect(axios.get).toHaveBeenCalledWith('/auth/me');

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0].type).toBe('auth/fetchAuthMe/pending');
      expect(dispatch.mock.calls[1][0].type).toBe('auth/fetchAuthMe/fulfilled');
      expect(dispatch.mock.calls[1][0].payload).toEqual(mockUser);
    });
  });

  describe('extraReducers', () => {
    it('должен обрабатывать состояние загрузки авторизации', () => {
      const action = { type: fetchAuth.pending.type };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        data: null,
        status: 'loading',
      });
    });

    it('должен обрабатывать успешную авторизацию', () => {
      const mockUser = { id: 1, fullName: 'Test User' };
      const action = { type: fetchAuth.fulfilled.type, payload: mockUser };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        data: mockUser,
        status: 'loaded',
      });
    });

    it('должен обрабатывать ошибку авторизации', () => {
      const action = { type: fetchAuth.rejected.type };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        data: null,
        status: 'error',
      });
    });
  });
}); 