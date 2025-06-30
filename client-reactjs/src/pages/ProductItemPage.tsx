import { ChangeEvent, FormEvent, RefObject, useEffect, useRef, useState } from "react";
import SectionUnderTopProductPage from "../components/SectionUnderTopProductPage";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct } from "../types/types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductItemPageItemBlock from "../components/ProductItemPageItemBlock";
import ProductItemPageReviewItem from "../components/ProductItemPageReviewItem";
import SectionNewArrivals from "../components/SectionNewArrivals";
import { useTypedSelector } from "../hooks/useTypedSelector";



const ProductItemPage = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { pathname } = useLocation(); // берем pathname(url страницы) из useLocation()

    const [tab, setTab] = useState('Desc');

    const [activeForm, setActiveForm] = useState(false);

    const [activeStarsForm, setActiveStarsForm] = useState(0);

    const [errorForm, setErrorForm] = useState('');

    const [textAreaValue, setTextAreaValue] = useState('');

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const { data, refetch, isFetching: isFetchingProductById } = useQuery({
        queryKey: [`getProductById${params.id}`], // делаем отдельный queryKey для каждого товара с помощью params.id,чтобы правильно отображалась пагинация комментариев при переходе на разные страницы товаров(чтобы для каждого товара был свой уникальный queryKey(название(id) для данных в react query))
        queryFn: async () => {

            const response = await axios.get<IProduct>(`${process.env.REACT_APP_BACKEND_URL}/api/getProductsCatalog/${params.id}`); // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IProduct для объекта товара)

            console.log(response.data);

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет объект товара) и тд

        }
    })

    // при изменении pathname(url страницы),делаем запрос на обновление данных о товаре(иначе не меняются данные) и изменяем таб на Desc(описание товара),если вдруг был включен другой таб,то при изменении url страницы будет включен опять дефолтный таб,также изменяем значение количества товара,если было выбрано уже какое-то,чтобы поставить первоначальное, и убираем форму добавления комментария,если она была открыта,и изменяем значение состоянию activeStarsForm на 0,то есть убираем звезды в форме для коментария,если они были выбраны,также убираем ошибку формы,если она была
    useEffect(() => {

        refetch();

        setActiveStarsForm(0);

        setActiveForm(false);

        setErrorForm('');

        setTab('Desc');

        setTextAreaValue('');

        // здесь еще надо будет изменять состояние страницы пагинации комментариев на 1 и переобновлять массив комментариев


    }, [pathname])

    useEffect(() => {

        refetch();

    }, [data?.data])

    // функция для формы для создания комментария,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)   
    const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();  // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если значение textarea (.trim()-убирает из строки пробелы,чтобы нельзя было ввести только пробел) в форме комментария будет по количеству символов меньше или равно 10 или больше 300,то будем изменять состояние errorForm(то есть показывать ошибку и не отправлять комментарий),в другом случае очищаем поля textarea,activeStars(рейтинг,который пользователь указал в форме) и убираем форму
        if(textAreaValue.trim().length <= 10 || textAreaValue.trim().length > 300){

            setErrorForm('Review must be 10 - 300 characters');

        } else if(activeStarsForm === 0){

            // если состояние рейтинга в форме равно 0,то есть пользователь не указал рейтинг,то показываем ошибку
            setErrorForm('Enter rating');

        } else {

            const date = new Date(); // создаем объект на основе класса Date(класс в javaScript для работы с датой и временем)

            let monthDate = (date.getMonth() + 1).toString(); // помещаем в переменную номера текущего месяца,указываем ей let,чтобы можно было изменять ей значение потом, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString()

            let dayDate = (date.getDate()).toString(); // помещаем в переменную текущее число месяца,указываем ей let,чтобы можно было изменять ей значение потом, date.getDate() - показывает текущее число календаря и потом приводим получившееся значение к формату строки с помощью toString(),чтобы проверить на количество символов 

            // если monthDate.length < 2(то есть monthDate по количеству символов меньше 2,то есть текущий месяц состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед месяцами меньше 10
            if(monthDate.length < 2){

                monthDate = '0' + monthDate; // изменяем значение monthDate на 0 + текущее значение monthDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

            } else {
                // в другом случае,если условие выше не сработало,то изменяем monthDate на monthDate,то есть оставляем этой переменной такое же значение как и изначальное
                monthDate = monthDate;

            }

            // если dayDate.length < 2(то есть dayDate по количеству символов меньше 2,то есть текущее число месяца состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед месяцами меньше 10
            if(dayDate.length < 2){

                dayDate = '0' + dayDate; // изменяем значение dayDate на 0 + текущее значение dayDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

            } else {
                // в другом случае,если условие выше не сработало,то изменяем dayDate на dayDate,то есть оставляем этой переменной такое же значение как и изначальное
                dayDate = dayDate;

            }

            // помещаем в переменную showTime значение времени,когда создаем комментарий, date.getDate() - показывает текущее число календаря, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString(), getFullYear() - показывает текущий год,потом эту переменную showTime будем сохранять в объект для создания комментария на сервере и потом показывать дату создания комментария уже на клиенте(в данном случае на этой странице у комментария),вынесли подсчет месяца в переменную monthDate и тут ее указываем,также и подсчет текущего числа месяца в переменную dayDate и тут ее указываем
            const showTime = dayDate + '.' + monthDate + '.' + date.getFullYear();


            // здесь надо будет делать запрос на создание комментария

            setActiveForm(false); // убираем форму,изменяя состояние activeForm на false

            setActiveStarsForm(0); // убираем звезды формы(ставим их на дефолтное значение,изменяя состояние activeStarsForm на 0),которые мог пользователь ввести

            setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь мог ввести

            setErrorForm(''); // убираем ошибку формы,если она была

        }

    }

    const cancelFormHandler = () => {

        setActiveForm(false); // убираем форму,изменяя состояние activeForm на false

        setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь мог ввести

        setActiveStarsForm(0); // убираем выбранные пользователем звезды

        setErrorForm(''); // убираем ошибку формы,если она была

    }

    // указываем,что эта функция ничего не возвращает(то есть указываем ей тип возвращаемых данных как void),в данном случае это не обязательно делать,так как это и так понятно,но так как используем typescript и чтобы лучше попрактиковаться и больше его использовать,указываем это,также vs code автоматически подхватывает тип возвращаемых данных,если функция ничего не возвращает и в данном случае указывать это не обязательно
    const addReviewsBtn = ():void => {

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то показываем форму,в другом случае перекидываем пользователя на страницу авторизации 
        if(user.userName){

            setActiveForm(true); // изменяем состояние активной формы,то есть показываем форму для создания комментария 

        } else {

            router('/userPage'); // перекидываем пользователя на страницу авторизации (/userPage в данном случае)

        }

    }


    return (
        <main className="main">
            <SectionUnderTopProductPage productName="Product Name" />
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active sectionProductItemPage" : "sectionCatalog sectionProductItemPage"} ref={sectionCatalog}>

                {/* вынесли блок с информацией о товаре и слайдером в наш компонент ProductItemPageItemBlock,так как там много кода,передаем туда как пропс(параметр) product со значением data?.data(объект товара),также передаем поле pathname(url страницы),чтобы потом при его изменении изменять значение количества товара,так как оно находится в этом компоненте ProductItemPageItemBlock,указываем именно таким образом pathname={pathname},иначе выдает ошибку типов,передаем функцию refetch для переобновления данных товара(повторный запрос на сервер для переобновления данных товара) и указываем ему название как refetchProduct(просто название этого пропса(параметра)) */}
                <ProductItemPageItemBlock product={data?.data} pathname={pathname} />

                {/* указываем здесь контейнер,так как для блока ProductItemPageItemBlock нужен контейнер в отдельной его части по такому дизайну */}
                <div className="container">

                    <div className="sectionProductItemPage__descBlock">
                        <div className="sectionCategories__topBlock sectionProductItemPage__descBlock-topBlock">
                            <div className="sectionCategories__topBlock-leftBorderBlock"></div>
                            <h1 className="sectionCategories__topBlock-title">Product Description</h1>
                        </div>

                        <div className="sectionProductItemPage__descBlock-tabs">
                            <button className={tab === 'Desc' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Desc')}>Description</button>
                            <button className={tab === 'Reviews' ? "descBlock__tabs-btn descBlock__tabs-btnReviews descBlock__tabs-btn--active" : "descBlock__tabs-btn descBlock__tabs-btnReviews"} onClick={() => setTab('Reviews')}>
                                <p className="tabs__btnReviews-text">Reviews</p>
                                <p className="tabs__btnReviews-text">(0)</p>
                            </button>
                        </div>

                        <div className="sectionProductItemPage__descBlock-desc">

                            {tab === 'Desc' &&
                                <div className="descBlock__desc-inner">
                                    <div className="descBlock__desc-leftBlock">
                                        <p className="descBlock__desc-text">{data?.data.descText}</p>
                                        <p className="descBlock__desc-text">Our collection of clothes will make you the trendsetter with an iconic resemblance of choice in Styled Wear. It is quite evident to say that there are very few Styled Clothing online stores where you can buy Western Wear comprising the premium material and elegant design that you are always seeking for.</p>
                                    </div>
                                    <div className="descBlock__desc-rightBlock">
                                        <table className="descBlock__desc-table">
                                            <tbody className="desc__table-body">
                                                <tr className="desc__table-row">
                                                    <td className="desc__table-column">
                                                        <th className="desc__table-headText">Fabric</th>
                                                        <p className="desc__table-text">Bio-washed Cotton</p>
                                                    </td>
                                                    <td className="desc__table-column">
                                                        <th className="desc__table-headText">Pattern</th>
                                                        <p className="desc__table-text">Printed</p>
                                                    </td>
                                                    <td className="desc__table-column">
                                                        <th className="desc__table-headText">Fit</th>
                                                        <p className="desc__table-text">Regular-fit</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }

                            {tab === 'Reviews' &&
                                <div className="descBlock__desc-innerReviews">
                                    <div className="reviews__leftBlock">

                                        {/* <h4 className="reviews__leftBlock-text">No reviews yet.</h4> */}

                                        <div className="reviews__leftBlock-comments">

                                            <ProductItemPageReviewItem/>

                                        </div>

                                    </div>
                                    <div className="reviews__rightBlock">

                                        <div className={activeForm ? "reviews__rightBlock-btnBlock reviews__rightBlock-btnBlock--disabled" : "reviews__rightBlock-btnBlock"}>
                                            <button className="reviews__btnBlock-btn" onClick={addReviewsBtn}>Add Review</button>
                                        </div>

                                        <form className={activeForm ? "reviews__form reviews__form--active" : "reviews__form"} onSubmit={submitFormHandler}>
                                            <div className="reviews__form-topBlock">
                                                <div className="reviews__form-topBlockInfo">
                                                    <img src="/images/sectionProductItemPage/Profile.png" alt="" className="form__topBlockInfo-img" />
                                                    <p className="form__topBlockInfo-name">{user.userName}</p>
                                                </div>
                                                <div className="sectionNewArrivals__item-stars reviews__form-stars">
                                                    {/* указываем этой кнопке тип button(то есть обычная кнопка),так как это кнопка находится в форме и чтобы при нажатии на нее форма не отправлялась(то есть не срабатывало событие onSubmit у формы), по клику на эту кнопку изменяем состояние activeStarsForm на 1,то есть на 1 звезду */}
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(1)}>
                                                        {/* если activeStarsForm равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                                                        <img src={activeStarsForm === 0 ? "/images/sectionNewArrivals/Vector (2).png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(2)}>
                                                        <img src={activeStarsForm >= 2 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(3)}>
                                                        <img src={activeStarsForm >= 3 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(4)}>
                                                        <img src={activeStarsForm >= 4 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(5)}>
                                                        <img src={activeStarsForm >= 5 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="reviews__form-mainBlock">
                                                <textarea className="form__mainBlock-textArea" placeholder="Enter your comment" value={textAreaValue} onChange={(e) => setTextAreaValue(e.target.value)}></textarea>

                                                {/* если errorForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                                {errorForm !== '' && <p className="formErrorText">{errorForm}</p>}


                                                <div className="form__mainBlock-bottomBlock">
                                                    {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                                    <button className="reviews__btnBlock-btn" type="submit">Save Review</button>

                                                    <button className="reviews__form-cancelBtn" type="button" onClick={cancelFormHandler}>Cancel</button>
                                                </div>

                                            </div>
                                        </form>

                                    </div>
                                </div>
                            }

                        </div>

                    </div>

                </div>

            </section>

            <SectionNewArrivals/>

        </main>
    )
}

export default ProductItemPage;