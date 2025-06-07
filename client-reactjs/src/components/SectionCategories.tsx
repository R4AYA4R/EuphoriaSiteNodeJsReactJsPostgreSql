import { RefObject, useRef } from "react";
import { useNavigate } from "react-router-dom"
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const SectionCategories = () => {

    const sectionCategories = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategories as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const router = useNavigate(); // useNavigate может перемещатьтся на другую страницу вместо ссылок

    const setJoggersCategory = () => {

        // здесь будем изменять состояние редакса для категорий

        router('/catalog'); // перекидываем пользователя на страницу каталога(/catalog)
    }

    const setLongSleeveCategory = () => {

        // здесь будем изменять состояние редакса для категорий

        router('/catalog'); // перекидываем пользователя на страницу каталога(/catalog)
    }

    const setTshirtsCategory = () => {

        // здесь будем изменять состояние редакса для категорий

        router('/catalog'); // перекидываем пользователя на страницу каталога(/catalog)
    }

    const setShortsCategory = () => {

        // здесь будем изменять состояние редакса для категорий

        router('/catalog'); // перекидываем пользователя на страницу каталога(/catalog)
    }

    return (
        <section id="sectionCategories" className={onScreen.sectionCategoriesIntersecting ? "sectionCategories sectionCategories__active " : "sectionCategories"} ref={sectionCategories}>
            <div className="container">
                <div className="sectionCategories__inner">
                    <div className="sectionCategories__topBlock">
                        <div className="sectionCategories__topBlock-leftBorderBlock"></div>
                        <h1 className="sectionCategories__topBlock-title">Top Categories</h1>
                    </div>
                    <div className="sectionCategories__items">
                        <div className="sectionCategories__item">
                            <img src="/images/sectionCategories/joggersImg.jpg" alt="" className="sectionCategoires__item-img" onClick={setJoggersCategory} />
                            <div className="sectionCategories__item-bottomBlock">
                                <p className="sectionCategories__item-text" onClick={setJoggersCategory}>Joggers</p>
                                <button className="sectionCategories__item-linkBtn" onClick={setJoggersCategory}>
                                    <img src="/images/sectionTop/arrow.png" alt="" className="sectionCategories__item-linkBtnImg" />
                                </button>
                            </div>
                        </div>
                        <div className="sectionCategories__item">
                            <img src="/images/sectionCategories/Rectangle 28.jpg" alt="" className="sectionCategoires__item-img" onClick={setLongSleeveCategory} />
                            <div className="sectionCategories__item-bottomBlock">
                                <p className="sectionCategories__item-text" onClick={setLongSleeveCategory}>Long Sleeve</p>
                                <button className="sectionCategories__item-linkBtn" onClick={setLongSleeveCategory}>
                                    <img src="/images/sectionTop/arrow.png" alt="" className="sectionCategories__item-linkBtnImg" />
                                </button>
                            </div>
                        </div>
                        <div className="sectionCategories__item">
                            <img src="/images/sectionCategories/Rectangle 28 (1).jpg" alt="" className="sectionCategoires__item-img" onClick={setTshirtsCategory} />
                            <div className="sectionCategories__item-bottomBlock">
                                <p className="sectionCategories__item-text" onClick={setTshirtsCategory}>T-Shirts</p>
                                <button className="sectionCategories__item-linkBtn" onClick={setTshirtsCategory}>
                                    <img src="/images/sectionTop/arrow.png" alt="" className="sectionCategories__item-linkBtnImg" />
                                </button>
                            </div>
                        </div>
                        <div className="sectionCategories__item">
                            <img src="/images/sectionCategories/Rectangle 28 (2).jpg" alt="" className="sectionCategoires__item-img" onClick={setShortsCategory} />
                            <div className="sectionCategories__item-bottomBlock">
                                <p className="sectionCategories__item-text" onClick={setShortsCategory}>Shorts</p>
                                <button className="sectionCategories__item-linkBtn" onClick={setShortsCategory}>
                                    <img src="/images/sectionTop/arrow.png" alt="" className="sectionCategories__item-linkBtnImg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionCategories;