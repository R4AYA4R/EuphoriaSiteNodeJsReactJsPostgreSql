import axios from "axios";
import SectionUnderTop from "../components/SectionUnderTop";
import UserPageFormComponent from "../components/UserPageFormComponent";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { AuthResponse } from "../types/types";
import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import AuthService from "../service/AuthService";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import $api from "../http/http";


const UserPage = () => {

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setLoadingUser, authorizationForUser, logoutUser, setUser } = useActions();  // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    const [tab, setTab] = useState('Dashboard');

    const [inputNameAccSettings, setInputNameAccSettings] = useState('');

    const [inputEmailAccSettings, setInputEmailAccSettings] = useState('');

    const [errorAccSettings, setErrorAccSettings] = useState('');

    // фукнция для запроса на сервер на изменение информации пользователя в базе данных,лучше описать эту функцию в сервисе(отдельном файле для запросов типа AuthService),например, но в данном случае уже описали здесь,также можно это сделать было через useMutation с помощью react query,но так как мы в данном случае обрабатываем ошибки от сервера вручную,то сделали так
    const changeAccInfoInDb = async (userId: number, name: string, email: string) => {

        return $api.put('/changeAccInfo', { userId, name, email }); // возвращаем put запрос на сервер на эндпоинт /changeAccInfo для изменения данных пользователя и передаем вторым параметром объект с полями,используем здесь наш axios с определенными настройками,которые мы задали ему в файле http,чтобы правильно работали запросы на authMiddleware на проверку на access токен на бэкэнде,чтобы когда будет ошибка от бэкэнда от authMiddleware,то будет сразу идти повторный запрос на /refresh на бэкэнде для переобновления access токена и refresh токена(refresh и access токен будут обновляться только если текущий refresh токен еще годен по сроку годности,мы это прописали в функции у эндпоинта /refresh на бэкэнде) и опять будет идти запрос на изменение данных пользователя в базе данных(на /changeAccInfo в данном случае) но уже с переобновленным access токеном,который теперь действителен(это чтобы предотвратить доступ к аккаунту мошенникам,если они украли аккаунт,то есть если access токен будет не действителен уже,то будет запрос на /refresh для переобновления refresh и access токенов, и тогда у мошенников уже будут не действительные токены и они не смогут пользоваться аккаунтом,но если текущий refresh токен тоже будет не действителен,то будет ошибка,и пользователь не сможет получить доступ к этой функции(изменения данных пользователя в данном случае),пока заново не войдет в аккаунт)

    }

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

    // const sectionTopRef = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    // const onScreen = useIsOnScreen(sectionTopRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen,вторым параметром передаем в наш хук переменную isLoading,в данном случае она для отслеживания первоначальной загрузки данных пользователя,внутри хука отслеживаем этот параметр isLoading,и,если он равен false(или другое пустое значение),то только тогда начинаем следить за html элементом,чтобы показать анимацию,иначе,если не отслеживать эту загрузку,то intersectionObserver будет выдавать ошибку,что такого html элемента на странице не найдено,так как в это время будет показан только лоадер,для отслеживания загрузки данных пользователя,в данном случае


    // функция для выхода из аккаунта
    const logout = async () => {

        // оборачиваем в try catch,чтобы отлавливать ошибки 
        try {

            await AuthService.logout(); // вызываем нашу функцию logout() у AuthService

            logoutUser(); // вызываем нашу функцию(action) для изменения состояния пользователя для выхода из аккаунта и в данном случае не передаем туда ничего

            setTab('Dashboard');  // изменяем состояние таба на dashboard то есть показываем секцию dashboard(в данном случае главный отдел пользователя),чтобы при выходе из аккаунта и входе обратно у пользователя был открыт главный отдел аккаунта,а не настройки или последний отдел,который пользователь открыл до выхода из аккаунта

            // очищаем поля инпутов форм для изменения данных пользователя
            setInputEmailAccSettings(''); // изменяем состояние инпута почты на пустую строку,чтобы когда пользователь выходил из аккаунта очищался инпут почты,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то в инпуте почты может быть текст,который он до этого там вводил

            setInputNameAccSettings(''); // изменяем состояние инпута имени на пустую строку,чтобы когда пользователь выходил из аккаунта очищался инпут имени,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то в инпуте имени может быть текст,который он до этого там вводил

            setErrorAccSettings(''); // изменяем состояние ошибки формы изменения данных пользователя на пустую строку,чтобы когда пользователь выходил из аккаунта убиралась ошибка,даже если она там была,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то может показываться ошибка,которую пользователь до этого получил

            // потом еще будем очищать поля формы настроек пользователя и поля формы создания нового товара для админа


        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e

        }

    }

    // функция для формы изменения имени и почты пользователя,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const onSubmitAccSettings = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если inputEmailAccSettings.trim() не равно пустой строке(то есть в inputEmailAccSettings,отфильтрованном по пробелам, есть какое-то значение) или inputNameAccSettings.trim() не равно пустой строке(то есть в inputNameAccSettings(отфильтрованное по пробелам с помощью trim()) есть какое-то значение), то делаем запрос на сервер для изменения данных пользователя,если же в поля инпутов имени или почты пользователь ничего не ввел,то не будет отправлен запрос
        if (inputEmailAccSettings.trim() !== '' || inputNameAccSettings.trim() !== '') {

            // оборачиваем в try catch для отлавливания ошибок
            try {

                let name = inputNameAccSettings.trim(); // помещаем в переменную значение инпута имени и убираем у него пробелы с помощю trim() (указываем ей именно let,чтобы можно было изменять ее значение)

                // если name true(то есть в name есть какое-то значение),то изменяем первую букву этой строки инпута имени на первую букву этой строки инпута имени только в верхнем регистре,делаем эту проверку,иначе ошибка,так как пользователь может не ввести значение в инпут имени и тогда будет ошибка при изменении первой буквы инпута имени
                if (name) {

                    name = name.replace(name[0], name[0].toUpperCase());  // заменяем первую букву этой строки инпута имени на первую букву этой строки инпута имени только в верхнем регистре,чтобы имя начиналось с большой буквы,даже если написали с маленькой

                }

                const response = await changeAccInfoInDb(user.id, name, inputEmailAccSettings); // вызываем нашу функцию запроса на сервер для изменения данных пользователя,передаем туда user.id(id пользователя) и инпуты имени(в данном случае вынесли его в переменную name,чтобы убрать из него пробелы и сделать первую букву заглавной) и почты

                setUser(response.data); // изменяем сразу объект пользователя на данные,которые пришли от сервера,чтобы не надо было обновлять страницу для обновления данных


                setErrorAccSettings(''); // изменяем состояние ошибки на пустую строку,то есть убираем ошибку

                setInputEmailAccSettings(''); // изменяем состояние инпута почты на пустую строку,чтобы убирался текст в инпуте почты после успешного запроса

                setInputNameAccSettings(''); // изменяем состояние инпута имени на пустую строку,чтобы убирался текст в инпуте имени после успешного запроса


            } catch (e: any) {

                console.log(e.response?.data?.message); // выводим ошибку в логи

                return setErrorAccSettings(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка

            }

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

                                    <div className="sectionUserPage__mainBlock-dashboard">
                                        <img src="/images/sectionUserPage/Ellipse 5.png" alt="" className="sectionUserPage__dashboard-img" />
                                        <h3 className="sectionUserPage__dashboard-title">{user.userName}</h3>
                                        <p className="sectionUserPage__dashboard-email">{user.email}</p>

                                        {/* если user.role === 'USER'(то есть если роль пользователя равна "USER"),то показываем кнопку, по которой можно перейти в настройки аккаунта пользователя*/}
                                        {user.role === 'USER' &&
                                            <button className="sectionUserPage__dashboard-btn" onClick={() => setTab('Account Settings')}>Edit Profile</button>
                                        }


                                    </div>

                                </div>
                            }

                            {/* если user.role === 'USER'(то есть если роль пользователя равна "USER") и tab === 'Account Settings',то показываем таб с настройками профиля пользователя */}
                            {user.role === 'USER' && tab === 'Account Settings' &&
                                <div className="sectionUserPage__mainBlock-inner">

                                    <form className="sectionUserPage__mainBlock-formInfo" onSubmit={onSubmitAccSettings}>
                                        <h2 className="sectionUserPage__formInfo-title">Account Settings</h2>
                                        <div className="sectionUserPage__formInfo-mainBlock">
                                            <div className="sectionUserPage__formInfo-item">
                                                <p className="sectionUserPage__formInfo-itemText">Name</p>
                                                <input type="text" className="signInForm__inputEmailBlock-input sectionUserPage__formInfo-itemInput" placeholder={`${user.userName}`} value={inputNameAccSettings} onChange={(e) => setInputNameAccSettings(e.target.value)} />
                                            </div>
                                            <div className="sectionUserPage__formInfo-item">
                                                <p className="sectionUserPage__formInfo-itemText">Email</p>
                                                <input type="text" className="signInForm__inputEmailBlock-input sectionUserPage__formInfo-itemInput" placeholder={`${user.email}`} value={inputEmailAccSettings} onChange={(e) => setInputEmailAccSettings(e.target.value)} />
                                            </div>

                                            {/* если errorAccSettings true(то есть в состоянии errorAccSettings что-то есть),то показываем текст ошибки */}
                                            {errorAccSettings && <p className="formErrorText">{errorAccSettings}</p>}

                                            {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                            <button className="signInForm__btn sectionUserPage__formInfo-btn" type="submit">Save Changes</button>

                                        </div>
                                    </form>

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