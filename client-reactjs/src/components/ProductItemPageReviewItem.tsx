import { QueryObserverResult } from "@tanstack/react-query";
import { IComment, ICommentResponse, IUser } from "../types/types";
import { AxiosResponse } from "axios";

interface IProductItemPageReviewItem {
    user: IUser,
    comment: IComment,
    refetchComments: () => Promise<QueryObserverResult<ICommentResponse, Error>> // указываем этому полю,что это стрелочная функция и возвращает Promise<QueryObserverResult<ICommentResponse, Error>> (этот тип скопировали из файла ProductItemPage.tsx у этой функции refetchComments),то есть указываем,что эта функция возвращает Promise,внутри которого тип QueryObserverResult,внутри которого наш тип ICommentResponse и тип Error, если бы мы в функции запроса на получение комментариев возвращали бы response,а не response.data,то тип у этой функции запроса на сервер был бы Promise<QueryObserverResult<AxiosResponse<ICommentResponse, any>, Error>>,но в данном случае возвращаем response.data,поэтому тип Promise<QueryObserverResult<ICommentResponse, Error>> 
}

const ProductItemPageReviewItem = ({ comment, user, refetchComments }: IProductItemPageReviewItem) => {

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