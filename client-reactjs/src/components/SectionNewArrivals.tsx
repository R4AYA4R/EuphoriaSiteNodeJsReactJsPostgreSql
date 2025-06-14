import { RefObject, useRef } from "react";
import { useIsOnScreen } from "../hooks/useIsOnScreen";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct } from "../types/types";
import ProductItemArrivals from "./ProductItemArrivals";

const SectionNewArrivals = () => {

    const sectionCategories = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCategories as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const { data } = useQuery({
        queryKey: ['getProductsNewArrivals'], // указываем название
        queryFn: async () => {

            const response = await axios.get<IProduct[]>(`${process.env.REACT_APP_BACKEND_URL}/api/getProductsArrivals?limit=4`); // делаем запрос на сервер для получения товаров для секции sectionNewArrivals,указываем в типе в generic наш тип на основе интерфейса IProduct,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных),вынесли основной url до бэкэнда в переменную REACT_APP_BACKEND_URL(REACT_APP_ обязательная приставка для переменных в .env файле для react js,иначе не находит эти переменные,и после изменения этих переменных в файле .env,нужно заново запустить сайт,то есть закрыть терминал(консоль) с текущим открытым сайтом(если это на localhost запускается,то есть на локальном компьютере),и заново в новом терминале запустить его командой npm start) в файле .env,чтобы было более удобно ее указывать и было более безопасно,так как обычно git не отслеживает этот файл и не будет его пушить в репозиторий,также после этого url указываем конкретный путь до нашего роутера на бэкэнде(/api в данном случае),а потом уже конкретный url до эндпоинта

            console.log(response.data);

            return response; // возвращаем объект ответа от сервера,в нем будет этот массив объектов товаров в поле data у data,которую мы берем из этого useQuery,а также другие поля в ответе от сервера

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
                            <ProductItemArrivals key={product.id} product={product}/>
                        )}
                        
                    </div>
                </div>
            </div>
        </section>
    )

}

export default SectionNewArrivals;