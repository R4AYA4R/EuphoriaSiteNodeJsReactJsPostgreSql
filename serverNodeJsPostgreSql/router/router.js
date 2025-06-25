import { Router } from "express";
import productController from "../controllers/productController.js"; // указываем здесь вручную расширение файла .js,иначе выдает ошибку,что не может найти файл
import { body } from "express-validator";
import userController from "../controllers/userController.js";

const router = new Router(); // создаем объект на основе этого класса Router

router.get('/getProductsArrivals', productController.getProductsArrivals); // описываем get запрос на сервере,первым параметром указываем url,по которому этот эндпоинт будет отрабатывать,а вторым передаем функцию,которая будет срабатывать на этом эндпоинте(по этому url)

router.get('/getProductsCatalog', productController.getProductsCatalog); // описываем get запрос на сервере для получения товаров для каталога

router.get('/getProductsCatalog/:id', productController.getProductById); // описываем get запрос на сервере для получения объекта блюда по id,указываем этот динамический параметр id через : (двоеточие) в url к этому эндпоинту



router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration
); // указываем post запрос для регистрации по маршруту /registration,вторым параметром указываем middleware(функцию body для валидации),указываем в параметре body() названия поля из тела запроса,которое хотим провалидировать(в данном случае это email),и указываем валидатор isEmail() для проверки на email,также валидируем и пароль,но там уже указываем валидатор isLength(),куда передаем объект и поля min(минимальное количество) и max(максимальное) по количеству символов,четвертым параметром указываем функцию registration из нашего userController для регистрации,которая будет отрабатывать на этом эндпоинте


export default router; // экспортируем наш router