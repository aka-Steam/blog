import { theme } from './theme';

describe('Theme', () => {
  it('должен иметь корректную конфигурацию primary цвета', () => {
    expect(theme.palette.primary.main).toBe('#550055');
  });

  it('должен иметь корректную конфигурацию typography для кнопок', () => {
    expect(theme.typography.button.textTransform).toBe('none');
    expect(theme.typography.button.fontWeight).toBe(400);
  });

  it('должен быть валидным объектом темы Material-UI', () => {
    expect(theme).toHaveProperty('palette');
    expect(theme).toHaveProperty('typography');
    expect(theme).toHaveProperty('spacing');
    expect(theme).toHaveProperty('breakpoints');
  });
}); 