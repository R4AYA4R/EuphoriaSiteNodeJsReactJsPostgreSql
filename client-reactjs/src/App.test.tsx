
import { render, screen } from '@testing-library/react';

import AboutUs from './pages/AboutUs';

import 'intersection-observer'; // импортируем вручную intersection-observer(который до этого установили для dev режима(режима разработки) командой npm i intersection-observer --save-dev),чтобы не было ошибки,что не может найти intersection observer при запуске тестов

test('render text', () => {
  render(<AboutUs />);
  const linkElement = screen.getByText(/100% Trusted Fashion Store/i);
  expect(linkElement).toBeInTheDocument();
});
