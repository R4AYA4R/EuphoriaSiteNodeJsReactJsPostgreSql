import ApiError from "../exceptions/ApiError.js"; // указываем здесь вручную расширение файла .js,иначе выдает ошибку,что не может найти файл

// создаем и экспортируем функцию для обработки ошибок
export default function (err,req,res,next){

    console.log(err); // выводим в консоль err(ошибку,если она была)

    // если ошибка является инстансом нашего класса ApiError,то есть принадлежит ли параметр err(ошибка) нашему классу ApiError
    if(err instanceof ApiError){

        return res.status(err.status).json({message:err.message,errors:err.errors}); // возвращаем на клиент статус код ошибки(err.status),сообщение ошибки и массив ошибок(err.errors)

    }

    return res.status(500).json({message:"Unexpected Error"}); // если проверка выше не сработала(то есть эту ошибку мы не обрабатывали нашими функциями у класса ApiError и не обрабатывали эту ошибку у функции для эндпоинта с помощью нашего класса ApiError),то возвращаем на клиент статус код 500(серверная ошибка) и сообщение,типа непредвиденная ошибка

}