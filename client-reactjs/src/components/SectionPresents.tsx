import { Link } from "react-router-dom";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { RefObject, useRef } from "react";

const SectionPresents = () => {

    const sectionPresentsRef = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript
    
    const onScreen = useIsOnScreen(sectionPresentsRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return(
        <section className={onScreen.sectionPresentsIntersecting ? "sectionPresents sectionPresents__active" : "sectionPresents"} id="sectionPresents" ref={sectionPresentsRef}>
            <div className="container">
                <div className="sectionPresents__inner">
                    <div className="sectionPresents__item sectionPresents__item-highCoziness">
                        <p className="sectionPresents__item-sutitle">Low Price</p>
                        <h3 className="sectionPresents__item-title">High Coziness</h3>
                        <p className="sectionPresents__item-desc sectionPresents__item-descHighCoziness">UPTO 50% OFF</p>
                        <Link to="/catalog" className="sectionPresents__item-link">Explore Items</Link>
                    </div>
                    <div className="sectionPresents__item sectionPresents__item-breezySummer">
                        <p className="sectionPresents__item-sutitle">Beyoung Presents</p>
                        <h3 className="sectionPresents__item-title">Breezy Summer Style</h3>
                        <p className="sectionPresents__item-desc">UPTO 50% OFF</p>
                        <Link to="/catalog" className="sectionPresents__item-link">Explore Items</Link>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionPresents;
