
import { render, screen } from '@testing-library/react';
import HomePage from './pages/HomePage';

test('render text', () => {
  render(<HomePage />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});
