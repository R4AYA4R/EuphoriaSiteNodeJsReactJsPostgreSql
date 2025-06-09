import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

// создаем интерфейс для пропсов(параметров) этого компонента SectionUnderTop
interface ISectionUnderTop {
    subtext: string
}

// указываем тип объекта пропсов(параметров) этого компонента как тип на основе нашего интерфейса ISectionUnderTop
const SectionUnderTop = ({ subtext }: ISectionUnderTop) => {

    const sectionCategories = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategories as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        <section id="sectionCategories" className={onScreen.sectionCategoriesIntersecting ? "sectionCategories sectionCategories__active sectionUnderTop" : "sectionCategories sectionUnderTop"} ref={sectionCategories}>
            <div className="container">
                <div className="sectionUnderTop__inner">
                    <p className="sectionUnderTop__text">Home</p>
                    <img src="/images/sectionUnderTop/rightArrow.png" alt="" className="sectionUnderTop__img" />
                    <p className="sectionUnderTop__subtext">{subtext}</p>
                </div>
            </div>
        </section>
    )

}

export default SectionUnderTop;