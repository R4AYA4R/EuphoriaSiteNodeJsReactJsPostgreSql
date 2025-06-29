import axios from "axios";
import SectionUnderTop from "../components/SectionUnderTop";
import UserPageFormComponent from "../components/UserPageFormComponent";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { AuthResponse } from "../types/types";
import { useEffect, useState } from "react";
import AuthService from "../service/AuthService";


const UserPage = () => {

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setLoadingUser, authorizationForUser, logoutUser } = useActions();  // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    const [tab, setTab] = useState('Dashboard');

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
        console.log(isAuth);

    }, [])

    // функция для выхода из аккаунта
    const logout = async () => {

        // оборачиваем в try catch,чтобы отлавливать ошибки 
        try {

            await AuthService.logout(); // вызываем нашу функцию logout() у AuthService

            logoutUser(); // вызываем нашу функцию(action) для изменения состояния пользователя для выхода из аккаунта и в данном случае не передаем туда ничего

            setTab('Dashboard');  // изменяем состояние таба на dashboard то есть показываем секцию dashboard(в данном случае главный отдел пользователя),чтобы при выходе из аккаунта и входе обратно у пользователя был открыт главный отдел аккаунта,а не настройки или последний отдел,который пользователь открыл до выхода из аккаунта

            // потом еще будем очищать поля формы настроек пользователя и поля формы создания нового товара для админа


        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e

        }

    }

    // если состояние загрузки true,то есть идет загрузка запроса на сервер для проверки,авторизован ли пользователь,то показываем лоадер(загрузку),если не отслеживать загрузку при функции checkAuth(для проверки на refresh токен при запуске страницы),то будет не правильно работать(только через некоторое время,когда запрос на /refresh будет отработан,поэтому нужно отслеживать загрузку и ее возвращать как разметку страницы,пока грузится запрос на /refresh)
    if (isLoading) {

        // возвращаем тег main с классом main,так как указали этому классу стили,чтобы был прижат header и footer
        return (
            <main className="main">
                <div className="container">
                    <div className="innerForLoader">
                        <div className="loader"></div>
                    </div>
                </div>
            </main>
        )

    }

    // если isAuth false,то есть пользователь не авторизован(когда возвращается ошибка от сервера от эндпоинта /refresh в функции checkAuth,то isAuth становится типа false,и тогда пользователя типа выкидывает из аккаунта,то есть в данном случае возвращаем компонент формы регистрации и авторизации),то возвращаем компонент формы,вместо страницы пользователя,когда пользотватель логинится и вводит правильно данные,то эта проверка на isAuth тоже работает правильно и если данные при логине были введены верно,то сразу показывается страница пользователя(даже без использования отдельного useEffect)
    if (!isAuth) {

        return (
            <main className="main">

                <SectionUnderTop subtext="My Account" /> {/* указываем пропс(параметр) subtext(в данном случае со значением My Account,чтобы отобразить в этой секции текст My Account,так как это для страницы аккаунта пользователя),чтобы использовать этот компонент на разных страницах,а отличаться он будет только этим параметром subtext */}

                <UserPageFormComponent />

            </main>
        )

    }


    return (
        <main className="main">

            <SectionUnderTop subtext="My Account" /> {/* указываем пропс(параметр) subtext(в данном случае со значением My Account,чтобы отобразить в этой секции текст My Account,так как это для страницы аккаунта пользователя),чтобы использовать этот компонент на разных страницах,а отличаться он будет только этим параметром subtext */}


            <section className="sectionUserPage">
                <div className="container">
                    <div className="sectionUserPage__inner">
                        <div className="sectionUserPage__leftBar">

                            <div className="sectionCategories__topBlock sectionUserPage__leftBar-topBlock">
                                <div className="sectionCategories__topBlock-leftBorderBlock"></div>
                                <h1 className="sectionCategories__topBlock-title sectionUserPage__leftBar-title">Hello {user.userName}</h1>
                            </div>

                            <p className="sectionUserPage__leftBar-subtitle">Welcome to your Account</p>

                            <ul className="sectionUserPage__leftBar-menu">
                                <li className="sectionUserPage__menu-item">
                                    <button className={tab === 'Dashboard' ? "sectionUserPage__menu-btn sectionUserPage__menu-btn--active" : "sectionUserPage__menu-btn"} onClick={() => setTab('Dashboard')}>
                                        <img src="/images/sectionUserPage/dashboard 2.png" alt="" className="sectionUserPage__menu-btnImg" />
                                        <p className="sectionUserPage__menu-btnText">Dashboard</p>
                                    </button>
                                </li>

                                {/* если user.role === 'USER'(то есть если роль пользователя равна "USER"),то показываем таб с настройками профиля пользователя */}
                                {user.role === 'USER' &&

                                    <li className="sectionUserPage__menu-item">
                                        <button className={tab === 'Account Settings' ? "sectionUserPage__menu-btn sectionUserPage__menu-btn--active" : "sectionUserPage__menu-btn"} onClick={() => setTab('Account Settings')}>
                                            <img src="/images/sectionUserPage/dashboard 2 (1).png" alt="" className="sectionUserPage__menu-btnImg" />
                                            <p className="sectionUserPage__menu-btnText">Account Settings</p>
                                        </button>
                                    </li>

                                }

                                {/* здесь еще надо будет добавить вкладку для админа для админ панели */}

                            </ul>

                            <div className="sectionUserPage__menu-item">
                                <button className="sectionUserPage__menu-btn" onClick={logout}>
                                    <img src="/images/sectionUserPage/dashboard 2 (2).png" alt="" className="sectionUserPage__menu-btnImg" />
                                    <p className="sectionUserPage__menu-btnText">Logout</p>
                                </button>
                            </div>

                        </div>
                        <div className="sectionUserPage__mainBlock">

                            {tab === 'Dashboard' &&
                                <div className="sectionUserPage__mainBlock-inner">

                                    dashboard {user.userName}

                                </div>
                            }

                            {/* если user.role === 'USER'(то есть если роль пользователя равна "USER") и tab === 'Account Settings',то показываем таб с настройками профиля пользователя */}
                            {user.role === 'USER' && tab === 'Account Settings' &&
                                <div className="sectionUserPage__mainBlock-inner">

                                    account settings {user.userName}

                                </div>
                            }

                        </div>
                    </div>
                </div>
            </section>

        </main>
    )

}

export default UserPage;