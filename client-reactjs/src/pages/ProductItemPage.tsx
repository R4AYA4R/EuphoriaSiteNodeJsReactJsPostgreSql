import { RefObject, useEffect, useRef, useState } from "react";
import SectionUnderTopProductPage from "../components/SectionUnderTopProductPage";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IProduct } from "../types/types";
import { useLocation, useParams } from "react-router-dom";
import ProductItemPageItemBlock from "../components/ProductItemPageItemBlock";



const ProductItemPage = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { pathname } = useLocation(); // берем pathname(url страницы) из useLocation()

    const [tab, setTab] = useState('Desc');


    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const { data, refetch, isFetching: isFetchingProductById } = useQuery({
        queryKey: [`getProductById${params.id}`], // делаем отдельный queryKey для каждого товара с помощью params.id,чтобы правильно отображалась пагинация комментариев при переходе на разные страницы товаров(чтобы для каждого товара был свой уникальный queryKey(название(id) для данных в react query))
        queryFn: async () => {

            const response = await axios.get<IProduct>(`${process.env.REACT_APP_BACKEND_URL}/api/getProductsCatalog/${params.id}`); // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IProduct для объекта товара)

            console.log(response.data);

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет объект товара) и тд

        }
    })

    // при изменении pathname(url страницы),делаем запрос на обновление данных о товаре(иначе не меняются данные) и изменяем таб на Desc(описание товара),если вдруг был включен другой таб,то при изменении url страницы будет включен опять дефолтный таб,также изменяем значение количества товара,если было выбрано уже какое-то,чтобы поставить первоначальное, и убираем форму добавления комментария,если она была открыта,и изменяем значение состоянию activeStarsForm на 0,то есть убираем звезды в форме для коментария,если они были выбраны
    useEffect(() => {

        refetch();

    }, [pathname])

    useEffect(() => {

        refetch();

    }, [data?.data])


    return (
        <main className="main">
            <SectionUnderTopProductPage productName="Product Name" />
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active sectionProductItemPage" : "sectionCatalog sectionProductItemPage"} ref={sectionCatalog}>

                {/* вынесли блок с информацией о товаре и слайдером в наш компонент ProductItemPageItemBlock,так как там много кода,передаем туда как пропс(параметр) product со значением data?.data(объект товара),также передаем поле pathname(url страницы),чтобы потом при его изменении изменять значение количества товара,так как оно находится в этом компоненте ProductItemPageItemBlock,указываем именно таким образом pathname={pathname},иначе выдает ошибку типов,передаем функцию refetch для переобновления данных товара(повторный запрос на сервер для переобновления данных товара) и указываем ему название как refetchProduct(просто название этого пропса(параметра)) */}
                <ProductItemPageItemBlock product={data?.data} pathname={pathname} />

                {/* указываем здесь контейнер,так как для блока ProductItemPageItemBlock нужен контейнер в отдельной его части по такому дизайну */}
                <div className="container">

                    <div className="sectionProductItemPage__descBlock">
                        <div className="sectionCategories__topBlock sectionProductItemPage__descBlock-topBlock">
                            <div className="sectionCategories__topBlock-leftBorderBlock"></div>
                            <h1 className="sectionCategories__topBlock-title">Product Description</h1>
                        </div>

                        <div className="sectionProductItemPage__descBlock-tabs">
                            <button className={tab === 'Desc' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={()=>setTab('Desc')}>Description</button>
                            <button className={tab === 'Reviews' ? "descBlock__tabs-btn descBlock__tabs-btnReviews descBlock__tabs-btn--active" : "descBlock__tabs-btn descBlock__tabs-btnReviews"} onClick={()=>setTab('Reviews')}>
                                <p className="tabs__btnReviews-text">Reviews</p>
                                <p className="tabs__btnReviews-text">(0)</p>
                            </button>
                        </div>

                        <div className="sectionProductItemPage__descBlock-desc">

                            {tab === 'Desc' &&
                                <div className="descBlock__desc-inner">
                                    <p className="descBlock__desc-text">{data?.data.descText}</p>
                                    <p className="descBlock__desc-text">Our collection of clothes will make you the trendsetter with an iconic resemblance of choice in Styled Wear. It is quite evident to say that there are very few Styled Clothing online stores where you can buy Western Wear comprising the premium material and elegant design that you are always seeking for.</p>
                                    <table className="descBlock__desc-table">
                                        <tbody className="desc__table-body">
                                            <tr className="desc__table-row">
                                                <td className="desc__table-column">
                                                    <th className="desc__table-headText">Fabric</th>
                                                    <p className="desc__table-text">Bio-washed Cotton</p>
                                                </td>
                                                <td className="desc__table-column">
                                                    <th className="desc__table-headText">Pattern</th>
                                                    <p className="desc__table-text">Printed</p>
                                                </td>
                                                <td className="desc__table-column">
                                                    <th className="desc__table-headText">Fit</th>
                                                    <p className="desc__table-text">Regular-fit</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            }

                            {tab === 'Reviews' &&
                                <div className="descBlock__desc-innerReviews">
                                    Reviews
                                </div>
                            }

                        </div>

                    </div>

                </div>

            </section>
        </main>
    )
}

export default ProductItemPage;