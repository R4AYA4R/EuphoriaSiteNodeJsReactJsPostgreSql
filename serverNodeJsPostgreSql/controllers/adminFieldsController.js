

import { validationResult } from "express-validator";
import adminFieldsService from "../service/adminFieldsService.js";
import commentService from "../service/commentService.js";
import productService from "../service/productService.js"; // указываем тут расширение файла как .js вручную,иначе не находит файл


// создаем класс для AdminFieldsController,где будем описывать функции для эндпоинтов
class AdminFieldsController {

    // первым параметром эти функции принимают req(запрос),а вторым параметром res(ответ),третьим параметром передаем функцию next(следующий по цепочке middleware,в данном случае это наш errorMiddleware)
    async changeEmail(req, res, next) {

        // отличие req.params от req.query заключается в том,что в req.params указываются параметры в самом url до эндпоинта на бэкэнде(в node js в данном случае,типа /api/getProducts) через :(типа /:id,динамический параметр id),а req.query - это параметры,которые берутся из url(которые дополнительно добавили с фронтенда к url) через знак ?(типа ?name=bob)

        const { newEmail } = req.body; // достаем(деструктуризируем) из тела запроса поле newEmail

        // оборачиваем в try catch для обработки ошибок
        try {

            const errors = validationResult(req); // используем validationResult и передаем туда запрос(req),из него автоматически достанутся необходимые поля и провалидируются,и помещаем ошибки валидации в переменную errors

            const adminFieldsData = await adminFieldsService.changeEmail(newEmail,errors);  // вызываем нашу функцию changeEmail из adminFieldsService,передаем туда newEmail(новую почту из тела запроса) и errors(ошибки при валидации,если они были),эта функция возвращает обновленный объект админ полей в базе данных и помещаем его в переменную adminFieldsData

            return res.json(adminFieldsData); // возвращаем обновленный объект админ полей на клиент

        } catch (e) {

            next(e);  // вызываем функцию next()(параметр этой функции getProductsArrivals) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProductsArrivals,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

    async getAdminFields(req, res, next) {

        // отличие req.params от req.query заключается в том,что в req.params указываются параметры в самом url до эндпоинта на бэкэнде(в node js в данном случае,типа /api/getProducts) через :(типа /:id,динамический параметр id),а req.query - это параметры,которые берутся из url(которые дополнительно добавили с фронтенда к url) через знак ?(типа ?name=bob)

        // оборачиваем в try catch для обработки ошибок
        try {

            const adminFieldsData = await adminFieldsService.getAdminFields();  // вызываем нашу функцию getAdminFields из adminFieldsService,эта функция возвращает найденный объект админ полей в базе данных и помещаем его в переменную adminFieldsData

            return res.json(adminFieldsData); // возвращаем обновленный объект админ полей на клиент

        } catch (e) {

            next(e);  // вызываем функцию next()(параметр этой функции getProductsArrivals) и туда передаем ошибку,в этот next() попадает ошибка,и если ошибка будет от нашего класса ApiError(наш класс обработки ошибок,то есть когда мы будем вызывать функцию из нашего класса ApiError для обработки определенной ошибки,то эта функция будет возвращать объект с полями message и тд,и этот объект будет попадать в эту функцию next(в наш errorMiddleware) у этой нашей функции getProductsArrivals,и будет там обрабатываться),то она будет там обработана с конкретным сообщением,которое мы описывали,если эта ошибка будет не от нашего класса ApiError(мы обрабатывали какие-то конкретные ошибки,типа UnauthorizedError,ошибки при авторизации и тд),а какая-то другая,то она будет обработана как обычная ошибка(просто выведена в логи,мы это там прописали),вызывая эту функцию next(),мы попадаем в наш middleware error-middleware(который подключили в файле index.js)

        }

    }

}

export default new AdminFieldsController(); // экспортируем объект на основе класса AdminFieldsController,чтобы потом сразу можно было после импорта этого объекта из этого файла указывать через точку функции этого класса AdminFieldsController(типа adminFieldsController.getProductsCatalog()),если так не делать,то если у функций класса нету параметра static,то нельзя будет их вызвать,не создав перед этим объект на основе этого класса