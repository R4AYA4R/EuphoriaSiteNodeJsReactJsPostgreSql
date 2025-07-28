
import { render, screen } from '@testing-library/react';

import AboutUs from './pages/AboutUs';

import 'intersection-observer';

test('render text', () => {
  render(<AboutUs />);
  const linkElement = screen.getByText(/100% Trusted Fashion Store/i);
  expect(linkElement).toBeInTheDocument();
});
