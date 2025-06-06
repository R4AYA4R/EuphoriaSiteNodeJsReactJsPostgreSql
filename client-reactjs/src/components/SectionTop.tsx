import { RefObject, useRef } from "react";
import { Link } from "react-router-dom";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionTop = () => {

    const sectionTopRef = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionTopRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return(
        // делаем проверку в className,если onScreen.sectionTopIntersecting(если состояние sectionTopIntersecting true) true,то есть этот html элемент сейчас наблюдается обзервером,то указываем такие классы,в другом случае другие,чтобы сделать анимацию появления,когда эта секция появляется на экране браузера
        <section id="sectionTop" className={onScreen.sectionTopIntersecting ? "sectionTop sectionTop__active" : "sectionTop"} ref={sectionTopRef}>
            <div className="container">
                <div className="sectionTop__inner">
                    <p className="sectionTop__subtitle">T-shirt / Tops</p>
                    <h2 className="sectionTop__title">Summer Value Pack</h2>
                    <p className="sectionTop__subtitle">cool / colorful / comfy</p>
                    <Link to="/catalog" className="sectionTop__link">
                        <p className="sectionTop__link-text">Shop Now</p>    
                        <img src="/images/sectionTop/arrow.png" alt="" className="sectionTop__link-img" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default SectionTop;