import { RefObject, useRef, useState } from "react";
import SectionUnderTop from "../components/SectionUnderTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import ReactSlider from "react-slider"; // импортируем ReactSlider из 'react-slider' вручную,так как автоматически не импортируется(в данном случае автоматически импортировалось),перед этим устанавливаем(npm install --save-dev @types/react-slider --force( указываем --force,чтобы установить эту библиотеку через силу,так как для версии react 19,выдает ошибку при установке этой библиотеки) типы для react-slider,иначе выдает ошибку,если ошибка сохраняется,что typescript не может найти типы для ReactSlider,после того,как установили для него типы,то надо закрыть запущенный локальный хост для нашего сайта в терминале и заново его запустить с помощью npm start

const Catalog = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [filterCategories, setFilterCategories] = useState('');

    const [filterPrice,setFilterPrice] = useState([0,200]); // массив для значений нашего инпута range(ReactSlider),первым значением указываем значение для первого ползунка у этого инпута,а вторым для второго, ставим изначальное значение для второго ползунка инпута как priceFilterMax(максимальная цена товарв из всех,которую посчитали на бэкэнде),чтобы сразу показывалось,что это максимальное значение цены,не указываем здесь конкретно data?.maxPriceAllProducts,так как тогда выдает ошибки,что для ReactSlider нельзя назначить значение с типом undefined и тд

    const [sizes,setSizes] = useState({
        sizeS:false,
        sizeM:false,
        sizeL:false,
        sizeXL:false,
    })

    const [activeSortBlock,setActiveSortBlock] = useState(false);

    const [sortBlockValue,setSortBlockValue] = useState(''); // состояние для значения селекта сортировки товаров по рейтингу и тд

    const sortItemHandlerRating = () => {

        setSortBlockValue('Rating'); // изменяем состояние sortBlockValue на значение Rating

        setActiveSortBlock(false); // изменяем состояние activeSortBlock на значение false,то есть убираем появившийся селект блок
    }

    return (
        <main className="main">
            <SectionUnderTop subtext="Shop" /> {/* указываем пропс(параметр) subtext(в данном случае со значением Shop,чтобы отобразить в этой секции текст Shop,так как это для страницы каталога),чтобы использовать этот компонент на разных страницах,а отличаться он будет только этим параметром subtext */}
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active " : "sectionCatalog"} ref={sectionCatalog}>
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__filterBar">
                            <div className="sectionCatalog__filterBar-filterItem">
                                <h2 className="filterBar__filterItem-title filterBar__filterItem-title--categories">Categories</h2>
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
                            <div className="sectionCatalog__filterBar-filterItem">
                                <h2 className="filterBar__filterItem-title">Price</h2>
                                <div className="filterBar__filterItem-labels">
                                    
                                    <ReactSlider
                                        
                                        // указываем классы для этого инпута range и для его кнопок и тд, и в файле index.css их стилизуем 
                                        className="filterItem__inputRangeSlider"

                                        thumbClassName="inputRangeSlider__thumb"

                                        trackClassName="inputRangeSlider__track"

                                        defaultValue={filterPrice}  // поле для дефолтного значения минимального(первый элемент массива) и максимального(второй элемент массива),указываем этому полю значение как наш массив filterPrice(массив чисел для минимального(первый элемент массива) и максимального(второй элемент массива) значения)

                                        max={200} // поле для максимального значения

                                        min={0} // поле для минимального значения

                                        value={filterPrice}  // указываем поле value как наше состояние filterPrice(массив из 2 элементов для минимального и максимального значения фильтра цены),указываем это,чтобы при изменении состояния filterPrice, менялось и значение этого инпута range,то есть этого react slider(его ползунки и значения их),в данном случае это для того,чтобы при удалении фильтра цены,менялись значения ползунков этого react slider(инпут range)

                                        // вместо этого сами деструктуризируем дополнительные параметры из props в коде ниже,иначе выдает ошибку в версии react 19,так как библиотека react-slider давно не обновлялась,а сам react обновился
                                        // renderThumb={(props,state) => <div {...props}>{state.valueNow}</div>}

                                        // деструктуризируем поле key и ...restProps из props(параметр у этой функции callback),чтобы потом отдельно передать в div,так как выдает ошибку в версии react 19,если сделать как код выше
                                        renderThumb={(props,state) => {
                                            const { key, ...restProps } = props; // деструктуризируем отдельно поле key из props,и остальные параметры,которые есть у props,разворачиваем в этот объект и указываем им название restProps(...restProps),потом отдельно указываем этому div поле key и остальные параметры у props(restProps),разворачиваем restProps в объект,таким образом передаем их этому div {...restProps}

                                            return (
                                                <div key={key} {...restProps}>{state.valueNow}</div>
                                            );

                                        }}

                                        onChange={(value,index) => setFilterPrice(value)} // при изменении изменяем значение состояния массива filterPrice(в параметрах функция callback принимает value(массив текущих значений этого инпута) и index(индекс кнопки элемента массива,то есть за какую кнопку сейчас дергали))

                                        // здесь еще надо будет делать refetch(повторный запрос на сервер для обновления данных массива товаров) в onAfterChange и onSliderClick


                                    />

                                    {/* выводим минимальное текущее значение инпута range (наш ReactSlider) по индексу 0 из нашего массива filterPrice (filterPrice[0]) и выводим максимальное текущее значение по индексу 1 из нашего массива filterPrice (filterPrice[1]),используем toFixed(0),чтобы после запятой у этого числа было 0 чисел,иначе могут показываться значения с несколькими числами после запятой */}
                                    <p className="filterItem__inputRangeSliderPrice">${filterPrice[0]} - ${filterPrice[1].toFixed(0)}</p>

                                </div>
                            </div>
                            <div className="sectionCatalog__filterBar-filterItem">
                                <h2 className="filterBar__filterItem-title">Size</h2>
                                <div className="filterBar__filterItem-labels">
                                    
                                    <div className="filterItem__labels-sizes">
                                        {/* в onClick этой кнопке изменяем состояние sizes,возвращая новый объект,в который разворачиваем все поля предыдущего(текущего(prev)) объекта и изменяем только поле sizeS на true,чтобы добавить фильтр по размеру,и для класса делаем проверку,если поле sizeS у состояния sizes true,то показываем активный класс кнопке,в другом случае обычный */}
                                        <button className={sizes.sizeS ? "filterBar__filterItem-sizeBtn filterBar__filterItem-sizeBtn--active" : "filterBar__filterItem-sizeBtn"} onClick={()=>setSizes((prev)=>({...prev, sizeS:!prev.sizeS}))}>S</button>

                                        <button className={sizes.sizeM ? "filterBar__filterItem-sizeBtn filterBar__filterItem-sizeBtn--active" : "filterBar__filterItem-sizeBtn"} onClick={()=>setSizes((prev)=>({...prev, sizeM:!prev.sizeM}))}>M</button>

                                        <button className={sizes.sizeL ? "filterBar__filterItem-sizeBtn filterBar__filterItem-sizeBtn--active" : "filterBar__filterItem-sizeBtn"} onClick={()=>setSizes((prev)=>({...prev, sizeL:!prev.sizeL}))}>L</button>

                                        <button className={sizes.sizeXL ? "filterBar__filterItem-sizeBtn filterBar__filterItem-sizeBtn--active" : "filterBar__filterItem-sizeBtn"} onClick={()=>setSizes((prev)=>({...prev, sizeXL:!prev.sizeXL}))}>XL</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="sectionCatalog__productsBlock">
                            <div className="sectionCatalog__productsBlock-searchBlock">
                                <div className="sectionCatalog__searchBlock-inputBlock">
                                    <input type="text" className="searchBlock__inputBlock-input" placeholder="Search"/>
                                    <img src="/images/sectionCatalog/Icon (1).png" alt="" className="searchBlock__inputBlock-img" />
                                </div>
                                <div className="searchBlock__sortBlock">
                                    <p className="sortBlock__text">Sort By:</p>
                                    <div className="sortBlock__inner">
                                        <div className="sortBlock__topBlock" onClick={()=>setActiveSortBlock((prev)=>!prev)}>
                                            {/* если sortBlockValue true,то есть если в sortBlockValue есть какое-то значение,то указываем такие классы,в другом случае другие,в данном случае делаем это для анимации появления текста */}
                                            <p className={sortBlockValue ? "sortBlock__topBlock-text sortBlock__topBlock-text--active" : "sortBlock__topBlock-text"}>{sortBlockValue}</p>
                                            <img src="/images/sectionCatalog/Icon.png" alt="" className={activeSortBlock ? "sortBlock__topBlock-img sortBlock__topBlock-img--active" : "sortBlock__topBlock-img"} />
                                        </div>
                                        <div className={activeSortBlock ? "sortBlock__optionsBlock sortBlock__optionsBlock--active" : "sortBlock__optionsBlock"}>
                                            <div className="sortBlock__optionsBlock-item" onClick={sortItemHandlerRating}>
                                                <p className="optionsBlock__item-text">Rating</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            catalog
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Catalog;