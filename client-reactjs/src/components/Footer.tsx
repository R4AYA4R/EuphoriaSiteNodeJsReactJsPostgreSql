import { Link } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { FormEvent, useEffect, useState } from "react";
import $api from "../http/http";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IAdminFields } from "../types/types";

const Footer = () => {

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const [tabChangeEmail, setTabChangeEmail] = useState(false);

    const [inputEmail, setInputEmail] = useState('');

    const [errorEmailForm, setErrorEmailForm] = useState('');

    // создаем функцию запроса и делаем запрос на сервер(при создании функции в useQuery запрос автоматически делается 1 раз при запуске страницы) для получения объекта админ полей(нужных полей текста и тд для сайта,чтобы потом мог админ их изменять в базе данных)
    const { data: dataAdminFields, refetch: refetchAdminFields } = useQuery({
        queryKey: ['getAdminFields'], // указываем название
        queryFn: async () => {

            const response = await axios.get<IAdminFields>(`${process.env.REACT_APP_BACKEND_URL}/api/getAdminFields`); // делаем запрос на сервер на получение объекта админ полей,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IAdminFields),используем тут обычный axios,так как не нужна здесь проверка на access токен пользователя

            console.log(response.data);

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет массив объектов комментариев) и тд

        }
    })

    // при изменении dataAdminFields?.data(объекта админ полей) изменяем состояние inputEmail на dataAdminFields?.data.email(почта из объекта админ полей,который взяли из базы данных),делаем этот useEffect,чтобы при загрузке страницы первоначальное значение состояния inputEmail было как dataAdminFields?.data.email,чтобы при показе инпута изменения почты для админа,там сразу было значение dataAdminFields?.data.email(почта из базы данных),которое можно стереть,если не сделать этот useEffect,то первоначальное значение состояния inputEmail не будет задано
    useEffect(() => {

        // если dataAdminFields?.data.email true,то есть поле email у объекта админ полей true,то есть оно есть(делаем эту проверку,так как выдает ошибку,что dataAdminFields?.data.email может быть undefined и что его нельзя назначить состоянию с типом string(можно было указать тип этому состоянию string | undefined,но тогда надо было бы делать проверки типа если dataAdminFields?.data.email true при проверке этого инпута в форме для изменения почты))
        if (dataAdminFields?.data.email) {

            setInputEmail(dataAdminFields?.data.email);

        }

    }, [dataAdminFields?.data])

    const cancelFormHandler = () => {

        // изменяем состояния для формы изменения почты на дефолтные значения
        setTabChangeEmail(false); // убираем форму,изменяя состояние tabChangeEmail на false

        // если dataAdminFields?.data.email true,то есть поле email у объекта админ полей true,то есть оно есть(делаем эту проверку,так как выдает ошибку,что dataAdminFields?.data.email может быть undefined и что его нельзя назначить состоянию с типом string(можно было указать тип этому состоянию string | undefined,но тогда надо было бы делать проверки типа если dataAdminFields?.data.email true при проверке этого инпута в форме для изменения почты))
        if (dataAdminFields?.data.email) {

            setInputEmail(dataAdminFields?.data.email); // очищаем инпут почты

        }

        setErrorEmailForm(''); // убираем ошибку формы,если она была

    }

    // функция для формы изменения почты для админа,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const submitFormChangeEmail = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если инпут почты includes('.') false(то есть инпут почты не включает в себя точку) или значение инпута почты,отфильтрованное по пробелам( trim() ), по количеству символов меньше 4,то показываем ошибку
        if (!inputEmail.includes('.') || inputEmail.trim().length < 4) {

            setErrorEmailForm('Enter email correctly'); // показываем ошибку формы

        } else {

            // оборачиваем в try catch для отлавливания ошибок
            try {

                const response = await $api.put('/changeEmail', { newEmail: inputEmail.trim() });  // делаем запрос на сервер(лучше было это вынести в отдельную функцию,но уже сделали так),используем здесь наш axios с определенными настройками($api),которые мы задали ему в файле http,чтобы правильно работали запросы на authMiddleware на проверку на access токен на бэкэнде, и в объекте тела запроса указываем поле для новой почты,указываем inputEmail.trim(),то есть отфильтрованной по пробелам,иначе,если указать правильно почту,но поставить перед ней или после нее пробелы,то валидатор на бэкэнде будет считать,что эта почта неправильная

                console.log(response.data);

                refetchAdminFields(); // переобновляем данные объекта админ полей

                setTabChangeEmail(false); // изменяем значение tabChangeEmail на false,чтобы убрать форму для изменения почты

                // если dataAdminFields?.data.email true,то есть поле email у объекта админ полей true,то есть оно есть(делаем эту проверку,так как выдает ошибку,что dataAdminFields?.data.email может быть undefined и что его нельзя назначить состоянию с типом string(можно было указать тип этому состоянию string | undefined,но тогда надо было бы делать проверки типа если dataAdminFields?.data.email true при проверке этого инпута в форме для изменения почты))
                if (dataAdminFields?.data.email) {

                    setInputEmail(dataAdminFields?.data.email); // очищаем инпут почты

                }

                setErrorEmailForm(''); // убираем ошибку формы

            } catch (e: any) {

                console.log(e.response?.data?.message);

                return setErrorEmailForm(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не закрывался таб с инпутом для изменения почты и тд,если есть ошибка

            }


        }

    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__inner">
                    <div className="footer__topBlock">
                        <ul className="footer__topBlock-list">
                            <h1 className="footer__item-title">Need Help</h1>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Contact Us</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">FAQ's</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Career</Link>
                            </li>
                        </ul>
                        <ul>
                            <h1 className="footer__item-title">Company</h1>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">About Us</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Euphoria Blog</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Collaboration</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Media</Link>
                            </li>
                        </ul>
                        <ul>
                            <h1 className="footer__item-title">More Info</h1>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Term and Conditions</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Privacy Policy</Link>
                            </li>
                            <li className="footer__list-item">
                                <Link to="/aboutUs" className="footer__item-link">Shipping Policy</Link>
                            </li>
                        </ul>
                        <ul>
                            <h1 className="footer__item-title">Location</h1>
                            <li className="footer__list-item footer__list-itemEmail">

                                {/* если состояние таба tabChangeEmail false,то показываем почту и кнопку,чтобы изменить почту,если это состояние tabChangeEmail будет равно true,то этот блок показываться не будет */}
                                {!tabChangeEmail &&

                                    <>
                                        {/* указываем в href этой ссылке mailto: и название почты(чтобы по этой ссылке открывалась почта,чтобы сразу можно было писать,но в данном случае при нажатии на эту ссылку будет всплывающее окно,с вопросом о том,какое приложение использовать для открытия этой ссылки,и если выбрать просто браузер,то он просто откроется с пустой вкладкой в новом окне приложения,лучше выбирать приложение outlook(оно вроде поддерживает почту),но там надо сначала зарегестрироваться) */}
                                        <a href={`mailto:${dataAdminFields?.data.email}`}className="footer__item-link">{dataAdminFields?.data.email}</a>

                                        {/* делаем проверку если user.role === 'ADMIN' (если роль у пользователя сейчас админ),то показываем кнопку изменения почты */}
                                        {user.role === 'ADMIN' &&

                                            <button className="adminForm__item-imageBlockBtn sectionUserPage__item-priceBlockChangeBtn footer__changeEmailBtn" type="button" onClick={() => setTabChangeEmail(true)} >
                                                <img src="/images/sectionUserPage/CrossImg.png" alt="" className="adminForm__imageBlockBtn-img" />
                                            </button>

                                        }
                                    </>

                                }

                                {/* если tabChangeEmail true,то показываем этот блок */}
                                {tabChangeEmail &&

                                    <form className="footer__formChangeEmail" onSubmit={submitFormChangeEmail}>

                                        <div className="formChangeEmail__item">
                                            <p className="formChangeEmail__item-text">New Email</p>
                                            <input type="text" className="signInForm__inputEmailBlock-input footer__formChangeEmail-inputEmail" placeholder="Email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} />
                                        </div>

                                        {/* если errorEmailForm true(то есть в состоянии errorEmailForm что-то есть),то показываем текст ошибки */}
                                        {errorEmailForm && <p className="formErrorText">{errorEmailForm}</p>}

                                        <div className="form__mainBlock-bottomBlock">
                                            {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                            <button className="signInForm__btn sectionUserPage__formInfo-btn" type="submit">Save Changes</button>

                                            <button className="reviews__form-cancelBtn footer__changeEmailForm-cancelBtn" type="button" onClick={cancelFormHandler}>Cancel</button>
                                        </div>

                                    </form>

                                }


                            </li>
                            <li className="footer__list-item">
                                <p className="footer__item-text">Eklingpura Chouraha, Ahmedabad Main Road</p>
                            </li>
                            <li className="footer__list-item">
                                <p className="footer__item-text">(NH 8- Near Mahadev Hotel) Udaipur, India - 313002</p>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__bottomBlock">
                        <p className="footer__bottomBlock-text">Copyright © 2023 Euphoria Folks Pvt Ltd. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;