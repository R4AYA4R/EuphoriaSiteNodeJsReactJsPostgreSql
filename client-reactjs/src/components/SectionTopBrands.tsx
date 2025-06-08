import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionTopBrands = () => {

    const sectionPresentsRef = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionPresentsRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section className={onScreen.sectionPresentsIntersecting ? "sectionPresents sectionPresents__active sectionTopBrands" : "sectionPresents sectionTopBrands"} id="sectionPresents" ref={sectionPresentsRef}>
            <div className="container">
                <div className="sectionTopBrands__inner">
                    <h1 className="sectionTopBrands__title">Top Brands Deal</h1>
                    <p className="sectionTopBrands__text">Up To <span className="sectionTopBrands__text-span">60%</span> off on brands</p>
                    <div className="sectionTopBrands__items">
                        <img src="/images/sectionTopBrands/Group 43.jpg" alt="" className="sectionTopBrands__img" />
                        <img src="/images/sectionTopBrands/Group 44.jpg" alt="" className="sectionTopBrands__img" />
                        <img src="/images/sectionTopBrands/Group 45.jpg" alt="" className="sectionTopBrands__img" />
                        <img src="/images/sectionTopBrands/Group 46.jpg" alt="" className="sectionTopBrands__img" />
                        <img src="/images/sectionTopBrands/Group 47.jpg" alt="" className="sectionTopBrands__img" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionTopBrands;