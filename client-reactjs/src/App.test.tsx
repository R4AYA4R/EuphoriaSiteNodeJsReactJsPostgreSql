
import { render, screen } from '@testing-library/react';

import AboutUs from './pages/AboutUs';

import 'intersection-observer'; // импортируем вручную intersection-observer(который до этого установили для dev режима(режима разработки) командой npm i intersection-observer --save-dev),чтобы не было ошибки,что не может найти intersection observer при запуске тестов
import SectionAboutUsTeam from './components/SectionAboutUsTeam'; // в данном случае импортировали секцию SectionAboutUsTeam в которой нету ссылки Link из react-router-dom(так как выдает ошибку,что не может найти react-router-dom,если использовать в компоненте какой-либо компонент(например, Link) из react-router-dom) и просто для теста проверям,есть ли в этой секции текст Our awesome team

test('render text', () => {
  render(<SectionAboutUsTeam/>);
  const linkElement = screen.getByText(/Our awesome team/i);
  expect(linkElement).toBeInTheDocument();
});
