import { ChangeEvent, useEffect, useState } from "react";
import { IComment, IProductCart } from "../types/types";
import { useNavigate } from "react-router-dom";

interface IProductItemCart {
    productCart: IProductCart,
    comments: IComment[] | undefined
}

const ProductItemCart = ({ productCart, comments }: IProductItemCart) => {

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу 

    const [inputAmountValue, setInputAmountValue] = useState(1);

    const [valueDiscount, setValueDiscount] = useState<number>(0);  // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    const [commentsForProduct, setCommentsForProduct] = useState<IComment[] | undefined>([]);  // состояние для всех комментариев для отдельного товара,указываем ему тип в generic как IComment[] | undefined,указываем или undefined,так как выдает ошибку,когда изменяем это состояние на отфильтрованный массив комментариев по имени товара,что comments может быть undefined

    const [subtotalPriceProduct,setSubtotalPriceProduct] = useState(0);


    // функция для изменения значения инпута количества товара,указываем параметру e(event) тип как ChangeEvent<HTMLInputElement>
    const changeInputAmountValue = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение инпута > 99,то изменяем состояние инпута цены на 99,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число
        if (+e.target.value > 99) {

            setInputAmountValue(99);

        } else if (+e.target.value <= 0) {

            // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
            setInputAmountValue(0);

        } else {

            setInputAmountValue(+e.target.value); // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

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

    useEffect(()=>{

        setSubtotalPriceProduct(inputAmountValue * productCart.totalPrice); // изменяем subtotalPriceProduct на inputAmountValue умноженное на productCart.totalPrice(цена товара уже со скидкой(если она есть) или обычная цена,помещали это значение в это поле еще при добавлении товара в корзину)

    },[inputAmountValue])

    return (
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

                    {/* <h1 className="sectionCart__product-name">{productCart.name}</h1> */}

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
            <button className="sectionCart__product-deleteBtn">
                <img src="/images/sectionCart/deletecon.png" alt="" className="sectionCart__product-deleteBtnImg" />
            </button>
        </div>
    )

}

export default ProductItemCart;