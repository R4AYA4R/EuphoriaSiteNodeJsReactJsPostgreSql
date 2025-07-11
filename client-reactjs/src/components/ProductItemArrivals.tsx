import { useEffect, useState } from "react";
import { IComment, IProduct, IProductCart, IProductsCartResponse } from "../types/types";
import { useNavigate } from "react-router-dom";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import { useTypedSelector } from "../hooks/useTypedSelector";
import axios from "axios";

// создаем интерфейс(тип) для пропсов компонента ProductItemArrivals,указываем в нем поле product с типом нашего интерфейса IProduct и тд
interface IProductItemArrivals {
    product: IProduct,
    comments: IComment[] | undefined, // указываем этому полю для комментариев тип IComment и что это массив,или тип undefined(указываем это или undefined,так как поле comments может быть undefined(также выдает ошибку об этом))

    dataProductsCart: IProductsCartResponse | null | undefined, // указываем это поле для ответа от сервера на получение товаров корзины,указываем ему тип как наш IProductsCartResponse или null(так как наша функция запроса на сервер может вернуть null,мы это указали) | undefined(указываем или undefined,иначе выдает ошибку,что нельзя назначить тип просто IProductsCartResponse,так как это поле может быть еще undefined)

    refetchProductsCart: () => Promise<QueryObserverResult<IProductsCartResponse | null, Error>> // указываем поле для функции переобновления данных товаров корзины,указываем,что это стрелочная функция и она возвращает тип Promise,в котором QueryObserverResult,в котором IProductsCartResponse или null(так как наша функция запроса на сервер может вернуть null,мы это указали) и тип Error(что может прийти еще и ошибка),скопировали этот весь тип в файле sectionNewArrivals у этой функции refetchProductsCart у react query(tanstack query),этот полный тип подсветил vs code
}

// указываем объекту пропсов(параметров,которые будем передавать этому компоненту) наш тип IProductItemArrivals
const ProductItemArrivals = ({ product, comments, dataProductsCart, refetchProductsCart }: IProductItemArrivals) => {

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const [commentsForProduct, setCommentsForProduct] = useState<IComment[] | undefined>([]);  // состояние для всех комментариев для отдельного товара,указываем ему тип в generic как IComment[] | undefined,указываем или undefined,так как выдает ошибку,когда изменяем это состояние на отфильтрованный массив комментариев по имени товара,что comments может быть undefined

    const [isExistsCart, setIsExistsCart] = useState(false);

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу 

    const [valueDiscount, setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    const { mutate: mutateAddProductCart } = useMutation({
        mutationKey: ['create productCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем запрос на сервер и добавляем данные на сервер(указываем это вторым параметров в функции post у axios),указываем тип данных,которые нужно добавить на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип,вынесли основной url до бэкэнда в переменную REACT_APP_BACKEND_URL
            await axios.post<IProductCart>(`${process.env.REACT_APP_BACKEND_URL}/api/addProductToCart`, productCart);

        },

        // при успешной мутации,то есть в данном случае при успешном добавлении товара в корзину обновляем dataProductsCart(массив объектов товаров корзины),чтобы сразу показывалось изменение в корзине товаров,если так не сделать,то текст Already in Cart(что товар уже в корзине) будет показан только после обновления страницы,а не сразу,так как массив объектов товаров корзины еще не переобновился
        onSuccess() {

            refetchProductsCart(); // переобновляем массив товаров корзины

        }

    })

    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(() => {

        // если product.priceDiscount true,то есть в поле priceDiscount у product есть какое-то значение,и оно не false или null и тд,то есть есть скидка у товара,то тогда ее и считаем
        if (product.priceDiscount) {

            setValueDiscount(((product.price - product.priceDiscount) / product.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

        }


    }, [product])

    // при рендеринге(запуске) этого компонента и при изменении comments(массива всех комментариев) будет отработан код в этом useEffect,обязательно указываем comments в массиве зависимостей этого useEffect,иначе комментарии могут не успеть загрузиться и в состоянии commentsForProduct будет пустой массив комментариев 
    useEffect(() => {

        setCommentsForProduct(comments?.filter(comment => comment.productId === product.id)); // изменяем состояние commentsForProduct на отфильтрованный массив всех комментариев comments(пропс(параметр) этого компонента) по id товара(product.id),то есть оставляем в массиве все объекты комментариев,у которых поле productId равно product.id(объект товара,который передали пропсом(параметром) в этот компонент)

    }, [comments])

    const addProductToCart = () => {

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то помещаем товар в корзину,в другом случае перекидываем пользователя на страницу авторизации
        if (user.userName) {

            // не используем в данном случае это,так как просто указываем сейчас поля вручную в объекте в функции mutateAddProductCart
            // если product true,то есть product есть,делаем эту проверку,иначе выдает ошибку при деструктуризации полей из объекта product,что нету таких полей в типе IProduct |(или) undefined, то есть типа product может быть undefined
            // if(product){

            //     const { id:missedId, ...restProductObj } = product; // деструктуризируем поле id и указываем ему название как missedId, и также деструктуризируем остальные поля у объекта product в новый объект под названием restProductObj,то есть таким образом из объекта product убрали поле id,и можем использовать новый объект restProductObj без этого поля id,но со всеми остальными полями объекта product,это один из способов,как убрать поле из объекта(можно было еще просто отфильтровать объект product функцией filter(key => key !== 'id'),то есть оставили бы все поля,которые не равны значению id,то есть убрали бы это поле из этого объекта,а новый отфильтрованный объект добавили бы в новую переменную), делали так,чтобы потом в функцию mutateAddProductCart передать объект,в который бы развернули этот объект restProductObj,чтобы отдельно не указывать каждое поле вручную

            //     // console.log(missedId);

            //     // console.log(restProductObj);

            //     // mutateAddProductCart({ ...restProductObj,usualProductId:product.id,userId:user.id } as IProductCart);

            // }

            // если product true,то есть product есть(делаем эту проверку,так как выдает ошибку,что product может быть undefined)
            if (product) {

                let totalPriceProduct;

                // если product.priceDiscount true,то есть у товара есть цена со скидкой
                if (product?.priceDiscount) {

                    totalPriceProduct = product.priceDiscount * product.amount; // изменяем значение totalPriceProduct на product.amount(по дефолту оно 1), умноженное на product.priceDiscount(цену товара со скидкой)

                } else {
                    // в другом случае,если у товара нет скидки,то изменяем значение totalPriceProduct на product.amount(по дефолту оно 1), умноженное на product.price(обычную цену товара)
                    totalPriceProduct = product?.price * product.amount;
                }

                mutateAddProductCart({ usualProductId: product?.id, amount: product.amount, categoryId: product?.categoryId, name: product?.name, descImages: product?.descImages, descText: product?.descText, mainImage: product?.mainImage, price: product?.price, priceDiscount: product?.priceDiscount, rating: product?.rating, size: product.sizes[0], totalPrice: totalPriceProduct, typeId: product?.typeId, userId: user.id } as IProductCart); // передаем в mutateAddProductCart объект типа IProductCart только таким образом,разворачивая в объект все необходимые поля(то есть наш product(объект товара в данном случае),в котором полe name,делаем поле name со значением,как и у этого товара name(product.name) и остальные поля также,кроме поля totalPrice,size,их мы изменяем и указываем totalPrice со значением totalPriceProduct(эту переменную мы посчитали выше в коде),также поле size указываем как product.sizes[0] (то есть первый элемент массива размеров у товара),указываем тип этого объекта как созданный нами тип as IProductCart(в данном случае делаем так,потому что показывает ошибку,что totalPriceProduct может быть undefined и что не хватает поля id,но мы его специально не указываем,чтобы он автоматически генерировался в базе данных),при создании на сервере не указываем конкретное значение id,чтобы он сам автоматически генерировался на сервере и потом можно было удалить этот объект, добавляем поле userId со значением user.id(то есть со значением id пользователя,чтобы потом показывать товары в корзине для каждого конкретного пользователя,у которого id будет равен полю userId у этого товара),указываем usualProductId со значением product?.id,чтобы потом в корзине можно было перейти на страницу товара в магазине по этому usualProductId,а сам id корзины товара не указываем,чтобы он автоматически правильно генерировался,так как делаем показ товаров по-разному для конкретных пользователей(то есть как и должно быть),иначе ошибка

            }


        } else {

            router('/userPage');  // перекидываем пользователя на страницу авторизации (/userPage в данном случае)

        }

    }

    // указываем у этого useEffect в массиве зависимостей dataProductsCart?.allProductsCartForUser(то есть массив товаров корзины,отфильтрованных для конкретного пользователя) и product(объект товара),указываем это,чтобы правильно работала проверка на есть ли этот товар в корзине,и также чтобы эта проверка срабатывала каждый раз,когда будет меняться этот массив dataProductsCart?.allProductsCartForUser(то есть когда туда будем добавлять новые объекты товаров) и product(сам объект товара)
    useEffect(() => {

        const existsCart = dataProductsCart?.allProductsCartForUser.some(productCart => productCart.name === product?.name); // делаем проверку методом some и результат записываем в переменную isExistsCart,если в dataProductsCart?.allProductsCartForUser(в массиве объектов товаров корзины для определенного авторизованного пользователя) есть элемент(объект) name которого равен product name(то есть name этого товара на этой странице),в итоге в isExistsCart будет помещено true или false в зависимости от проверки методом some

        // если existsCart true,то есть этот товар уже есть в корзине
        if (existsCart) {

            setIsExistsCart(true); // изменяем состояние isExistsCart на true,чтобы показать текст,что товар уже в корзине

        }

    }, [dataProductsCart?.allProductsCartForUser, product])

    return (
        <div className="sectionNewArrivals__item">

            {/* если product.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
            {product.priceDiscount ?
                <>
                    <div className="sectionNewArrivals__item-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                    {/* если valueDiscount больше 30,то есть скидка товара больше 30 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                    {valueDiscount > 30 &&
                        <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>
                    }

                </>
                : ''
            }

            {/* указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта product(пропс(параметр) этого компонента),потом когда сделаем раздачу статики на бэкэнде,то будем указывать путь до папки на бэкэнде, в onClick указываем наш router() (то есть хук useNavigate) и в нем указываем url,куда перекинуть пользователя,в данном случае перекидываем его на страницу ProductItemPage,то есть на страницу товара,в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем переменную(REACT_APP_BACKEND_URL в данном случае,REACT_APP_ обязательная приставка для переменных в .env файле для react js,иначе не находит эти переменные,и после изменения этих переменных в файле .env,нужно заново запустить сайт,то есть закрыть терминал(консоль) с текущим открытым сайтом(если это на localhost запускается,то есть на локальном компьютере),и заново в новом терминале запустить его командой npm start)) в файле .env для нашего url до бэкэнда и значение поля mainImage у product(объекта товара) */}
            <img src={`${process.env.REACT_APP_BACKEND_URL}/${product.mainImage}`} alt="" className="sectionNewArrivals__item-img" onClick={() => router(`/catalog/${product.id}`)} />

            {/* если product.name.length > 29,то есть длина названия по количеству символов больше 29(это значение посчитали в зависимости от дизайна,сколько символов в названии нормально влазит в максимальную ширину и высоту текста названия),то показываем такой блок текста названия товара,с помощью substring() вырезаем из строки названия товара опеределенное количество символов(передаем первым параметром в substring с какого символа по индексу начинать вырезать,вторым параметром передаем до какого символа по индексу вырезать,в данном случае подобрали значение до 29 символа по индексу вырезать,так как еще нужно место на троеточие),и в конце добавляем троеточие,чтобы красиво смотрелось,в другом случае показываем обычное название товара(product.name) */}
            {product.name.length > 29 ?

                <h2 className="sectionNewArrivals__item-title" onClick={() => router(`/catalog/${product.id}`)}>{(product.name).substring(0, 29)}...</h2>
                :
                <h2 className="sectionNewArrivals__item-title" onClick={() => router(`/catalog/${product.id}`)}>{product.name}</h2>

            }


            <div className="sectionNewArrivals__item-starsBlock">
                <div className="sectionNewArrivals__item-stars">
                    {/* будем здесь делать проверку типа если рейтинг больше 0.5,то картинка половины здезы,если больше 1,то целая звезда,в другом случае пустая звезда */}

                    {/* если product.rating равно 0,то показываем пустую звезду,в другом случае если product.rating больше или равно 0.5 и меньше или равно 0.9,то показываем половину звезды,в другом случае показываем целую звезду */}
                    <img src={product.rating === 0 ? "/images/sectionNewArrivals/Vector (2).png" : product.rating >= 0.5 && product.rating < 1 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                    <img src={product.rating >= 2 ? "/images/sectionNewArrivals/Vector (1).png" : product.rating >= 1.5 && product.rating < 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                    <img src={product.rating >= 3 ? "/images/sectionNewArrivals/Vector (1).png" : product.rating >= 2.5 && product.rating < 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                    <img src={product.rating >= 4 ? "/images/sectionNewArrivals/Vector (1).png" : product.rating >= 3.5 && product.rating < 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                    <img src={product.rating >= 5 ? "/images/sectionNewArrivals/Vector (1).png" : product.rating >= 4.5 && product.rating < 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                </div>
                <p className="sectionNewArrivals__item-starsAmount">({commentsForProduct?.length})</p>
            </div>

            {/* если product.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае другой */}
            {product.priceDiscount ?

                <div className="sectionNewArrivals__item-priceBlock">
                    <p className="item__priceBlock-priceSale">${product.priceDiscount}</p>
                    <p className="item__priceBlock-priceUsual">${product.price}</p>
                </div>
                :
                <div className="sectionNewArrivals__item-priceBlock">
                    <p className="item__priceBlock-priceUsualDefault">${product.price}</p>
                </div>

            }

            <div className="sectionNewArrivals__item-cartBlock">

                {/* если isExistsCart true(то есть этот товарна этой странице уже находится в корзине) и если user.userName true(то есть пользователь авторизован,если не сделать эту проверку на авторизован ли пользователь,то после выхода из аккаунта и возвращении на страницу корзины товары будут показываться до тех пор,пока не обновится страница,поэтому делаем эту проверку),то показываем текст */}
                {user.userName && isExistsCart ?

                    <h3 className="textAlreadyInCart sectionNewArrivals__item-textAlreadyInCart">Already In Cart</h3> :

                    <button className="sectionNewArrivals__cartBlock-btn" onClick={addProductToCart}>
                        <p className="cartBlock__btn-text">Add to Cart</p>
                        <img src="/images/sectionNewArrivals/shopping cart.png" alt="" className="cartBlock__btn-img" />
                    </button>

                }


            </div>
        </div>
    )
}

export default ProductItemArrivals;