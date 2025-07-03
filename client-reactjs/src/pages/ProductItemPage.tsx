import { ChangeEvent, FormEvent, RefObject, useEffect, useRef, useState } from "react";
import SectionUnderTopProductPage from "../components/SectionUnderTopProductPage";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IComment, ICommentResponse, IProduct } from "../types/types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductItemPageItemBlock from "../components/ProductItemPageItemBlock";
import ProductItemPageReviewItem from "../components/ProductItemPageReviewItem";
import SectionNewArrivals from "../components/SectionNewArrivals";
import { useTypedSelector } from "../hooks/useTypedSelector";
import SectionUnderTop from "../components/SectionUnderTop";
import { getPagesArray } from "../utils/getPagesArray";



const ProductItemPage = () => {

    const [limit, setLimit] = useState(3); // указываем лимит для максимального количества объектов,которые будут на одной странице(для пагинации)

    const [page, setPage] = useState(1); // указываем состояние текущей страницы

    const [totalPages, setTotalPages] = useState(0); // указываем состояние totalPages в данном случае для общего количества страниц


    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    // функция для post запроса на сервер с помощью useMutation(react query(сейчас уже tanstack query)),создаем комментарий на сервере,берем mutate у useMutation,чтобы потом вызвать эту функцию запроса на сервер в нужный момент
    const { mutate } = useMutation({
        mutationKey: ['create comment'],
        mutationFn: async (comment: IComment) => {

            // делаем запрос на сервер и добавляем данные на сервер(указываем это вторым параметров в функции post у axios),указываем тип данных,которые нужно добавить на сервер(в данном случае IComment),но здесь не обязательно указывать тип,вынесли основной url до бэкэнда в переменную REACT_APP_BACKEND_URL
            await axios.post<IComment>(`${process.env.REACT_APP_BACKEND_URL}/api/createComment`, comment);

        },

        // при успешной мутации переобновляем массив комментариев
        onSuccess() {

            setPage(1);

            refetchComments();  // указываем здесь отдельно повторный запрос на получение массива комментариев,так как если текущая страница пагинации и так 1,то повторный запрос автоматически идти не будет,который указали в useEffect,так как будет идти повторный запрос на сервер только после изменения page(состояние текущей страницы пагинации),а по дефолту page и так равен 1,поэтому page по факту изменен не будет и повторный запрос не сделается

        }

    })

    // описываем запрос на сервер для обновления рейтинга товара
    const { mutate: mutateProductRating } = useMutation({
        mutationKey: ['updateProductRating'],
        mutationFn: async (product: IProduct) => {

            // делаем put запрос на сервер для обновления данных на сервере,указываем тип данных,которые нужно добавить(обновить) на сервер(в данном случае IProduct),но здесь не обязательно указывать тип,в объекте тела запроса передаем параметр productId со значением product.id(id объекта товара,который мы передадим в эту функцию запроса на сервер для обновления данных товара(mutateProductRating())),а также поле rating со значением product.rating(поле rating у объекта product,который мы передадим в эту функцию запроса на сервер для обновления данных товара(mutateProductRating()))
            await axios.put<IProduct>(`${process.env.REACT_APP_BACKEND_URL}/api/updateProductRating`, { productId: product.id, rating: product.rating });

        },

        // при успешной мутации(изменения) рейтинга,переобновляем данные товара,данные массива товаров в секции sectionNewArrivals и данные массива комментариев для sectionNewArrivals
        onSuccess() {

            refetch();

            // здесь еще надо будет переобновлять данные о товаре в sectionNewArrivals и массив комментариев для sectionNewArrivals

        }

    })

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { pathname } = useLocation(); // берем pathname(url страницы) из useLocation()

    const [tab, setTab] = useState('Desc');

    const [activeForm, setActiveForm] = useState(false);

    const [activeStarsForm, setActiveStarsForm] = useState(0);

    const [errorForm, setErrorForm] = useState('');

    const [textAreaValue, setTextAreaValue] = useState('');

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const { data, refetch, isFetching: isFetchingProductById } = useQuery({
        queryKey: [`getProductById${params.id}`], // делаем отдельный queryKey для каждого товара с помощью params.id,чтобы правильно отображалась пагинация комментариев при переходе на разные страницы товаров(чтобы для каждого товара был свой уникальный queryKey(название(id) для данных в react query))
        queryFn: async () => {

            const response = await axios.get<IProduct>(`${process.env.REACT_APP_BACKEND_URL}/api/getProductsCatalog/${params.id}`); // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IProduct для объекта товара)

            console.log(response.data);

            return response; // возвращаем этот объект ответа от сервера,в котором есть всякие поля типа status,data(конкретно то,что мы возвращаем от сервера,в данном случае это будет объект товара) и тд

        }
    })

    // не указываем такой же queryKey как и в sectionNewArrivals для получения комментариев,чтобы при изменении комментариев у товара переобновлять массив комментариев отдельно для этой страницы productItemPage
    const { data: dataComments, refetch: refetchComments, isFetching, isLoading } = useQuery({
        queryKey: [`commentsForProductItemPage${params.id}`], // делаем отдельный queryKey для комментариев для каждого товара с помощью params.id,чтобы правильно отображалась пагинация комментариев при переходе на разные страницы товаров и правильно работало отслеживание заргузки запроса на сервер
        queryFn: async () => {

            const response = await axios.get<ICommentResponse>(`${process.env.REACT_APP_BACKEND_URL}/api/getCommentsForProduct?productId=${params.id}`, {
                params: {

                    page: page, // указываем параметр page(параметр текущей страницы,для пагинации)

                    limit: limit // указываем параметр limit для максимального количества объектов,которые будут на одной странице(для пагинации),можно было указать эти параметры limit и page просто через знак вопроса в url,но можно и тут в отдельном объекте params,также можно было не указывать limit:limit,а просто указать один раз limit(для page также),так как название ключа(поля объекта) и состояния limit(в данном случае) одинаковые,но указали уже так


                }
            }); // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productId со значением id товара(data?.data.id) на этой странице,но в данном случае указываем productId со значением params.id(id из url этой страницы,там тоже находится id этого товара),делаем это для того,чтобы при первоначальном запросе на сервер на получение комментариев для товара не было ошибки,что productId undefined,так как на тот момент data.data.id еще может быть undefined(то есть запрос на получение данных товара еще не загрузился), когда указываем params.id,то ошибки при первоначальном запросе нету,так как этот params.id доступен уже сразу при загрузке страницы,в данном случае не обязательно указывать параметр productId в объекте в params у этой функции запроса,так как и просто через знак вопроса в url тоже нормально работает 

            // если dataComments?.commentsForPagination.count true,то есть в dataComments?.commentsForPagination.count есть какое-то значение,то изменяем общее количество страниц,делаем эту проверку, потому что dataComments?.commentsForPagination.count может быть undefined(выдает ошибку такую)
            if (dataComments?.commentsForPagination.count) {

                setTotalPages(Math.ceil(dataComments?.commentsForPagination.count / limit));  // изменяем состояние totalPages на значение деления dataComments?.commentsForPagination.count на limit,используем Math.ceil() - она округляет получившееся значение в большую сторону к целому числу(например,5.3 округлит к 6),чтобы правильно посчитать общее количество страниц

            }

            console.log(response.data);

            console.log(totalPages);

            console.log(response);

            return response.data; // возвращаем конкретный уже объект ответа от сервера(response.data),в нем будет объект массивов объектов комментариев(allComments,allCommentsForProduct и commentsForPagination),который мы берем из этого useQuery

        }
    })

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>, isLoading); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen,вторым параметром передаем в наш хук переменную isLoading,в данном случае она для отслеживания первоначальной загрузки комментариев,внутри хука отслеживаем этот параметр isLoading,и,если он равен false(или другое пустое значение),то только тогда начинаем следить за html элементом,чтобы показать анимацию,иначе,если не отслеживать эту загрузку,то intersectionObserver будет выдавать ошибку,что такого html элемента на странице не найдено,так как в это время будет показан только лоадер,для отслеживания загрузки комментариев,в данном случае

    // при изменении pathname(url страницы),делаем запрос на обновление данных о товаре(иначе не меняются данные) и изменяем таб на Desc(описание товара),если вдруг был включен другой таб,то при изменении url страницы будет включен опять дефолтный таб,также изменяем значение количества товара,если было выбрано уже какое-то,чтобы поставить первоначальное, и убираем форму добавления комментария,если она была открыта,и изменяем значение состоянию activeStarsForm на 0,то есть убираем звезды в форме для коментария,если они были выбраны,также убираем ошибку формы,если она была
    useEffect(() => {

        refetch();

        setActiveStarsForm(0);

        setActiveForm(false);

        setErrorForm('');

        setTab('Desc');

        setTextAreaValue('');

        setPage(1);

        refetchComments();  // также переобновляем массив комментариев

    }, [pathname])

    useEffect(() => {

        refetch();

    }, [data?.data])

    // при запуске(рендеринге) этого компонента(при загрузке этой страницы),а также при изменении массива комментариев для этого товара,будем обновлять рейтинг товара, обязательно указываем повторный запрос на обновление массива комментариев(refetchComments() в данном случае) при изменении dataComments?.allCommentsForProduct(массив объектов комментариев для этого товара),иначе,при загрузке страницы пагинация не показывается 
    useEffect(() => {

        const commentsRating = dataComments?.allCommentsForProduct.reduce((prev, curr) => prev + curr.rating, 0) // проходимся по массиву объектов комментариев для товара на этой странице и на каждой итерации увеличиваем переменную prev(это число,и мы указали,что в начале оно равно 0 и оно будет увеличиваться на каждой итерации массива объектов,запоминая старое состояние числа и увеличивая его на новое значение) на curr(текущий итерируемый объект).rating ,это чтобы посчитать общую сумму всего рейтинга от каждого комментария и потом вывести среднее значение

        // если commentsRating true(эта переменная есть и равна чему-то) и dataComments?.allCommentsForProduct.length true(этот массив отфильтрованных комментариев для товара на этой странице есть), и isFetching false(то есть сейчас не грузится запрос на сервер на получение массива комментариев для этого товара,то есть он уже загрузился,вроде без этой проверки на isFetching тоже работает,но чтобы избежать ошибок типа что к тому моменту массив товаров еще не загрузился и тд,то лучше ее указать),то считаем средний рейтинг всех комментариев и записываем его в переменную,а потом делаем запрос на сервер для обновления рейтинга у объекта товара в базе данных
        if(commentsRating && dataComments?.allCommentsForProduct.length && !isFetching){

            const commentsRatingMiddle = commentsRating / dataComments?.allCommentsForProduct.length; // считаем средний рейтинг всех комментариев,делим commentsRating(общая сумма рейтинга от каждого комментария) на dataComments?.allCommentsForProduct.length(длину массива комментариев для этого товара)

            mutateProductRating({...data?.data, rating:commentsRatingMiddle} as IProduct); // делаем запрос на изменение рейтинга у товара,разворачиваем все поля товара текущей страницы(data?.data) и поле rating изменяем на commentsRatingMiddle,указываем тип этому объекту как тип на основе нашего интерфейса IProduct(в данном случае делаем это,так как выдает ошибку,что id и другие поля могут быть undefined)

            // здесь еще надо будет обновлять рейтинг товара корзины

        }
        

        refetchComments();

    }, [dataComments?.allCommentsForProduct])

    // функция для формы для создания комментария,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)   
    const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();  // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если значение textarea (.trim()-убирает из строки пробелы,чтобы нельзя было ввести только пробел) в форме комментария будет по количеству символов меньше или равно 10 или больше 300,то будем изменять состояние errorForm(то есть показывать ошибку и не отправлять комментарий),в другом случае очищаем поля textarea,activeStars(рейтинг,который пользователь указал в форме) и убираем форму
        if (textAreaValue.trim().length <= 10 || textAreaValue.trim().length > 300) {

            setErrorForm('Review must be 10 - 300 characters');

        } else if (activeStarsForm === 0) {

            // если состояние рейтинга в форме равно 0,то есть пользователь не указал рейтинг,то показываем ошибку
            setErrorForm('Enter rating');

        } else {

            const date = new Date(); // создаем объект на основе класса Date(класс в javaScript для работы с датой и временем)

            let monthDate = (date.getMonth() + 1).toString(); // помещаем в переменную номера текущего месяца,указываем ей let,чтобы можно было изменять ей значение потом, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString()

            let dayDate = (date.getDate()).toString(); // помещаем в переменную текущее число месяца,указываем ей let,чтобы можно было изменять ей значение потом, date.getDate() - показывает текущее число календаря и потом приводим получившееся значение к формату строки с помощью toString(),чтобы проверить на количество символов 

            // если monthDate.length < 2(то есть monthDate по количеству символов меньше 2,то есть текущий месяц состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед месяцами меньше 10
            if (monthDate.length < 2) {

                monthDate = '0' + monthDate; // изменяем значение monthDate на 0 + текущее значение monthDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

            } else {
                // в другом случае,если условие выше не сработало,то изменяем monthDate на monthDate,то есть оставляем этой переменной такое же значение как и изначальное
                monthDate = monthDate;

            }

            // если dayDate.length < 2(то есть dayDate по количеству символов меньше 2,то есть текущее число месяца состоит из одного символа,то есть меньше 10,например,9 и тд),делаем эту проверку,чтобы добавить 0 перед месяцами меньше 10
            if (dayDate.length < 2) {

                dayDate = '0' + dayDate; // изменяем значение dayDate на 0 + текущее значение dayDate,то есть добавляем ноль перед числом месяца,чтобы число месяца меньше 10,записывалось с 0 перед ним,типа 04 и тд

            } else {
                // в другом случае,если условие выше не сработало,то изменяем dayDate на dayDate,то есть оставляем этой переменной такое же значение как и изначальное
                dayDate = dayDate;

            }

            // помещаем в переменную showTime значение времени,когда создаем комментарий, date.getDate() - показывает текущее число календаря, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString(), getFullYear() - показывает текущий год,потом эту переменную showTime будем сохранять в объект для создания комментария на сервере и потом показывать дату создания комментария уже на клиенте(в данном случае на этой странице у комментария),вынесли подсчет месяца в переменную monthDate и тут ее указываем,также и подсчет текущего числа месяца в переменную dayDate и тут ее указываем
            const showTime = dayDate + '.' + monthDate + '.' + date.getFullYear();

            mutate({ name: user.userName, text: textAreaValue, rating: activeStarsForm, createdTime: showTime, productId: data?.data.id, adminReply: { text: 'adminReply asdfasdf2', createdTime: 'time2' } } as IComment); // вызываем функцию post запроса на сервер,создавая комментарий,разворачивая в объект нужные поля для комментария и давая этому объекту тип as IComment,чтобы не выдавало ошибку,что для productId нельзя назначить undefined значение,а также чтобы не указывало ошибку,что не указали поле id(вручную не указываем id,чтобы он автоматически создавался на сервере), указываем поле productId со значением как у id товара на этой странице(data?.data.id),чтобы в базе данных связать этот товар с комментарием

            setActiveForm(false); // убираем форму,изменяя состояние activeForm на false

            setActiveStarsForm(0); // убираем звезды формы(ставим их на дефолтное значение,изменяя состояние activeStarsForm на 0),которые мог пользователь ввести

            setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь мог ввести

            setErrorForm(''); // убираем ошибку формы,если она была

        }

    }

    const cancelFormHandler = () => {

        setActiveForm(false); // убираем форму,изменяя состояние activeForm на false

        setTextAreaValue(''); // очищаем значение в textarea(изменяя состояние textAreaValue на пустую строку),которое пользователь мог ввести

        setActiveStarsForm(0); // убираем выбранные пользователем звезды

        setErrorForm(''); // убираем ошибку формы,если она была

    }

    // указываем,что эта функция ничего не возвращает(то есть указываем ей тип возвращаемых данных как void),в данном случае это не обязательно делать,так как это и так понятно,но так как используем typescript и чтобы лучше попрактиковаться и больше его использовать,указываем это,также vs code автоматически подхватывает тип возвращаемых данных,если функция ничего не возвращает и в данном случае указывать это не обязательно
    const addReviewsBtn = (): void => {

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то показываем форму,в другом случае перекидываем пользователя на страницу авторизации 
        if (user.userName) {

            setActiveForm(true); // изменяем состояние активной формы,то есть показываем форму для создания комментария 

        } else {

            router('/userPage'); // перекидываем пользователя на страницу авторизации (/userPage в данном случае)

        }

    }

    // при обновлении страницы переобновляем(делаем повторный запрос на сервер) массив комментариев
    useEffect(() => {

        refetchComments();

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

    // если isLoading true,то есть идет первоначальная загрузка комментариев товара,то показывать лоадер,иначе,если это не отслеживать и не показывать,то комментарии,и число комментариев будет появляться через время
    if (isLoading) {

        return (
            // возвращаем тег main с классом main,так как указали этому классу стили,чтобы был прижат header и footer
            <main className="main">
                <div className="container">
                    <div className="innerForLoader">
                        <div className="loader"></div>
                    </div>
                </div>
            </main>
        )

    }

    return (
        <main className="main">
            <SectionUnderTopProductPage productName={data?.data.name} />
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionProductItemPage sectionCatalog__active " : "sectionCatalog sectionProductItemPage"} ref={sectionCatalog}>

                {/* вынесли блок с информацией о товаре и слайдером в наш компонент ProductItemPageItemBlock,так как там много кода,передаем туда как пропс(параметр) product со значением data?.data(объект товара),также передаем поле pathname(url страницы),чтобы потом при его изменении изменять значение количества товара,так как оно находится в этом компоненте ProductItemPageItemBlock,указываем именно таким образом pathname={pathname},иначе выдает ошибку типов,передаем функцию refetch для переобновления данных товара(повторный запрос на сервер для переобновления данных товара) и указываем ему название как refetchProduct(просто название этого пропса(параметра)) */}
                <ProductItemPageItemBlock product={data?.data} pathname={pathname} comments={dataComments?.allCommentsForProduct}/>

                {/* указываем здесь контейнер,так как для блока ProductItemPageItemBlock нужен контейнер в отдельной его части по такому дизайну */}
                <div className="container">

                    <div className="sectionProductItemPage__descBlock">
                        <div className="sectionCategories__topBlock sectionProductItemPage__descBlock-topBlock">
                            <div className="sectionCategories__topBlock-leftBorderBlock"></div>
                            <h1 className="sectionCategories__topBlock-title">Product Description</h1>
                        </div>

                        <div className="sectionProductItemPage__descBlock-tabs">
                            <button className={tab === 'Desc' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Desc')}>Description</button>
                            <button className={tab === 'Reviews' ? "descBlock__tabs-btn descBlock__tabs-btnReviews descBlock__tabs-btn--active" : "descBlock__tabs-btn descBlock__tabs-btnReviews"} onClick={() => setTab('Reviews')}>
                                <p className="tabs__btnReviews-text">Reviews</p>
                                <p className="tabs__btnReviews-text">({dataComments?.commentsForPagination.count})</p>
                            </button>
                        </div>

                        <div className="sectionProductItemPage__descBlock-desc">

                            {tab === 'Desc' &&
                                <div className="descBlock__desc-inner">
                                    <div className="descBlock__desc-leftBlock">
                                        <p className="descBlock__desc-text">{data?.data.descText}</p>
                                        <p className="descBlock__desc-text">Our collection of clothes will make you the trendsetter with an iconic resemblance of choice in Styled Wear. It is quite evident to say that there are very few Styled Clothing online stores where you can buy Western Wear comprising the premium material and elegant design that you are always seeking for.</p>
                                    </div>
                                    <div className="descBlock__desc-rightBlock">
                                        <table className="descBlock__desc-table">
                                            <tbody className="desc__table-body">
                                                <tr className="desc__table-row">
                                                    <td className="desc__table-column">
                                                        <h2 className="desc__table-headText">Fabric</h2>
                                                        <p className="desc__table-text">Bio-washed Cotton</p>
                                                    </td>
                                                    <td className="desc__table-column">
                                                        <h2 className="desc__table-headText">Pattern</h2>
                                                        <p className="desc__table-text">Printed</p>
                                                    </td>
                                                    <td className="desc__table-column">
                                                        <h2 className="desc__table-headText">Fit</h2>
                                                        <p className="desc__table-text">Regular-fit</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }

                            {tab === 'Reviews' &&
                                <div className="descBlock__desc-innerReviews">
                                    <div className="reviews__leftBlock">


                                        {!isFetching && dataComments?.commentsForPagination.count ?
                                            <>
                                                <div className="reviews__leftBlock-comments">

                                                    {dataComments.commentsForPagination.rows.map(comment =>

                                                        <ProductItemPageReviewItem key={comment.id} comment={comment} user={user} refetchComments={refetchComments} />

                                                    )}

                                                </div>

                                                {/* если dataComments.commentsForPagination.count больше 3,то есть количество всех объектов комментариев для этого товара больше 3,то показывать пагинацию,в другом случае пустая строка,то есть не показывать,то есть если всего комментариев 3 и меньше,то вообще пагинация не нужна в данном случае */}
                                                {dataComments.commentsForPagination.count > 3 ?

                                                    <div className="productsBlock__pagination sectionProductItemPage__paginationComments">

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

                                            </> : isFetching ?
                                                <div className="innerForLoader">
                                                    <div className="loader"></div>
                                                </div>
                                                : <h4 className="reviews__leftBlock-text">No reviews yet.</h4>
                                        }



                                    </div>
                                    <div className="reviews__rightBlock">

                                        <div className={activeForm ? "reviews__rightBlock-btnBlock reviews__rightBlock-btnBlock--disabled" : "reviews__rightBlock-btnBlock"}>
                                            <button className="reviews__btnBlock-btn" onClick={addReviewsBtn}>Add Review</button>
                                        </div>

                                        <form className={activeForm ? "reviews__form reviews__form--active" : "reviews__form"} onSubmit={submitFormHandler}>
                                            <div className="reviews__form-topBlock">
                                                <div className="reviews__form-topBlockInfo">
                                                    <img src="/images/sectionProductItemPage/Profile.png" alt="" className="form__topBlockInfo-img" />
                                                    <p className="form__topBlockInfo-name">{user.userName}</p>
                                                </div>
                                                <div className="sectionNewArrivals__item-stars reviews__form-stars">
                                                    {/* указываем этой кнопке тип button(то есть обычная кнопка),так как это кнопка находится в форме и чтобы при нажатии на нее форма не отправлялась(то есть не срабатывало событие onSubmit у формы), по клику на эту кнопку изменяем состояние activeStarsForm на 1,то есть на 1 звезду */}
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(1)}>
                                                        {/* если activeStarsForm равно 0,то показываем серую картинку звездочки,в другом случае оранжевую */}
                                                        <img src={activeStarsForm === 0 ? "/images/sectionNewArrivals/Vector (2).png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(2)}>
                                                        <img src={activeStarsForm >= 2 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(3)}>
                                                        <img src={activeStarsForm >= 3 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(4)}>
                                                        <img src={activeStarsForm >= 4 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                    <button className="form__topBlockInfo-btnStar" type="button" onClick={() => setActiveStarsForm(5)}>
                                                        <img src={activeStarsForm >= 5 ? "/images/sectionNewArrivals/Vector (1).png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="reviews__form-mainBlock">
                                                <textarea className="form__mainBlock-textArea" placeholder="Enter your comment" value={textAreaValue} onChange={(e) => setTextAreaValue(e.target.value)}></textarea>

                                                {/* если errorForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                                {errorForm !== '' && <p className="formErrorText">{errorForm}</p>}


                                                <div className="form__mainBlock-bottomBlock">
                                                    {/* указываем этой кнопке тип submit,чтобы при нажатии на нее сработало событие onSubmit у этой формы */}
                                                    <button className="reviews__btnBlock-btn" type="submit">Save Review</button>

                                                    <button className="reviews__form-cancelBtn" type="button" onClick={cancelFormHandler}>Cancel</button>
                                                </div>

                                            </div>
                                        </form>

                                    </div>
                                </div>
                            }

                        </div>

                    </div>

                </div>

            </section>

            <SectionNewArrivals />

        </main>
    )
}

export default ProductItemPage;