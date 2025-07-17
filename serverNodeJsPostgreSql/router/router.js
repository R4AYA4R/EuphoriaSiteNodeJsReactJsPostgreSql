import { Router } from "express";
import productController from "../controllers/productController.js"; // указываем здесь вручную расширение файла .js,иначе выдает ошибку,что не может найти файл
import { body } from "express-validator";
import userController from "../controllers/userController.js";
import commentController from "../controllers/commentController.js";
import authMIddleware from "../middlewares/authMIddleware.js";
import fileController from "../controllers/fileController.js";

const router = new Router(); // создаем объект на основе этого класса Router

router.get('/getProductsArrivals', productController.getProductsArrivals); // описываем get запрос на сервере,первым параметром указываем url,по которому этот эндпоинт будет отрабатывать,а вторым передаем функцию,которая будет срабатывать на этом эндпоинте(по этому url)

router.get('/getProductsCatalog', productController.getProductsCatalog); // описываем get запрос на сервере для получения товаров для каталога

router.get('/getProductsCatalog/:id', productController.getProductById); // описываем get запрос на сервере для получения объекта блюда по id,указываем этот динамический параметр id через : (двоеточие) в url к этому эндпоинту


router.post('/createComment', commentController.createComment); // создаем post запрос на создание комментария в базе данных

router.get('/getCommentsForProduct', commentController.getCommentsForProduct); // создаем get запрос на получение комментариев для определенного товара

router.put('/updateProductRating', productController.updateProductRating); // создаем put запрос для обновления рейтинга товара 

router.put('/updateProductCartRating', productController.updateProductCartRating); // создаем put запрос для обновления рейтинга товара корзины


router.post('/addProductToCart', productController.addProductToCart); // создаем post запрос для создания товара в корзине

router.get('/getAllProductsCart', productController.getAllProductsCart);  // создаем get запрос на получение товаров корзины для определенного авторизованного пользователя

router.put('/updateProductCart', productController.updateProductCart); // создаем put запрос на обновление данных товара корзины

router.delete('/deleteProductCart/:productId', productController.deleteProductCart); // создаем delete запрос на удаление товара корзины, delete запрос не имеет тела запроса и все query параметры передаются через строку запроса,в данном случае передаем через двоеточие query параметр productId(id товара корзины,который нужно удалить)


router.put('/changeAccInfo', authMIddleware, body('email').isEmail(), userController.changeAccInfo); // указываем put запрос для изменения данных пользователя в базе данных,вторым параметром указываем authMiddleware для проверки на access токен у пользователя,если он есть и он еще годен по сроку жизни этого токена(мы этот срок указали при создании токена),то будет выполнена функция changeAccInfo,если нет,то не будет и будет ошибка,если access токен пользователя иссяк(уже не годен по сроку годности),то будет идти повторный запрос на /refresh для обновления refresh и access токенов(это мы прописывали на фронтенде для нашего axios),refresh и access токены будут обновлены,если текущий refresh токен пользователя еще годен по сроку годности(это мы прописывали в функции для эндпоинта /refresh),если текущий refresh токен еще годен по сроку годности,то будут обновлены refresh и access токены и после этого будет идти повторный запрос(это мы прописывали на фронтенде для нашего axios) на изменение пароля или почты пользователя,но уже с обновленными refresh и access токенами,если же при повторном запросе на /refresh refresh токен пользователя иссяк (уже не годен по сроку годности),то будет ошибка и не будет выполнена функция изменения пароля или почты пользователя, третьим параметром указываем middleware(функцию body для валидации),указываем в параметре body() названия поля из тела запроса,которое хотим провалидировать(в данном случае это email),и указываем валидатор isEmail() для проверки на email

router.put('/changeAccPass',authMIddleware,userController.changeAccPass);  // создаем put запрос для изменения пароля пользователя в базе данных,вторым параметром указываем наш authMiddleware для проверки на access токен у пользователя,если он есть и он еще годен по сроку жизни этого токена(мы этот срок указали при создании токена),то будет выполнена функция changeAccPass,если нет,то не будет и будет ошибка,если access токен пользователя иссяк(уже не годен по сроку годности),то будет идти повторный запрос на /refresh для обновления refresh и access токенов(это мы прописывали на фронтенде для нашего axios),refresh и access токены будут обновлены,если текущий refresh токен пользователя еще годен по сроку годности(это мы прописывали в функции для эндпоинта /refresh),если текущий refresh токен еще годен по сроку годности,то будут обновлены refresh и access токены и после этого будет идти повторный запрос(это мы прописывали на фронтенде для нашего axios) на изменение пароля пользователя,но уже с обновленными refresh и access токенами,если же при повторном запросе на /refresh refresh токен пользователя иссяк (уже не годен по сроку годности),то будет ошибка и не будет выполнена функция изменения пароля пользователя


router.post('/uploadFile',authMIddleware,fileController.uploadFile); // указываем post запрос для загрузки файла с фронтенда на наш node js сервер(в данном случае в папку static),вторым параметром указываем наш authMiddleware для проверки на access токен

router.delete('/deleteImage/:imageName',fileController.deleteImage); // указываем delete запрос для удаления файла с нашего node js сервера(в данном случае из папки checkStatic),delete запрос не имеет тела запроса и все параметры передаются через строку,тут указываем через :(двоеточие) динамический параметр imageName,то есть этот параметр может меняться(в данном случае этот параметр нужен,чтобы удалить файл из папки checkStatic по этому названию imageName)


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    userController.registration
); // указываем post запрос для регистрации по маршруту /registration,вторым параметром указываем middleware(функцию body для валидации),указываем в параметре body() названия поля из тела запроса,которое хотим провалидировать(в данном случае это email),и указываем валидатор isEmail() для проверки на email,также валидируем и пароль,но там уже указываем валидатор isLength(),куда передаем объект и поля min(минимальное количество) и max(максимальное) по количеству символов,четвертым параметром указываем функцию registration из нашего userController для регистрации,которая будет отрабатывать на этом эндпоинте

router.post('/login', userController.login); // указываем post запрос для логина

router.post('/logout', userController.logout); // указываем post запрос для выхода из аккаунта

router.get('/refresh', userController.refresh); // указываем get запрос для перезаписывания access токена,если он умер(то есть здесь будем отправлять refresh токен и получать обратно пару access и refresh токенов),если у access токена время действия закончилось,то мы с фронтенда делаем запрос на /refresh,перезаписываем там access и refresh токены(перезаписываем refresh и access токены только в том случае,если refresh токен пользователя еще годен по сроку годности,иначе выдаем ошибку и пользователю нужно будет заново входить в аккаунт,чтобы переобновить refresh токен),и тогда,если аккаунт украли и у мошенника закончилось время жизни access токена,то делается запрос на /refresh,но уже у него access и refresh токены не действительны и он не может получить доступ к сервисам,authMiddleware нужен,чтобы защитить пользователя от мошенников,так как,когда истекает access токен,идет запрос на refresh токен,и после этого обновляется и access токен,и refresh токен,соответственно мошенник уже не может получить доступ к этому эндпоинту(маршруту по url),так как его refresh и access токен будут уже не действительны,а функция checkAuth нужна для проверки только refresh токена(то есть,если пользователь вообще не пользовался сервисом какое-то время(которое указали у жизни refresh токена),нужно именно не переобновлять страницы и тд,чтобы не шел запрос на /refresh(иначе refresh токен будет переобновляться с каждым запросом,нужно,чтобы refresh токен истек до запроса на /refresh, также функция checkAuth на фронтенде будет делать запрос на /refresh и тем самым будет проверять,действует ли еще refresh токен пользователя и если еще действует,то обновлять refresh и access токены),то его refresh токен истечет и его выкинет с аккаунта после обновления страницы,но если пользователь будет использовать в данном случае,например,функцию authMiddleware,то его access токен и refresh токен будут заново перезаписаны и таймер на время жизни refresh токена будет обновлен и заново запущен,поэтому его не будет выкидывать из аккаунта) 


export default router; // экспортируем наш router