import SectionUnderTop from "../components/SectionUnderTop";
import UserPageFormComponent from "../components/UserPageFormComponent";
import { useTypedSelector } from "../hooks/useTypedSelector";


const UserPage = () => {

    const { isAuth, user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

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

            userPage {user.userName}

        </main>
    )

}

export default UserPage;