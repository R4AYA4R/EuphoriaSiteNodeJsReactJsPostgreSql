

import { Swiper, SwiperSlide } from 'swiper/react'; // импортируем вручну таким образом сам Swiper(для слайдера) и SwiperSlide(для элементов в этом слайдере) из библиотеки swiper/react(перед этим мы установили библиотеку swiper(npm i swiper)),иначе автоматически неправильно импортирует и выдает ошибку

import { Autoplay, Navigation, Thumbs, Zoom } from 'swiper/modules'; // импортируем модули для этого слайдера swiper,модули типа навигации(Navigation),пагинации(Pagination) и тд,нужно их импортировать,чтобы подключить и использовать в этом слайдере swiper,импортируем Thumbs для превью картинок слайдера,Autoplay для автоматической прокрутки слайдов

// импортируем стили для самого слайдера и его модулей(типа для навигации этого слайдера,пагинации и тд)
import 'swiper/css';
import 'swiper/css/navigation'; // импортируем стили для модуля навигации(navigation) этого слайдера swiper
import 'swiper/css/thumbs'; // импортируем стили для модуля превью картинок (thumbs) этого слайдера swiper
import 'swiper/css/zoom'; // импортируем стили для зума(приближения) картинок
import { ChangeEvent, useEffect, useState } from 'react';
import { IProduct } from '../types/types';

interface IProductItemPageItemBlock {

    product: IProduct | undefined, // указываем этому полю тип на основе нашего интерфейса IProduct или undefined(указываем это или undefined,так как выдает ошибку,что product может быть undefined)

    pathname: string, // указываем поле для pathname(url страницы),который взяли в родительском компоненте,то есть в компоненте ProductItemPage,указываем ему тип string


}

const ProductItemPageItemBlock = ({ product, pathname }: IProductItemPageItemBlock) => {

    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null); // указываем тип в generic для этого состояния thumbsSwiper(превью картинок для слайдера swiper) как any,иначе выдает ошибку,что нельзя назначить тип Swiper состоянию

    const [inputAmountValue, setInputAmountValue] = useState(1);

    const [valueDiscount, setValueDiscount] = useState<number>(0);  // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    const [sizesMass, setSizesMass] = useState<string[]>([]);

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

    // при изменении pathname(то есть когда будет меняться url страницы,то есть когда будем переходить,например,на другую страницу товара,чтобы значение количества товара становилось на 1,то есть на дефолтное значение) изменяем поле inputAmountValue на 1
    useEffect(() => {

        setInputAmountValue(1);

        setSizesMass([]); // очищаем массив sizesMass,то есть убираем выбранные пользователем размеры

    }, [pathname])

    // при рендеринге этого компонента и при изменении product(объекта товара) будет отработан код в этом useEffect
    useEffect(() => {

        // если product.priceDiscount true,то есть в поле priceDiscount у product есть какое-то значение,и оно не false или null и тд,то есть есть скидка у товара,то тогда ее и считаем
        if (product?.priceDiscount) {

            setValueDiscount(((product.price - product.priceDiscount) / product.price) * 100); // изменяем значение valueDiscount,считаем тут сколько процентов скидка от предыдущей цены, отнимаем цену со скидкой(product.priceDiscount) от изначальной цены(product.price), делим результат на изначальную цену и умножаем весь полученный результат на 100

        }


    }, [product])

    // указываем функцию для добавления и удаления размеров в массив состояния sizes
    const addSizes = (itemSize: string) => {

        // если в массиве sizesMass нету элемента,равного значению itemSize(параметр этой функции)
        if (!sizesMass.some(size => size === itemSize)) {

            // изменянем состояние sizesMass,возвращаем новый массив,куда разворачиваем предыдущий(текущий) массив(...prev) и добавляем в него новый элемент itemSize,не используем здесь типа sizesMass.push(),так как тогда обновление состояние sizesMass будет не сразу,а ставится в очередь на обновление и это будет не правильно работать,а когда мы используем prev(текущее состояние),то тогда мы работаем уже точно с текущим состоянием массива,и он будет обновлен сразу
            setSizesMass((prev) => [...prev, itemSize]);


        } else {

            // в другом случае,если этот элемент(itemSize) уже есть,то оставляем все элементы в массиве sizes,которые не равны значению itemSize,то есть удаляем этот элемент itemSize из массива sizes
            setSizesMass((prev) => prev.filter(size => size !== itemSize));

        }


    }

    // используем useEffect,чтобы вывести в консоль текущее состояние массива sizesMass при его изменении,иначе,если использовать console.log в нашей функции addSizes,то там будет отображаться предыдущее состояние массива sizesMass,так как это состояние sizesMass на тот момент еще не будет обновлено
    useEffect(() => {

        console.log(sizesMass)

    }, [sizesMass])

    return (
        <div className="sectionProductItemPage__itemBlock-inner">
            <div className="sectionProductItemPage__leftBlock">

                <div className="sectionProductItemPage__leftBlock-imgBlock">

                    <div className="sectionProductItemPage__leftBlock-sliderBlock">

                        <div className="sliderBlock__previewSliderBlock">
                            <div className="container">

                                <div className="previewSliderBlock__inner">
                                    <Swiper

                                        className="sliderBlock__previewSliderBlock-previewSlider"

                                        slidesPerView={3} // указываем количество слайдов для показа в одном элементе слайдера(который сейчас активен у слайдера),в данном случае указываем 3 картинки(у нас их и есть в главном слайдере 3),для активного слайда

                                        modules={[Thumbs]}

                                        watchSlidesProgress={true} // указываем это,чтобы был добавлен дополнительный класс видимости текущего активного слайда

                                        onSwiper={setThumbsSwiper}

                                        slideToClickedSlide={true} // перемещается к слайду,на который кликнули

                                        spaceBetween={20} // отступ в пикселях между слайдами

                                    >

                                        <SwiperSlide className="sliderBlock__previewSlider-slide">
                                            {/* здесь уже не используем zoom контейнер(div элемент с классом zoom контейнера для этого слайдера),так как здесь уже не нужен зум и это просто превью картинок, указываем в src этой картинке путь до папки,где хранятся картинки и само название картинки указываем как значение mainImage у объекта product(пропс(параметр) этого компонента) */}
                                            <img src={`${process.env.REACT_APP_BACKEND_URL}/${product?.mainImage}`} alt="" className="sectionProductItemPage__sliderBlock-sliderImg sectionProductItemPage__previewSlider-sliderImg" />
                                        </SwiperSlide>

                                        {/* проходимся по массиву descImages у product,и возвращаем новый массив,на каждой итерации(месте предыдущего элемента) будет подставлен элемент,который мы указали в функции callback у этого map(),в данном случае это будет элемент слайдера <SwiperSlide/>,то есть отображаем картинки товара,в параметрах этой функции callback у map берем image(текущий итерируемый элемент массива,название может быть любое) и index(текущий индекс итерируемого элемента массива),указываем этот index в key,чтобы эти ключи(key) были разные,так как в данном случае у нас есть одинаковые названия у картинок,лучше указывать отдельный какой-нибудь id в key,но в данном случае это подходит,в src у img указываем путь до картинки,указываем в конце этого пути параметр image(текущий итерируемый объект массива) этой функции callback у map,чтобы указать разные названия картинок */}
                                        {product?.descImages.map((image, index) =>

                                            <SwiperSlide className="sliderBlock__previewSlider-slide" key={index}>
                                                {/* здесь уже не используем zoom контейнер(div элемент с классом zoom контейнера для этого слайдера),так как здесь уже не нужен зум и это просто превью картинок */}
                                                {/* в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/(вынесли url до бэкэнда в переменную REACT_APP_BACKEND_URL в файле .env) и image(текущий итерируемый элемент массива descImages,то есть название каждой картинки описания) */}
                                                <img src={`${process.env.REACT_APP_BACKEND_URL}/${image}`} alt="" className="sectionProductItemPage__sliderBlock-sliderImg sectionProductItemPage__previewSlider-sliderImg" />
                                            </SwiperSlide>

                                        )}

                                    </Swiper>

                                    <div className="previewSliderBlock__navigation">
                                        <button className="previewSliderBlock__navigation-item previewSliderBlock__navigation-itemNext">
                                            <img src="/images/sectionProductItemPage/ArrowTop.png" alt="" className="previewSliderBlock__navigation-itemImg" />
                                        </button>
                                        <button className="previewSliderBlock__navigation-item previewSliderBlock__navigation-itemPrev">
                                            <img src="/images/sectionProductItemPage/ArrowDown.png" alt="" className="previewSliderBlock__navigation-itemImg" />
                                        </button>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <Swiper

                            modules={[Navigation, Thumbs, Zoom, Autoplay]} // указываем модули этому слайдеру,чтобы они работали,в данном случае указываем модуль Navigation для навигации,чтобы могли меняться картинки 

                            slidesPerView={1} // количество слайдов для показа в одном элементе слайдера(который сейчас активен у слайдера),можно указывать не только целые числа но и числа с точко(типа 2.5),можно указать еще значение 'auto',тогда будет автоматически формироваться ширина слайда контентом внутри него,или конкретно указанной шириной этому слайдеру в css

                            zoom={true} // подключаем зум картинок,можно указать параметры maxRatio(максимальное увеличение) и minRation(минимальное увеличение),но в данном случае и так подходит на автоматических настройках

                            // указываем thumbs,для поля swiper указываем наше состояние для thumbs(thumbsSwiper)
                            thumbs={{
                                swiper: thumbsSwiper
                            }}

                            navigation={{
                                nextEl: '.previewSliderBlock__navigation-itemPrev',
                                prevEl: '.previewSliderBlock__navigation-itemNext'
                            }}  // указываем navigation,то есть подключаем конкретно навигацию для этого слайдера,чтобы могли меняться картинки,а также конкретно указываем html элемент для кнопки навигации следующего и предыдущего слайда,указываем просто названия классов с точкой для каждого их этих кнопок

                            spaceBetween={10} // указываем отступ между слайдами(хотя бы небольшой),чтобы не было бага с границей следующего слайда,чтобы он не виднелся 

                            // в данном случае не указываем этот режим loop,так как он не работает в данном случае корректно и swiper выдает уведомление об этом,так как у нас не много слайдов
                            // loop={true} // указываем loop true,чтобы слайдер был типа бесконечным,и можно было перелистывать с последнего слайда на первый и обратно

                            // автопрокрутка слайдов
                            autoplay={{
                                delay: 2000, // пауза между прокруткой слайда в милисекундах

                                disableOnInteraction: true // отключает автопрокрутку,когда вручную перелестнули или свайпнули слайд
                            }}

                            grabCursor={true} // меняет курсор мыши при свайпе слайда на руку

                        >

                            {/* если product?.priceDiscount true,то есть поле priceDiscount у product есть и в нем есть какое-то значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае пустую строку,то есть ничего не показываем */}
                            {product?.priceDiscount ?
                                <>
                                    <div className="sectionNewArrivals__item-saleBlock">{valueDiscount.toFixed(0)}%</div> {/* указываем число скидки в процентах с помощью toFixed(0),чтобы убрать все цифры после запятой,чтобы число было целым,toFixed() указывает,сколько можно оставить цифр после запятой,а также округляет число в правильную сторону автоматически */}

                                    {/* если valueDiscount больше 30,то есть скидка товара больше 30 процентов,то указываем этот блок с текстом HOT,типа большая скидка */}
                                    {valueDiscount > 30 &&
                                        <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>
                                    }

                                </>
                                : ''
                            }

                            {/* указываем SwiperSlide(элемент слайдера) и в него помещаем картинку для этого слайдера,указываем картинке для первого слайда в src путь до картинки,в конце этого пути указываем product?.mainImage,то есть название картинки у объекта товара(product) для главной(первой) картинки для слайдера */}
                            <SwiperSlide>
                                {/* добавляем блок div с классом swiper-zoom-container (это класс этому слайдеру для зума по дефолту,мы подключили стили для этого zoom),чтобы работал зум картинок,в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и значение поля mainImage у product(объекта товара) */}
                                <div className="swiper-zoom-container">
                                    <img src={`${process.env.REACT_APP_BACKEND_URL}/${product?.mainImage}`} alt="" className="sectionProductItemPage__sliderBlock-sliderImg" />
                                </div>
                            </SwiperSlide>

                            {/* проходимся по массиву descImages у product,и возвращаем новый массив,на каждой итерации(месте предыдущего элемента) будет подставлен элемент,который мы указали в функции callback у этого map(),в данном случае это будет элемент слайдера <SwiperSlide/>,то есть отображаем картинки товара,в параметрах этой функции callback у map берем image(текущий итерируемый элемент массива,название может быть любое) и index(текущий индекс итерируемого элемента массива),указываем этот index в key,чтобы эти ключи(key) были разные,так как в данном случае у нас есть одинаковые названия у картинок,лучше указывать отдельный какой-нибудь id в key,но в данном случае это подходит,в src у img указываем путь до картинки,указываем в конце этого пути параметр image(текущий итерируемый объект массива) этой функции callback у map,чтобы указать разные названия картинок */}
                            {product?.descImages.map((image, index) =>

                                <SwiperSlide key={index}>
                                    {/* добавляем блок div с классом swiper-zoom-container (это класс этому слайдеру для зума по дефолту,мы подключили стили для этого zoom),чтобы работал зум картинок,в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и image(текущий итерируемый элемент массива descImages,то есть название каждой картинки описания) */}
                                    <div className="swiper-zoom-container">
                                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${image}`} alt="" className="sectionProductItemPage__sliderBlock-sliderImg" />
                                    </div>
                                </SwiperSlide>

                            )}

                        </Swiper>

                    </div>

                </div>



            </div>
            <div className="sectionProductItemPage__rightBlock">
                {/* указываем дополнительный контейнер для sectionProductItemPage__rightBlock,так как по дизайну нужно так отделить и ограничить максимальную ширину блока sectionProductItemPage__rightBlock */}
                <div className="sectionProductItemPage__rightBlock-container">
                    <h1 className="sectionProductItemPage__rightBlock-title">{product?.name}</h1>
                    <div className="sectionNewArrivals__item-starsBlock">
                        <div className="sectionNewArrivals__item-stars">

                            {/* если product true,то есть данные о товаре на текущей странице есть(делаем эту проверку,потому что без нее ошибка,типа product может быть undefined),и в src у элементов img(картинок) указываем условие,какую звезду рейтинга отображать в зависимости от значения рейтинга товара */}
                            {product &&

                                <>
                                    {/* если product.rating равно 0,то показываем пустую звезду,в другом случае если product.rating больше или равно 0.5 и меньше или равно 0.9,то показываем половину звезды,в другом случае показываем целую звезду */}
                                    < img src={product.rating === 0 ? "/images/sectionNewArrivals/Vector (2).png" : product.rating >= 0.5 && product.rating < 1 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (1).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={product.rating >= 2 ? "/images/sectionNewArrivals/Vector (1).png" : product.rating >= 1.5 && product.rating < 2 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={product.rating >= 3 ? "/images/sectionNewArrivals/Vector (1).png" : product.rating >= 2.5 && product.rating < 3 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={product.rating >= 4 ? "/images/sectionNewArrivals/Vector (1).png" : product.rating >= 3.5 && product.rating < 4 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                    <img src={product.rating >= 5 ? "/images/sectionNewArrivals/Vector (1).png" : product.rating >= 4.5 && product.rating < 5 ? "/images/sectionNewArrivals/Vector.png" : "/images/sectionNewArrivals/Vector (2).png"} alt="" className="sectionNewArrivals__item-starsImg" />
                                </>

                            }
                        </div>
                        <p className="sectionNewArrivals__item-starsAmount">(0)</p>
                    </div>

                    {/* если product?.priceDiscount true(указываем знак вопроса после product)так как product может быть undefined и выдает ошибку об этом),то есть поле priceDiscount у product есть и в нем есть какое-то не пустое значение,то есть у этого товара есть цена со скидкой,то показываем такой блок,в другом случае другой */}
                    {product?.priceDiscount ?

                        <div className="sectionNewArrivals__item-priceBlock sectionProductItemPage__item-priceBlock">
                            <p className="item__priceBlock-priceSale">${product.priceDiscount}</p>
                            <p className="item__priceBlock-priceUsual">${product.price}</p>
                        </div>
                        :
                        <div className="sectionNewArrivals__item-priceBlock sectionProductItemPage__item-priceBlock">
                            <p className="item__priceBlock-priceUsualDefault">${product?.price}</p>
                        </div>

                    }

                    <div className="sectionProductItemPage__rightBlock-sizeBlock">
                        <p className="sectionProductItemPage__sizeBlock-text">Select Size</p>
                        <div className="sectionProductItemPage__sizeBlock-sizes">

                            {/* проходимся по массиву sizes и показываем кнопки для размера одежды,который доступен для этого товара */}
                            {product?.sizes.map((sizeItem, index) =>

                                // в onClick указываем нашу функцию addSizes,в которую передаем параметр sizeItem(текущий итерируемый элемент массива sizes у product),в className проверяем,есть ли sizeItem(текущий итерируемый элемент массива sizes у product) в массиве sizesMass(то есть равен ли sizeItem значению какого-нибудь элемента в массиве sizesMass),если есть,то показываем активный класс кнопке,в другом случае обычный
                                <button key={index} className={sizesMass.some(item => item === sizeItem) ? "sizeBlock__sizes-item sizeBlock__sizes-item--active" : "sizeBlock__sizes-item"} onClick={() => addSizes(sizeItem)}>{sizeItem}</button>

                            )}

                        </div>
                    </div>

                    <div className="sectionNewArrivals__item-cartBlock sectionProductItemPage__cartBlock">

                        {/* потом будем проверять есть ли этот товар уже в корзине */}
                        {/* <h3 className="textAlreadyInCart">In Cart</h3> */}

                        <div className="sectionProductItemPage__cartBlock-inputBlock">
                            <button className="cartBlock__inputBlock-btn cartBlock__inputBlock-btn--minus" onClick={handlerMinusAmountBtn}>
                                <img src="/images/sectionProductItemPage/Minus.png" alt="" className="cartBlock__inputBlock-btnImg" />
                            </button>
                            <input type="number" className="cartBlock__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                            <button className="cartBlock__inputBlock-btn cartBlock__inputBlock-btn--plus" onClick={handlerPlusAmountBtn}>
                                <img src="/images/sectionProductItemPage/Plus.png" alt="" className="cartBlock__inputBlock-btnImg" />
                            </button>
                        </div>

                        <button className="sectionProductItemPage__rightBlock-btnCart">
                            <p className="sectionProductItemPage__btnCart-text">Add to Cart</p>
                            <img src="/images/sectionProductItemPage/shopping cart.png" alt="" className="sectionProductItemPage__btnCart-img" />
                        </button>
                    </div>

                    <div className="sectionProductItemPage__rightBlock-bottomBlock">
                        <div className="sectionProductItemPage__bottomBlock-item">
                            <img src="/images/sectionProductItemPage/Frame 24.png" alt="" className="sectionProductItemPage__bottomBlock-itemImg" />
                            <p className="sectionProductItemPage__bottomBlock-itemText">Secure Payment</p>
                        </div>
                        <div className="sectionProductItemPage__bottomBlock-item">
                            <img src="/images/sectionProductItemPage/Frame 25.png" alt="" className="sectionProductItemPage__bottomBlock-itemImg" />
                            <p className="sectionProductItemPage__bottomBlock-itemText">Size & Fit</p>
                        </div>
                        <div className="sectionProductItemPage__bottomBlock-item">
                            <img src="/images/sectionProductItemPage/Frame 26.png" alt="" className="sectionProductItemPage__bottomBlock-itemImg" />
                            <p className="sectionProductItemPage__bottomBlock-itemText">Free Shipping</p>
                        </div>
                        <div className="sectionProductItemPage__bottomBlock-item">
                            <img src="/images/sectionProductItemPage/Frame 27.png" alt="" className="sectionProductItemPage__bottomBlock-itemImg" />
                            <p className="sectionProductItemPage__bottomBlock-itemText">Free Returns</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default ProductItemPageItemBlock;