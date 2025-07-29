import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionAboutUsTop = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active sectionAboutUsTop" : "sectionCatalog sectionAboutUsTop"} ref={sectionCatalog}>
            <div className="container">
                <div className="sectionAboutUsTop__inner">
                    <div className="sectionAboutUsTop__infoBlock">
                        <h1 className="sectionAboutUsTop__infoBlock-title">100% Trusted Fashion Store</h1>
                        <p className="sectionAboutUsTop__infoBlock-text">Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi, laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit. Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec a eros non massa vulputate ornare. Vivamus ornare commodo ante, at commodo felis congue vitae.</p>
                    </div>
                    <div className="sectionAboutUsTop__img" />
                </div>
            </div>
        </section>
    )

}

export default SectionAboutUsTop;