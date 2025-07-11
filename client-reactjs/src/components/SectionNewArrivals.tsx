import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ICommentResponse, IProduct, IProductsCartResponse } from "../types/types";
import ProductItemArrivals from "./ProductItemArrivals";
import { useTypedSelector } from "../hooks/useTypedSelector";

const SectionNewArrivals = () => {

    const sectionCategories = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategories as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const { data } = useQuery({
        queryKey: ['getProductsNewArrivals'], // указываем название
        queryFn: async () => {

            const response = await axios.get<IProduct[]>(`${process.env.REACT_APP_BACKEND_URL}/api/getProductsArrivals?limit=4`); // делаем запрос на сервер для получения товаров для секции sectionNewArrivals,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных),вынесли основной url до бэкэнда в переменную REACT_APP_BACKEND_URL(REACT_APP_ обязательная приставка для переменных в .env файле для react js,иначе не находит эти переменные,и после изменения этих переменных в файле .env,нужно заново запустить сайт,то есть закрыть терминал(консоль) с текущим открытым сайтом(если это на localhost запускается,то есть на локальном компьютере),и заново в новом терминале запустить его командой npm start) в файле .env,чтобы было более удобно ее указывать и было более безопасно,так как обычно git не отслеживает этот файл и не будет его пушить в репозиторий,также после этого url указываем конкретный путь до нашего роутера на бэкэнде(/api в данном случае),а потом уже конкретный url до эндпоинта

            console.log(response.data);

            return response; // возвращаем объект ответа от сервера,в нем будет этот массив объектов товаров в поле data у data,которую мы берем из этого useQuery,а также другие поля в ответе от сервера

        }
    })

    // указываем такой же queryKey как и в ProductItemPage для получения всех комментариев для секции sectionNewArrivals,чтобы при изменении комментариев у товара на странице ProductItemPage переобновлять массив комментариев в секции sectionNewArrivals
    const { data:dataComments,refetch:refetchComments } = useQuery({
        queryKey: ['commentsForProduct'], // указываем название
        queryFn: async () => {

            const response = await axios.get<ICommentResponse>(`${process.env.REACT_APP_BACKEND_URL}/api/getCommentsForProduct`); // делаем запрос на сервер для получения всех комментариев для секции sectionNewArrivals,указываем в типе в generic наш тип на основе интерфейса ICommentResponse,указываем(то есть указываем тип данных,которые придут от сервера),вынесли основной url до бэкэнда в переменную REACT_APP_BACKEND_URL(REACT_APP_ обязательная приставка для переменных в .env файле для react js,иначе не находит эти переменные,и после изменения этих переменных в файле .env,нужно заново запустить сайт,то есть закрыть терминал(консоль) с текущим открытым сайтом(если это на localhost запускается,то есть на локальном компьютере),и заново в новом терминале запустить его командой npm start) в файле .env,чтобы было более удобно ее указывать и было более безопасно,так как обычно git не отслеживает этот файл и не будет его пушить в репозиторий,также после этого url указываем конкретный путь до нашего роутера на бэкэнде(/api в данном случае),а потом уже конкретный url до эндпоинта

            console.log(response.data);

            return response.data; // возвращаем конкретный уже объект ответа от сервера(response.data),в нем будет объект массивов объектов комментариев(allComments,allCommentsForProduct и commentsForPagination),который мы берем из этого useQuery

        }
    })

    // указываем в этой функции запроса на сервер для получения массива товаров корзины такой же queryKey как и на странице Cart.tsx,чтобы эти данные кешировались и можно было переобновить их на этой странице,чтобы они переобновились сразу же и для страницы Cart.tsx,но здесь уже не указываем параметры для этого запроса и дополнительную логику для пагинации товаров корзины,так как здесь не нужна пагинация,а основной запрос на получение товаров корзины работает также без пагинации,сделали так на бэкэнде
    const { data: dataProductsCart, refetch: refetchProductsCart, isFetching } = useQuery({
        queryKey: ['getAllProductsCart'], // указываем название
        queryFn: async () => {

            // если user.id true,то есть id у user есть,то делаем запрос на сервер,делаем эту проверку,чтобы шел запрос на сервер на получение массива объектов товаров корзины только когда user.id true(то есть пользователь авторизован),в другом случае возвращаем null,делаем так,чтобы не выдавало ошибку на сервере,что user.id undefined,а возвращаем null,чтобы не выдавало ошибку,что query data(данные из функции запроса на сервер с помощью useQuery) не может быть undefined
            if (user.id) {

                const response = await axios.get<IProductsCartResponse>(`${process.env.REACT_APP_BACKEND_URL}/api/getAllProductsCart?userId=${user.id}`,); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductsCartResponse),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя,вынесли основной url до бэкэнда в переменную окружения REACT_APP_BACKEND_URL в файле .env

                console.log(response.data);

                return response.data; // возвращаем конкретный уже объект ответа от сервера(response.data),в нем будет объект массивов объектов товаров корзины(allProductsCartForUser и productsCartForPagination),который мы берем из этого useQuery


            } else {

                return null;

            }


        }
    })


    return (
        <section id="sectionCategories" className={onScreen.sectionCategoriesIntersecting ? "sectionCategories sectionCategories__active sectionNewArrivals" : "sectionCategories sectionNewArrivals"} ref={sectionCategories}>
            <div className="container">
                <div className="sectionNewArrivals__inner">
                    <div className="sectionCategories__topBlock">
                        <div className="sectionCategories__topBlock-leftBorderBlock"></div>
                        <h1 className="sectionCategories__topBlock-title">New Arrivals</h1>
                    </div>
                    <div className="sectionNewArrivals__items">

                        {/* проходимся по массиву товаров,который пришел от сервера и выводим карточки товаров */}
                        {data?.data.map((product)=>
                            <ProductItemArrivals key={product.id} product={product} comments={dataComments?.allComments} dataProductsCart={dataProductsCart} refetchProductsCart={refetchProductsCart}/>
                        )}
                        
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionNewArrivals;