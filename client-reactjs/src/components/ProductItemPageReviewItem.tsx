import { QueryObserverResult } from "@tanstack/react-query";
import { IComment, ICommentResponse, IUser } from "../types/types";
import { AxiosResponse } from "axios";
import { FormEvent, useState } from "react";
import $api from "../http/http";

interface IProductItemPageReviewItem {
    user: IUser,
    comment: IComment,
    refetchComments: () => Promise<QueryObserverResult<ICommentResponse, Error>>, // указываем этому полю,что это стрелочная функция и возвращает Promise<QueryObserverResult<ICommentResponse, Error>> (этот тип скопировали из файла ProductItemPage.tsx у этой функции refetchComments),то есть указываем,что эта функция возвращает Promise,внутри которого тип QueryObserverResult,внутри которого наш тип ICommentResponse и тип Error, если бы мы в функции запроса на получение комментариев возвращали бы response,а не response.data,то тип у этой функции запроса на сервер был бы Promise<QueryObserverResult<AxiosResponse<ICommentResponse, any>, Error>>,но в данном случае возвращаем response.data,поэтому тип Promise<QueryObserverResult<ICommentResponse, Error>> 

    refetchCommentsArrivals: () => Promise<QueryObserverResult<ICommentResponse, Error>> // указываем этому полю,что это стрелочная функция и возвращает Promise<QueryObserverResult<ICommentResponse, Error>> (этот тип скопировали из файла ProductItemPage.tsx у этой функции refetchComments),то есть указываем,что эта функция возвращает Promise,внутри которого тип QueryObserverResult,внутри которого наш тип ICommentResponse и тип Error, если бы мы в функции запроса на получение комментариев возвращали бы response,а не response.data,то тип у этой функции запроса на сервер был бы Promise<QueryObserverResult<AxiosResponse<ICommentResponse, any>, Error>>,но в данном случае возвращаем response.data,поэтому тип Promise<QueryObserverResult<ICommentResponse, Error>> 
}

const ProductItemPageReviewItem = ({ comment, user, refetchComments,refetchCommentsArrivals }: IProductItemPageReviewItem) => {

    const [activeAdminForm, setActiveAdminForm] = useState(false);

    const [errorAdminForm, setErrorAdminForm] = useState('');

    const [textAreaValue, setTextAreaValue] = useState('');

    // функция для формы для создания ответа от админа,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const submitAdminReplyForm = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если значение textarea (.trim()-убирает из строки пробелы,чтобы нельзя было ввести только пробел) в форме ответа от админа для комментария будет по количеству символов меньше или равно 10 или больше 300,то будем изменять состояние errorAdminForm(то есть показывать ошибку и не отправлять ответ от админа для комментария),в другом случае очищаем поля textarea и тд и убираем форму
        if (textAreaValue.trim().length <= 10 || textAreaValue.trim().length > 300) {

            setErrorAdminForm('Reply must be 11 - 300 characters');

        } else {

            // оборачиваем в try catch для отлавливания ошибок
            try {

                const date = new Date(); // создаем объект на основе класса Date(класс в javaScript для работы с датой и временем)

                let monthDate = (date.getMonth() + 1).toString(); // помещаем в переменную номера текущего месяца,указываем ей let,чтобы можно было изменять ей значение потом, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString()

                let dayDate = (date.getDate()).toString(); // помещаем в переменную текущее число месяца,указываем ей let,чтобы можно было изменять ей значение потом, date.getDate() - показывает текущее число календаря и потом приводим получившееся значение к формату строки с помощью toString(),чтобы проверить на количество символов 

                // если monthDate.length < 2(то есть monthDate по количеству символов меньше 2,то есть текущий месяц состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед месяцами меньше 10
                if (monthDate.length < 2) {

                    monthDate = '0' + monthDate; // изменяем значение monthDate на 0 + текущее значение monthDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

                } else {
                    // в другом случае,если условие выше не сработало,то изменяем monthDate на monthDate,то есть оставляем этой переменной такое же значение как и изначальное
                    monthDate = monthDate;

                }

                // если dayDate.length < 2(то есть dayDate по количеству символов меньше 2,то есть текущее число месяца состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед днями(числами) меньше 10
                if (dayDate.length < 2) {

                    dayDate = '0' + dayDate; // изменяем значение dayDate на 0 + текущее значение dayDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

                } else {
                    // в другом случае,если условие выше не сработало,то изменяем dayDate на dayDate,то есть оставляем этой переменной такое же значение как и изначальное
                    dayDate = dayDate;

                }

                // помещаем в переменную showTime значение времени,когда создаем комментарий, date.getDate() - показывает текущее число календаря, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString(), getFullYear() - показывает текущий год,потом эту переменную showTime будем сохранять в объект для создания комментария на сервере и потом показывать дату создания комментария уже на клиенте(в данном случае на этой странице у комментария),вынесли подсчет месяца в переменную monthDate и тут ее указываем,также и подсчет текущего числа месяца в переменную dayDate и тут ее указываем
                const showTime = dayDate + '.' + monthDate + '.' + date.getFullYear();

                const response = await $api.put<IComment>('/addReplyForComment', {
                    ...comment, adminReply: {
                        text: textAreaValue,
                        createdTime: showTime
                    }
                }); // делаем put запрос на сервер и изменяем данные на сервере,указываем тип данных,которые нужно добавить на сервер(в данном случае IComment),но здесь не обязательно указывать тип,в тело запроса передаем объект,в который разворачиваем все поля объекта comment(пропс(параметр) этого компонента ProductItemPageReviewItem,то есть объект комментария) и добавляем поле adminReply со значением объекта с полями,указываем полю text значение как textAreaValue,а полю createdTime значение как showTime,используем тут наш инстанс axios ($api),чтобы правильно обрабатывался этот запрос для проверки на access токен с помощью нашего authMiddleware на нашем сервере

                console.log(response.data);

                refetchComments(); // переобновляем массив комментариев(делаем повторный запрос на сервер для их получения)

            } catch (e: any) {

                console.log(e.response?.data?.message); // выводим ошибку в логи

                return setErrorAdminForm(e.response?.data?.message); // возвращаем и показываем ошибку в форме,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию

            }

        }

    }

    const cancelFormHandler = () => {

        setActiveAdminForm(false); // убираем форму,изменяя состояние activeAdminForm на false

        setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь(админ) мог ввести

        setErrorAdminForm(''); // убираем ошибку формы,если она была

    }

    // фукнция для удаления ответа от админа для удаления по кнопке
    const deleteReplyFromAdminByBtn = async () => {

        // оборачиваем в try catch для отлавливания ошибок
        try {

            const response = await $api.delete<IComment>(`/deleteReplyFromAdmin/${comment.id}`); // делаем запрос на сервер для удаления ответа от админа, указываем в ссылке на эндпоинт параметр comment.id(id у объекта комментария),чтобы на бэкэнде его достать,здесь используем наш axios с определенными настройками ($api в данном случае),так как на бэкэнде у этого запроса на удаление проверяем пользователя на access токен,так как проверяем,валидный(годен ли по сроку годности еще) ли access токен у пользователя(админа в данном случае) или нет), указываем в generic тип данных,который вернется в ответе от сервера(в данном случае это будет наш тип IComment)

            console.log(response.data); // выводим в логи ответ от сервера

            refetchComments(); // переобновляем массив комментариев

        } catch (e: any) {

            console.log(e.response?.data?.message); // выводим ошибку в логи

        }

    }

    // фукнция для удаления комментария для админа для удаления по кнопке
    const deleteCommentForAdminByBtn = async () => {

        // оборачиваем в try catch для отлавливания ошибок
        try {

            const response = await $api.delete(`/deleteComment/${comment.id}`); // делаем запрос на сервер для удаления комментария, указываем в ссылке на эндпоинт параметр comment.id(id у объекта комментария),чтобы на бэкэнде его достать,здесь используем наш axios с определенными настройками ($api в данном случае),так как на бэкэнде у этого запроса на удаление проверяем пользователя на access токен,так как проверяем,валидный(годен ли по сроку годности еще) ли access токен у пользователя(админа в данном случае) или нет)

            console.log(response.data); // выводим в логи ответ от сервера

            refetchComments(); // переобновляем массив комментариев

            refetchCommentsArrivals(); // переобновляем массив комментариев для секции sectionNewArrivals,чтобы там сразу переобновилось число комментариев для товара,а не после обновления страницы

        } catch (e: any) {

            console.log(e.response?.data?.message); // выводим ошибку в логи

        }

    }

    return (
        <div className="reviews__leftBlock-item">
            <div className="reviews__item-topBlock">
                <div className="reviews__item-topBlockLeftInfo">
                    <img src="/images/sectionProductItemPage/Profile.png" alt="" className="reviews__item-img" />
                    <div className="reviews__item-topBlockLeftInfo--info">
                        <p className="reviews__item-title">{comment.name}</p>
                        <div className="sectionNewArrivals__item-stars">

                            {/* если product.rating равно 0,то показываем пустую звезду,в другом случае если product.rating больше или равно 0.5 и меньше или равно 0.9,то показываем половину звезды,в другом случае показываем целую звезду */}
                            <img src={comment.rating === 0 ? "/images/sectionNewArrivals/Vector (2).png" : comment.rating >= 0.5 && comment.rating < 1 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src={comment.rating >= 2 ? "/images/sectionNewArrivals/Vector (1).png" : comment.rating >= 1.5 && comment.rating < 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src={comment.rating >= 3 ? "/images/sectionNewArrivals/Vector (1).png" : comment.rating >= 2.5 && comment.rating < 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src={comment.rating >= 4 ? "/images/sectionNewArrivals/Vector (1).png" : comment.rating >= 3.5 && comment.rating < 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src={comment.rating >= 5 ? "/images/sectionNewArrivals/Vector (1).png" : comment.rating >= 4.5 && comment.rating < 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                        </div>
                    </div>
                </div>
                <p className="reviews__item-topBlockTime">{comment.createdTime}</p>

                {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор),то показываем кнопку для удаления комментария для админа */}
                {user.role === 'ADMIN' &&
                    // в onClick этой button указываем нашу функцию deleteCommentForAdminByBtn для удаления комментария для админа
                    <button className="adminForm__item-imageBlockBtn reviews__item-topBlockDeleteBtn" type="button" onClick={deleteCommentForAdminByBtn} >
                        <img src="/images/sectionUserPage/CrossImg.png" alt="" className="adminForm__imageBlockBtn-img" />
                    </button>

                }

            </div>
            <p className="reviews__item-text">{comment.text}</p>

            {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор) и если comment.adminReply false(или null,или undefined,или другое false значение),то есть поле adminReply у comment(объект комментария) не указано,или в нем нету значения(то есть у этого комментария нету еще ответа от админа),то показываем блок и кнопку для добавления ответа от админа,в другом случае этот блок(div элемент со всей формой и тд) и кнопка показана не будет */}
            {user.role === 'ADMIN' && !comment.adminReply &&

                <div className="reviews__item-adminCommentBlock">

                    <button className={activeAdminForm ? "reviews__item-btnAnswer reviews__item-btnAnswer--disabled" : "reviews__item-btnAnswer"} onClick={() => setActiveAdminForm(true)}>Add Reply</button>

                    <form className={activeAdminForm ? "reviews__formAnswer reviews__formAnswer--active" : "reviews__formAnswer"} onSubmit={submitAdminReplyForm}>
                        <div className="reviews__form-topBlock">
                            <div className="reviews__form-topBlockInfo">
                                <img src="/images/sectionProductItemPage/Profile.png" alt="" className="form__topBlockInfo-img" />
                                <p className="form__topBlockInfo-name">ADMIN</p>
                            </div>
                        </div>
                        <div className="reviews__form-mainBlock">
                            <textarea className="form__mainBlock-textArea" placeholder="Enter your comment" value={textAreaValue} onChange={(e) => setTextAreaValue(e.target.value)}></textarea>

                            {/* если errorAdminForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                            {errorAdminForm !== '' && <p className="formErrorText">{errorAdminForm}</p>}

                            <div className="form__mainBlock-bottomBlock">
                                {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                <button className="reviews__btnBlock-btn" type="submit">Save Reply</button>

                                <button className="reviews__form-cancelBtn" type="button" onClick={cancelFormHandler}>Cancel</button>
                            </div>

                        </div>
                    </form>

                </div>

            }

            {/* если comment.adminReply true,то есть поле adminReply у объекта comment(объект комментария) есть и в нем есть какое-то значение,то показываем блок с ответом от админа для этого комментария*/}
            {comment.adminReply &&

                <div className="reviews__item-adminCommentBlock">

                    {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор),то показываем кнопку для удаления ответа от админа */}
                    {user.role === 'ADMIN' &&
                        // в onClick этой button указываем нашу функцию deleteReplyFromAdminByBtn для удаления ответа от админа
                        <button className="adminForm__item-imageBlockBtn reviews__item-adminCommentBlockDeleteBtn" type="button" onClick={deleteReplyFromAdminByBtn} >
                            <img src="/images/sectionUserPage/CrossImg.png" alt="" className="adminForm__imageBlockBtn-img" />
                        </button>

                    }

                    <p className="reviews__item-topBlockReplyText">Reply for {comment.name}</p>
                    <div className="reviews__item-topBlock">
                        <div className="reviews__item-topBlockLeftInfo">
                            <img src="/images/sectionProductItemPage/Profile.png" alt="" className="reviews__item-img" />
                            <div className="reviews__item-topBlockLeftInfo--info">
                                <p className="reviews__item-title">Admin</p>
                            </div>
                        </div>
                        <p className="reviews__item-topBlockTime">{comment.adminReply.createdTime}</p>
                    </div>
                    <p className="reviews__item-text">{comment.adminReply.text}</p>
                </div>

            }


        </div>
    )

}

export default ProductItemPageReviewItem;