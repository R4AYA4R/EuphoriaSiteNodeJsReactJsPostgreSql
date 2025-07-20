

import { Swiper, SwiperSlide } from 'swiper/react'; // импортируем вручну таким образом сам Swiper(для слайдера) и SwiperSlide(для элементов в этом слайдере) из библиотеки swiper/react(перед этим мы установили библиотеку swiper(npm i swiper)),иначе автоматически неправильно импортирует и выдает ошибку

import { Autoplay, Navigation, Thumbs, Zoom } from 'swiper/modules'; // импортируем модули для этого слайдера swiper,модули типа навигации(Navigation),пагинации(Pagination) и тд,нужно их импортировать,чтобы подключить и использовать в этом слайдере swiper,импортируем Thumbs для превью картинок слайдера,Autoplay для автоматической прокрутки слайдов

// импортируем стили для самого слайдера и его модулей(типа для навигации этого слайдера,пагинации и тд)
import 'swiper/css';
import 'swiper/css/navigation'; // импортируем стили для модуля навигации(navigation) этого слайдера swiper
import 'swiper/css/thumbs'; // импортируем стили для модуля превью картинок (thumbs) этого слайдера swiper
import 'swiper/css/zoom'; // импортируем стили для зума(приближения) картинок
import { ChangeEvent, useEffect, useState } from 'react';
import { AuthResponse, IComment, IProduct, IProductCart, IProductsCartResponse } from '../types/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useLocation, useNavigate } from 'react-router-dom';
import { useActions } from '../hooks/useActions';

interface IProductItemPageItemBlock {

    product: IProduct | undefined, // указываем этому полю тип на основе нашего интерфейса IProduct или undefined(указываем это или undefined,так как выдает ошибку,что product может быть undefined)

    pathname: string, // указываем поле для pathname(url страницы),который взяли в родительском компоненте,то есть в компоненте ProductItemPage,указываем ему тип string

    comments: IComment[] | undefined, // указываем поле для комментариев этого товара с типом на основе нашего интерфейса IComment,указываем,что это массив [],  или undefined(указываем это или undefined,так как выдает ошибку,что comments может быть undefined)


}

const ProductItemPageItemBlock = ({ product, pathname, comments }: IProductItemPageItemBlock) => {

    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null); // указываем тип в generic для этого состояния thumbsSwiper(превью картинок для слайдера swiper) как any,иначе выдает ошибку,что нельзя назначить тип Swiper состоянию

    const [inputAmountValue, setInputAmountValue] = useState(1);

    const [valueDiscount, setValueDiscount] = useState<number>(0);  // указываем состояние для скидки в процентах,указываем ему в generic тип number,то есть в этом состоянии будут числа,но если указать дефолтное значение состоянию useState,то автоматически ему выдается тип тех данных,которые мы указали по дефолту,в данном случае указали этому состоянию по дефолту значение 0,поэтому тип в generic здесь можно было не указывать,так как он был бы присвоен автоматически как number

    const router = useNavigate();  // useNavigate может перемещатьтся на другую страницу вместо ссылок

    const { user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth и тд,используя наш типизированный хук для useSelector

    const { setLoadingUser, authorizationForUser, logoutUser } = useActions();  // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions

    // const [sizesMass, setSizesMass] = useState<string[]>([]); // это не будем уже здесь использовать,так как сделали так,чтобы можно было выбрать только 1 отдельный размер

    const [size, setSize] = useState<string>(''); // состояние для одного выбранного размера

    const [errorAdding, setErrorAdding] = useState(''); // делаем состояние ошибки,чтобы показывать ее,если пользователь не выбрал размер и тд

    const [isExistsCart, setIsExistsCart] = useState(false);

    // указываем в этой функции запроса на сервер для получения массива товаров корзины такой же queryKey как и на странице Cart.tsx,чтобы эти данные кешировались и можно было переобновить их на этой странице,чтобы они переобновились сразу же и для страницы Cart.tsx
    const { data: dataProductsCart, refetch: refetchProductsCart } = useQuery({
        queryKey: ['getAllProductsCart'], // указываем название
        queryFn: async () => {

            // если user.id true,то есть id у user есть,то делаем запрос на сервер,делаем эту проверку,чтобы шел запрос на сервер на получение массива объектов товаров корзины только когда user.id true(то есть пользователь авторизован),в другом случае возвращаем null,делаем так,чтобы не выдавало ошибку на сервере,что user.id undefined,а возвращаем null,чтобы не выдавало ошибку,что query data(данные из функции запроса на сервер с помощью useQuery) не может быть undefined
            if (user.id) {

                const response = await axios.get<IProductsCartResponse>(`${process.env.REACT_APP_BACKEND_URL}/api/getAllProductsCart?userId=${user.id}`); // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IProductsCartResponse),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя,вынесли основной url до бэкэнда в переменную окружения REACT_APP_BACKEND_URL в файле .env

                console.log(response.data);

                return response.data; // возвращаем конкретный уже объект ответа от сервера(response.data),в нем будет объект массивов объектов товаров корзины(allProductsCartForUser и productsCartForPagination),который мы берем из этого useQuery


            } else {

                return null;

            }


        }
    })

    const { mutate: mutateAddProductCart } = useMutation({
        mutationKey: ['create productCart'],
        mutationFn: async (productCart: IProductCart) => {

            // делаем запрос на сервер и добавляем данные на сервер(указываем это вторым параметров в функции post у axios),указываем тип данных,которые нужно добавить на сервер(в данном случае IProductCart),но здесь не обязательно указывать тип,вынесли основной url до бэкэнда в переменную REACT_APP_BACKEND_URL
            await axios.post<IProductCart>(`${process.env.REACT_APP_BACKEND_URL}/api/addProductToCart`, productCart);

        },

        // при успешной мутации,то есть в данном случае при успешном добавлении товара в корзину обновляем dataProductsCart(массив объектов товаров корзины),чтобы сразу показывалось изменение в корзине товаров,если так не сделать,то текст Already in Cart(что товар уже в корзине) будет показан только после обновления страницы,а не сразу,так как массив объектов товаров корзины еще не переобновился
        onSuccess() {

            setSize(''); // убираем указанный размер товара

            setErrorAdding(''); // убираем ошибку для размера товара

            refetchProductsCart(); // переобновляем массив товаров корзины

        }

    })



    // const isExistsCart = dataProductsCart?.allProductsCartForUser.some(productCart => productCart.name === product?.name && product?.sizes.includes(productCart.size)); // делаем проверку методом some и результат записываем в переменную isExistsCart,если в dataProductsCart?.allProductsCartForUser(в массиве объектов товаров корзины для определенного авторизованного пользователя) есть элемент(объект) name которого равен product name(то есть name этого товара на этой странице) и если массив sizes у product(объект товара на этой странице) содержит елемент со значением size у productCart(объекта товара корзины),в итоге в isExistsCart будет помещено true или false в зависимости от проверки методом some


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

    // при изменении pathname(то есть когда будет меняться url страницы,то есть когда будем переходить,например,на другую страницу товара,чтобы значение количества товара становилось на 1,то есть на дефолтное значение) изменяем поле inputAmountValue на 1
    useEffect(() => {

        setInputAmountValue(1);

        // это уже здесь не используем,так как сделали так,чтобы можно было выбрать только 1 отдельный размер
        // setSizesMass([]); // очищаем массив sizesMass,то есть убираем выбранные пользователем размеры 

        setSize(''); // очищаем выбранный размер 

        setIsExistsCart(false); // изменяем состояние isExistsCart(для проверки есть ли этот товар уже в корзине) на false,чтобы при изменении url страницы это состояние становилось как по дефолту false,и чтобы изначально не была видна надпись,что этот товар уже в корзине на другой странице другого товара

        setErrorAdding(''); // очищаем ошибку,если пользователь не выбрал размер при добавлении товара в корзину,чтобы при изменении url страницы эта ошибка убиралась,чтобы ее изначально не было видно на других страницах других товаров

        // в данном случае и так без этого правильно работает,поэтому этот код закомментировали
        // refetchProductsCart(); // переобновляем массив объектов товаров корзины,чтобы при изменении pathname он переобновлялся и правильно работала проверка на есть ли этот товар уже в корзине

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

        // это уже не используем,так как сделали так,чтобы можно было выбрать только 1 размер
        // если в массиве sizesMass нету элемента,равного значению itemSize(параметр этой функции)
        // if (!sizesMass.some(size => size === itemSize)) {

        //     // изменянем состояние sizesMass,возвращаем новый массив,куда разворачиваем предыдущий(текущий) массив(...prev) и добавляем в него новый элемент itemSize,не используем здесь типа sizesMass.push(),так как тогда обновление состояние sizesMass будет не сразу,а ставится в очередь на обновление и это будет не правильно работать,а когда мы используем prev(текущее состояние),то тогда мы работаем уже точно с текущим состоянием массива,и он будет обновлен сразу
        //     setSizesMass((prev) => [...prev, itemSize]);


        // } else {

        //     // в другом случае,если этот элемент(itemSize) уже есть,то оставляем все элементы в массиве sizes,которые не равны значению itemSize,то есть удаляем этот элемент itemSize из массива sizes
        //     setSizesMass((prev) => prev.filter(size => size !== itemSize));

        // }

        setSize(itemSize); // изменяем состояние size на itemSize(параметр этой функции addSizes)


    }

    // используем useEffect,чтобы вывести в консоль текущее состояние массива sizesMass при его изменении,иначе,если использовать console.log в нашей функции addSizes,то там будет отображаться предыдущее состояние массива sizesMass,так как это состояние sizesMass на тот момент еще не будет обновлено
    // useEffect(() => {

    //     console.log(sizesMass)

    // }, [sizesMass])

    const addProductToCart = () => {

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то помещаем товар в корзину,в другом случае перекидываем пользователя на страницу авторизации
        if (user.userName) {

            // если size равно пустой строке,то есть пользователь не выбрал размер,то показываем текст ошибки рядом с кнопкой добавления товара в корзину
            if (size === '') {

                setErrorAdding('Select size');

            } else if(inputAmountValue < 1){
                // если inputAmountValue меньше 1(в этом инпуте можно ввести значение 0 и тд),то показываем ошибку и не добавляем товар в корзину
                setErrorAdding('Product amount must be 1 or more');

            } else {

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

                        totalPriceProduct = product.priceDiscount * inputAmountValue; // изменяем значение totalPriceProduct на inputAmountValue, умноженное на product.priceDiscount(цену товара со скидкой)

                    } else {
                        // в другом случае,если у товара нет скидки,то изменяем значение totalPriceProduct на inputAmountValue, умноженное на product.price(обычную цену товара)
                        totalPriceProduct = product?.price * inputAmountValue;
                    }

                    mutateAddProductCart({ usualProductId: product?.id, amount: inputAmountValue, categoryId: product?.categoryId, name: product?.name, descImages: product?.descImages, descText: product?.descText, mainImage: product?.mainImage, price: product?.price, priceDiscount: product?.priceDiscount, rating: product?.rating, size: size, totalPrice: totalPriceProduct, typeId: product?.typeId, userId: user.id } as IProductCart); // передаем в mutateAddProductCart объект типа IProductCart только таким образом,разворачивая в объект все необходимые поля(то есть наш product(объект товара в данном случае),в котором полe name,делаем поле name со значением,как и у этого товара name(product.name) и остальные поля также,кроме поля amount,totalPrice,size,их мы изменяем и указываем как значения inputAmountValue(инпут с количеством) и totalPrice со значением totalPriceProduct(эту переменную мы посчитали выше в коде),указываем тип этого объекта как созданный нами тип as IProductCart(в данном случае делаем так,потому что показывает ошибку,что totalPriceProduct может быть undefined и что не хватает поля id,но мы его специально не указываем,чтобы он автоматически генерировался в базе данных),при создании на сервере не указываем конкретное значение id,чтобы он сам автоматически генерировался на сервере и потом можно было удалить этот объект, добавляем поле userId со значением user.id(то есть со значением id пользователя,чтобы потом показывать товары в корзине для каждого конкретного пользователя,у которого id будет равен полю userId у этого товара),указываем usualProductId со значением product?.id,чтобы потом в корзине можно было перейти на страницу товара в магазине по этому usualProductId,а сам id корзины товара не указываем,чтобы он автоматически правильно генерировался,так как делаем показ товаров по-разному для конкретных пользователей(то есть как и должно быть),иначе ошибка

                }



            }


        } else {

            router('/userPage');  // перекидываем пользователя на страницу авторизации (/userPage в данном случае)

        }

    }

    // в данном случае можно было указать эту функцию для обновления access и refresh токенов пользователя(также и useEffect,который будет переобновлять данные товаров корзины при изменении состояния пользователя в redux toolkit) только в компоненте header,так как он у нас на каждой странице,поэтому это будет срабатывать при каждом обновлении и запуске страницы,но уже сделали тут
    // указываем здесь также функцию checkAuth,чтобы переобновлять данные пользователя,когда обновится эта страница товара,чтобы правильно работали проверки есть ли этот товар сейчас в корзине
    const checkAuth = async () => {

        setLoadingUser(true);

        // оборачиваем в try catch для отлавливания ошибок
        try {

            // здесь используем уже обычный axios,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse, указываем url до эндпоинта /refresh на бэкэнде(в данном случае вынесли нашу переменную основного url до бэкэнда REACT_APP_BACKEND_URL в .env файле,это основной url до бэкэнда) и /api,то есть уже конкретный url до нашего роутера на бэкэнде на бэкэнде и через / указываем refresh(это тот url,где мы выдаем access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${process.env.REACT_APP_BACKEND_URL}/api/refresh`, { withCredentials: true }); // в переменную response здесь будут помещены 2 токена(access и refresh) и поле user с типом данных на основе нашего интерфейса IUser,если запрос прошел успешно

            console.log(response.data);

            authorizationForUser(response.data);  // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

        } catch (e: any) {

            console.log(e.response?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e

        } finally {

            // в блоке finally будет выполнен код в независимости от try catch(то есть в любом случае,даже если будет ошибка)
            setLoadingUser(false); // изменяем поле isLoading состояния пользователя в userSlice на false(то есть загрузка закончена)

        }

    }

    // при запуске сайта(в данном случае при рендеринге этого компонента,то есть этой страницы) будет отработан код в этом useEffect
    useEffect(() => {

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть,то есть пользователь уже когда-то регистрировался или авторизовывался и у него уже есть refresh токен в cookies
        if (localStorage.getItem('token')) {

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(user.userName);

    }, [])

    // при запуске(рендеринге) этого компонента и при изменении user(объекта пользователя) переобновляем массив товаров корзины dataProductsCart,так как не успевает загрузится запрос /refresh для проверки авторизации пользователя(для выдачи новых токенов refresh и access),иначе если этого не сделать,то после обновления страницы корзины не показывается,что этот товар есть в корзине, при изменении состояния user(в userSlice в данном случае) (то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются),то делаем повторный запрос на получения товаров корзины,чтобы данные о количестве товаров корзины сразу переобновлялись при изменения состояния user(то есть когда пользователь логинится или выходит из аккаунта,или его поля меняются),если не сделать это,то данные о товарах корзины будут переобновляться только после перезагрузки страницы
    useEffect(() => {

        refetchProductsCart();

    }, [user])

    // указываем у этого useEffect в массиве зависимостей dataProductsCart?.allProductsCartForUser(то есть массив товаров корзины,отфильтрованных для конкретного пользователя) и product(объект товара),указываем это,чтобы правильно работала проверка на есть ли этот товар в корзине,и также чтобы эта проверка срабатывала каждый раз,когда будет меняться этот массив dataProductsCart?.allProductsCartForUser(то есть когда туда будем добавлять новые объекты товаров) и product(сам объект товара)
    useEffect(() => {

        const filteredMassName = dataProductsCart?.allProductsCartForUser.filter(item => item.name === product?.name); // фильтруем массив объектов корзины для пользователя,оставляем в нем все элементы,у которых item.name(имя объекта товара корзины) равен product?.name(имя объекта товара на этой странице),то есть фильтруем по конкретному имени товара

        console.log(dataProductsCart?.allProductsCartForUser);

        console.log(filteredMassName);

        let compareMass: string[] = []; // указываем массив для проверки(чтобы потом сравнить его значения со значениями у массива product?.sizes(массив размеров у товара)),указываем ему let,чтобы изменять значение,хотя если бы указали const,то тоже смогли бы добавлять в этот массив новые элементы с помощью функции push и тд,но не смогли бы,например,изменить значение этой переменной на объект и тд,вместо массива

        filteredMassName?.forEach(item => {

            compareMass.push(item.size); // пушим в compareMass значение поля size у item(текущий итерируемый элемент массива объектов товаров корзины,отфильтрованный по конкретному имени товара)

        })

        const equalMasses = product?.sizes.every((value, index) => compareMass.includes(value)); // проверяем,подходит ли каждый элемент массива product?.sizes(массив размеров у этого товара на этой странице) под условие внутри функции every(),указываем условие,если элемент массива product?.sizes(value) содержится в массиве compareMass, таким образом проверяем,есть ли каждый элемент массива product?.sizes в массиве compareMass,то есть проверяем,есть ли все размеры этого товара с таким же названием,как и название товара на этой странице уже в корзине

        console.log(equalMasses);

        // если equalMasses true,то есть переменная equalMasses true,то есть все размеры товара с таким же названием,как и название товара на этой странице уже есть в корзине
        if (equalMasses) {

            setIsExistsCart(true); // изменяем состояние isExistsCart на true,чтобы показать текст,что товар уже в корзине

        }


    }, [dataProductsCart?.allProductsCartForUser,product])

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
                        <p className="sectionNewArrivals__item-starsAmount">({comments?.length})</p>
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

                            {/* проходимся по массиву sizes и показываем кнопки для размера одежды,который доступен для этого товара,указываем фигурные скобки в этой callback функции внутри этой функции map,чтобы можно было описывать тут сразу переменные,а также потом указываем return и саму html верстку,которую возвращаем(в таком случае обязательно указывать return,так как указали фигурные скобки в этой callback функции и выдает ошибку) */}
                            {product?.sizes.map((sizeItem, index) => {

                                // это уже здесь не используем,так как сделали так,чтобы можно было выбрать только 1 отдельный размер
                                // в onClick указываем нашу функцию addSizes,в которую передаем параметр sizeItem(текущий итерируемый элемент массива sizes у product),в className проверяем,есть ли sizeItem(текущий итерируемый элемент массива sizes у product) в массиве sizesMass(то есть равен ли sizeItem значению какого-нибудь элемента в массиве sizesMass),если есть,то показываем активный класс кнопке,в другом случае обычный
                                // <button key={index} className={sizesMass.some(item => item === sizeItem) ? "sizeBlock__sizes-item sizeBlock__sizes-item--active" : "sizeBlock__sizes-item"} onClick={() => addSizes(sizeItem)}>{sizeItem}</button>

                                const massCartFilteredName = dataProductsCart?.allProductsCartForUser.filter(productCart => productCart.name === product?.name); // фильтруем массив объектов товаров корзины для определенного пользователя,оставляем в нем все объекты,у которых поле name равно полю product?.name(названию товара на этой странице),то есть находим все объекты товаров с названием таким же,как и на этой странице

                                const exists = massCartFilteredName?.some(p => p.size === sizeItem); // проверяем,есть ли в этом massCartFilteredName массиве объектов товаров корзины элемент,у которого поле size равно sizeItem(текущий итерируемый элемент массива sizes у product(объект товара на этой странице)),то есть проверяем,есть ли этот размер у этого названия товара уже в корзине

                                // указываем key как sizeItem в данном случае,так как sizeItem будет уникальным
                                return <div className="sectionProductItemPage__sizeBlock-sizesItemBlock" key={sizeItem}>
                                    {/* если sizeItem равен состоянию size(то есть выбранный размер),то показывать активный класс этой кнопке,в другом случае,если в dataProductsCart?.allProductsCartForUser(в массиве объектов товаров корзины для определенного авторизованного пользователя) есть элемент(объект) name которого равен product name(то есть name этого товара на этой странице),то есть проверяем,есть ли объект товара уже в корзине с таким названием,как на этой странице и exists(эту переменную описали выше в коде) true,то есть этот размер товара и это имя товара уже в корзине пользователя,то показываем класс типа для выключенной кнопки,что с ней нельзя взаимодействовать,и уже в другом случае указываем обычный класс */}
                                    <button key={index} className={sizeItem === size ? "sizeBlock__sizes-item sizeBlock__sizes-item--active" : dataProductsCart?.allProductsCartForUser.some(productCart => productCart.name === product?.name) && exists ? "sizeBlock__sizes-item sizeBlock__sizes-itemDisabled" : "sizeBlock__sizes-item"} onClick={() => addSizes(sizeItem)}>{sizeItem}</button>

                                    {/* если sizeItem равен состоянию size(то есть выбранный размер),то показывать активный класс этой кнопке,в другом случае,если в dataProductsCart?.allProductsCartForUser(в массиве объектов товаров корзины для определенного авторизованного пользователя) есть элемент(объект) name которого равен product name(то есть name этого товара на этой странице),то есть проверяем,есть ли объект товара уже в корзине с таким названием,как на этой странице и exists(эту переменную описали выше в коде) true,то есть этот размер товара и это имя товара уже в корзине пользователя,в итоге текст In Cart будет показан,если эта проверка будет true,в другом случае этот текст показан не будет */}
                                    {dataProductsCart?.allProductsCartForUser.some(productCart => productCart.name === product?.name) && exists && <p className="sizeBlock-sizesItemBlock-textInCart">In Cart</p>}
                                </div>

                            })}

                        </div>
                    </div>

                    {/* если isExistsCart true(то есть этот товарна этой странице уже находится в корзине) и если user.userName true(то есть пользователь авторизован,если не сделать эту проверку на авторизован ли пользователь,то после выхода из аккаунта и возвращении на страницу корзины товары будут показываться до тех пор,пока не обновится страница,поэтому делаем эту проверку),то показываем текст,в другом случае если tabChangePrice false(то есть таб с инпутом для изменения цены товара для админа равен false,то есть не показан),то показываем кнопку добавления товара в корзину и инпут с количеством этого товара */}
                    {user.userName && isExistsCart ?

                        <h3 className="textAlreadyInCart">Already In Cart</h3>
                        :
                        <>
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

                                <button className="sectionProductItemPage__rightBlock-btnCart" onClick={addProductToCart}>
                                    <p className="sectionProductItemPage__btnCart-text">Add to Cart</p>
                                    <img src="/images/sectionProductItemPage/shopping cart.png" alt="" className="sectionProductItemPage__btnCart-img" />
                                </button>

                            </div>

                            {/* если errorAdding true,то есть errorAdding не равно пустой строке или имеет другое true значение(типа 1,true,не пустая строка и тд),то есть есть ошибка формы,то показываем ее */}
                            {errorAdding && <p className="formErrorText sectionProductItemPage__errorCartText">{errorAdding}</p>}
                        </>

                    }


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