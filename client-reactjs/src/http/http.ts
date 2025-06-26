import axios from "axios";

// создаем наш api(axios),но с определенными настройками
const $api = axios.create({

    withCredentials: true, // указываем,чтобы к каждому запросу axios cookie цеплялись автоматически,указываем это поле true

    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`  // указываем базовый url для axios(в данном случае нашу переменную url до бэкэнда REACT_APP_BACKEND_URL в .env файле,это основной url до бэкэнда) и /api,то есть уже конкретный url до нашего роутера на бэкэнде

})

// создаем interceptor(функция,которая будет отрабатывать на каждый запрос или ответ от сервера(в данном случае на каждый запрос),эта функция параметром принимает config инстанса axios(типа axios),у этого config есть те же поля типа headers,baseUrl и тд) на request(запрос на сервер)
$api.interceptors.request.use((config) => {

    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`; // указываем значение полю Authorization у поля headers у config,даем ему значение токена,первым словом указываем тип токена Bearer(в данном случае) и сам токен,который берем из localStorage по ключу(по названию) token

    return config; // возвращаем этот config

})

export default $api; // экспортируем наш $api(инстанс axios)