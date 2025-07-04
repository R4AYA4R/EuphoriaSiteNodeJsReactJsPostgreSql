
import { useEffect, useState } from "react";
import { IComment, IProduct } from "../types/types";
import { useNavigate } from "react-router-dom";

// создаем интерфейс(тип) для пропсов компонента IProductItemCatalog,указываем в нем поле product с типом нашего интерфейса IProduct и тд
interface IProductItemCatalog {
    product: IProduct,
    comments: IComment[] | undefined, // указываем этому полю для комментариев тип IComment и что это массив,или тип undefined(указываем это или undefined,так как поле comments может быть undefined(также выдает ошибку об этом))
}

// указываем объекту пропсов(параметров,которые будем передавать этому компоненту) наш тип IProductItemArrivals
const ProductItemCatalog = ({ product, comments }: IProductItemCatalog) => {

    const [commentsForProduct,setCommentsForProduct] = useState<IComment[] | undefined>([]);  // состояние для всех комментариев для отдельного товара,указываем ему тип в generic как IComment[] | undefined,указываем или undefined,так как выдает ошибку,когда изменяем это состояние на отфильтрованный массив комментариев по имени товара,что comments может быть undefined

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу 

    const [valueDiscount, setValueDiscount] = useState<number>(0); // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(() => {

        // если product.priceDiscount true,то есть в поле priceDiscount у product есть какое-то значение,и оно не false или null и тд,то есть есть скидка у товара,то тогда ее и считаем
        if (product.priceDiscount) {

            setValueDiscount(((product.price - product.priceDiscount) / product.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

        }


    }, [product])

    // при рендеринге(запуске) этого компонента и при изменении comments(массива всех комментариев) будет отработан код в этом useEffect,обязательно указываем comments в массиве зависимостей этого useEffect,иначе комментарии могут не успеть загрузиться и в состоянии commentsForProduct будет пустой массив комментариев 
    useEffect(()=>{

        setCommentsForProduct(comments?.filter(comment => comment.productId === product.id)); // изменяем состояние commentsForProduct на отфильтрованный массив всех комментариев comments(пропс(параметр) этого компонента) по id товара(product.id),то есть оставляем в массиве все объекты комментариев,у которых поле productId равно product.id(объект товара,который передали пропсом(параметром) в этот компонент)

    },[comments])

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

                <h2 className="sectionNewArrivals__item-title" onClick={() => router(`/catalog/${product.id}`)}>{(product.name).substring(0,29)}...</h2>
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

                {/* потом будем проверять есть ли этот товар уже в корзине */}
                {/* <h3 className="textAlreadyInCart">In Cart</h3> */}

                <button className="sectionNewArrivals__cartBlock-btn">
                    <p className="cartBlock__btn-text">Add to Cart</p>
                    <img src="/images/sectionNewArrivals/shopping cart.png" alt="" className="cartBlock__btn-img" />
                </button>
            </div>
        </div>
    )
}

export default ProductItemCatalog;