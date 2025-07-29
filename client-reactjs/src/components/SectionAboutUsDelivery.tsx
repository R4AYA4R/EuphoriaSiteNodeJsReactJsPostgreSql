

import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { Link } from "react-router-dom";

const SectionAboutUsDelivery = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    return (
        <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active " : "sectionCatalog"} ref={sectionCatalog}>
            <div className="container">
                <div className="sectionAboutUsTop__inner">
                    <div className="sectionAboutUsTop__infoBlock">
                        <h1 className="sectionAboutUsTop__infoBlock-title">We Delivered, You Enjoy Your Order.</h1>
                        <p className="sectionAboutUsTop__infoBlock-text">Ut suscipit egestas suscipit. Sed posuere pellentesque nunc, ultrices consectetur velit dapibus eu. Mauris sollicitudin dignissim diam, ac mattis eros accumsan rhoncus. Curabitur auctor bibendum nunc eget elementum.</p>
                        <div className="sectionAboutUsDelivery__itemsBlock">
                            <div className="sectionAboutUsDelivery__itemsBlock-item">
                                <img src="/images/sectionAboutUs/Check.png" alt="" className="sectionAboutUsDelivery__item-img" />
                                <p className="sectionAboutUsDelivery__item-text">Sed in metus pellentesque.</p>
                            </div>
                            <div className="sectionAboutUsDelivery__itemsBlock-item">
                                <img src="/images/sectionAboutUs/Check.png" alt="" className="sectionAboutUsDelivery__item-img" />
                                <p className="sectionAboutUsDelivery__item-text">Fusce et ex commodo, aliquam nulla efficitur, tempus lorem.</p>
                            </div>
                            <div className="sectionAboutUsDelivery__itemsBlock-item">
                                <img src="/images/sectionAboutUs/Check.png" alt="" className="sectionAboutUsDelivery__item-img" />
                                <p className="sectionAboutUsDelivery__item-text">Maecenas ut nunc fringilla erat varius.</p>
                            </div>
                        </div>
                        <Link to="/catalog" className="sectionTop__link  sectionAboutUsDelivery__link">
                            <p className="sectionTop__link-text sectionAboutUsDelivery__link-text">Shop Now</p>
                            <img src="/images/sectionTop/arrow.png" alt="" className="sectionTop__link-img" />
                        </Link>
                    </div>

                    <div className="sectionAboutUsDelivery__img" />

                </div>
            </div>
        </section>
    )

}

export default SectionAboutUsDelivery;