
import { render, screen } from '@testing-library/react';

import Catalog from './pages/Catalog';

test('render text', () => {
  render(<Catalog />);
  const linkElement = screen.getByText(/catalog/i);
  expect(linkElement).toBeInTheDocument();
});
