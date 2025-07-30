import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { AuthResponse, IProductsCartResponse } from "../types/types";
import { useEffect, useState } from "react";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";

const Header = () => {

    const [activeMobileMenu,setActiveMobileMenu] = useState(false);

    const { user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setLoadingUser, authorizationForUser } = useActions();  // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    // указываем в этой функции запроса на сервер для получения массива товаров корзины такой же queryKey как и на странице Cart.tsx,чтобы эти данные кешировались и можно было переобновить их на этой странице,чтобы они переобновились сразу же и для страницы Cart.tsx
    const { data: dataProductsCart, refetch: refetchProductsCart, isFetching } = useQuery({
        queryKey: ['getAllProductsCart'], // указываем название
        queryFn: async () => {

            // если user.id true,то есть id у user есть,то делаем запрос на сервер,делаем эту проверку,чтобы шел запрос на сервер на получение массива объектов товаров корзины только когда user.id true(то есть пользователь авторизован),в другом случае возвращаем null,делаем так,чтобы не выдавало ошибку на сервере,что user.id undefined,а возвращаем null,чтобы не выдавало ошибку,что query data(данные из функции запроса на сервер с помощью useQuery) не может быть undefined
            if (user.id) {

                const response = await axios.get<IProductsCartResponse>(`${process.env.REACT_APP_BACKEND_URL}/api/getAllProductsCart?userId=${user.id}`); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductsCartResponse),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя,вынесли основной url до бэкэнда в переменную окружения REACT_APP_BACKEND_URL в файле .env

                console.log(response.data);

                return response.data; // возвращаем конкретный уже объект ответа от сервера(response.data),в нем будет объект массивов объектов товаров корзины(allProductsCartForUser и productsCartForPagination),который мы берем из этого useQuery


            } else {

                return null;

            }


        }
    })

    // указываем здесь также функцию checkAuth,чтобы переобновлять данные пользователя,когда обновится эта страница товара,чтобы правильно работали проверки есть ли этот товар сейчас в корзине
    const checkAuth = async () => {

        setLoadingUser(true);

        // оборачиваем в try catch для отлавливания ошибок
        try {

            // здесь используем уже обычный axios,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse, указываем url до эндпоинта /refresh на бэкэнде(в данном случае вынесли нашу переменную основного url до бэкэнда REACT_APP_BACKEND_URL в .env файле,это основной url до бэкэнда) и /api,то есть уже конкретный url до нашего роутера на бэкэнде на бэкэнде и через / указываем refresh(это тот url,где мы выдаем access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${process.env.REACT_APP_BACKEND_URL}/api/refresh`, { withCredentials: true }); // в переменную response здесь будут помещены 2 токена(access и refresh) и поле user с типом данных на основе нашего интерфейса IUser,если запрос прошел успешно

            console.log(response.data);

            authorizationForUser(response.data);  // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e

        } finally {

            // в блоке finally будет выполнен код в независимости от try catch(то есть в любом случае,даже если будет ошибка)
            setLoadingUser(false); // изменяем поле isLoading состояния пользователя в userSlice на false(то есть загрузка закончена)

        }

    }

    // при запуске сайта(в данном случае при рендеринге этого компонента,то есть этой страницы) будет отработан код в этом useEffect
    useEffect(() => {

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть,то есть пользователь уже когда-то регистрировался или авторизовывался и у него уже есть refresh токен в cookies
        if (localStorage.getItem('token')) {

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(user.userName);

    }, [])

    // при запуске(рендеринге) этого компонента(в данном случае при рендеринге компонента header,то есть при каждом обновлении и запуске страницы,так как этот header у нас на каждой странице) и при изменении user(объекта пользователя) переобновляем массив товаров корзины dataProductsCart(он будет переобновлен для всех компонентов,где мы указывали такой же query key для функции запроса на сервер с помощью useQuery,то есть для страницы корзины,страницы о товаре и тд),так как не успевает загрузится запрос /refresh для проверки авторизации пользователя(для выдачи новых токенов refresh и access),иначе если этого не сделать,то после обновления страницы корзины не показывается,что этот товар есть в корзине, при изменении состояния user(в userSlice в данном случае) (то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются),то делаем повторный запрос на получения товаров корзины,чтобы данные о количестве товаров корзины сразу переобновлялись при изменения состояния user(то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются),если не сделать это,то данные о товарах корзины будут переобновляться только после перезагрузки страницы
    useEffect(() => {

        refetchProductsCart();

    }, [user])

    return (
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
                            <NavLink to="/" className={({ isActive }) => isActive ? "header__menuList-link header__menuList-link--active" : "header__menuList-link"}>Home</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/catalog" className={({ isActive }) => isActive ? "header__menuList-link header__menuList-link--active" : "header__menuList-link"}>Shop</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/aboutUs" className={({ isActive }) => isActive ? "header__menuList-link header__menuList-link--active" : "header__menuList-link"}>About Us</NavLink>
                        </li>
                        <li className="header__menuList-item header__menuList-itemBoxes">
                            <NavLink to="/userPage" className="header__menuList-link header__menuList-linkBox">
                                <img src="/images/header/user.png" alt="" className="header__menuList-linkImg" />
                            </NavLink>
                            <NavLink to="/cart" className="header__menuList-link header__menuList-linkBox header__menuList-linkCart">
                                <img src="/images/header/shopping cart.png" alt="" className="header__menuList-linkImg" />

                                {/* если dataProductsCart?.allProductsCartForUser.length true(то есть массив товаров корзины для определенного пользователя есть),то показываем количество товаров корзины, в другом случае показываем 0 */}
                                <span className="header__linkCart-span">{dataProductsCart?.allProductsCartForUser.length ? dataProductsCart?.allProductsCartForUser.length : 0}</span>
                            </NavLink>
                        </li>
                    </ul>

                    {/* если activeMobileMenu true (то есть сейчас открыто мобильное меню),то показываем блок див и в onClick указываем,что изменяем состояние activeMobileMenu на false,то есть будем закрывать мобильное меню по клику на другую область,кроме этого меню,чтобы оно закрылось не только по кнопке,но и по области вокруг,в другом случае этот блок показан не будет */}
                    {activeMobileMenu && <div className="header__menuMobileCloseBlock" onClick={()=>setActiveMobileMenu(false)}></div>}

                    <ul className={activeMobileMenu ? "header__menuMobile header__menuMobile--active" : "header__menuMobile"}>
                        <li className="header__menuList-item">
                            {/* используем тут NavLink,чтобы при клике на эту ссылку перекинуть пользователя по маршруту /(то есть на главную страницу),указываем это в to,также используем тут NavLink,вместо обычного Link,чтобы отслеживать активное состояние этой ссылки,то есть находится ли пользователь на этой странице,для которой эта ссылка или нет,чтобы указать ей активный класс,также отслеживаем активную сейчас страницу и с помощью isActive у NavLink указываем,если isActive true,то указываем классы для активной кнопки текущей страницы,в другом случае обычные классы */}
                            <NavLink to="/" className={({ isActive }) => isActive ? "header__menuList-link header__menuList-link--active" : "header__menuList-link"}>Home</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/catalog" className={({ isActive }) => isActive ? "header__menuList-link header__menuList-link--active" : "header__menuList-link"}>Shop</NavLink>
                        </li>
                        <li className="header__menuList-item">
                            <NavLink to="/aboutUs" className={({ isActive }) => isActive ? "header__menuList-link header__menuList-link--active" : "header__menuList-link"}>About Us</NavLink>
                        </li>

                        <li className="header__menuList-item header__menuList-itemBoxes header__menuMobile-itemBoxes">
                            <NavLink to="/userPage" className="header__menuList-link header__menuList-linkBox">
                                <img src="/images/header/user.png" alt="" className="header__menuList-linkImg" />
                            </NavLink>
                            <NavLink to="/cart" className="header__menuList-link header__menuList-linkBox header__menuList-linkCart">
                                <img src="/images/header/shopping cart.png" alt="" className="header__menuList-linkImg" />

                                {/* если dataProductsCart?.allProductsCartForUser.length true(то есть массив товаров корзины для определенного пользователя есть),то показываем количество товаров корзины, в другом случае показываем 0 */}
                                <span className="header__linkCart-span">{dataProductsCart?.allProductsCartForUser.length ? dataProductsCart?.allProductsCartForUser.length : 0}</span>
                            </NavLink>
                        </li>
                    </ul>

                    <button className="header__menuBtn" onClick={()=>setActiveMobileMenu((prev) => !prev)}>
                        {/* если activeMobileMenu true(то есть сейчас открыто мобильное меню),то показываем активные классы для каждого спана отдельно,так как делаем им такую анимацию,в другом случае указываем обычный класс */}
                        <span className={activeMobileMenu ? "header__menuBtn-span header__menuBtn-spanActive1" : "header__menuBtn-span"}></span>
                        <span className={activeMobileMenu ? "header__menuBtn-span header__menuBtn-spanActive2" : "header__menuBtn-span"}></span>
                        <span className={activeMobileMenu ? "header__menuBtn-span header__menuBtn-spanActive3" : "header__menuBtn-span"}></span>
                        <span className={activeMobileMenu ? "header__menuBtn-span header__menuBtn-spanActive1" : "header__menuBtn-span"}></span>
                    </button>

                </div>
            </div>
        </header>
    )

}

export default Header;