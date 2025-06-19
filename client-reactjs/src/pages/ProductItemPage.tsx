import { RefObject, useRef } from "react";
import SectionUnderTopProductPage from "../components/SectionUnderTopProductPage";
import { useIsOnScreen } from "../hooks/useIsOnScreen";


const ProductItemPage = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <main className="main">
            <SectionUnderTopProductPage productName="Product Name" />
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active sectionProductItemPage" : "sectionCatalog sectionProductItemPage"} ref={sectionCatalog}>

                <div className="sectionProductItemPage__itemBlock-inner">
                    <div className="sectionProductItemPage__leftBlock">
                        <div className="container">

                            {/* здесь надо будет делать слайдер */}

                        </div>
                    </div>
                    <div className="sectionProductItemPage__rightBlock">
                        <div className="container">
                            <h1 className="sectionProductItemPage__rightBlock-title">Product Name</h1>
                            <div className="sectionNewArrivals__item-starsBlock">
                                <div className="sectionNewArrivals__item-stars">
                                    {/* если product.rating равно 0,то показываем пустую звезду,в другом случае если product.rating больше или равно 0.5 и меньше или равно 0.9,то показываем половину звезды,в другом случае показываем целую звезду */}
                                    <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src="/images/sectionNewArrivals/Vector (2).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                </div>
                                <p className="sectionNewArrivals__item-starsAmount">(0)</p>
                            </div>

                            <div className="sectionNewArrivals__item-priceBlock sectionProductItemPage__priceBlock">
                                <p className="item__priceBlock-priceSale">$10</p>
                                <p className="item__priceBlock-priceUsual">$15</p>
                            </div>

                            <div className="sectionProductItemPage__rightBlock-sizeBlock">
                                <p className="sectionProductItemPage__sizeBlock-text">Select Size</p>
                                <div className="sectionProductItemPage__sizeBlock-sizes">
                                    <div className="sizeBlock__sizes-item">S</div>
                                    <div className="sizeBlock__sizes-item">M</div>
                                    <div className="sizeBlock__sizes-item">L</div>
                                    <div className="sizeBlock__sizes-item">XL</div>
                                </div>
                            </div>

                            <div className="sectionNewArrivals__item-cartBlock">

                                {/* потом будем проверять есть ли этот товар уже в корзине */}
                                {/* <h3 className="textAlreadyInCart">In Cart</h3> */}

                                <button className="sectionProductItemPage__rightBlock-btnCart">
                                    <p className="sectionProductItemPage__btnCart-text">Add to Cart</p>
                                    <img src="/images/sectionProductItemPage/shopping cart.png" alt="" className="sectionProductItemPage__btnCart-img" />
                                </button>
                            </div>

                            <div className="sectionProductItemPage__rightBlock-bottomBlock">
                                <div className="sectionProductItemPage__bottomBlock-item">
                                    <img src="/images/sectionProductItemPage/Frame 24.png" alt="" className="sectionProductItemPage__bottomBlock-itemImg" />
                                    <p className="sectionProductItemPage__bottomBlock-itemText">Secure Payment</p>
                                </div>
                                <div className="sectionProductItemPage__bottomBlock-item">
                                    <img src="/images/sectionProductItemPage/Frame 25.png" alt="" className="sectionProductItemPage__bottomBlock-itemImg" />
                                    <p className="sectionProductItemPage__bottomBlock-itemText">Size & Fit</p>
                                </div>
                                <div className="sectionProductItemPage__bottomBlock-item">
                                    <img src="/images/sectionProductItemPage/Frame 26.png" alt="" className="sectionProductItemPage__bottomBlock-itemImg" />
                                    <p className="sectionProductItemPage__bottomBlock-itemText">Free Shipping</p>
                                </div>
                                <div className="sectionProductItemPage__bottomBlock-item">
                                    <img src="/images/sectionProductItemPage/Frame 27.png" alt="" className="sectionProductItemPage__bottomBlock-itemImg" />
                                    <p className="sectionProductItemPage__bottomBlock-itemText">Free Returns</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ProductItemPage;