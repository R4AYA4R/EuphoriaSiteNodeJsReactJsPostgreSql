import { RefObject, useRef, useState } from "react";
import SectionUnderTopProductPage from "../components/SectionUnderTopProductPage";
import { useIsOnScreen } from "../hooks/useIsOnScreen";

import { Swiper, SwiperSlide } from 'swiper/react'; // импортируем вручну таким образом сам Swiper(для слайдера) и SwiperSlide(для элементов в этом слайдере) из библиотеки swiper/react(перед этим мы установили библиотеку swiper(npm i swiper)),иначе автоматически неправильно импортирует и выдает ошибку

import { Autoplay, Navigation, Thumbs, Zoom } from 'swiper/modules'; // импортируем модули для этого слайдера swiper,модули типа навигации(Navigation),пагинации(Pagination) и тд,нужно их импортировать,чтобы подключить и использовать в этом слайдере swiper,импортируем Thumbs для превью картинок слайдера,Autoplay для автоматической прокрутки слайдов

// импортируем стили для самого слайдера и его модулей(типа для навигации этого слайдера,пагинации и тд)
import 'swiper/css';
import 'swiper/css/navigation'; // импортируем стили для модуля навигации(navigation) этого слайдера swiper
import 'swiper/css/thumbs'; // импортируем стили для модуля превью картинок (thumbs) этого слайдера swiper
import 'swiper/css/zoom'; // импортируем стили для зума(приближения) картинок



const ProductItemPage = () => {

    const sectionCatalog = useRef<HTMLElement>(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef,указываем тип в generic этому useRef как HTMLElement(иначе выдает ошибку),указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnScreen(sectionCatalog as RefObject<HTMLElement>); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),указываем тип этой ссылке на html элемент как RefObject<HTMLElement> (иначе выдает ошибку),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null); // указываем тип в generic для этого состояния thumbsSwiper(превью картинок для слайдера swiper) как any,иначе выдает ошибку,что нельзя назначить тип Swiper состоянию

    return (
        <main className="main">
            <SectionUnderTopProductPage productName="Product Name" />
            <section id="sectionCatalog" className={onScreen.sectionCatalogIntersecting ? "sectionCatalog sectionCatalog__active sectionProductItemPage" : "sectionCatalog sectionProductItemPage"} ref={sectionCatalog}>

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
                                                    {/* здесь уже не используем zoom контейнер(div элемент с классом zoom контейнера для этого слайдера),так как здесь уже не нужен зум и это просто превью картинок */}
                                                    <img src="/images/sectionNewArrivals/Rectangle 25.jpg" alt="" className="sectionProductItemPage__sliderBlock-sliderImg sectionProductItemPage__previewSlider-sliderImg" />
                                                </SwiperSlide>

                                                <SwiperSlide className="sliderBlock__previewSlider-slide">
                                                    <img src="/images/sectionNewArrivals/Rectangle 26.jpg" alt="" className="sectionProductItemPage__sliderBlock-sliderImg sectionProductItemPage__previewSlider-sliderImg" />
                                                </SwiperSlide>

                                                <SwiperSlide className="sliderBlock__previewSlider-slide">
                                                    <img src="/images/sectionNewArrivals/Rectangle 25.jpg" alt="" className="sectionProductItemPage__sliderBlock-sliderImg sectionProductItemPage__previewSlider-sliderImg" />
                                                </SwiperSlide>

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
                                        nextEl: '.previewSliderBlock__navigation-itemNext',
                                        prevEl: '.previewSliderBlock__navigation-itemPrev'
                                    }}  // указываем navigation,то есть подключаем конкретно навигацию для этого слайдера,чтобы могли меняться картинки,а также конкретно указываем html элемент для кнопки навигации следующего и предыдущего слайда,указываем просто названия классов с точкой для каждого их этих кнопок

                                    spaceBetween={10} // указываем отступ между слайдами(хотя бы небольшой),чтобы не было бага с границей следующего слайда,чтобы он не виднелся 

                                    loop={true} // указываем loop true,чтобы слайдер был типа бесконечным,и можно было перелистывать с последнего слайда на первый и обратно

                                    // автопрокрутка слайдов
                                    autoplay={{
                                        delay: 2000, // пауза между прокруткой слайда в милисекундах

                                        disableOnInteraction: true // отключает автопрокрутку,когда вручную перелестнули или свайпнули слайд
                                    }}

                                    grabCursor={true} // меняет курсор мыши при свайпе слайда на руку

                                >

                                    <div className="sectionNewArrivals__item-saleBlock">35%</div>

                                    <div className="sectionNewArrivals__item-saleBlockHot">HOT</div>

                                    {/* указываем SwiperSlide(элемент слайдера) и в него помещаем картинку для этого слайдера,указываем картинке для первого слайда в src путь до картинки,в конце этого пути указываем product?.mainImage,то есть название картинки у объекта товара(product) для главной(первой) картинки для слайдера */}
                                    <SwiperSlide>
                                        {/* добавляем блок div с классом swiper-zoom-container (это класс этому слайдеру для зума по дефолту,мы подключили стили для этого zoom),чтобы работал зум картинок,в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и значение поля mainImage у product(объекта товара) */}
                                        <div className="swiper-zoom-container">
                                            <img src="/images/sectionNewArrivals/Rectangle 25.jpg" alt="" className="sectionProductItemPage__sliderBlock-sliderImg" />
                                        </div>
                                    </SwiperSlide>

                                    <SwiperSlide>
                                        <div className="swiper-zoom-container">
                                            <img src="/images/sectionNewArrivals/Rectangle 26.jpg" alt="" className="sectionProductItemPage__sliderBlock-sliderImg" />
                                        </div>
                                    </SwiperSlide>

                                    <SwiperSlide>
                                        <div className="swiper-zoom-container">
                                            <img src="/images/sectionNewArrivals/Rectangle 25.jpg" alt="" className="sectionProductItemPage__sliderBlock-sliderImg" />
                                        </div>
                                    </SwiperSlide>

                                </Swiper>

                            </div>

                        </div>



                    </div>
                    <div className="sectionProductItemPage__rightBlock">
                        <h1 className="sectionProductItemPage__rightBlock-title">Product Name</h1>
                        <div className="sectionNewArrivals__item-starsBlock">
                            <div className="sectionNewArrivals__item-stars">
                                {/* если product.rating равно 0,то показываем пустую звезду,в другом случае если product.rating больше или равно 0.5 и меньше или равно 0.9,то показываем половину звезды,в другом случае показываем целую звезду */}
                                <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src="/images/sectionNewArrivals/Vector (1).png" alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src="/images/sectionNewArrivals/Vector.png" alt="" className="sectionNewArrivals__item-starsImg" />
                                <img src="/images/sectionNewArrivals/Vector (2).png" alt="" className="sectionNewArrivals__item-starsImg" />
                            </div>
                            <p className="sectionNewArrivals__item-starsAmount">(0)</p>
                        </div>

                        <div className="sectionNewArrivals__item-priceBlock sectionProductItemPage__priceBlock">
                            <p className="item__priceBlock-priceSale">$10</p>
                            <p className="item__priceBlock-priceUsual">$15</p>
                        </div>

                        <div className="sectionProductItemPage__rightBlock-sizeBlock">
                            <p className="sectionProductItemPage__sizeBlock-text">Select Size</p>
                            <div className="sectionProductItemPage__sizeBlock-sizes">
                                <div className="sizeBlock__sizes-item">S</div>
                                <div className="sizeBlock__sizes-item">M</div>
                                <div className="sizeBlock__sizes-item">L</div>
                                <div className="sizeBlock__sizes-item">XL</div>
                            </div>
                        </div>

                        <div className="sectionNewArrivals__item-cartBlock">

                            {/* потом будем проверять есть ли этот товар уже в корзине */}
                            {/* <h3 className="textAlreadyInCart">In Cart</h3> */}

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

            </section>
        </main>
    )
}

export default ProductItemPage;