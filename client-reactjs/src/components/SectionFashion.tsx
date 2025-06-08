import { RefObject, useRef } from "react";
import { Link } from "react-router-dom";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionFashion = () => {

    const sectionCategories = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategories as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section id="sectionCategories" className={onScreen.sectionCategoriesIntersecting ? "sectionCategories sectionCategories__active sectionFashion" : "sectionCategories sectionFashion"} ref={sectionCategories}>
            <div className="container">
                <div className="sectionFashion__inner">
                    <div className="sectionFashion__itemInfo">
                        <h1 className="sectionFashion__itemInfo-title">WE MADE YOUR EVERYDAY FASHION BETTER!</h1>
                        <p className="sectionFashion__itemInfo-text">In our journey to improve everyday fashion, euphoria presents EVERYDAY wear range - Comfortable & Affordable fashion 24/7</p>
                        <Link to="/catalog" className="sectionTop__link sectionFashion__link">
                            <p className="sectionTop__link-text">Shop Now</p>
                            <img src="/images/sectionTop/arrow.png" alt="" className="sectionTop__link-img" />
                        </Link>
                    </div>
                    <img src="/images/sectionFashion/Rectangle 13.png" alt="" className="sectionFashion__img" />
                </div>
            </div>
        </section>
    )
}

export default SectionFashion;