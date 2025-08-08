
import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionAboutUsTrusted = () => {

    const sectionPresentsRef = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript
    
    const onScreen = useIsOnScreen(sectionPresentsRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    return (
        <section className={onScreen.sectionPresentsIntersecting ? "sectionPresents sectionPresents__active sectionAboutUsTrusted" : "sectionPresents sectionAboutUsTrusted"} id="sectionPresents" ref={sectionPresentsRef}>
            <div className="container">
                <div className="sectionAboutUsTop__inner sectionAboutUsTrusted__inner">
                    <div className="sectionAboutUsTrusted__img" />
                    <div className="sectionAboutUsTop__infoBlock">
                        <h1 className="sectionAboutUsTop__infoBlock-title">100% Safe Fashion Store</h1>
                        <p className="sectionAboutUsTop__infoBlock-text">Pellentesque a ante vulputate leo porttitor luctus sed eget eros. Nulla et rhoncus neque. Duis non diam eget est luctus tincidunt a a mi. Nulla eu eros consequat tortor tincidunt feugiat.</p>
                        <div className="sectionAboutUsTrusted__infoBlock-items">
                            <div className="sectionAboutUsTrusted__items-item">
                                <img src="/images/sectionAboutUs/Icon (1).svg" alt="" className="sectionAboutUsTrusted__item-img" />
                                <div className="sectionAboutUsTrusted__item-textBlock">
                                    <h3 className="sectionAboutUsTrusted__item-name">Customer Feedback</h3>
                                    <p className="sectionAboutUsTrusted__item-subtext">Our happy customer</p>
                                </div>
                            </div>
                            <div className="sectionAboutUsTrusted__items-item">
                                <img src="/images/sectionAboutUs/Icon (3).svg" alt="" className="sectionAboutUsTrusted__item-img" />
                                <div className="sectionAboutUsTrusted__item-textBlock">
                                    <h3 className="sectionAboutUsTrusted__item-name">Great Support 24/7</h3>
                                    <p className="sectionAboutUsTrusted__item-subtext">Instant access to Contact</p>
                                </div>
                            </div>
                            <div className="sectionAboutUsTrusted__items-item">
                                <img src="/images/sectionAboutUs/Icon (2).svg" alt="" className="sectionAboutUsTrusted__item-img" />
                                <div className="sectionAboutUsTrusted__item-textBlock">
                                    <h3 className="sectionAboutUsTrusted__item-name">Free Shipping</h3>
                                    <p className="sectionAboutUsTrusted__item-subtext">Free shipping with discount</p>
                                </div>
                            </div>
                            <div className="sectionAboutUsTrusted__items-item">
                                <img src="/images/sectionAboutUs/Icon (4).svg" alt="" className="sectionAboutUsTrusted__item-img" />
                                <div className="sectionAboutUsTrusted__item-textBlock">
                                    <h3 className="sectionAboutUsTrusted__item-name">100% Secure Payment</h3>
                                    <p className="sectionAboutUsTrusted__item-subtext">We ensure your money is save</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionAboutUsTrusted;