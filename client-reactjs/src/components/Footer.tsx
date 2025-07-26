import { Link } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { FormEvent, useState } from "react";

const Footer = () => {

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const [tabChangeEmail, setTabChangeEmail] = useState(false);

    const [inputEmail, setInputEmail] = useState('');

    const [errorEmailForm, setErrorEmailForm] = useState('');

    const cancelFormHandler = () => {

        // изменяем состояния для формы изменения почты на дефолтные значения
        setTabChangeEmail(false); // убираем форму,изменяя состояние tabChangeEmail на false

        setInputEmail(''); // очищаем инпут почты

        setErrorEmailForm(''); // убираем ошибку формы,если она была

    }

    // функция для формы изменения почты для админа,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const submitFormChangeEmail = async (e:FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если инпут почты includes('.') false(то есть инпут почты не включает в себя точку) или значение инпута почты,отфильтрованное по пробелам( trim() ), по количеству символов меньше 4,то показываем ошибку
        if(!inputEmail.includes('.') || inputEmail.trim().length < 4){

            setErrorEmailForm('Enter email correctly'); // показываем ошибку формы

        } else {


            // здесь надо будет делать запрос на сервер для изменения почты на сайте


            setTabChangeEmail(false); // изменяем значение tabChangeEmail на false,чтобы убрать форму для изменения почты

            setInputEmail(''); // очищаем инпут почты

            setErrorEmailForm(''); // убираем ошибку формы

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
                                        <Link to="/aboutUs" className="footer__item-link">supporteuphoria@gmail.com</Link>

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