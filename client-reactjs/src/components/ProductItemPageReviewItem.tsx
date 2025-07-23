import { QueryObserverResult } from "@tanstack/react-query";
import { IComment, ICommentResponse, IUser } from "../types/types";
import { AxiosResponse } from "axios";
import { FormEvent, useState } from "react";

interface IProductItemPageReviewItem {
    user: IUser,
    comment: IComment,
    refetchComments: () => Promise<QueryObserverResult<ICommentResponse, Error>> // указываем этому полю,что это стрелочная функция и возвращает Promise<QueryObserverResult<ICommentResponse, Error>> (этот тип скопировали из файла ProductItemPage.tsx у этой функции refetchComments),то есть указываем,что эта функция возвращает Promise,внутри которого тип QueryObserverResult,внутри которого наш тип ICommentResponse и тип Error, если бы мы в функции запроса на получение комментариев возвращали бы response,а не response.data,то тип у этой функции запроса на сервер был бы Promise<QueryObserverResult<AxiosResponse<ICommentResponse, any>, Error>>,но в данном случае возвращаем response.data,поэтому тип Promise<QueryObserverResult<ICommentResponse, Error>> 
}

const ProductItemPageReviewItem = ({ comment, user, refetchComments }: IProductItemPageReviewItem) => {

    const [activeAdminForm, setActiveAdminForm] = useState(false);

    const [errorAdminForm,setErrorAdminForm] = useState('');

    const [textAreaValue, setTextAreaValue] = useState('');

    // функция для формы для создания ответа от админа,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const submitAdminReplyForm = async (e:FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        

    }

    const cancelFormHandler = () => {

        setActiveAdminForm(false); // убираем форму,изменяя состояние activeAdminForm на false

        setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь(админ) мог ввести

        setErrorAdminForm(''); // убираем ошибку формы,если она была

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
            </div>
            <p className="reviews__item-text">{comment.text}</p>

            {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор) и если comment.adminReply false(или null,или undefined,или другое false значение),то есть поле adminReply у comment(объект комментария) не указано,или в нем нету значения(то есть у этого комментария нету еще ответа от админа),то показываем блок и кнопку для добавления ответа от админа,в другом случае этот блок(div элемент со всей формой и тд) и кнопка показана не будет */}
            {user.role === 'ADMIN' && !comment.adminReply &&

                <div className="reviews__item-adminCommentBlock">

                    <button className={activeAdminForm ? "reviews__item-btnAnswer reviews__item-btnAnswer--disabled" : "reviews__item-btnAnswer"} onClick={() => setActiveAdminForm(true)}>Add Reply</button>

                    <form className={activeAdminForm ? "reviews__form reviews__form--active" : "reviews__form"} onSubmit={submitAdminReplyForm}>
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

            {/* здесь еще будем делать форму для ответа от админа и тд */}
            {/* <div className="reviews__item-adminCommentBlock">
                <p className="reviews__item-topBlockReplyText">Reply for Username</p>
                <div className="reviews__item-topBlock">
                    <div className="reviews__item-topBlockLeftInfo">
                        <img src="/images/sectionProductItemPage/Profile.png" alt="" className="reviews__item-img" />
                        <div className="reviews__item-topBlockLeftInfo--info">
                            <p className="reviews__item-title">Admin</p>
                        </div>
                    </div>
                    <p className="reviews__item-topBlockTime">10.10.2000</p>
                </div>
                <p className="reviews__item-text">Comment admin</p>
            </div> */}

        </div>
    )

}

export default ProductItemPageReviewItem;