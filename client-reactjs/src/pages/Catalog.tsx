import { RefObject, useEffect, useRef, useState } from "react";
import SectionUnderTop from "../components/SectionUnderTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import ReactSlider from "react-slider"; // импортируем ReactSlider из 'react-slider' вручную,так как автоматически не импортируется(в данном случае автоматически импортировалось),перед этим устанавливаем(npm install --save-dev @types/react-slider --force( указываем --force,чтобы установить эту библиотеку через силу,так как для версии react 19,выдает ошибку при установке этой библиотеки) типы для react-slider,иначе выдает ошибку,если ошибка сохраняется,что typescript не может найти типы для ReactSlider,после того,как установили для него типы,то надо закрыть запущенный локальный хост для нашего сайта в терминале и заново его запустить с помощью npm start
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { IProduct, IProductsCatalogResponse } from "../types/types";
import ProductItemCatalog from "../components/ProductItemCatalog";
import { getPagesArray } from "../utils/getPagesArray";

const Catalog = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [limit, setLimit] = useState(1); // указываем лимит для максимального количества объектов,которые будут на одной странице(для пагинации)

    const [page, setPage] = useState(1); // указываем состояние текущей страницы

    const [totalPages, setTotalPages] = useState(0); // указываем состояние totalPages в данном случае для общего количества страниц


    const [filteredLongSleeves, setFilteredLongSleeves] = useState<IProduct[]>([]); // состояние для отфильтрованного массива по категориям,чтобы показывать количество товаров в определенной категории,указываем в generic тип IProduct[] | undefined,иначе выдает ошибку

    const [filteredJoggers, setFilteredJoggers] = useState<IProduct[]>([]);

    const [filteredTShirts, setFilteredTShirts] = useState<IProduct[]>([]);

    const [filteredShorts, setFilteredShorts] = useState<IProduct[]>([]);

    const [filteredTypeMen, setFilteredTypeMen] = useState<IProduct[]>([]);

    const [filteredTypeWomen, setFilteredTypeWomen] = useState<IProduct[]>([]);

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер,берем isFetching у useQuery,чтобы отслеживать,загружается ли сейчас запрос на сервер,разница isFetching и isLoading в том,что isFetching всегда будет проверять загрузку запроса на сервер при каждом запросе,а isLoading будет проверять только первый запрос на сервер,в данном случае нужен isFetching,так как идут повторные запросы на сервер
    const { data, refetch, isFetching } = useQuery({
        queryKey: ['getProductsCatalog'], // указываем название
        queryFn: async () => {

            // выносим url на получение товаров в отдельную переменную,чтобы ее потом изменять,вынесли основной url до бэкэнда в переменную REACT_APP_BACKEND_URL(REACT_APP_ обязательная приставка для переменных в .env файле для react js,иначе не находит эти переменные,и после изменения этих переменных в файле .env,нужно заново запустить сайт,то есть закрыть терминал(консоль) с текущим открытым сайтом(если это на localhost запускается,то есть на локальном компьютере),и заново в новом терминале запустить его командой npm start) в файле .env,чтобы было более удобно ее указывать и было более безопасно,так как обычно git не отслеживает этот файл и не будет его пушить в репозиторий,также после этого url указываем конкретный путь до нашего роутера на бэкэнде(/api в данном случае),а потом уже конкретный url до эндпоинта
            let url = `${process.env.REACT_APP_BACKEND_URL}/api/getProductsCatalog?name=${searchValue}`;

            // если состояние фильтра типа typeFilter равно Men,то добавляем к url еще query параметр typeId со значением 1(указываем значение 1,так как на бэкэнде в базе данных сделали так,что нужно указывать фильтр type по его id,на бэкэнде это обрабатываем,в данном случае для фильтра типа Men на бэкэнде id 1)
            if (typeFilter === 'Men') {

                url += '&typeId=1';

            } else if (typeFilter === 'Women') {

                url += '&typeId=2';

            }

            if (filterCategories === 'Long Sleeves') {

                url += '&categoryId=1';

            } else if (filterCategories === 'Joggers') {

                url += '&categoryId=2';

            } else if (filterCategories === 'T-Shirts') {

                url += '&categoryId=3';

            } else if (filterCategories === 'Shorts') {

                url += '&categoryId=4';

            }

            // filterPrice[0] > 0 (то есть указан фильтр минимальной цены) или если data?.maxPriceAllProducts(максимальное значение цены товара,которое мы посчитали на бэкэнде и поместили в поле maxPriceAllProducts) true,то есть поле maxPriceAllProducts есть и в нем есть какое-то значение(делаем эту проверку,так как выдает ошибку,что data?.maxPriceAllProducts может быть undefined,но мы и так будем изменять фильтр цены когда объекты товаров загрузятся,и это уже будет повторный запрос на сервер,поэтому значение data?.maxPriceAllProducts уже будет и поэтому это подходит) и filterPrice[1] меньше data?.maxPriceAllProducts(максимальное значение цены товара,которое мы посчитали на бэкэнде и поместили в поле maxPriceAllProducts),то добавляем query параметр minPrice со значением filterPrice[0](минимальное значение фильтра цены) и maxPrice к url со значением этого максимального значения фильтра цены(filterPrice[1])
            if (filterPrice[0] > 0 || data?.maxPriceAllProducts && filterPrice[1] < data?.maxPriceAllProducts) {

                url += `&minPrice=${filterPrice[0]}&maxPrice=${filterPrice[1]}`;

            }

            // если sizesMass true,то есть массив фильтров для размеров есть и он не пустой
            if (sizesMass) {

                // проходимся по массиву sizesMass и на каждой итерации(для каждого элемента массива) добавляем к url до бэкэнда параметр &sizes со значением itemSize,то есть будет в url подставлено типа &sizes=S&sizes=M и тд
                sizesMass.forEach((itemSize) => {

                    url += `&sizes=${itemSize}`;

                })

            }

            // если sortBlockValue(состояние для сортировки товаров) не равно пустой строке,то добавляем к url еще параметры sortBy и order в которые передаем значение состояния sortBlockValue и порядок сортировки(DESC(от большего к меньшему) или ASC(от меньшего к большему) в данном случае для базы данных postgreSql),в нем хранится название поля,и это значение мы приводим к нижнему регистру букв с помощью toLowerCase(),чтобы в названии поля были все маленькие буквы,мы это обрабатываем на бэкэнде в node js)
            if (sortBlockValue !== '') {

                url += `&sortBy=${sortBlockValue.toLowerCase()}&order=DESC`;

            }

            // указываем тип данных,который придет от сервера как тип на основе нашего интерфейса IProductsCatalogResponse,у этого объекта будут поля count(количество объектов товаров всего,которые пришли от сервера) и rows(сами объекты товаров,но на конкретной странице пагинации),также поле maxPriceAllProducts(максимальная цена товара из всех),чтобы взять потом количество этих всех объектов товаров и использовать для пагинации),вместо url будет подставлено значение,которое есть у нашей переменной url
            const response = await axios.get<IProductsCatalogResponse>(url, {
                params: {

                    page: page,  // указываем параметр page(параметр текущей страницы,для пагинации)

                    limit: limit // указываем параметр limit для максимального количества объектов,которые будут на одной странице(для пагинации),можно было указать эти параметры limit и page просто через знак вопроса в url,но можно и тут в отдельном объекте params,также можно было не указывать limit:limit,а просто указать один раз limit(для page также),так как название ключа(поля объекта) и состояния limit(в данном случае) одинаковые,но указали уже так

                }
            }); // делаем запрос на сервер для получения товаров каталога,указываем в типе в generic наш тип на основе интерфейса IProductsCatalogResponse

            console.log(response);

            setFilteredLongSleeves(response.data.allProductsForCount.filter(product => product.categoryId === 1)); // помещаем в состояние filteredLongSleeves массив allProductsForCount(массив всех товаров без пагинации,который пришел от сервера),отфильтрованный с помощью filter(),фильтруем его(то есть оставляем все объекты в этом массиве,те для которых это условие в filter() будет true) по полю categoryId со значением,в данном случае 1(так как сделали в базе данных postgreSql так,что поле categoryId со значением 1 будет значить,что у этого товара категория 'Long Sleeves'),то есть получаем массив объектов товаров с категорией 'Long Sleeves',чтобы отобразить количество товаров в этой категории, фильтровать отдельно для цены и размеров(в данном случае sizes) не надо,так как и так на бэкэнде это проверяем,если эти фильтры указаны,и массив уже приходит отфильтрованный по этим фильтрам цены и размера,остается только отфильтровать его для каждой категории и типа(type)

            setFilteredJoggers(response.data.allProductsForCount.filter(product => product.categoryId === 2));

            setFilteredTShirts(response.data.allProductsForCount.filter(product => product.categoryId === 3));

            setFilteredShorts(response.data.allProductsForCount.filter(product => product.categoryId === 4));

            setFilteredTypeMen(response.data.allProductsForCount.filter(product => product.typeId === 1)); // это фильтруем уже для категории типа type(типа для мужской или женской одежды)

            setFilteredTypeWomen(response.data.allProductsForCount.filter(product => product.typeId === 2));

            const totalCount = response.data.allProductsForCount.length; // записываем общее количество объектов товаров с помощью .length,которые пришли от сервера в переменную totalCount(берем это у поля length у поля allProductsForCount(массив всех объектов товаров без лимитов и состояния текущей страницы,то есть без пагинации) у поля data у response(общий объект ответа от сервера))

            setTotalPages(Math.ceil(totalCount / limit)); // изменяем состояние totalPages на значение деления totalCount на limit,используем Math.ceil() - она округляет получившееся значение в большую сторону к целому числу(например,5.3 округлит к 6),чтобы правильно посчитать общее количество страниц

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля products(внутри него есть поле count и rows) и maxPriceAllProducts

        }
    })

    const [searchValue, setSearchValue] = useState(''); // состояние для инпута поиска

    const [filterCategories, setFilterCategories] = useState('');

    const [typeFilter, setTypeFilter] = useState(''); // состояние для фильтра типа(в данном случае для женской и мужской одежды)

    const [priceFilterMax, setPriceFilterMax] = useState(0); // состояние для максимальной цены товара,которое посчитали на бэкэнде и поместили в состояние priceFilterMax,указываем дефолтное значение 0,иначе не работает,так как выдает ошибки,что для ReactSlider нельзя назначить значение с типом undefined и тд

    const [filterPrice, setFilterPrice] = useState([0, priceFilterMax]); // массив для значений нашего инпута range(ReactSlider),первым значением указываем значение для первого ползунка у этого инпута,а вторым для второго, ставим изначальное значение для второго ползунка инпута как priceFilterMax(максимальная цена товарв из всех,которую посчитали на бэкэнде),чтобы сразу показывалось,что это максимальное значение цены,не указываем здесь конкретно data?.maxPriceAllProducts,так как тогда выдает ошибки,что для ReactSlider нельзя назначить значение с типом undefined и тд

    const [sizes, setSizes] = useState({
        sizeS: false,
        sizeM: false,
        sizeL: false,
        sizeXL: false,
    })

    const [sizesMass, setSizesMass] = useState<string[]>([]);

    const [activeSortBlock, setActiveSortBlock] = useState(false);

    const [sortBlockValue, setSortBlockValue] = useState(''); // состояние для значения селекта сортировки товаров по рейтингу и тд

    const sortItemHandlerRating = () => {

        setSortBlockValue('Rating'); // изменяем состояние sortBlockValue на значение Rating

        setActiveSortBlock(false); // изменяем состояние activeSortBlock на значение false,то есть убираем появившийся селект блок
    }

    // функция для кнопки удаления фильтра цены
    const removeFilterPrice = () => {

        if (data?.maxPriceAllProducts) {

            setFilterPrice([0, data?.maxPriceAllProducts]); // изменяем состояние фильтра цены на дефолтные значение(0 и data?.maxPriceAllProducts(максимальное значение цены товара,которое посчитали на бэкэнде))

        }

        // используем setTimeout,чтобы сделать повторный запрос на сервер через некоторое время,чтобы успело переобновиться состояние filterPrice,иначе состояние не успевает переобновиться и повторный запрос идет с предыдущими данными filterPrice,в данном случае ставим задержку(то есть через какое время выполниться повторный запрос) 200 миллисекунд(0.2 секунды)
        setTimeout(() => {

            refetch(); // делаем повторный запрос на сервер,чтобы переобновить данные товаров уже без фильтров цены,делаем так,потому что отдельно отслеживаем события кликов и ползунков у инпута React Slider,поэтому нужно отдельно переобновлять дополнительно данные в функциях изменения фильтра цены

        }, 200)

    }

    const addFilterSizeS = () => {

        setSizes((prev) => ({ ...prev, sizeS: !prev.sizeS })); // изменяем значение состояния sizes на новый объект,в который разворачиваем все поля предыдущего(текущего(prev)) объекта и меняем только поле sizeS на противоположное значение текущему(!prev.sizeS)

        // если в массиве sizesMass нету элемента,равного значению 'S'
        if (!sizesMass.some(item => item === 'S')) {

            sizesMass.push('S'); // пушим в это состояние sizesMass(массив) элемент со значением 'S'

        } else {
            // в другом случае,если этот элемент('S') уже есть,то оставляем все элементы в массиве sizesMass,которые не равны значению 'S',то удаляем этот элемент 'S' из массива sizesMass
            setSizesMass((prev) => prev.filter(item => item !== 'S'));

        }

    }

    const addFilterSizeM = () => {

        setSizes((prev) => ({ ...prev, sizeM: !prev.sizeM }));

        // если в массиве sizesMass нету элемента,равного значению 'M'
        if (!sizesMass.some(item => item === 'M')) {

            sizesMass.push('M'); // пушим в это состояние sizesMass(массив) элемент со значением 'M'

        } else {
            // в другом случае,если этот элемент('M') уже есть,то оставляем все элементы в массиве sizesMass,которые не равны значению 'M',то удаляем этот элемент 'M' из массива sizesMass
            setSizesMass((prev) => prev.filter(item => item !== 'M'));

        }

    }

    const addFilterSizeL = () => {

        setSizes((prev) => ({ ...prev, sizeL: !prev.sizeL }));

        // если в массиве sizesMass нету элемента,равного значению 'L'
        if (!sizesMass.some(item => item === 'L')) {

            sizesMass.push('L'); // пушим в это состояние sizesMass(массив) элемент со значением 'L'

        } else {
            // в другом случае,если этот элемент('L') уже есть,то оставляем все элементы в массиве sizesMass,которые не равны значению 'L',то удаляем этот элемент 'L' из массива sizesMass
            setSizesMass((prev) => prev.filter(item => item !== 'L'));

        }

    }

    const addFilterSizeXL = () => {

        setSizes((prev) => ({ ...prev, sizeXL: !prev.sizeXL }));

        // если в массиве sizesMass нету элемента,равного значению 'XL'
        if (!sizesMass.some(item => item === 'XL')) {

            sizesMass.push('XL'); // пушим в это состояние sizesMass(массив) элемент со значением 'XL'

        } else {
            // в другом случае,если этот элемент('XL') уже есть,то оставляем все элементы в массиве sizesMass,которые не равны значению 'XL',то удаляем этот элемент 'XL' из массива sizesMass
            setSizesMass((prev) => prev.filter(item => item !== 'XL'));

        }

    }

    const removeFilterSize = () => {

        setSizesMass([]); // изменяем состояние sizesMass на пустой массив

        // изменяем каждое поле в состоянии sizes(объект состояний в данном случае) на значение false,то есть убираем фильтр размеров
        setSizes({
            sizeS: false,
            sizeM: false,
            sizeL: false,
            sizeXL: false
        })

    }

    // при изменении data?.products.rows изменяем значение priceFilterMax на data?.maxPriceAllProducts(максимальное значение цены товара,которое посчитали на бэкэнде)
    useEffect(() => {

        // если data?.maxPriceAllProducts true,то есть data?.maxPriceAllProducts есть и в нем есть какое-то значение,делаем эту проверку,иначе выдает ошибку,что data?.maxPriceAllProducts может быть undefined
        if (data?.maxPriceAllProducts) {

            setPriceFilterMax(data?.maxPriceAllProducts);

        }

        console.log(data?.maxPriceAllProducts);

    }, [data?.products.rows])

    // при изменении priceFilterMax изменяем значение filterPrice,возвращаем массив,первым элементом указываем предыдущее значение по индексу 0(то есть минимальное значение фильтра цены) и второй элемент указываем со значением как priceFilterMax(делаем эти манипуляции с priceFilterMax,иначе выдает ошибку,что для ReacSlider нельзя указать значение с типом undefined и тд)
    useEffect(() => {

        setFilterPrice((prev) => [prev[0], priceFilterMax]);

        console.log(filterPrice);

    }, [priceFilterMax])

    // указываем в массиве зависимостей этого useEffect data?.products(массив объектов товаров для отдельной страницы пагинации),чтобы делать повторный запрос на получения объектов товаров при изменении data?.products,в данном случае это для пагинации,если не указать data?.products,то пагинация при запуске страницы не будет работать, также делаем повторный запрос на сервер уже с измененным значение searchValue(чтобы поисковое число(число товаров,которое изменяется при поиске) показывалось правильно,когда вводят что-то в поиск)
    useEffect(() => {

        refetch(); // делаем повторный запрос на получение товаров при изменении data?.products, searchValue(значение инпута поиска),filterCategories и других фильтров,а также при изменении состояния текущей страницы пагинации 

    }, [searchValue, typeFilter, filterCategories, sizes, sortBlockValue, page])

    // при изменении searchValue,то есть когда пользователь что-то вводит в инпут поиска,то изменяем filterCategory на пустую строку и остальные фильтры тоже,соответственно будет сразу идти поиск по всем товарам,а не в конкретной категории или определенных фильтрах,но после поиска можно будет результат товаров по поиску уже отфильтровать по категориям и тд
    useEffect(() => {

        setFilterCategories('');

        setTypeFilter('');

        setFilterPrice([0, priceFilterMax]);  // убираем фильтр цены,изменяем состояние filterPrice для фильтра цены,первым элементом массива указываем значение 0(дефолтное значение фильтра цены),вторым элементом указываем priceFilterMax(максимальное значение цены товара,которое посчитали на бэкэнде и поместили в состояние priceFilterMax)

        // изменяем каждое поле в состоянии sizes(объект состояний в данном случае) на значение false,то есть убираем фильтр размеров
        setSizes({
            sizeS: false,
            sizeM: false,
            sizeL: false,
            sizeXL: false,
        });

        setSizesMass([]); // изменяем состояние sizesMass на пустой массив

        // используем setTimeout,чтобы сделать повторный запрос на сервер через некоторое время,чтобы успело переобновиться состояние filterPrice,иначе состояние не успевает переобновиться и повторный запрос идет с предыдущими данными filterPrice,в данном случае ставим задержку(то есть через какое время выполниться повторный запрос) 100 миллисекунд(0.1 секунда)
        setTimeout(() => {

            refetch(); // делаем повторный запрос на сервер,чтобы переобновить данные товаров уже без фильтров цены,делаем так,потому что отдельно отслеживаем события кликов и ползунков у инпута React Slider,поэтому нужно отдельно переобновлять дополнительно данные в функциях изменения фильтра цены

        }, 100);


    }, [searchValue])

    // при изменении фильтров и состояния сортировки(sortBlockValue в данном случае) изменяем состояние текущей страницы пагинации на первую
    useEffect(() => {

        setPage(1);

    }, [filterPrice, filterCategories, sortBlockValue, typeFilter, sizes])

    let pagesArray = getPagesArray(totalPages, page); // помещаем в переменную pagesArray массив страниц пагинации,указываем переменную pagesArray как let,так как она будет меняться в зависимости от проверок в функции getPagesArray

    const prevPage = () => {

        // если текущая страница больше или равна 2,делаем эту проверку,чтобы если текущая страница 1,то не отнимало минус 1
        if (page >= 2) {

            setPage((prev) => prev - 1); // изменяем состояние текущей страницы на - 1(то есть в setPage берем prev(предыдущее значение,то есть текущее) и отнимаем 1)

        }

    }

    const nextPage = () => {

        // если текущая страница меньше или равна общему количеству страниц - 1(чтобы после последней страницы не переключалось дальше)
        if (page <= totalPages - 1) {

            setPage((prev) => prev + 1); // изменяем состояние текущей страницы на + 1(то есть в setPage берем prev(предыдущее значение,то есть текущее) и прибавляем 1)

        }

    }

    return (
        <main className="main">
            <SectionUnderTop subtext="Shop" /> {/* указываем пропс(параметр) subtext(в данном случае со значением Shop,чтобы отобразить в этой секции текст Shop,так как это для страницы каталога),чтобы использовать этот компонент на разных страницах,а отличаться он будет только этим параметром subtext */}
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active " : "sectionCatalog"} ref={sectionCatalog}>
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__filterBar">

                            <div className="sectionCatalog__filterBar-filterItem">
                                <h2 className="filterBar__filterItem-title filterBar__filterItem-title--categories">Type</h2>
                                <div className="filterBar__filterItem-labels">
                                    <label className="filterBar__filterItem-categoriesLabel" onClick={() => setTypeFilter('Men')}>
                                        <input type="radio" name="radio" className="categoriesLabel__input" />
                                        <span className={typeFilter === 'Men' ? "categoriesLabel-radioStyle categoriesLabel-radioStyle--active" : "categoriesLabel-radioStyle"}>
                                            <span className={typeFilter === 'Men' ? "categoriesLabel__radioStyle-before categoriesLabel__radioStyle-before--active" : "categoriesLabel__radioStyle-before"}></span>
                                        </span>
                                        <p className={typeFilter === 'Men' ? "categoriesLabel__text categoriesLabel__text--active" : "categoriesLabel__text"}>Men</p>

                                        {/* если typeFilter !== '',то есть какая-либо категория выбрана,то не показываем число товаров в этой категории(в данном случае сделали так,чтобы число товаров в определенном типе(type) показывалось только если никакой другой тип(type) не выбран),указываем значение этому тексту для количества товаров категории, в данном случае как filteredTypeMen.length(массив объектов товаров,отфильтрованный по полю typeId и значению 1(то есть в данном случае для типа 'Men'),лучше фильтровать массивы товаров для показа количества товаров в категориях запросами на сервер,добавляя туда параметры фильтров,если они выбраны,но тогда может много запросов идти на сервер и сейчас уже сделали так */}
                                        <p className={typeFilter !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>({filteredTypeMen.length})</p>
                                    </label>
                                    <label className="filterBar__filterItem-categoriesLabel" onClick={() => setTypeFilter('Women')}>
                                        <input type="radio" name="radio" className="categoriesLabel__input" />
                                        <span className={typeFilter === 'Women' ? "categoriesLabel-radioStyle categoriesLabel-radioStyle--active" : "categoriesLabel-radioStyle"}>
                                            <span className={typeFilter === 'Women' ? "categoriesLabel__radioStyle-before categoriesLabel__radioStyle-before--active" : "categoriesLabel__radioStyle-before"}></span>
                                        </span>
                                        <p className={typeFilter === 'Women' ? "categoriesLabel__text categoriesLabel__text--active" : "categoriesLabel__text"}>Women</p>
                                        <p className={typeFilter !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>({filteredTypeWomen.length})</p>
                                    </label>
                                </div>
                            </div>

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
                                        <p className={filterCategories !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>({filteredLongSleeves.length})</p>
                                    </label>
                                    <label className="filterBar__filterItem-categoriesLabel" onClick={() => setFilterCategories('Joggers')}>
                                        <input type="radio" name="radio" className="categoriesLabel__input" />
                                        <span className={filterCategories === 'Joggers' ? "categoriesLabel-radioStyle categoriesLabel-radioStyle--active" : "categoriesLabel-radioStyle"}>
                                            <span className={filterCategories === 'Joggers' ? "categoriesLabel__radioStyle-before categoriesLabel__radioStyle-before--active" : "categoriesLabel__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Joggers' ? "categoriesLabel__text categoriesLabel__text--active" : "categoriesLabel__text"}>Joggers</p>
                                        <p className={filterCategories !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>({filteredJoggers.length})</p>
                                    </label>
                                    <label className="filterBar__filterItem-categoriesLabel" onClick={() => setFilterCategories('T-Shirts')}>
                                        <input type="radio" name="radio" className="categoriesLabel__input" />
                                        <span className={filterCategories === 'T-Shirts' ? "categoriesLabel-radioStyle categoriesLabel-radioStyle--active" : "categoriesLabel-radioStyle"}>
                                            <span className={filterCategories === 'T-Shirts' ? "categoriesLabel__radioStyle-before categoriesLabel__radioStyle-before--active" : "categoriesLabel__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'T-Shirts' ? "categoriesLabel__text categoriesLabel__text--active" : "categoriesLabel__text"}>T-Shirts</p>
                                        <p className={filterCategories !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>({filteredTShirts.length})</p>
                                    </label>
                                    <label className="filterBar__filterItem-categoriesLabel" onClick={() => setFilterCategories('Shorts')}>
                                        <input type="radio" name="radio" className="categoriesLabel__input" />
                                        <span className={filterCategories === 'Shorts' ? "categoriesLabel-radioStyle categoriesLabel-radioStyle--active" : "categoriesLabel-radioStyle"}>
                                            <span className={filterCategories === 'Shorts' ? "categoriesLabel__radioStyle-before categoriesLabel__radioStyle-before--active" : "categoriesLabel__radioStyle-before"}></span>
                                        </span>
                                        <p className={filterCategories === 'Shorts' ? "categoriesLabel__text categoriesLabel__text--active" : "categoriesLabel__text"}>Shorts</p>
                                        <p className={filterCategories !== '' ? "categoriesLabel__amount categoriesLabel__amountDisable" : "categoriesLabel__amount"}>({filteredShorts.length})</p>
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

                                        max={data?.maxPriceAllProducts} // поле для максимального значения

                                        min={0} // поле для минимального значения

                                        minDistance={5} // минимальная дистанция между ползунками этого слайдера(input range),указывается типа в пикселях,лучше ее указать,иначе,если они потом будут друг на друге стоять и пытаться переместить их нажатием на другую сторону,то сможет переместиться только в одну сторону,прежде чем сможет нормально работать,а также при этих многочисленных попыток может показать ошибку,поэтому указываем эту минимальную дистанцию(в 5 пикселей в данном случае)

                                        value={filterPrice}  // указываем поле value как наше состояние filterPrice(массив из 2 элементов для минимального и максимального значения фильтра цены),указываем это,чтобы при изменении состояния filterPrice, менялось и значение этого инпута range,то есть этого react slider(его ползунки и значения их),в данном случае это для того,чтобы при удалении фильтра цены,менялись значения ползунков этого react slider(инпут range)

                                        // вместо этого сами деструктуризируем дополнительные параметры из props в коде ниже,иначе выдает ошибку в версии react 19,так как библиотека react-slider давно не обновлялась,а сам react обновился
                                        // renderThumb={(props,state) => <div {...props}>{state.valueNow}</div>}

                                        // деструктуризируем поле key и ...restProps из props(параметр у этой функции callback),чтобы потом отдельно передать в div,так как выдает ошибку в версии react 19,если сделать как код выше
                                        renderThumb={(props, state) => {
                                            const { key, ...restProps } = props; // деструктуризируем отдельно поле key из props,и остальные параметры,которые есть у props,разворачиваем в этот объект и указываем им название restProps(...restProps),потом отдельно указываем этому div поле key и остальные параметры у props(restProps),разворачиваем restProps в объект,таким образом передаем их этому div {...restProps}

                                            return (
                                                <div key={key} {...restProps}>{state.valueNow}</div>
                                            );

                                        }}

                                        onChange={(value, index) => setFilterPrice(value)} // при изменении изменяем значение состояния массива filterPrice(в параметрах функция callback принимает value(массив текущих значений этого инпута) и index(индекс кнопки элемента массива,то есть за какую кнопку сейчас дергали))

                                        // onAfterChange срабатывает,когда отпустили ползунок у инпута React Slider,в данном случае делаем повторный запрос на сервер(refetch()),когда отпустили ползунок у инпута,чтобы переобновить данные товаров уже с новым фильтром цены
                                        onAfterChange={() => {

                                            refetch();

                                        }}

                                        // onSliderClick срабатывает,когда нажали на инпут React Slider,в данном случае делаем повторный запрос на сервер(refetch()),когда нажимаем на React Slider,чтобы переобновить данные товаров уже с новым фильтром цены(если не указать это,то при клике на инпут React Slider значение будет изменяться правильно,а при запросе на сервер будут неправильные значения)
                                        onSliderClick={() => {

                                            refetch();

                                        }}


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
                                        <button className={sizes.sizeS ? "filterBar__filterItem-sizeBtn filterBar__filterItem-sizeBtn--active" : "filterBar__filterItem-sizeBtn"} onClick={addFilterSizeS}>S</button>

                                        <button className={sizes.sizeM ? "filterBar__filterItem-sizeBtn filterBar__filterItem-sizeBtn--active" : "filterBar__filterItem-sizeBtn"} onClick={addFilterSizeM}>M</button>

                                        <button className={sizes.sizeL ? "filterBar__filterItem-sizeBtn filterBar__filterItem-sizeBtn--active" : "filterBar__filterItem-sizeBtn"} onClick={addFilterSizeL}>L</button>

                                        <button className={sizes.sizeXL ? "filterBar__filterItem-sizeBtn filterBar__filterItem-sizeBtn--active" : "filterBar__filterItem-sizeBtn"} onClick={addFilterSizeXL}>XL</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="sectionCatalog__productsBlock">
                            <div className="sectionCatalog__productsBlock-searchBlock">
                                <div className="sectionCatalog__searchBlock-inputBlock">
                                    <input type="text" className="searchBlock__inputBlock-input" placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                                    <img src="/images/sectionCatalog/Icon (1).png" alt="" className="searchBlock__inputBlock-img" />
                                </div>
                                <div className="searchBlock__sortBlock">
                                    <p className="sortBlock__text">Sort By:</p>
                                    <div className="sortBlock__inner">
                                        <div className="sortBlock__topBlock" onClick={() => setActiveSortBlock((prev) => !prev)}>
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
                            <div className="productsBlock__filtersBlock">
                                <div className="productsBlock__filtersBlock-leftBlock">
                                    <p className="filtersBlock__text">Active Filters:</p>

                                    {/* если typeFilter не равно пустой строке,то показываем фильтр с текстом typeFilter,то есть выбран фильтр сортировки по типам для женской или мужской одежды */}
                                    {typeFilter !== '' &&

                                        <div className="filtersBlock__leftBlock-item">

                                            {typeFilter === 'Men' &&
                                                <p className="filtersBlock__item-text">Men</p>
                                            }

                                            {typeFilter === 'Women' &&
                                                <p className="filtersBlock__item-text">Women</p>
                                            }

                                            <button className="filtersBlock__item-btn" onClick={() => setTypeFilter('')}>
                                                <img src="/images/sectionCatalog/CrossImg.png" alt="" className="filtersBlock__item-btnImg" />
                                            </button>
                                        </div>

                                    }

                                    {/* если filterCategories не равно пустой строке,то показываем фильтр с текстом filterCategories,то есть выбран фильтр сортировки по категориям */}
                                    {filterCategories !== '' &&

                                        <div className="filtersBlock__leftBlock-item">

                                            {filterCategories === 'Long Sleeves' &&
                                                <p className="filtersBlock__item-text">Long Sleeves</p>
                                            }

                                            {filterCategories === 'Joggers' &&
                                                <p className="filtersBlock__item-text">Joggers</p>
                                            }

                                            {filterCategories === 'T-Shirts' &&
                                                <p className="filtersBlock__item-text">T-Shirts</p>
                                            }

                                            {filterCategories === 'Shorts' &&
                                                <p className="filtersBlock__item-text">Shorts</p>
                                            }


                                            <button className="filtersBlock__item-btn" onClick={() => setFilterCategories('')}>
                                                <img src="/images/sectionCatalog/CrossImg.png" alt="" className="filtersBlock__item-btnImg" />
                                            </button>
                                        </div>

                                    }

                                    {/* если элемент по индексу 0 из массива filterPrice не равно 0 или элемент по индексу 1 из массива filterPrice меньше priceFilterMax(максимальное значение цены товара,которое посчитали на бэкэнде и поместили в состояние priceFilterMax) (то есть это не дефолтные значения,то есть пользователь изменил фильтр цены),то показываем фильтр цены,в данном случае делаем условие именно таким образом(после условия ставим знак вопроса ? (то есть если условие выполняется), а потом ниже в коде ставим двоеточие : (то есть в противоположном случае,если это условие не выполняется) и пустую строку '' (то есть не показываем ничего) ),иначе не работает правильно условие */}
                                    {filterPrice[0] !== 0 || filterPrice[1] < priceFilterMax ?

                                        <div className="filtersBlock__leftBlock-item">

                                            <p className="filtersBlock__item-text">Price: ${filterPrice[0]} - ${filterPrice[1].toFixed(0)}</p>


                                            {/* в onClick(при нажатии на кнопку) указываем нашу функцию removeFilterPrice,там убираем фильтр цены и тд */}
                                            <button className="filtersBlock__item-btn" onClick={removeFilterPrice}>
                                                <img src="/images/sectionCatalog/CrossImg.png" alt="" className="filtersBlock__item-btnImg" />
                                            </button>
                                        </div>
                                        : ''
                                    }

                                    {/* если sizesMass.length не равно 0,то есть длина массива sizesMass не равна 0,то есть пользователь выбрал хотя бы один фильтр размера,то показываем элемент(item) с фильтром этого размера */}
                                    {sizesMass.length !== 0 &&

                                        <div className="filtersBlock__leftBlock-item">

                                            {/* проходимся по массиву sizesMass и отрисовываем на основе него(вместо каждого элемента этого массива sizesMass,показываем новый элемент с тегом p) новый массив элементов с тегом p и значением как size(то есть значением элемента массива sizesMass на каждой итерации),указываем key как size в данном случае,так как элементы этого массива sizesMass будут разными и будут отличаться */}
                                            <div className="filtersBlock__item-textBlockSize">Size:
                                                {/* {sizesMass.map((size,index) => {

                                                    // если длина массива sizesMass больше 1(то есть пользователь выбрал фильтр размеров больше 1) и индекс элемента size у массива sizesMass меньше sizesMass.length - 1,то есть длина массива - 1(то есть это будет предпоследний элемент,так как длина массива в данном случае будет 4(минус 1 и будет 3),а индекс элемента массива тогда будет 2,так как индексы в массиве начинают счет с нуля),то есть для всех элементов этого массива, кроме последнего,будет отрисован текст этого элемента и запятая,а для последнего будет просто текст без запятой
                                                    if (sizesMass.length > 1 && sizesMass.indexOf(size) < sizesMass.length - 1) {

                                                        // именно возвращаем этот html элемент,так как мы открыли квадратные скобки {} у этой стрелочной функции map и должны вернуть новые элементы массива,если бы не нужно было писать условия,то можно было бы просто обернуть этот html элемент в круглые скобки (),это бы означало,что мы его возвращаем(вместо отдельного такого return)
                                                        return <p key={size} className="filtersBlock__item-text">{size}, </p>

                                                    } else {
                                                        // в другом случае возвращаем этот html элемент p со значением size(элемент массива sizesMass на текущей итерации) 
                                                        return <p key={size} className="filtersBlock__item-text">{size}</p>

                                                    }

                                                })} */}

                                                {/* не используем код выше,так как этот текст лучше смотрится без запятой,а код чуть выше для примера,чтобы сделать с запятой */}
                                                {sizesMass.map((size, index) =>
                                                    <p key={size} className="filtersBlock__item-text">{size}</p>
                                                )}

                                            </div>

                                            {/* в onClick указываем нашу функцию removeFilterSize,в ней убираем фильтр размеров */}
                                            <button className="filtersBlock__item-btn" onClick={removeFilterSize}>
                                                <img src="/images/sectionCatalog/CrossImg.png" alt="" className="filtersBlock__item-btnImg" />
                                            </button>
                                        </div>

                                    }

                                    {/* если sortBlockValue не равно пустой строке,то показываем текст сортировки(item с текстом сортировки) */}
                                    {sortBlockValue !== '' &&

                                        <div className="filtersBlock__leftBlock-item">

                                            <p className="filtersBlock__item-text">Sort By: {sortBlockValue}</p>

                                            {/* в onClick указываем значение sortBlockValue на пустую строку,то есть убираем фильтр сортировки товаров */}
                                            <button className="filtersBlock__item-btn" onClick={() => setSortBlockValue('')}>
                                                <img src="/images/sectionCatalog/CrossImg.png" alt="" className="filtersBlock__item-btnImg" />
                                            </button>
                                        </div>

                                    }

                                </div>
                                <div className="productsBlock__filtersBlock-amountBlock">
                                    {/* указываем значение этому тексту как data?.products.count,то есть количество объектов всех товаров без пагинации,который приходит от сервера */}
                                    <p className="filtersBlock__amountBlock-amount">{data?.products.count}</p>
                                    <p className="filtersBlock__amountBlock-text">Results found.</p>
                                </div>
                            </div>

                            {/*  указываем если data?.rows.length true(то есть количество всех объектов товаров на определенной странице пагинации true,то есть они есть) и isFetching false(то есть загрузка запроса на сервер закончена,делаем эту проверку,чтобы когда грузится запрос на сервер показывать лоадер(загрузку) или текст типа Loading... ), то показываем объекты товаров,в другом случае если isFetching true,то показываем лоадер,или текст типа Loading..., и уже в другом случае,если эти условия не верны,то показываем текст,что не найдены объекты товаров,проходимся по массиву объектов товаров data?.rows,указываем data?.rows,так как от сервера в поле data приходит объект с полями products(внутри поля count и rows) и maxPriceAllProducts(максимальное значение цены товара из всех) */}
                            {!isFetching && data?.products.rows.length ?

                                <div className="sectionCatalog__productsBlock-productsItems">

                                    {data?.products.rows.map((product) =>

                                        <ProductItemCatalog key={product.id} product={product} />

                                    )}

                                </div>

                                : isFetching ?

                                    <div className="innerForLoader">
                                        <div className="loader"></div>
                                    </div>

                                    : <h2 className="productsBlock__notFoundText">Not Found</h2>

                            }

                            {/* если длина массива всех объектов товаров для определенной страницы пагинация(data?.products.rows.length) true(то есть товары есть) и isFetching false(то есть запрос на сервер сейчас не грузится,делаем проверку на isFetching,чтобы пагинация не показывалась,когда грузится запрос на сервер и показывается лоадер),то показывать пагинацию,в другом случае пустая строка(то есть ничего не показывать) */}
                            {!isFetching && data?.products.rows.length ?

                                <div className="productsBlock__pagination">

                                    <button className="productsBlock__pagination-btnArrowLeft" onClick={prevPage}>
                                        <img src="/images/sectionCatalog/ArrowLeft.png" alt="" className="pagination__btnArrow-img" />
                                    </button>

                                    {pagesArray.map(p =>

                                        <button
                                            className={page === p ? "pagination__item pagination__item--active" : "pagination__item"} // если состояние номера текущей страницы page равно значению элемента массива pagesArray,то отображаем такие классы(то есть делаем эту кнопку страницы активной),в другом случае другие

                                            key={p}

                                            onClick={() => setPage(p)} // отслеживаем на какую кнопку нажал пользователь и делаем ее активной,изменяем состояние текущей страницы page на значение элемента массива pagesArray(то есть страницу,на которую нажал пользователь)

                                        >{p}</button>

                                    )}


                                    {/* если общее количество страниц больше 4 и текущая страница меньше общего количества страниц - 2,то отображаем три точки */}
                                    {totalPages > 4 && page < totalPages - 2 && <div className="pagination__dots">...</div>}


                                    {/* если общее количество страниц больше 3 и текущая страница меньше общего количества страниц - 1,то отображаем кнопку последней страницы,при клике на кнопку изменяем состояние текущей страницы на totalPages(общее количество страниц,то есть на последнюю страницу) */}
                                    {totalPages > 3 && page < totalPages - 1 && <button className="pagination__item" onClick={() => setPage(totalPages)}>{totalPages}</button>}


                                    <button className="productsBlock__pagination-btnArrowRight" onClick={nextPage}>
                                        <img src="/images/sectionCatalog/ArrowRight.png" alt="" className="pagination__btnArrow-img" />
                                    </button>

                                </div>
                                : ''

                            }



                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Catalog;