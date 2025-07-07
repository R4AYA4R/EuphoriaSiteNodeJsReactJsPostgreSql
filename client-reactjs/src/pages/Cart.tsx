import { RefObject, useEffect, useRef, useState } from "react";
import ProductItemCart from "../components/ProductItemCart";
import SectionUnderTop from "../components/SectionUnderTop";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { ICommentResponse, IProductsCartResponse } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { getPagesArray } from "../utils/getPagesArray";


const Cart = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [subtotalCheckPrice, setSubtotalCheckPrice] = useState<number>(); // состояние для цены суммы чека всей корзины

    const [limit, setLimit] = useState(3); // указываем лимит для максимального количества объектов,которые будут на одной странице(для пагинации)

    const [page, setPage] = useState(1); // указываем состояние текущей страницы

    const [totalPages, setTotalPages] = useState(0); // указываем состояние totalPages в данном случае для общего количества страниц

    const { user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    // указываем в этой функции запроса на сервер для получения массива товаров корзины такой же queryKey как и на странице ProductItemPageItemBlock.tsx,чтобы эти данные кешировались и можно было переобновить их на этой странице,чтобы они переобновились сразу же и для страницы ProductItemPageItemBlock.tsx
    const { data: dataProductsCart, refetch: refetchProductsCart, isFetching } = useQuery({
        queryKey: ['getAllProductsCart'], // указываем название
        queryFn: async () => {

            // если user.id true,то есть id у user есть,то делаем запрос на сервер,делаем эту проверку,чтобы шел запрос на сервер на получение массива объектов товаров корзины только когда user.id true(то есть пользователь авторизован),в другом случае возвращаем null,делаем так,чтобы не выдавало ошибку на сервере,что user.id undefined,а возвращаем null,чтобы не выдавало ошибку,что query data(данные из функции запроса на сервер с помощью useQuery) не может быть undefined
            if (user.id) {

                const response = await axios.get<IProductsCartResponse>(`${process.env.REACT_APP_BACKEND_URL}/api/getAllProductsCart?userId=${user.id}`, {
                    params: {
                        limit, // указываем параметр limit для максимального количества объектов,которые будут на одной странице(для пагинации),можно было указать эти параметры limit и page просто через знак вопроса в url,но можно и тут в отдельном объекте params,также можно было не указывать limit:limit,а просто указать один раз limit(для page также),так как название ключа(поля объекта) и состояния limit(в данном случае) одинаковые,но указали уже так

                        page  // указываем параметр page(параметр текущей страницы,для пагинации)
                    }
                }); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductsCartResponse),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя,вынесли основной url до бэкэнда в переменную окружения REACT_APP_BACKEND_URL в файле .env

                console.log(response.data);

                const totalCount = response.data.allProductsCartForUser.length; // записываем общее количество объектов товаров с помощью .length,которые пришли от сервера в переменную totalCount(берем это у поля length у поля allProductsCartForUser(массив всех объектов товаров корзины,отфильтрованных для определенного пользователя без лимитов и состояния текущей страницы,то есть без пагинации) у поля data у response(общий объект ответа от сервера))

                setTotalPages(Math.ceil(totalCount / limit)); // изменяем состояние totalPages на значение деления totalCount на limit,используем Math.ceil() - она округляет получившееся значение в большую сторону к целому числу(например,5.3 округлит к 6),чтобы правильно посчитать общее количество страниц

                return response.data; // возвращаем конкретный уже объект ответа от сервера(response.data),в нем будет объект массивов объектов товаров корзины(allProductsCartForUser и productsCartForPagination),который мы берем из этого useQuery


            } else {

                return null;

            }


        }
    })

    // указываем такой же queryKey как и в секции sectionNewArrivals для получения всех комментариев,чтобы при изменении комментариев у товара на странице ProductItemPage переобновлять массив комментариев в секции sectionNewArrivals и здесь на странице Cart.tsx
    const { data: dataComments, refetch: refetchComments } = useQuery({
        queryKey: ['commentsForProduct'], // указываем название
        queryFn: async () => {

            const response = await axios.get<ICommentResponse>(`${process.env.REACT_APP_BACKEND_URL}/api/getCommentsForProduct`); // делаем запрос на сервер для получения всех комментариев для секции sectionNewArrivals,указываем в типе в generic наш тип на основе интерфейса ICommentResponse,указываем(то есть указываем тип данных,которые придут от сервера),вынесли основной url до бэкэнда в переменную REACT_APP_BACKEND_URL(REACT_APP_ обязательная приставка для переменных в .env файле для react js,иначе не находит эти переменные,и после изменения этих переменных в файле .env,нужно заново запустить сайт,то есть закрыть терминал(консоль) с текущим открытым сайтом(если это на localhost запускается,то есть на локальном компьютере),и заново в новом терминале запустить его командой npm start) в файле .env,чтобы было более удобно ее указывать и было более безопасно,так как обычно git не отслеживает этот файл и не будет его пушить в репозиторий,также после этого url указываем конкретный путь до нашего роутера на бэкэнде(/api в данном случае),а потом уже конкретный url до эндпоинта

            console.log(response.data);

            return response.data; // возвращаем конкретный уже объект ответа от сервера(response.data),в нем будет объект массивов объектов комментариев(allComments,allCommentsForProduct и commentsForPagination),который мы берем из этого useQuery

        }
    })

    // при рендеринге этого компонента и при изменении dataProductsCart?.allProductsCartForUser(массив объектов товаров корзины) отработает этот useEffect
    useEffect(() => {

        const dataTotalPrice = dataProductsCart?.allProductsCartForUser.reduce((prev, curr) => prev + curr.totalPrice, 0); // проходимся по массиву объектов товаров корзины и на каждой итерации увеличиваем переменную prev(это число,и мы указали,что в начале оно равно 0 и оно будет увеличиваться на каждой итерации массива объектов,запоминая старое состояние числа и увеличивая его на новое значение) на curr(текущий итерируемый объект).totalPrice,это чтобы посчитать общую сумму цены всех товаров

        setSubtotalCheckPrice(dataTotalPrice); // изменяем состояние общей цены всей корзины на dataTotalPrice

    }, [dataProductsCart?.allProductsCartForUser])

    // при запуске(рендеринге) этого компонента и при изменении user(объекта пользователя) переобновляем массив товаров корзины dataProductsCart(он будет переобновлен для всех компонентов,где мы указывали такой же query key для функции запроса на сервер с помощью useQuery,то есть для страницы корзины,страницы о товаре и тд),так как не успевает загрузится запрос /refresh для проверки авторизации пользователя(для выдачи новых токенов refresh и access),иначе если этого не сделать,то после обновления страницы корзины не показывается,что этот товар есть в корзине, при изменении состояния user(в userSlice в данном случае) (то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются),то делаем повторный запрос на получения товаров корзины,чтобы данные о количестве товаров корзины сразу переобновлялись при изменения состояния user(то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются),в данном случае если не сделать это,то при обновлении страницы не работает пагинация
    useEffect(() => {

        refetchProductsCart();

    }, [user])

    // при изменении страницы пагинации переобновляем(делаем повторный запрос на сервер) массив товаров корзины
    useEffect(() => {

        refetchProductsCart();

    }, [page])

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
            <SectionUnderTop subtext="Cart" />
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active sectionCart" : "sectionCatalog sectionCart"} ref={sectionCatalog}>
                <div className="container">
                    <div className="sectionCart__inner">
                        <div className="sectionCart__table">
                            <div className="sectionCart__table-names">
                                <p className="sectionCart__table-name">Product Details</p>
                                <p className="sectionCart__table-name">Price</p>
                                <p className="sectionCart__table-name">Quantity</p>
                                <p className="sectionCart__table-name">Subtotal</p>
                                <p className="sectionCart__table-name">Action</p>
                            </div>
                            <div className="sectionCart__table-mainBlock">

                                {/* если user.userName true и dataProductsCart?.allProductsCartForUser.length true,то есть пользователь авторизован и массив товаров корзины для определенного пользователя есть,то показываем этот блок с товарами и пагинацией,в другом случае,если isFetching(если грузится сейчас запрос на сервер на получения товаров корзины) или isLoading(если данные о пользователе сейчас загружаются) true,то показываем лоадер,и уже в другом случае показываем текст,что корзина пустая */}
                                {user.userName && dataProductsCart?.allProductsCartForUser.length ?

                                    <>
                                        <div className="sectionCart__table-productsBlock">

                                            {dataProductsCart?.productsCartForPagination.rows.map(productCart =>

                                                <ProductItemCart key={productCart.id} productCart={productCart} comments={dataComments?.allComments} />

                                            )}

                                        </div>

                                        {/* если dataProductsCart?.allProductsCartForUser.length > 3,то есть длина массива объектов товаров корзины больше 3,то показываем пагинацию,в другом случае пустая строка,то есть ничего не показываем,делаем эту проверку,чтобы если товаров в корзине 3 или меньше,то пагинация не показывалась */}
                                        {dataProductsCart?.allProductsCartForUser.length > 3 ?

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

                                            </div> : ''

                                        }


                                        <div className="sectionCart__table-bottomBlock">
                                            <button className="sectionCart__table-bottomBlockClearBtn">Clear Cart</button>

                                            <button className="sectionCart__table-bottomBlockUpdateBtn">Update Cart</button>
                                        </div>


                                    </> : isFetching || isLoading ?

                                        <div className="innerForLoader">
                                            <div className="loader"></div>
                                        </div> :

                                        <h1 className="textEmptyCart">Cart is Empty</h1>

                                }





                            </div>
                        </div>
                        <div className="sectionCart__bill">
                            <div className="sectionCart__bill-topBlock">
                                <div className="sectionCart__bill-topBlockItem">
                                    <p className="bill__topBlockItem-text">Subtotal</p>

                                    {/* если subtotalCheckPrice true(то есть в этом состоянии есть значение,в данном случае делаем эту проверку,потому что выдает ошибку,что subtotalCheckPrice может быть undefined),то указываем значение этому тексту как subtotalCheckPrice,в другом случае,если корзина пустая и subtotalCheckPrice не true,то указываем 0 и указываем toFixed(2),чтобы было 2 цифры после запятой,иначе,при изменении количества товара,может быть число с большим количеством цифр после запятой,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически,а также чтобы красивее смотрелось с двумя нулями или двумя числами после запятой */}
                                    <p className="bill__topBlockItem-subtext">${(subtotalCheckPrice ? subtotalCheckPrice : 0)?.toFixed(2)}</p>
                                </div>
                                <div className="sectionCart__bill-topBlockItem">
                                    <p className="bill__topBlockItem-text">Shipping</p>
                                    <p className="bill__topBlockItem-subtext">$5.00</p>
                                </div>
                            </div>
                            <div className="sectionCart__bill-bottomBlock">
                                <div className="sectionCart__bill-topBlockItem">
                                    <p className="bill__bottomBlockItem-text">Total</p>

                                    {/* если subtotalCheckPrice true(то есть в этом состоянии есть значение,в данном случае делаем эту проверку,потому что выдает ошибку,что subtotalCheckPrice может быть undefined),то указываем значение этому тексту как subtotalCheckPrice + 5(в данном случае 5 это типа цена доставки,мы ее прибавляем к общей цене всех товаров корзины), в другом случае,если корзина пустая и subtotalCheckPrice не true,то указываем 0 и указываем toFixed(2),чтобы было 2 цифры после запятой,иначе,при изменении количества товара,может быть число с большим количеством цифр после запятой,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически,а также чтобы красивее смотрелось с двумя нулями или двумя числами после запятой */}
                                    <p className="bill__bottomBlockItem-subtext">${(subtotalCheckPrice ? subtotalCheckPrice + 5 : 0)?.toFixed(2)}</p>
                                </div>
                                <button className="sectionCart__bill-btn">Proceed To Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Cart;