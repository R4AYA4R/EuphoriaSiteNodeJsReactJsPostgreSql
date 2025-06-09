
import { render, screen } from '@testing-library/react';

import AboutUs from './pages/AboutUs';

test('render text', () => {
  render(<AboutUs />);
  const linkElement = screen.getByText(/AboutUs/i);
  expect(linkElement).toBeInTheDocument();
});
