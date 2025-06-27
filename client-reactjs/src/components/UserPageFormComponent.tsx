import { FormEvent, RefObject, useRef, useState } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import AuthService from "../service/AuthService";
import { useActions } from "../hooks/useActions";

const UserPageFormComponent = () => {

    const imgBlockSignUpRef = useRef<HTMLDivElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную imgBlockSignUpRef,указываем тип в generic этому useRef как HTMLDivElement(иначе выдает ошибку,так как эта ссылка уже будет для блока div),указываем в useRef null,так как используем typeScript,делаем еще одну ссылку на html элемент,чтобы сделать дополнительные анимации отдельные для каждого блока

    const onScreen = useIsOnScreen(imgBlockSignUpRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const signUpBlockRef = useRef<HTMLDivElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную signUpBlockRef,указываем тип в generic этому useRef как HTMLDivElement(иначе выдает ошибку,так как эта ссылка уже будет для блока div),указываем в useRef null,так как используем typeScript,делаем еще одну ссылку на html элемент,чтобы сделать дополнительные анимации отдельные для каждого блока

    const onScreenSignUpBlockRef = useIsOnScreen(signUpBlockRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [tab, setTab] = useState('signIn');

    const [errorSignInForm, setErrorSignInForm] = useState('');

    const [inputSignInEmail, setInputSignInEmail] = useState('');

    const [inputSignInPassword, setInputSignInPassword] = useState('');

    const [hideInputSignInPassword, setHideInputSignInPassword] = useState(true);


    const [inputSignUpEmail, setInputSignUpEmail] = useState('');

    const [inputSignUpName, setInputSignUpName] = useState('');

    const [inputSignUpPassword, setInputSignUpPassword] = useState('');

    const [inputSignUpConfirmPassword, setInputSignUpConfirmPassword] = useState('');

    const [hideInputSignUpPassword, setHideInputSignUpPassword] = useState(true);

    const [hideInputSignUpConfirmPassword, setHideInputSignUpConfirmPassword] = useState(true);

    const [errorSignUpForm, setErrorSignUpForm] = useState('');

    const { authorizationForUser } = useActions(); // берем action authorizationForUser и другие для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутый в диспатч,так как мы оборачивали это в самом хуке useActions


    // функция для регистрации
    const registration = async (email: string, password: string) => {

        // оборачиваем в try catch,чтобы отлавливать ошибки
        try {

            let name = inputSignUpName; // помещаем в переменную name(указываем ей именно let,чтобы можно было изменять) значение инпута имени

            name = name.trim().replace(name[0], name[0].toUpperCase());  // убираем пробелы из переменной имени и заменяем первую букву этой строки инпута имени(name[0] в данном случае) на первую букву этой строки инпута имени только в верхнем регистре(name[0].toUpperCase()),чтобы имя начиналось с большой буквы,даже если написали с маленькой

            const response = await AuthService.registration(email, password, name); // вызываем нашу функцию registration() у AuthService,передаем туда email,password и name(имя пользователя,его поместили в переменную name выше в коде),если запрос прошел успешно,то в ответе от сервера будут находиться токены, поле user с объектом пользователя(с полями email,id,userName,role),их и помещаем в переменную response

            console.log(response);

            authorizationForUser(response.data);  // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)


        } catch (e: any) {

            console.log(e.reponse?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e 

            setErrorSignUpForm(e.response?.data?.message + '. Fill in all fields correctly'); // помещаем в состояние ошибки формы регистрации текст ошибки,которая пришла от сервера(в данном случае еще и допольнительный текст)

        }

    }

    // функция для логина
    const login = async (email: string, password: string) => {

        // оборачиваем в try catch,чтобы отлавливать ошибки
        try {

            const response = await AuthService.login(email, password); // вызываем нашу функцию login() у AuthService,передаем туда email и password,если запрос прошел успешно,то в ответе от сервера будут находиться токены и поле user с объектом пользователя(с полями userName,email,id,role),их и помещаем в переменную response

            console.log(response);

            authorizationForUser(response.data);  // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)


        } catch (e: any) {

            console.log(e.reponse?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e 

            setErrorSignInForm(e.response?.data?.message + '. Fill in all fields correctly'); // помещаем в состояние ошибки формы регистрации текст ошибки,которая пришла от сервера(в данном случае еще и допольнительный текст)

        }

    }


    // функция для формы логина,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const submitSignInFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если инпут почты includes('.') false(то есть инпут почты не включает в себя .(точку)) или значение инпута почты,отфильтрованное без пробелов(с помощью trim() убираются пробелы по бокам строки,то есть какое-то значение строки в центре,а пробелы по бокам убираются,если они были) по количеству символов меньше 4,то показываем ошибку
        if (!inputSignInEmail.includes('.') || inputSignInEmail.trim().length < 4) {

            setErrorSignInForm('Enter email correctly'); // показываем ошибку 

        } else {

            setErrorSignInForm(''); // указываем значение состоянию ошибки пустую строку,то есть убираем ошибку,если она была

            login(inputSignInEmail, inputSignInPassword);  // вызываем нашу функцию авторизации и передаем туда состояния инпутов почты и пароля

        }

    }

    // функция для формы регистрации,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const submitSignUpFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если состояние инпута пароля не равно состоянию инпута подтверждения пароля,то показываем ошибку,что пароли не совпадают
        if (inputSignUpPassword !== inputSignUpConfirmPassword) {

            setErrorSignUpForm('Passwords don`t match'); // показываем ошибку формы

        } else if (inputSignUpEmail.trim() === '' || inputSignUpName.trim() === '' || inputSignUpPassword.trim() === '') {
            // если состояние инпута почты,отфильтрованное без пробелов(с помощью trim(),то есть из этой строки убираются пробелы) равно пустой строке или инпут пароля равен пустой строке,или инпут имени равен пустой строке (все эти инпуты проверяем уже отфильтрованные по пробелу с помощью trim() ),то показываем ошибку

            setErrorSignUpForm('Fill in all fields'); // показываем ошибку формы

        } else if (inputSignUpPassword.length < 3 || inputSignUpPassword.length > 32) {
            // если значение инпута пароля по длине символов меньше 3 или больше 32,то показываем ошибку

            setErrorSignUpForm('Password must be 3 - 32 characters'); // показываем ошибку формы

        } else if (!inputSignUpEmail.includes('.') || inputSignUpEmail.trim().length < 4) {
            // если инпут почты includes('.') false(то есть инпут почты не включает в себя точку) или значение инпута почты,отфильтрованное по пробелам( trim() ), по количеству символов меньше 4,то показываем ошибку

            setErrorSignUpForm('Enter email correctly'); // показываем ошибку формы

        } else if (inputSignUpName.trim().length < 3 || inputSignUpName.trim().length > 32) {
            // если инпут имени,отфильтрованный по пробелам(trim()),по количеству символов меньше 3 или больше 32

            setErrorSignUpForm('Name must be 3 - 32 characters');  // показываем ошибку формы

        } else {

            setErrorSignUpForm('');  // указываем значение состоянию ошибки пустую строку,то есть убираем ошибку,если она была


            registration(inputSignUpEmail, inputSignUpPassword); // вызываем нашу функцию регистрации и передаем туда состояния инпутов почты и пароля

        }

    }

    return (
        <section className="sectionSignUp">
            <div className="sectionSignUp__inner">
                <div id="sectionCategories" className={onScreen.sectionCategoriesIntersecting ? "sectionCategories sectionCategories__active sectionSignUp__leftImgBlock" : "sectionCategories sectionSignUp__leftImgBlock"} ref={imgBlockSignUpRef}></div>

                <div className={onScreenSignUpBlockRef.sectionPresentsIntersecting ? "sectionPresents sectionPresents__active sectionSignUp__signUpBlock" : "sectionPresents sectionSignUp__signUpBlock"} id="sectionPresents" ref={signUpBlockRef}>
                    {/* указываем дополнительный контейнер для sectionSignUp__signUpBlock,так как по дизайну нужно так отделить и ограничить максимальную ширину блока sectionSignUp__signUpBlock */}
                    <div className="sectionSignUp__signUpBlock-container">

                        <div className="sectionSignUp__signUpBlock-inner">

                            <div className="sectionSignUp__signUpBlock-tabs">
                                <button className={tab === 'signIn' ? "signUpBlock__tabs-btn signUpBlock__tabs-btn--active" : "signUpBlock__tabs-btn"} onClick={() => setTab('signIn')}>Sign In</button>
                                <button className={tab === 'signUp' ? "signUpBlock__tabs-btn signUpBlock__tabs-btn--active" : "signUpBlock__tabs-btn"} onClick={() => setTab('signUp')}>Sign Up</button>
                            </div>

                            {tab === 'signIn' &&

                                <form className="signUpBlock__signInForm" onSubmit={submitSignInFormHandler}>

                                    <div className="signInForm__inputEmailBlock">
                                        <img src="/images/sectionUserPage/EnvelopeSimple.png" alt="" className="signInForm__inputEmailBlock-img" />
                                        <input type="text" className="signInForm__inputEmailBlock-input" placeholder="Email" value={inputSignInEmail} onChange={(e) => setInputSignInEmail(e.target.value)} />
                                    </div>

                                    <div className="signInForm__inputEmailBlock signInForm__inputPasswordBlock">
                                        <img src="/images/sectionUserPage/Lock.png" alt="" className="signInForm__inputEmailBlock-img" />

                                        {/* если состояние hideInputSignInPassword true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                        <input type={hideInputSignInPassword ? "password" : "text"} className="signInForm__inputEmailBlock-input signInForm__inputEmailBlock-inputPassword" placeholder="Password" value={inputSignInPassword} onChange={(e) => setInputSignInPassword(e.target.value)} />
                                        <button className="signInForm__inputEmailBlock-hideBtn" type="button" onClick={() => setHideInputSignInPassword((prev) => !prev)}>
                                            <img src="/images/sectionUserPage/Icon.png" alt="" className="signInForm__inputEmailBlock-imgHide" />
                                        </button>
                                    </div>

                                    {/* если errorSignInForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                    {errorSignInForm && <p className="formErrorText">{errorSignInForm}</p>}

                                    {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                    <button className="signInForm__btn" type="submit">Sign In</button>

                                </form>

                            }

                            {tab === 'signUp' &&

                                <form className="signUpBlock__signInForm" onSubmit={submitSignUpFormHandler}>

                                    <div className="signInForm__inputEmailBlock">
                                        <img src="/images/sectionUserPage/User.png" alt="" className="signInForm__inputEmailBlock-img" />
                                        <input type="text" className="signInForm__inputEmailBlock-input" placeholder="Name" value={inputSignUpName} onChange={(e) => setInputSignUpName(e.target.value)} />
                                    </div>

                                    <div className="signInForm__inputEmailBlock">
                                        <img src="/images/sectionUserPage/EnvelopeSimple.png" alt="" className="signInForm__inputEmailBlock-img" />
                                        <input type="text" className="signInForm__inputEmailBlock-input" placeholder="Email" value={inputSignUpEmail} onChange={(e) => setInputSignUpEmail(e.target.value)} />
                                    </div>

                                    <div className="signInForm__inputEmailBlock">
                                        <img src="/images/sectionUserPage/Lock.png" alt="" className="signInForm__inputEmailBlock-img" />

                                        {/* если состояние hideInputSignInPassword true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                        <input type={hideInputSignUpPassword ? "password" : "text"} className="signInForm__inputEmailBlock-input signInForm__inputEmailBlock-inputPassword" placeholder="Password" value={inputSignUpPassword} onChange={(e) => setInputSignUpPassword(e.target.value)} />
                                        <button className="signInForm__inputEmailBlock-hideBtn" type="button" onClick={() => setHideInputSignUpPassword((prev) => !prev)}>
                                            <img src="/images/sectionUserPage/Icon.png" alt="" className="signInForm__inputEmailBlock-imgHide" />
                                        </button>
                                    </div>

                                    <div className="signInForm__inputEmailBlock signInForm__inputPasswordBlock">
                                        <img src="/images/sectionUserPage/Lock.png" alt="" className="signInForm__inputEmailBlock-img" />

                                        {/* если состояние hideInputSignInPassword true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                        <input type={hideInputSignUpConfirmPassword ? "password" : "text"} className="signInForm__inputEmailBlock-input signInForm__inputEmailBlock-inputPassword" placeholder="Confirm Password" value={inputSignUpConfirmPassword} onChange={(e) => setInputSignUpConfirmPassword(e.target.value)} />
                                        <button className="signInForm__inputEmailBlock-hideBtn" type="button" onClick={() => setHideInputSignUpConfirmPassword((prev) => !prev)}>
                                            <img src="/images/sectionUserPage/Icon.png" alt="" className="signInForm__inputEmailBlock-imgHide" />
                                        </button>
                                    </div>

                                    {/* если errorSignUpForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                    {errorSignUpForm && <p className="formErrorText">{errorSignUpForm}</p>}

                                    {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                    <button className="signInForm__btn" type="submit">Sign Up</button>

                                </form>

                            }

                        </div>

                    </div>

                </div>

            </div>
        </section>
    )
}

export default UserPageFormComponent;