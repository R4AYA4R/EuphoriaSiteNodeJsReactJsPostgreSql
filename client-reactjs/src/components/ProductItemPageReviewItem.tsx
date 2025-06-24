
const ProductItemPageReviewItem = () => {

    return (
        <div className="reviews__leftBlock-item">
            <div className="reviews__item-topBlock">
                <div className="reviews__item-topBlockLeftInfo">
                    <img src="/images/sectionProductItemPage/Profile.png" alt="" className="reviews__item-img" />
                    <div className="reviews__item-topBlockLeftInfo--info">
                        <p className="reviews__item-title">Bob</p>
                        <div className="sectionNewArrivals__item-stars">

                            {/* если product.rating равно 0,то показываем пустую звезду,в другом случае если product.rating больше или равно 0.5 и меньше или равно 0.9,то показываем половину звезды,в другом случае показываем целую звезду */}
                            <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                            <img src="/images/sectionNewArrivals/Vector (2).png" alt="" className="sectionNewArrivals__item-starsImg" />
                        </div>
                    </div>
                </div>
                <p className="reviews__item-topBlockTime">10.10.2000</p>
            </div>
            <p className="reviews__item-text">Desc</p>

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