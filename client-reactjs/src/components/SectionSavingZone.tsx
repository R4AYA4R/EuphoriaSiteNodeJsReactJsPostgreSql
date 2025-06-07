import { RefObject, useRef } from "react";
import { Link } from "react-router-dom";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionSavingZone = () => {

    // скопировали просто это из sectionPresents,чтобы заново не писать код,так как логика одинаковая
    const sectionPresentsRef = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionPresentsRef as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return (
        // указываем такой же id как и у секции sectionPresents,так как эти секции находятся в разных друг от друга местах,и мы уже прописывали логику для этого id в файле useIsOnScreen,также используем такие же классы,как и для sectionPresents,просто добавляем свой отдельный для sectionSavingZone,это чтобы заново не прописывать отдельную такую же анимацию и проверку на id в файле useIsOnScreen
        <section className={onScreen.sectionPresentsIntersecting ? "sectionPresents sectionPresents__active sectionSavingZone" : "sectionPresents sectionSavingZone"} id="sectionPresents" ref={sectionPresentsRef}>
            <div className="container">
                <div className="sectionSavingZone__inner">
                    <div className="sectionCategories__topBlock">
                        <div className="sectionCategories__topBlock-leftBorderBlock"></div>
                        <h1 className="sectionCategories__topBlock-title">Big Saving Zone</h1>
                    </div>
                    <div className="sectionSavingZone__items">
                        <div className="sectionSavingZone__item sectionSavingZone__item-hawai">
                            <div className="sectionSavingZone__item-info">
                                <h1 className="sectionSavingZone__item-title">Hawaiian Shirts</h1>
                                <p className="sectionSavingZone__item-subtitle">Dress up in summer vibe</p>
                                <p className="sectionSavingZone__item-saleText">UPTO 50% OFF</p>
                                <div className="sectionSavingZone__item-imgArrowBlock">
                                    <img src="/images/sectionSavingZone/arrow.png" alt="" className="sectionSavingZone__item-infoImg" />
                                </div>
                                <div />
                                <Link to="/catalog" className="sectionSavingZone__item-link">Shop Now</Link>
                            </div>
                        </div>
                        <div className="sectionSavingZone__item sectionSavingZone__item-printed">
                            <div className="sectionSavingZone__item-info sectionSavingZone__item-infoPrinted">
                                <h1 className="sectionSavingZone__item-title sectionSavingZone__item-titlePrinted">Printed T-Shirt</h1>
                                <p className="sectionSavingZone__item-subtitle">New Designs Every Week</p>
                                <p className="sectionSavingZone__item-saleText sectionSavingZone__item-saleTextPrinted">UPTO 40% OFF</p>
                                <div className="sectionSavingZone__item-imgArrowBlock sectionSavingZone__item-imgArrowBlockPrinted">
                                    <img src="/images/sectionSavingZone/arrow.png" alt="" className="sectionSavingZone__item-infoImg" />
                                </div>
                                <div />
                                <Link to="/catalog" className="sectionSavingZone__item-link">Shop Now</Link>
                            </div>
                        </div>
                        <div className="sectionSavingZone__item sectionSavingZone__item-cargo">
                            <div className="sectionSavingZone__item-info sectionSavingZone__item-infoPrinted">
                                <h1 className="sectionSavingZone__item-title sectionSavingZone__item-titleCargo">Cargo Joggers</h1>
                                <p className="sectionSavingZone__item-subtitle sectionSavingZone__item-subtitleCargo">Move with style & comfort</p>
                                <p className="sectionSavingZone__item-saleText sectionSavingZone__item-subtitleCargo">UPTO 40% OFF</p>
                                <div className="sectionSavingZone__item-imgArrowBlock sectionSavingZone__item-imgArrowBlockPrinted">
                                    <img src="/images/sectionSavingZone/arrow (1).png" alt="" className="sectionSavingZone__item-infoImg" />
                                </div>
                                <div />
                                <Link to="/catalog" className="sectionSavingZone__item-link sectionSavingZone__item-linkBlack">Shop Now</Link>
                            </div>
                        </div>
                    </div>
                    <div className="sectionSavingZone__itemsBottom">
                        <div className="sectionSavingZone__item sectionSavingZone__item-Urban">
                            <div className="sectionSavingZone__item-info">
                                <h1 className="sectionSavingZone__item-title sectionSavingZone__item-titleCargo sectionSavingZone__item-titleUrban">Urban Shirts</h1>
                                <p className="sectionSavingZone__item-subtitle sectionSavingZone__item-subtitleCargo">Live In Confort</p>
                                <p className="sectionSavingZone__item-saleText sectionSavingZone__item-subtitleCargo">FLAT 60% OFF</p>
                                <div className="sectionSavingZone__item-imgArrowBlock sectionSavingZone__item-imgArrowBlockPrinted">
                                    <img src="/images/sectionSavingZone/arrow (1).png" alt="" className="sectionSavingZone__item-infoImg" />
                                </div>
                                <div />
                                <Link to="/catalog" className="sectionSavingZone__item-link sectionSavingZone__item-linkBlack">Shop Now</Link>
                            </div>
                        </div>
                        <div className="sectionSavingZone__item sectionSavingZone__item-Oversize">
                            <div className="sectionSavingZone__item-info">
                                <h1 className="sectionSavingZone__item-title sectionSavingZone__item-titleCargo sectionSavingZone__item-titleShirts">Oversized T-Shirts</h1>
                                <p className="sectionSavingZone__item-subtitle sectionSavingZone__item-subtitleCargo">Street Style Icon</p>
                                <p className="sectionSavingZone__item-saleText sectionSavingZone__item-subtitleCargo">FLAT 60% OFF</p>
                                <div className="sectionSavingZone__item-imgArrowBlock sectionSavingZone__item-imgArrowBlockPrinted">
                                    <img src="/images/sectionSavingZone/arrow (1).png" alt="" className="sectionSavingZone__item-infoImg" />
                                </div>
                                <div />
                                <Link to="/catalog" className="sectionSavingZone__item-link sectionSavingZone__item-linkBlack">Shop Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionSavingZone;