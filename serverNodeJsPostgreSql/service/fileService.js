

import models from "../models/models.js"; // указываем тут расширение файла как .js вручную,иначе не находит файл
import ApiError from "../exceptions/ApiError.js";

import bcrypt from 'bcrypt'; // импортируем bcrypt для хеширования пароля(в данном случае импортируем вручную,иначе автоматически не импортируется)
import UserDto from "../dtos/userDto.js";
import tokenService from "./tokenService.js";

import * as path from 'path'; // импортируем все из модуля path для работы с файлами(в данном случае импортируем вручную и указываем *,то есть берем все из модуля path и указываем название этому всему как path)

import fs from 'fs'; // импортируем fs для работы с файлами

// создаем класс FileService,где будем описывать функции для эндпоинтов для сервиса файлов(их добавление,удаление и тд)
class FileService {

    // используем throw для ошибки(когда используем throw(то мы указываем,что это типа исключение,которое нужно обрабатывать с помощью try catch в родительской функции),то ошибка идет к функции выше,к родительской функции,в которой эта функция была вызвана,и если у этой родительской функции не было обработки ошибок с помощью try catch,то будет ошибка,что не обработано исключение(то есть ошибка,но не та,которую мы хотели обработать),в данном случае,когда мы указываем throw ошибку,то она идет в родительскую функцию и там срабатывает блок catch,и в этом блоке catch мы описали,что передаем ошибку в функцию next(наш errorMiddleware),где она будет обработана,а при использовании return Error(типа возвращаем ошибку),то это просто возвращается объект на основе класса Error и завершается функция,то есть код ниже этой строчки не выполнится,если будет ошибка с помощью return,и нужно обрабатывать где-то(в другой функции) возврат этой ошибки(то есть чтобы потом проверить,есть ли ошибка и вернуть ответ от сервера с ошибкой на клиент,то нужно будет ее в какой-нибудь родительской функции проверять,вернулась ли ошибка из дочерней функции и выводить ее в логи и возвращать на клиент ошибку,а при throw ошибки,эта ошибка автоматически переходит в блок catch в родительской функции(нужно обязательно добавлять try catch в родительскую функцию,чтобы ловить ошибку с помощью throw)),так,например,в функции для эндпоинта есть функция callback next,и когда мы возвращаем ошибку с помощью return в функции для эндпоинта,то эта ошибка передается в функцию next и там уже обрабатывается(мы это сами прописывали,нужно для этого отдельно подключить свою функцию типа errorMiddleware и там обрабатывать ошибку))

    // функция для загрузки файла 
    async uploadFile(image) {

        const folderPath = `${path.resolve()}\\checkStatic`; // помещаем в переменную folderPath путь на диске до папки checkStatic,которая возможно существует

        // если fs.existsSync(folderPath) false (fs.existsSync() - блокирует поток node js,то есть блокирует дальнейшее выполнение кода,пока эта функция не выполнится(что нам и нужно в данном случае),а просто fs.exists() - не блокирует дальнейшее действие кода),то есть такого пути нет,который мы указали в переменной folderPath,то есть папки checkStatic нет,то ее создаем
        if (!fs.existsSync(folderPath)) {

            fs.mkdirSync(path.resolve('checkStatic')); // создаем папку с помощью mkdirSync(),указываем путь до этой папки с помощью path.resolve() - берет текущую директорию(в данном случае директорию до \serverNodeJsPostgreSql) и добавляет к ней папку,которую мы передаем в параметре

        }

        const filePath = path.resolve('checkStatic', image.name); // помещаем в переменную filePath путь на диске,куда будем этот файл сохранять,используя resolve() у path(resolve() - берет текущую директорию(в данном случае директорию до \serverNodeJsPostgreSql) и добавляет к ней папку,которую мы передаем в параметре(ее нужно сразу создать вручную)),и также передаем вторым параметром название файла,который нужно сохранить в этой папке

        const filePathCheckStatic = `${path.resolve()}\\checkStatic\\${image.name}`; // помещаем в переменную filePathCheckStatic путь до файла,который возможно существует,и ниже в коде проверяем,существует ли он(здесь path.resolve() - берет текущую директорию(в данном случае директорию до \serverNodeJsPostgreSql) потом через слеши наша папка checkStatic(в которой мы храним все текущие скачанные файлы с фронтенда,когда пользователь только выбирает картинки,потом в эндпоинте(функции) создания нового товара будем сохранять эти файлы картинок в другую основную папку static,а из этой checkStatic будем удалять все файлы) и еще через слеши указываем название файла)

        const filePathStatic = `${path.resolve()}\\static\\${image.name}`; // помещаем в переменную filePathStatic путь до файла,который возможно существует в папке static,и ниже в коде проверяем,существует ли он(здесь path.resolve() - берет текущую директорию(в данном случае директорию до \serverNodeJsPostgreSql) потом через слеши наша папка static(в которой мы храним все точные скачанные с фронтенда файлы картинок для товара)

        // если путь filePathCheckStatic существует(то есть уже есть такой файл в такой папке checkStatic в данном случае) или filePathStatic существует,то показываем ошибку,проверяем это с помощью fs.existsSync()
        if (fs.existsSync(filePathCheckStatic) || fs.existsSync(filePathStatic)) {

            throw ApiError.BadRequest('This file already exists'); // вместо throw new Error указываем throw ApiError(наш класс для обработки ошибок),указываем у него функцию BadRequest,этот объект ошибки из функции BadRequest попадет в функцию next() (наш error middleware) у функции для эндпоинта,так как в ней мы отлавливали ошибки с помощью try catch и здесь указали throw,и эта ошибка там будет обработана,то есть показываем ошибку с сообщением

        }

        image.mv(filePath); // перемещаем файл в папку по пути filePath

        return filePath; // в данном случае возвращаем из этой функции filePath(путь до картинки в папке checkStatic)


    }

    // функция для удаления картинки для товара 
    async deleteImage(imageName) {

        const imagePath = `${path.resolve()}\\checkStatic\\${imageName}`; // помещаем путь до файла,который хотим удалить в переменную imagePath(здесь path.resolve() - берет текущую директорию(в данном случае директорию до \serverNodeJsPostgreSql) потом через слеши наша папка checkStatic в которой мы храним все скачанные файлы с фронтенда для формы админа,но они еще не сохранены в основную папку для всех картинок и еще через слеши указываем название файла)

        // если fs.existsSync(imagePath) false,то есть файл по такому пути,который находится в переменной imagePath не найден,то показываем ошибку и не удаляем такой файл,иначе может быть ошибка,когда хотим удалить файл,что такого файла и так нету
        if (!fs.existsSync(imagePath)) {

            throw ApiError.BadRequest('No such file or directory to delete'); // вместо throw new Error указываем throw ApiError(наш класс для обработки ошибок),указываем у него функцию BadRequest,этот объект ошибки из функции BadRequest попадет в функцию next() (наш error middleware) у функции для эндпоинта,так как в ней мы отлавливали ошибки с помощью try catch и здесь указали throw,и эта ошибка там будет обработана,то есть показываем ошибку с сообщением

        }

        fs.unlinkSync(imagePath); // удаляем файл по такому пути,который находится в переменной imagePath с помощью fs.unlinkSync(),у модуля fs для работы с файлами есть методы обычные(типа unlink) и Sync(типа unlinkSync), методы с Sync блокируют главный поток node js и код ниже этой строки не будет выполнен,пока не будет выполнен метод с Sync

        return imagePath; // в данном случае возвращаем из этой функции imagePath(путь до картинки в папке checkStatic,которую удалили)


    }

    // функция для удаления папки chechStatic
    async deleteCheckStatic() {

        const folderPath = `${path.resolve()}\\checkStatic`; // помещаем в переменную folderPath путь на диске до папки checkStatic,которая возможно существует

        // если fs.existsSync(folderPath) false,то есть такого пути нет,который мы указали в переменной folderPath,то есть папки checkStatic нет,то показываем ошибку
        if (!fs.existsSync(folderPath)) {

            throw ApiError.BadRequest('No such file or directory to delete'); // вместо throw new Error указываем throw ApiError(наш класс для обработки ошибок),указываем у него функцию BadRequest,этот объект ошибки из функции BadRequest попадет в функцию next() (наш error middleware) у функции для эндпоинта,так как в ней мы отлавливали ошибки с помощью try catch и здесь указали throw,и эта ошибка там будет обработана,то есть показываем ошибку с сообщением

        }

        fs.rmSync(path.resolve('checkStatic'), { recursive: true });  // удаляем папку checkStatic,указываем до нее путь с помощью path.resolve() - берет текущую директорию(в данном случае директорию до \serverNodeJsPostgreSql) и добавляет к ней папку,которую мы передаем в параметре,также указываем вторым параметром объект опций,указываем поле recursive:true,то есть папка будет удалена рекурсивно со всем содержимым,если в папке есть содержимое,а параметр recursive:true не указан,то выдаст ошибку,но если папка пустая,то параметр recursive:true можно не указывать,так как она тогда удалится без ошибки

        return 'Successfully deleted'; // в данном случае возвращаем из этой функции строку,типа сообщение,которое будем передавать потом на фронтенд


    }

}

export default new FileService(); // экспортируем уже объект на основе нашего класса FileService,чтобы можно было вызывать эти функции в этом классе через точку(типа fileService.uploadFile()),просто импортировав файл fileService,если так не делать,то если у функций класса нету параметра static,то нельзя будет их вызвать,не создав перед этим объект на основе этого класса