import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionNewArrivals = () => {

    const sectionCategories = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategories as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section id="sectionCategories" className={onScreen.sectionCategoriesIntersecting ? "sectionCategories sectionCategories__active sectionNewArrivals" : "sectionCategories sectionNewArrivals"} ref={sectionCategories}>
            <div className="container">
                <div className="sectionNewArrivals__inner">
                    <div className="sectionCategories__topBlock">
                        <div className="sectionCategories__topBlock-leftBorderBlock"></div>
                        <h1 className="sectionCategories__topBlock-title">New Arrivals</h1>
                    </div>
                    <div className="sectionNewArrivals__items">
                        <div className="sectionNewArrivals__item">
                            <img src="/images/sectionNewArrivals/Rectangle 25.jpg" alt="" className="sectionNewArrivals__item-img" />
                            <h2 className="sectionNewArrivals__item-title">Black Sweatshirt with...</h2>
                            <div className="sectionNewArrivals__item-starsBlock">
                                <div className="sectionNewArrivals__item-stars">
                                    {/* будем здесь делать проверку типа если рейтинг больше 0.5,то картинка половины здезы,если больше 1,то целая звезда,в другом случае пустая звезда */}
                                    <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector (2).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                </div>
                                <p className="sectionNewArrivals__item-starsAmount">(0)</p>
                            </div>
                            <div className="sectionNewArrivals__item-priceBlock">
                                <p className="item__priceBlock-priceSale">$10</p>
                                <p className="item__priceBlock-priceUsual">$12</p>
                            </div>
                            <div className="sectionNewArrivals__item-cartBlock">
                                <button className="sectionNewArrivals__cartBlock-btn">
                                    <p className="cartBlock__btn-text">Add to Cart</p>
                                    <img src="/images/sectionNewArrivals/shopping cart.png" alt="" className="cartBlock__btn-img" />
                                </button>
                            </div>
                        </div>
                        <div className="sectionNewArrivals__item">
                            <img src="/images/sectionNewArrivals/Rectangle 26.jpg" alt="" className="sectionNewArrivals__item-img" />
                            <h2 className="sectionNewArrivals__item-title">Line Pattern Black H...</h2>
                            <div className="sectionNewArrivals__item-starsBlock">
                                <div className="sectionNewArrivals__item-stars">
                                    {/* будем здесь делать проверку типа если рейтинг больше 0.5,то картинка половины здезы,если больше 1,то целая звезда,в другом случае пустая звезда */}
                                    <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector (2).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                </div>
                                <p className="sectionNewArrivals__item-starsAmount">(0)</p>
                            </div>
                            <div className="sectionNewArrivals__item-priceBlock">
                                <p className="item__priceBlock-priceUsualDefault">$15</p>
                            </div>
                            <div className="sectionNewArrivals__item-cartBlock">
                                <button className="sectionNewArrivals__cartBlock-btn">
                                    <p className="cartBlock__btn-text">Add to Cart</p>
                                    <img src="/images/sectionNewArrivals/shopping cart.png" alt="" className="cartBlock__btn-img" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionNewArrivals;