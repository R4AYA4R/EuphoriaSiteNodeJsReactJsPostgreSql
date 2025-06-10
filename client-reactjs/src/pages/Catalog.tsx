import { RefObject, useRef, useState } from "react";
import SectionUnderTop from "../components/SectionUnderTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

const Catalog = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [filterCategories, setFilterCategories] = useState('');

    return (
        <main className="main">
            <SectionUnderTop subtext="Shop" /> {/* указываем пропс(параметр) subtext(в данном случае со значением Shop,чтобы отобразить в этой секции текст Shop,так как это для страницы каталога),чтобы использовать этот компонент на разных страницах,а отличаться он будет только этим параметром subtext */}
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active " : "sectionCatalog"} ref={sectionCatalog}>
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__filterBar">
                            <div className="sectionCatalog__filterBar-filterItem">
                                <h2 className="filterBar__filterItem-title">Categories</h2>
                                <div className="filterBar__filterItem-labels">
                                    <label className="filterBar__filterItem-categoriesLabel" onClick={() => setFilterCategories('Long Sleeves')}>
                                        <input type="radio" name="radio" className="categoriesLabel__input" />
                                        <span className={filterCategories === 'Long Sleeves' ? "categoriesLabel-radioStyle categoriesLabel-radioStyle--active" : "categoriesLabel-radioStyle"}>
                                            <span className={filterCategories === 'Long Sleeves' ? "categoriesLabel__radioStyle-before categoriesLabel__radioStyle-before--active" : "categoriesLabel__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Long Sleeves' ? "categoriesLabel__text categoriesLabel__text--active" : "categoriesLabel__text"}>Long Sleeves</p>

                                        {/* если filterCategories !== '',то есть какая-либо категория выбрана,то не показываем число товаров в этой категории(в данном случае сделали так,чтобы число товаров в определнной категории показывалось только если никакие фильтры не выбраны,кроме поиска и цены),указываем значение этому тексту для количества товаров категории, в данном случае как filteredCategoryFruitsAndVegetables?.length(массив объектов товаров,отфильтрованный по полю category и значению 'Long Sleeves',то есть категория Long Sleeves),лучше фильтровать массивы товаров для показа количества товаров в категориях запросами на сервер,добавляя туда параметры фильтров,если они выбраны,но сейчас уже сделали так */}
                                        <p className={filterCategories !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>(0)</p>
                                    </label>
                                    <label className="filterBar__filterItem-categoriesLabel" onClick={() => setFilterCategories('Joggers')}>
                                        <input type="radio" name="radio" className="categoriesLabel__input" />
                                        <span className={filterCategories === 'Joggers' ? "categoriesLabel-radioStyle categoriesLabel-radioStyle--active" : "categoriesLabel-radioStyle"}>
                                            <span className={filterCategories === 'Joggers' ? "categoriesLabel__radioStyle-before categoriesLabel__radioStyle-before--active" : "categoriesLabel__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Joggers' ? "categoriesLabel__text categoriesLabel__text--active" : "categoriesLabel__text"}>Joggers</p>
                                        <p className={filterCategories !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>(0)</p>
                                    </label>
                                    <label className="filterBar__filterItem-categoriesLabel" onClick={() => setFilterCategories('Tshirts')}>
                                        <input type="radio" name="radio" className="categoriesLabel__input" />
                                        <span className={filterCategories === 'Tshirts' ? "categoriesLabel-radioStyle categoriesLabel-radioStyle--active" : "categoriesLabel-radioStyle"}>
                                            <span className={filterCategories === 'Tshirts' ? "categoriesLabel__radioStyle-before categoriesLabel__radioStyle-before--active" : "categoriesLabel__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Tshirts' ? "categoriesLabel__text categoriesLabel__text--active" : "categoriesLabel__text"}>T-Shirts</p>
                                        <p className={filterCategories !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>(0)</p>
                                    </label>
                                    <label className="filterBar__filterItem-categoriesLabel" onClick={() => setFilterCategories('Shorts')}>
                                        <input type="radio" name="radio" className="categoriesLabel__input" />
                                        <span className={filterCategories === 'Shorts' ? "categoriesLabel-radioStyle categoriesLabel-radioStyle--active" : "categoriesLabel-radioStyle"}>
                                            <span className={filterCategories === 'Shorts' ? "categoriesLabel__radioStyle-before categoriesLabel__radioStyle-before--active" : "categoriesLabel__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Shorts' ? "categoriesLabel__text categoriesLabel__text--active" : "categoriesLabel__text"}>Shorts</p>
                                        <p className={filterCategories !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>(0)</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="sectionCatalog__productsBlock">
                            catalog
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Catalog;