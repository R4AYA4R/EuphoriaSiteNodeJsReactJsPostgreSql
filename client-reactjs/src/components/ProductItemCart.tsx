import { ChangeEvent, useEffect, useState } from "react";
import { IComment, IProductCart, IProductsCartResponse } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface IProductItemCart {
    productCart: IProductCart,
    comments: IComment[] | undefined,
    refetchProductsCart: () => Promise<QueryObserverResult<IProductsCartResponse | null, Error>> // указываем этому полю,что это стрелочная функция и возвращает Promise<QueryObserverResult<IProductsCartResponse | null, Error>> (этот тип скопировали из файла Cart.tsx у этой функции refetchProductsCart),то есть указываем,что эта функция возвращает Promise,внутри которого тип QueryObserverResult,внутри которого наш тип IProductsCartResponse или null(так как наша функция запроса на сервер может вернуть null,мы это указали) и тип Error, если бы мы в функции запроса на получение комментариев возвращали бы response,а не response.data,то тип у этой функции запроса на сервер был бы Promise<QueryObserverResult<AxiosResponse<IProductsCartResponse | null, any>, Error>>,но в данном случае возвращаем response.data,поэтому тип Promise<QueryObserverResult<IProductsCartResponse | null, Error>> 
}

const ProductItemCart = ({ productCart, comments, refetchProductsCart }: IProductItemCart) => {

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу 

    const [inputAmountValue, setInputAmountValue] = useState(productCart.amount); // делаем дефолтное значение у inputAmountValue как productCart.amount,чтобы сразу показывалось число товаров,которое пользователь выбрал на странице товара

    const [valueDiscount, setValueDiscount] = useState<number>(0);  // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    const [commentsForProduct, setCommentsForProduct] = useState<IComment[] | undefined>([]);  // состояние для всех комментариев для отдельного товара,указываем ему тип в generic как IComment[] | undefined,указываем или undefined,так как выдает ошибку,когда изменяем это состояние на отфильтрованный массив комментариев по имени товара,что comments может быть undefined

    const [subtotalPriceProduct, setSubtotalPriceProduct] = useState(0);

    const { updateProductsCart } = useTypedSelector(state => state.cartSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setUpdateProductsCart } = useActions();  // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    // описываем запрос на сервер для обновления товара корзины,берем isPending,чтобы отслеживать,загружается ли сейчас этот запрос на сервер для изменения данных товара корзины
    const { mutate: mutateUpdateProductCart, isPending } = useMutation({
        mutationKey: ['updateProductCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем put запрос на сервер для обновления данных на сервере,указываем тип данных,которые нужно добавить(обновить) на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип,в объекте тела запроса передаем объект productCart(будем его передавать в эту фукнцию запроса на сервер для обновления данных товара(mutateUpdateProductCart()))
            await axios.put<IProductCart>(`${process.env.REACT_APP_BACKEND_URL}/api/updateProductCart`, productCart);

        },

        // при успешной мутации обновляем весь массив товаров корзины с помощью функции refetchProductsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess() {

            refetchProductsCart();

        }

    })

    // описываем запрос на сервер для удаления товара корзины
    const { mutate: mutateDeleteProductCart } = useMutation({
        mutationKey: ['deleteProductCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем запрос на сервер для удаление товара корзины,и указываем тип данных,которые вернет сервер(то есть в данном случае будем от сервера возвращать удаленный объект товара в базе данных,то есть в данном случае тип IProductCart,в данном случае не возвращается удаленный объект товара от сервера,а возвращается количество удаленных товаров,при удалении одного товара возвращается цифра 1(если удаление было успешно) или -1(если было не успешно),поэтому указываем тип возвращаемых данных как number),но здесь не обязательно указывать тип,указываем productCart.id в url,чтобы передать id товара корзины,который надо удалить
            await axios.delete<number>(`${process.env.REACT_APP_BACKEND_URL}/api/deleteProductCart/${productCart.id}`);

        },

        // при успешной мутации обновляем весь массив товаров корзины с помощью функции refetchProductsCart,которую мы передали как пропс (параметр) этого компонента
        onSuccess() {

            refetchProductsCart();

        }

    })

    // функция для изменения значения инпута количества товара,указываем параметру e(event) тип как ChangeEvent<HTMLInputElement>
    const changeInputAmountValue = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение инпута > 99,то изменяем состояние инпута цены на 99,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число
        if (+e.target.value > 99) {

            setInputAmountValue(99);

        } else if (+e.target.value <= 0) {

            // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
            setInputAmountValue(0);

        } else {

            setInputAmountValue(+(+e.target.value).toFixed(0)); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число,потом указываем toFixed(0),чтобы убрать цифры после запятой у числа,так как в этот инпут могут ввести число с запятой,а таким образом,когда будут вводить число после запятой,то автоматически будет преобразовываться это число без запятой,а также перед этим всем еще раз ставим +,чтобы перевести строковое значение в числовое,иначе выдает ошибку,что нельзя назначить строку(toFixed() возвращает строку) для состояния с числовыми значениями

        }

    }

    const handlerMinusAmountBtn = () => {

        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля или 1 не отнимало - 1
        if (inputAmountValue > 1) {

            setInputAmountValue((prev) => prev - 1);

        } else {

            setInputAmountValue(1);

        }

    }

    const handlerPlusAmountBtn = () => {

        // если значение инпута количества товара меньше 99 и больше или равно 0,то изменяем это значение на + 1,в другом случае указываем ему значение 99,чтобы больше 99 не увеличивалось
        if (inputAmountValue < 99 && inputAmountValue >= 0) {

            setInputAmountValue((prev) => prev + 1);

        } else {

            setInputAmountValue(99);

        }

    }

    // при рендеринге(запуске) этого компонента и при изменении comments(массива всех комментариев) будет отработан код в этом useEffect,обязательно указываем comments в массиве зависимостей этого useEffect,иначе комментарии могут не успеть загрузиться и в состоянии commentsForProduct будет пустой массив комментариев 
    useEffect(() => {

        setCommentsForProduct(comments?.filter(comment => comment.productId === productCart.usualProductId)); // изменяем состояние commentsForProduct на отфильтрованный массив всех комментариев comments(пропс(параметр) этого компонента) по id товара обычного(productCart.usualProductId),то есть оставляем в массиве все объекты комментариев,у которых поле productId равно productCart.usualProductId(объект товара корзины,который передали пропсом(параметром) в этот компонент,у которого есть usualProductId,то есть id обычного товара,так как связывали комментарии с id обычного объекта товара)

    }, [comments])

    // при рендеринге этого компонента и при изменении productCart(объекта товара корзины) будет отработан код в этом useEffect
    useEffect(() => {

        // если productCart.priceDiscount true,то есть в поле priceDiscount у productCart есть какое-то значение,и оно не false или null и тд,то есть есть скидка у товара,то тогда ее и считаем
        if (productCart.priceDiscount) {

            setValueDiscount(((productCart.price - productCart.priceDiscount) / productCart.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(productCart.priceDiscount) от изначальной цены(productCart.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

        }


    }, [productCart])

    useEffect(() => {

        // если productCart.priceDiscount true,то есть есть цена со скидкой у товара,то изменяем subtotalPriceProduct на inputAmountValue умноженное на productCart.priceDiscount(цену со скидкой),в другом случае изменяем subtotalPriceProduct на inputAmountValue умноженное на productCart.price(обычную цену товара)
        if (productCart.priceDiscount) {

            setSubtotalPriceProduct(inputAmountValue * productCart.priceDiscount); // умножаем inputAmountValue(выбранное количество товаров) на productCart.priceDiscount(цену товара со скидкой)


        } else {

            setSubtotalPriceProduct(inputAmountValue * productCart.price); // умножаем inputAmountValue(выбранное количество товаров) на productCart.price(цену товара)


        }

        setUpdateProductsCart(false); // обязательно изменяем поле updateProductsCart у состояния слайса(редьюсера) cartSlice на false при изменении inputAmountValue,чтобы срабатывала нормально проверка на updateProductsCart true,при изменении этого состояния updateProductsCart,иначе,если без изменения количества товара просто тыкать на кнопку обновления товаров корзины,то updateProductsCart будет изменено на true,но запрос не будет идти на обновление количества товара корзины,так как текущее значение инпута количества товара будет такое же,как уже есть у этого товара в базе данных,и потом,когда все-таки пользователь изменит инпут количества товара,то запрос на обновление количества товара корзины тоже не будет идти,так как уже не будет правильно срабатывать эта проверка на updateProductsCart true,поэтому при каждом изменении inputAmountValue изменяем updateProductsCart на false,чтобы можно было нажимать на кнопку обновления товаров корзины и шел запрос на обновление товара корзины и уже будет не важно,нажимал ли до этого пользователь эту кнопку,так как ему придется изменить значение инпута количества товара и соответсвенно состояние updateProductsCart изменится на false и это все будет работать правильно

    }, [inputAmountValue])

    // при рендеринге(запуске) этого компонента и при изменении поля updateProductsCart у состояния слайса(редьюсера) cartSlice делаем запрос на сервер на обновление данных о товаре в корзине
    useEffect(() => {

        // если updateProductsCart true(то есть пользователь нажал на кнопку обновить товары корзины) и productCart.amount не равно inputAmountValue(то есть количество товара в корзине(которое мы получили из запроса на сервер на получения всех товаров корзины в компоненте Cart.tsx) не равно значению состояния inputAmountValue,то есть пользователь изменил количество товара в корзине),то обновляем данные товара,делаем эту проверку,чтобы не циклился запрос на переобновление массива товаров корзины ,который мы делаем при обновлении данных товара,если эту проверку не сделать,то будут циклиться запросы на сервер и не будет нормально работать сайт, и чтобы если пользователь нажал на кнопку обновить товары в корзине,но не изменил inputAmountValue(количество товара) на новое значение,то не делать запрос на обновление товара корзины,чтобы не шли запросы на сервер просто так,а также указываем проверку на !isPending(isPending false),то есть сейчас запрос на обновление товара корзины не грузится,если не сделать эту проверку,то можно будет кучу раз нажимать на кнопку обновления товаров корзины и будет идти куча запросов на обновление товаров корзины,пока еще первый не загрузился,также делаем проверку на inputAmountValue не равно 0,чтобы оно не обновлялось,если указали в инпуте количества товара 0
        if (updateProductsCart && productCart.amount !== inputAmountValue && !isPending && inputAmountValue !== 0) {

            mutateUpdateProductCart({ ...productCart, amount: inputAmountValue, totalPrice: subtotalPriceProduct });  // делаем запрос на обновление данных товара корзины,разворачиваем весь объект productCart,то есть вместо productCart будут подставлены все поля из объекта productCart,но для полей amount и totalPrice указываем значения состояний количества товара (inputAmountValue) и цены товара(subtotalPriceProduct) на этой странице

            setUpdateProductsCart(false); // изменяем поле updateProductsCart у состояния слайса(редьюсера) cartSlice на false,чтобы указать,что данные товара обновились и потом можно было опять нажимать на кнопку обновления всех товаров корзины

        }

    }, [updateProductsCart])

    return (
        <>
            <div className="sectionCart__productsBlock-product">
                <div className="sectionCart__product-detailsBlock">

                    {/* если productCart.priceDiscount true,то есть поле priceDiscount у productCart есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
                    {productCart.priceDiscount ?
                        <>
                            <div className="sectionNewArrivals__item-saleBlock sectionCart__product-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                            {/* если valueDiscount больше 30,то есть скидка товара больше 30 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                            {valueDiscount > 30 &&
                                <div className="sectionNewArrivals__item-saleBlockHot sectionCart__product-saleBlockHot">HOT</div>
                            }

                        </>
                        : ''
                    }

                    {/* указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта product(пропс(параметр) этого компонента),в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем переменную(REACT_APP_BACKEND_URL в данном случае,REACT_APP_ обязательная приставка для переменных в .env файле для react js,иначе не находит эти переменные,и после изменения этих переменных в файле .env,нужно заново запустить сайт,то есть закрыть терминал(консоль) с текущим открытым сайтом(если это на localhost запускается,то есть на локальном компьютере),и заново в новом терминале запустить его командой npm start)) в файле .env для нашего url до бэкэнда и значение поля mainImage у product(объекта товара),указываем в router url,куда перекинуть пользователя,в данном случае перекидываем его на страницу ProductItemPage,и в этом url указываем productCart.usualProductId(то есть id обычного товара,чтобы перейти на страницу об этом обычном товаре) */}
                    <img src={`${process.env.REACT_APP_BACKEND_URL}/${productCart.mainImage}`} alt="" className="sectionCart__product-img" onClick={() => router(`/catalog/${productCart.usualProductId}`)} />
                    <div className="sectionCart__product-detailsBlockInfo">

                        {/* если productCart.name.length > 29,то есть длина названия по количеству символов больше 29(это значение посчитали в зависимости от дизайна,сколько символов в названии нормально влазит в максимальную ширину и высоту текста названия),то показываем такой блок текста названия товара,с помощью substring() вырезаем из строки названия товара опеределенное количество символов(передаем первым параметром в substring с какого символа по индексу начинать вырезать,вторым параметром передаем до какого символа по индексу вырезать,в данном случае подобрали значение до 29 символа по индексу вырезать,так как еще нужно место на троеточие),и в конце добавляем троеточие,чтобы красиво смотрелось,в другом случае показываем обычное название товара(product.name) */}
                        {productCart.name.length > 29 ?

                            <h1 className="sectionCart__product-name" onClick={() => router(`/catalog/${productCart.usualProductId}`)}>{(productCart.name).substring(0, 29)}...</h1>
                            :
                            <h1 className="sectionCart__product-name" onClick={() => router(`/catalog/${productCart.usualProductId}`)}>{productCart.name}</h1>

                        }

                        <div className="sectionNewArrivals__item-starsBlock">
                            <div className="sectionNewArrivals__item-stars">

                                {/* если product.rating равно 0,то показываем пустую звезду,в другом случае если product.rating больше или равно 0.5 и меньше или равно 0.9,то показываем половину звезды,в другом случае показываем целую звезду */}
                                <img src={productCart.rating === 0 ? "/images/sectionNewArrivals/Vector (2).png" : productCart.rating >= 0.5 && productCart.rating < 1 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={productCart.rating >= 2 ? "/images/sectionNewArrivals/Vector (1).png" : productCart.rating >= 1.5 && productCart.rating < 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={productCart.rating >= 3 ? "/images/sectionNewArrivals/Vector (1).png" : productCart.rating >= 2.5 && productCart.rating < 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={productCart.rating >= 4 ? "/images/sectionNewArrivals/Vector (1).png" : productCart.rating >= 3.5 && productCart.rating < 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src={productCart.rating >= 5 ? "/images/sectionNewArrivals/Vector (1).png" : productCart.rating >= 4.5 && productCart.rating < 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                            </div>
                            <p className="sectionNewArrivals__item-starsAmount">({commentsForProduct?.length})</p>
                        </div>


                        <p className="sectionCart__product-size">Size: {productCart.size}</p>
                    </div>
                </div>

                {/* если product.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае другой */}
                {productCart.priceDiscount ?

                    <div className="sectionNewArrivals__item-priceBlock sectionCart__product-priceBlock">
                        {/* указываем цену товара с помощью toFixed(2),чтобы было 2 цифры после запятой,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически,но в данном случае для цены товара это просто чтобы красивее смотрелось с двумя нулями или просто с двумя цифрами после запятой  */}
                        <p className="item__priceBlock-priceSale sectionCart__product-priceSale">${(productCart.priceDiscount).toFixed(2)}</p>
                        <p className="item__priceBlock-priceUsual sectionCart__product-price">${(productCart.price).toFixed(2)}</p>
                    </div>
                    :
                    <div className="sectionNewArrivals__item-priceBlock sectionCart__product-priceBlock">
                        <p className="item__priceBlock-priceUsualDefault sectionCart__product-price">${(productCart.price).toFixed(2)}</p>
                    </div>

                }

                <div className="sectionProductItemPage__cartBlock-inputBlock">
                    <button className="cartBlock__inputBlock-btn cartBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtn}>
                        <img src="/images/sectionProductItemPage/Minus.png" alt="" className="cartBlock__inputBlock-btnImg" />
                    </button>
                    <input type="number" className="cartBlock__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                    <button className="cartBlock__inputBlock-btn cartBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtn}>
                        <img src="/images/sectionProductItemPage/Plus.png" alt="" className="cartBlock__inputBlock-btnImg" />
                    </button>
                </div>
                {/* указываем цену с помощью toFixed(2),чтобы было 2 цифры после запятой,иначе,при изменении количества товара,может быть число с большим количеством цифр после запятой,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически  */}
                <p className="sectionCart__product-price">${subtotalPriceProduct.toFixed(2)}</p>

                {/* в onClick этой кнопке указываем нашу функцию для удаления товара из корзины и передаем туда productCart(объект товара корзины)(то есть в данном случае удаляем его из базы данных у сущности(модели) корзины) */}
                <button className="sectionCart__product-deleteBtn" onClick={() => mutateDeleteProductCart(productCart)}>
                    <img src="/images/sectionCart/deletecon.png" alt="" className="sectionCart__product-deleteBtnImg" />
                </button>
            </div>

            <div className="sectionCart__productsBlock-product sectionCart__productsBlock-mobileProduct">
                <div className="sectionCart__mobileProduct-topBlock">
                    <div className="sectionCart__product-detailsBlock">

                        {/* если productCart.priceDiscount true,то есть поле priceDiscount у productCart есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
                        {productCart.priceDiscount ?
                            <>
                                <div className="sectionNewArrivals__item-saleBlock sectionCart__product-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                                {/* если valueDiscount больше 30,то есть скидка товара больше 30 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                                {valueDiscount > 30 &&
                                    <div className="sectionNewArrivals__item-saleBlockHot sectionCart__product-saleBlockHot">HOT</div>
                                }

                            </>
                            : ''
                        }

                        {/* указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта product(пропс(параметр) этого компонента),в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем переменную(REACT_APP_BACKEND_URL в данном случае,REACT_APP_ обязательная приставка для переменных в .env файле для react js,иначе не находит эти переменные,и после изменения этих переменных в файле .env,нужно заново запустить сайт,то есть закрыть терминал(консоль) с текущим открытым сайтом(если это на localhost запускается,то есть на локальном компьютере),и заново в новом терминале запустить его командой npm start)) в файле .env для нашего url до бэкэнда и значение поля mainImage у product(объекта товара),указываем в router url,куда перекинуть пользователя,в данном случае перекидываем его на страницу ProductItemPage,и в этом url указываем productCart.usualProductId(то есть id обычного товара,чтобы перейти на страницу об этом обычном товаре) */}
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${productCart.mainImage}`} alt="" className="sectionCart__product-img" onClick={() => router(`/catalog/${productCart.usualProductId}`)} />
                        <div className="sectionCart__product-detailsBlockInfo">

                            {/* если productCart.name.length > 29,то есть длина названия по количеству символов больше 29(это значение посчитали в зависимости от дизайна,сколько символов в названии нормально влазит в максимальную ширину и высоту текста названия),то показываем такой блок текста названия товара,с помощью substring() вырезаем из строки названия товара опеределенное количество символов(передаем первым параметром в substring с какого символа по индексу начинать вырезать,вторым параметром передаем до какого символа по индексу вырезать,в данном случае подобрали значение до 29 символа по индексу вырезать,так как еще нужно место на троеточие),и в конце добавляем троеточие,чтобы красиво смотрелось,в другом случае показываем обычное название товара(product.name) */}
                            {productCart.name.length > 29 ?

                                <h1 className="sectionCart__product-name" onClick={() => router(`/catalog/${productCart.usualProductId}`)}>{(productCart.name).substring(0, 29)}...</h1>
                                :
                                <h1 className="sectionCart__product-name" onClick={() => router(`/catalog/${productCart.usualProductId}`)}>{productCart.name}</h1>

                            }

                            <div className="sectionNewArrivals__item-starsBlock">
                                <div className="sectionNewArrivals__item-stars">

                                    {/* если product.rating равно 0,то показываем пустую звезду,в другом случае если product.rating больше или равно 0.5 и меньше или равно 0.9,то показываем половину звезды,в другом случае показываем целую звезду */}
                                    <img src={productCart.rating === 0 ? "/images/sectionNewArrivals/Vector (2).png" : productCart.rating >= 0.5 && productCart.rating < 1 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={productCart.rating >= 2 ? "/images/sectionNewArrivals/Vector (1).png" : productCart.rating >= 1.5 && productCart.rating < 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={productCart.rating >= 3 ? "/images/sectionNewArrivals/Vector (1).png" : productCart.rating >= 2.5 && productCart.rating < 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={productCart.rating >= 4 ? "/images/sectionNewArrivals/Vector (1).png" : productCart.rating >= 3.5 && productCart.rating < 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={productCart.rating >= 5 ? "/images/sectionNewArrivals/Vector (1).png" : productCart.rating >= 4.5 && productCart.rating < 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                </div>
                                <p className="sectionNewArrivals__item-starsAmount">({commentsForProduct?.length})</p>
                            </div>


                            <p className="sectionCart__product-size">Size: {productCart.size}</p>
                        </div>
                    </div>

                    {/* в onClick этой кнопке указываем нашу функцию для удаления товара из корзины и передаем туда productCart(объект товара корзины)(то есть в данном случае удаляем его из базы данных у сущности(модели) корзины) */}
                    <button className="sectionCart__product-deleteBtn" onClick={() => mutateDeleteProductCart(productCart)}>
                        <img src="/images/sectionCart/deletecon.png" alt="" className="sectionCart__product-deleteBtnImg" />
                    </button>

                </div>

                <div className="sectionCart__mobileProduct-bottomBlock">
                    {/* если product.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае другой */}
                    {productCart.priceDiscount ?

                        <div className="sectionCart__mobileProduct-priceBlockItem">
                            <p className="sectionCart__table-name">Price</p>
                            <div className="sectionNewArrivals__item-priceBlock sectionCart__product-priceBlock">
                                {/* указываем цену товара с помощью toFixed(2),чтобы было 2 цифры после запятой,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически,но в данном случае для цены товара это просто чтобы красивее смотрелось с двумя нулями или просто с двумя цифрами после запятой  */}
                                <p className="item__priceBlock-priceSale sectionCart__product-priceSale">${(productCart.priceDiscount).toFixed(2)}</p>
                                <p className="item__priceBlock-priceUsual sectionCart__product-price">${(productCart.price).toFixed(2)}</p>
                            </div>
                        </div>
                        :
                        <div className="sectionCart__mobileProduct-priceBlockItem">
                            <p className="sectionCart__table-name">Price</p>
                            <div className="sectionNewArrivals__item-priceBlock sectionCart__product-priceBlock">
                                <p className="item__priceBlock-priceUsualDefault sectionCart__product-price">${(productCart.price).toFixed(2)}</p>
                            </div>
                        </div>

                    }

                    <div className="sectionCart__mobileProduct-priceBlockItem">
                        <p className="sectionCart__table-name">Quantity</p>
                        <div className="sectionProductItemPage__cartBlock-inputBlock">
                            <button className="cartBlock__inputBlock-btn cartBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtn}>
                                <img src="/images/sectionProductItemPage/Minus.png" alt="" className="cartBlock__inputBlock-btnImg" />
                            </button>
                            <input type="number" className="cartBlock__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                            <button className="cartBlock__inputBlock-btn cartBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtn}>
                                <img src="/images/sectionProductItemPage/Plus.png" alt="" className="cartBlock__inputBlock-btnImg" />
                            </button>
                        </div>
                    </div>

                    <div className="sectionCart__mobileProduct-priceBlockItem">
                        <p className="sectionCart__table-name">Subtotal</p>
                        {/* указываем цену с помощью toFixed(2),чтобы было 2 цифры после запятой,иначе,при изменении количества товара,может быть число с большим количеством цифр после запятой,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически  */}
                        <p className="sectionCart__product-price">${subtotalPriceProduct.toFixed(2)}</p>
                    </div>

                </div>


            </div>

        </>
    )

}

export default ProductItemCart;