import { RefObject, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";

const SectionCategories = () => {

    const { catalogCategory } = useTypedSelector(state => state.catalogSlice); // указываем наш слайс(редьюсер) под названием catalogSlice и деструктуризируем у него поле состояния catalogCategory,используя наш типизированный хук для useSelector

    const { setCategoryCatalog } = useActions(); // берем action для изменения состояния категории каталога у слайса(редьюсера) catalogSlice у нашего хука useActions уже обернутый в диспатч,так как мы оборачивали это в самом хуке useActions

    const sectionCategories = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategories as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const router = useNavigate(); // useNavigate может перемещатьтся на другую страницу вместо ссылок

    const setJoggersCategory = () => {

        setCategoryCatalog('Joggers'); // изменяем значение categoryCatalog на Joggers

        router('/catalog'); // перекидываем пользователя на страницу каталога(/catalog)
    }

    const setLongSleeveCategory = () => {

        setCategoryCatalog('Long Sleeves'); // изменяем значение categoryCatalog на Long Sleeves

        router('/catalog'); // перекидываем пользователя на страницу каталога(/catalog)
    }

    const setTshirtsCategory = () => {

        setCategoryCatalog('T-Shirts'); // изменяем значение categoryCatalog на T-Shirts

        router('/catalog'); // перекидываем пользователя на страницу каталога(/catalog)
    }

    const setShortsCategory = () => {

        setCategoryCatalog('Shorts'); // изменяем значение categoryCatalog на Shorts

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
                                <p className="sectionCategories__item-text" onClick={setLongSleeveCategory}>Long Sleeves</p>
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