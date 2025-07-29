

import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionAboutUsTeam = () => {

    const sectionPresentsRef = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript
    
    const onScreen = useIsOnScreen(sectionPresentsRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    return (
        <section className={onScreen.sectionPresentsIntersecting ? "sectionPresents sectionPresents__active sectionAboutUsTrusted sectionAboutUsTeam" : "sectionPresents sectionAboutUsTrusted sectionAboutUsTeam"} id="sectionPresents" ref={sectionPresentsRef}>
            <div className="container">
                <div className="sectionAboutUsTeam__inner">
                    <h2 className="sectionAboutUsTeam__title">Our Awesome Team</h2>
                    <p className="sectionAboutUsTeam__subtitle">Pellentesque a ante vulputate leo porttitor luctus sed eget eros. Nulla et rhoncus neque. Duis non diam eget est luctus tincidunt a a mi.</p>
                    <div className="sectionAboutUsTeam__items">
                        <div className="sectionAboutUsTeam__items-item">
                            <div className="sectionAboutUsTeam__item-img sectionAboutUsTeam__item-img1" />
                            <div className="sectionAboutUsTeam__item-bottomBlock">
                                <h3 className="sectionAboutUsTeam__item-name">Jenny Wilson</h3>
                                <p className="sectionAboutUsTeam__item-text">Chief Executive Officer</p>
                            </div>
                        </div>
                        <div className="sectionAboutUsTeam__items-item">
                            <div className="sectionAboutUsTeam__item-img sectionAboutUsTeam__item-img2" />
                            <div className="sectionAboutUsTeam__item-bottomBlock">
                                <h3 className="sectionAboutUsTeam__item-name">Sadie Morgan</h3>
                                <p className="sectionAboutUsTeam__item-text">Product Designer</p>
                            </div>
                        </div>
                        <div className="sectionAboutUsTeam__items-item">
                            <div className="sectionAboutUsTeam__item-img sectionAboutUsTeam__item-img3" />
                            <div className="sectionAboutUsTeam__item-bottomBlock">
                                <h3 className="sectionAboutUsTeam__item-name">Cody Fisher</h3>
                                <p className="sectionAboutUsTeam__item-text">Head of Development</p>
                            </div>
                        </div>
                        <div className="sectionAboutUsTeam__items-item">
                            <div className="sectionAboutUsTeam__item-img sectionAboutUsTeam__item-img4" />
                            <div className="sectionAboutUsTeam__item-bottomBlock">
                                <h3 className="sectionAboutUsTeam__item-name">Robert Fox</h3>
                                <p className="sectionAboutUsTeam__item-text">Assistant of CEO</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionAboutUsTeam;