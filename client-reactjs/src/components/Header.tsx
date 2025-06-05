import { NavLink } from "react-router-dom";

const Header = () => {

    return(
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    {/* используем тут NavLink,чтобы при клике на эту ссылку перекинуть пользователя по маршруту /(то есть на главную страницу),указываем это в to */}
                    <NavLink to="/" className="header__logoLink">
                        {/* в src(пути картинки) указываем путь из папки images,которую создали в папке public в папке для всего react приложения(сайта),создаем папку images в public,чтобы было удобно сразу указывать путь до картинки, указывая сразу /images и тд */}
                        <img src="/images/header/Logo.svg" alt="" className="header__logo-img" />
                    </NavLink>
                    <ul className="header__menuList">
                        <li className="header__menuList-item">
                            {/* используем тут NavLink,чтобы при клике на эту ссылку перекинуть пользователя по маршруту /(то есть на главную страницу),указываем это в to,также используем тут NavLink,вместо обычного Link,чтобы отслеживать активное состояние этой ссылки,то есть находится ли пользователь на этой странице,для которой эта ссылка или нет,чтобы указать ей активный класс,также отслеживаем активную сейчас страницу и с помощью isActive у NavLink указываем,если isActive true,то указываем классы для активной кнопки текущей страницы,в другом случае обычные классы */}
                            <NavLink to="/" className={({isActive}) => isActive ? "header__menuList-link header__menuList-link--active" : "header__menuList-link"}>Home</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/catalog" className={({isActive}) => isActive ? "header__menuList-link header__menuList-link--active" : "header__menuList-link"}>Shop</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/aboutUs" className={({isActive}) => isActive ? "header__menuList-link header__menuList-link--active" : "header__menuList-link"}>About Us</NavLink>
                        </li>
                        <li className="header__menuList-item header__menuList-itemBoxes">
                            <NavLink to="/userPage" className="header__menuList-link header__menuList-linkBox">
                                <img src="/images/header/user.png" alt="" className="header__menuList-linkImg" />
                            </NavLink>
                            <NavLink to="/cart" className="header__menuList-link header__menuList-linkBox header__menuList-linkCart">
                                <img src="/images/header/shopping cart.png" alt="" className="header__menuList-linkImg" />
                                <span className="header__linkCart-span">0</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )

}

export default Header;