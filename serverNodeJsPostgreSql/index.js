// лучше создать, подключить git репозиторий в проект,сделать первый commit и push данных в git до того,как создали папку с фронтендом на react js,иначе могут быть ошибки(могут и не быть) сохранений git папки всего проекта и git папки самого фронтенда на react js,чтобы файлы .env игнорировались гитом,то нужно добавить файл .gitignore в корневую папку проекта с папками бэкэнда и фронтенда,и в этом файле .gitignore указать просто .env,таким образом гит будет игнорировать все файлы .env и не пушить их в репозиторий,но если эти файлы .env уже запушились в репозиторий до того,как создали файл .gitignore,то нужно их удалить командой git rm --cached и название файла(можно более подробно посмотреть в интернете как это лучше сделать),потом сделать коммит и запушить эти изменения в репозиторий,и тогда эти файлы .env уже потом удалятся и не будут отслеживаться(но в данном случае их оставили,просто для наглядности и примера),также здесь будем использовать gitlab для ci cd пайплайна,поэтому нужно также подключить gitlab,чтобы туда также пушились изменения в коде,поэтому кроме добавления origin для гитхаба,нужно добавить еще origin для гитлаба, командой git remote set-url --add origin(origin здесь это имя для репозитория(вместо его url) и лучше создать 2 разных имени для гитхаб репозитория и гитлаб,чтобы потом не путаться,но в данном случае оставили название origin
// чтобы командой git push -u origin и название ветки,пушилось сразу в два репозитория с этим именем origin,командой git remote show можно увидеть имена для подключенных удаленных репозиториев(типа на гитхабе или гитлабе)) и ссылка на гитлаб репозиторий,добавляет отслеживание репозитория гитлаба и возможность пушить изменения еще и в гитлаб репозиторий,команда git push -u origin master пушит изменения в репозиторий для ветки master,слово origin здесь - это просто имя репозитория(вместо его url),а флаг -u устанавливает отслеживание ветки,которую мы указали(master в данном случае),чтобы потом можно было использовать команду git push и не указывать уже какую ветку пушить,так как до этого ее так указали,но в первый раз при пуше в репозиторий гитлаба нужно будет в всплывающем окне войти в свой аккаунт гитлаба,чтобы запушились изменения,или можно вместо этого сразу подключить репозиторий гитлаба командой git remote add origin и ссылка на гитлаб репозиторий,а потом уже командой git remote set-url --add origin и ссылка на гитхаб репозиторий добавить url репозитория гитхаба,но в этом url тогда лучше будет указать токен доступа,который можно создать в настройках профиля developer settings,и там создать access token(classic),выбрать параметры доступа и сгенерировать этот ключ,потом его в этом url репозитория указать и таким образом подключиться к репозитории гитхаба,но лучше сразу гитхаб подключить,а потом гитлаб,также чтобы вручную в гитлабе не мержить(merge,сливать вместе) новую ветку master(так как по дефолту главная ветка в гитлаб репозитории называется main),то нужно в настройках в repository указать default branch(дефолтную главную ветку) на master(но нужно,чтобы эта ветка master была сейчас активна,и ожидала типа мержа,чтобы смержиться(merge) с главной веткой main)
// ,тогда ее можно будет увидеть и выбрать как главную ветку,также для ci cd не обязательно заново регистрировать новый раннер для этого нового репозитория,если до этого уже регистрировали раннер и создавали его на локальном компьютере,поэтому в данном случае просто просто в настройках ci cd во вкладке runners нажимаем enable runner for this project(то есть включить этот раннер для этого проекта(репозитория)) возле созданного ранее раннера gitlab runner,и после этого нужно вручную добавить файл .gitlab-ci.yml в корневую папку проекта с папками фронтенда и бэкэнда,также во вкладке build ci/cd нужно убрать галочку с настройки Enable instance runners for this project,чтобы не запускались раннеры гитлаба для пайплайна,как минимум потому,что они требуют верификацию личности(подтвердить карту),и теперь после этого когда будем пушить изменения в коде на гитхаб и гитлаб командой git push,то будет автоматически срабатывать этот наш ci cd пайплайн(мы описали его в файле .gitlab-ci.yml) в репозитории гитлаба

// прописали npm init в проект,чтобы инициализировать npm менеджер пакетов,чтобы устанавливать зависимости и пакеты(после npm init на все вопросы можно нажать enter и они будут тогда по дефолту указаны),устанавливаем express,cors(для отправки запросов через браузер),cookie-parser, устанавливаем с помощью npm i,устанавливаем nodemon(npm i nodemon --save-dev(чтобы устанавилось только для режима разработки)),чтобы перезагружался сервер автоматически при изменении файлов,указываем в package json в поле scripts поле dev и значение nodemon index.js(чтобы запускался index.js с помощью nodemon,чтобы перезагружался сервер автоматически при изменении файлов),используем команду npm run dev,чтобы запустить файл index.js,добавляем поле type со значение module в package.json,чтобы работали импорты типа import from,устанавливаем dotenv(npm i dotenv),чтобы использовать переменные окружения,создаем файл .env в корне папки server,чтобы указывать там переменные окружения(переменные среды),устанавливаем npm i mongodb mongoose,для работы с базой данных mongodb,на сайте mongodb создаем новый проект для базы данных,и потом берем оттуда ссылку для подключения к базе данных,устанавливаем еще jsonwebtoken(для генерации jwt токена),bcrypt(для хеширования пароля),uuid(для генерации рандомных строк) (npm i jsonwebtoken bcrypt uuid),все модули для backend(бэкэнда,в данном случае в папке server) нужно устанавливать в папку для бэкэнда(в данном случае это папка server),для этого нужно каждый раз из корневой папки переходить в папку server(cd server) и уже там прописывать npm i,устанавливаем еще пакет nodemailer(npm i nodemailer) для работы с отправкой сообщений на почту,устанавливаем библиотеку express-validator(npm i express-validator) для валидации паролей,почт и тд(для их проверки на правилно введенную информацию),для работы с файлами в express, нужно установить модуль npm i express-fileupload,лучше создать, подключить git репозиторий в проект,сделать первый commit и push данных в git до того,как создали папку с фронтендом на react js,иначе могут быть ошибки(могут и не быть) сохранений git папки всего проекта и git папки самого фронтенда на react js

// в данном случае используем postgreSql вместо mongodb,поэтому ниже комментарии для подключение и работы с postgreSql,но сначала устанавливаем все нужные зависимости(библиотеки),которые в комментарии выше,кроме библиотек для mongodb
// указываем команду в терминале npm init -y(-y нужен,чтобы установить настройки по умолчанию автоматически,если бы не писали -y,то надо было бы нажимать enter на каждый вопрос,который будет написан после команды npm init,чтобы установить настройки по умолчанию),потом устанавливаем npm install express(для node js express), pg(для postgreSql), pg-hstore(для postgreSql), sequelize(чтобы взаимодействовать с базой данных postgreSql более просто), cors(чтобы можно было отправлять запросы на сервер из браузера), dotenv(чтобы задавать переменные окружения), устанавливаем npm i nodemon --save-dev(чтобы при сохранении файла перезагружался сервер автоматически, --save-dev значит,что устанавливаем только для режима разработки),в файле package.json в поле scripts указываем поле с названием dev(это будет название команды) и со значением nodemon index.js(чтобы по команде npm run dev запускался сервер и потом чтобы при сохранении файла перезагружался сервер автоматически),указываем в package.json поле type со значением module,чтобы работали импорты,создаем файл .env для описания переменных окружения(просто переменных,которые потом будет использовать в разных файлах), в программе pgAdmin(она устанавливается вместе с установкой postgreSql на компьютер) вводим пароль для подключения к postgres(этот пароль мы задавали при установке postgreSql на компьютер) и создаем новую базу данных,нажимая правой кнопкой мыши по вкладке databases и выбираем create,вводим там название базы данных и сохраняем,потом можно построить диаграмму базы данных(описание таблиц и полей в таблицах в нарисованном виде),это можно сделать например,на сайте app.diagrams.net,можно написать просто draw io,у каждой сущности(таблицы в базе данных) должен быть уникальный идентификатор(id),связь у таблиц 1 к 1(один к одному) значит,что один объект таблицы может принадлежать(иметь ссылку на объект другой таблицы) только одному другому объекту другой таблицы, свзять таблиц 1 ко многим значит,что один объект таблицы может принадлежать(иметь ссылку на объект другой таблицы) нескольким объектам других таблиц(типа тип товара может быть у многих объектов товаров), в pgAdmin во вкладке нужной базы данных(в данном случае postgreSqlSequelizeNodeJs),во вкладке schemas во вкладке public и во вкладке tables,можем найти наши созданные таблицы,чтобы посмотреть все записи в таблице,нужно нажать на таблицу правой кнопкой мыши и выбрать View/Edit Data(Просмотр или редактирование данных) и там выбрать All Rows(Все строки),
// чтобы переобновить даннные в этой таблице,можно еще раз нажать на просмотр и редактирование данных,тогда оно еще раз переобновится,устанавливаем (npm i) express-fileupload для загрузки файлов на сервер, устанавливаем (npm i) uuid для генерации рандомных строк(для рандомной генерации названия файла в данном случае),создаем папку static,в ней будем хранить файлы,которые будем загружать с фронтенда,а потом на фронтенд отдавать, чтобы удалить объект из таблицы в базе данных postgreSql с помощью sequelize,то надо использовать функцию destroy() у модели(таблицы),которую создали, типа Device.destroy({where:{id:1}}),то есть удаляем объект из таблицы Device у которого поле id равно 1(указываем условие с помощью where), чтобы обновить данные в таблице у объекта,нужно использовать функцию update(),типа Device.update({title: 'text'}, {where:{id:2}}), то есть обновляем поле title строку text(в данном случае) у объекта,у торого id равно 2(указываем условие с помощью where)

//authMiddleware нужен,чтобы защитить пользователя от мошенников,так как,когда истекает access токен,идет запрос на refresh токен,и после этого обновляется и access токен,и refresh токен,соответственно мошенник уже не может получить доступ к этому эндпоинту(маршруту по url),так как его refresh и access токен будут уже не действительны,а функция checkAuth нужна для проверки только refresh токена(то есть,если пользователь вообще не пользовался сервисом какое-то время(которое указали у жизни refresh токена),нужно именно не переобновлять страницы и тд,чтобы не шел запрос на /refresh(иначе refresh токен будет переобновляться с каждым запросом,нужно,чтобы refresh токен истек до запроса на /refresh),то его refresh токен истечет и его выкинет с аккаунта после обновления страницы,но если пользователь будет использовать в данном случае,например,функцию authMiddleware,то его access токен и refresh токен будут заново перезаписаны и таймер на время жизни refresh токена будет обновлен и заново запущен,поэтому его не будет выкидывать из аккаунта) 

import express from 'express'; // импортируем express(express типа для node js express,в данном случае импортируем это вручную,потому что автоматически не импортируется)

import bcrypt from 'bcrypt';

import cors from 'cors'; // импортируем cors,чтобы можно было отправлять запросы на сервер из браузера(в данном случае импортируем это вручную,потому что автоматически не импортируется)

import dotenv from 'dotenv';  // импортируем dotenv(в данном случае импортируем это вручную,потому что автоматически не импортируется)
import db from './db.js';
import cookieParser from 'cookie-parser'; // импортируем cookieParser для использования cookie
import errorMiddleware from './middlewares/errorMiddleware.js';
import router from './router/router.js';
import models from './models/models.js';
import fileUpload from 'express-fileupload';

dotenv.config(); // используем config() у dotenv,чтобы работал dotenv и можно было использовать переменные окружения

const PORT = process.env.PORT || 5000; // указываем переменную PORT и даем ей значение как у переменной PORT из файла .env,если такой переменной нет,то указываем значение 5000

const app = express(); // создаем экземпляр нашего приложения с помощью express()

// подключать этот fileUpload нужно в начале всех подключений use,или хотя бы выше,чем router,иначе не работает
app.use(fileUpload({})); // регистрируем модуль fileUpload с помощью use(),чтобы он работал,передаем в fileUpload() объект,используем fileUpload для работы с загрузкой файлов
 
app.use(express.static('static')); // делаем возможность отдавать изображение,то есть показывать изображение из папки static в браузере,когда,например, используем картинку,чтобы в src картинки можно было вставить путь до этой картинки на нашем node js сервере,и она показывалась

app.use(express.static('checkStatic')); // делаем возможность отдавать изображение из нашей папки для тестовых изображений(то есть когда пользователь(админ) только выбирает картинки для товара в форме создания товара,но еще их не сохранил для товара,чтобы потом можно было нормально работать с загрузкой этих картинок,потом будем удалять файлы из этой папки checkStatic,при запуске страницы,чтобы если вдруг админ выбрал картинку,она уже загрузилась в эту папку,но потом админ не сохранил этот товар,а обновил страницу,то чтобы он заново смог загрузить эту картинку,иначе выдавалась бы ошибка,что такой файл уже существует) то есть показывать изображение из папки static в браузере,когда,например, используем картинку,чтобы в src картинки можно было вставить путь до этой картинки на нашем node js сервере,и она показывалась

app.use(cookieParser()); // подключаем cookieParser,чтобы работали cookie

// подключаем cors,чтобы взаимодействовать с сервером(отправлять запросы) через браузер,указываем,с каким доменом нужно этому серверу обмениваться куками(cookies),для этого передаем объект в cors(),указываем поле credentials true(разрешаем использовать cookies) и указываем в origin url нашего фронтенда(в данном случае это http://localhost:3000),указываем этот url через переменную окружения CLIENT_URL(мы вынесли туда этот url)
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(express.json()); // подключаем express.json(),чтобы наш сервер мог парсить json формат данных,то есть обмениваться с браузером json форматом данных

app.use('/api',router); // подключаем роутер к нашему серверу,первым параметром указываем url по которому будет отрабатывать этот роутер,а вторым параметром указываем сам роутер 

app.use(errorMiddleware); // подключаем наш middleware для обработки ошибок,middleware для обработки ошибок нужно подключать в самом конце всех подключений use()

// делаем эту функцию start асинхронной,так как все операции с базой данных являются асинхронными
const start = async () => {

    // оборачиваем в try catch,чтобы отлавливать ошибки
    try{

        await db.authenticate(); // с помощью функции authenticate() у db(объекта,который мы импортировали на основе класса sequelize для работы с базой данных postgreSql) подключаемся к базе данных postgreSql

        await db.sync(); // используем функцию sync(),чтобы эта функция сверяла состояние базы данных со схемой данных которую мы опишем

        app.listen(PORT,() => console.log(`Server started on PORT = ${PORT}`)); // запускаем сервер,говоря ему прослушивать порт 5000(указываем первым параметром у listen() нашу переменную PORT) с помощью listen(),и вторым параметром указываем функцию,которая выполнится при успешном запуске сервера


        // это делаем 1 раз,чтобы создать объекты в таблицах базы данных PostgreSql и потом их использовать,указываем categoryId в соответствии с нужными категориями,в categoryId указываем id объекта из таблицы category с нужной нам категорией,так мы будем знать,какие товары с какой категорией(с полем typeId для типов мужской или женской одежды также),и потом будем фильтровать объекты товаров по полю categoryId со значением определенного id категории(со значением id объекта из таблицы Category,так мы будем знать,что это за категория),чтобы удалить запись из таблицы в pgAdmin,надо ее всю выделить,нажать на кнопку корзины и потом на кнопку save changes

        // await models.Category.create({category:"Long Sleeves"});
        // await models.Category.create({category:"Joggers"});
        // await models.Category.create({category:"T-Shirts"});
        // await models.Category.create({category:"Shorts"});

        // await models.Type.create({type:"Men"});
        // await models.Type.create({type:"Women"});


        // await models.Product.create({name:"Raven Hoodie With Black colored Design",descText:"100% Bio-washed Cotton – makes the fabric extra soft & silky. Flexible ribbed crew neck. Precisely stitched with no pilling & no fading. Provide  all-time comfort. Anytime, anywhere. Infinite range of matte-finish HD prints.",price:12,priceDiscount:10,amount:1,totalPrice:10,sizes:["L","XL"],rating:0,mainImage:"Product Image.jpg",descImages:["Product Image.jpg","Product Image.jpg"],categoryId:1,typeId:2});

        // await models.Product.create({name:"White T-shirt",descText:"100% Bio-washed Cotton – makes the fabric extra soft & silky. Flexible ribbed crew neck. Precisely stitched with no pilling & no fading. Provide  all-time comfort. Anytime, anywhere. Infinite range of matte-finish HD prints.",price:8,amount:1,totalPrice:8,sizes:["S","M"],rating:0,mainImage:"Rectangle 25.png",descImages:["Product Image.jpg","Product Image.jpg"],categoryId:3,typeId:2});

        // await models.Product.create({name:"Black Shorts",descText:"100% Bio-washed Cotton – makes the fabric extra soft & silky. Flexible ribbed crew neck. Precisely stitched with no pilling & no fading. Provide  all-time comfort. Anytime, anywhere. Infinite range of matte-finish HD prints.",price:45,priceDiscount:37,amount:1,totalPrice:37,sizes:["S","M","L"],rating:0,mainImage:"Rectangle 25 (1).png",descImages:["Product Image.jpg","Product Image.jpg"],categoryId:4,typeId:2});

        // await models.Product.create({name:"Dark Joggers",descText:"100% Bio-washed Cotton – makes the fabric extra soft & silky. Flexible ribbed crew neck. Precisely stitched with no pilling & no fading. Provide  all-time comfort. Anytime, anywhere. Infinite range of matte-finish HD prints.",price:110,priceDiscount:95.99,amount:1,totalPrice:95.99,sizes:["S","M","L","XL"],rating:0,mainImage:"Rectangle 22.png",descImages:["Product Image.jpg","Product Image.jpg"],categoryId:2,typeId:1});

        // await models.Product.create({name:"Dark Green Sweatshirt",descText:"100% Bio-washed Cotton – makes the fabric extra soft & silky. Flexible ribbed crew neck. Precisely stitched with no pilling & no fading. Provide  all-time comfort. Anytime, anywhere. Infinite range of matte-finish HD prints.",price:127,amount:1,totalPrice:127,sizes:["M","L","XL"],rating:0,mainImage:"Rectangle 25 (2).png",descImages:["Product Image.jpg","Product Image.jpg"],categoryId:1,typeId:1});

        // это делаем один раз для создания ролей в базе данных у таблицы Role,потом этот код закомментируем
        // await models.Role.create({role:"USER"});
        // await models.Role.create({role:"ADMIN"});

        // создаем объект пользователя в сущности users(пользователи) в базе данных 1 раз с ролью ADMIN,чтобы там он просто был и потом можно было только входить в аккаунт этого админа,после этого код закомментировали
        // const hashPass = await bcrypt.hash('adminEuphoria',3); // хешируем пароль в данном случае для админа("adminEuphoria") с помощью функции hash() у bcrypt,первым параметром передаем пароль,а вторым - соль,степень хеширования(чем больше - тем лучше захешируется,но не нужно слишком большое число,иначе будет долго хешироваться пароль)

        // const adminRole = await models.Role.findOne({where:{role:"ADMIN"}}); // получаем роль из базы данных со значением ADMIN и помещаем ее в переменную adminRole,изменяем значение role на ADMIN,чтобы зарегестрировать роль администратора

        // const adminCreated = await models.User.create({email:"adminEuphoria@gmail.com",password:hashPass,userName:'Admin',roleId:adminRole.id}); // создаем объект с полями email и password в базе данных и помещаем этот объект в переменную adminCreated,в поле password помещаем значение из переменной hashPass,то есть уже захешированный пароль,и указываем в объекте еще поле userName,в поле roleId указываем наш adminRole.id(id объекта роли,которую мы получили из базы данных выше для админа),так как мы получили объект из базы данных,а нам надо из него достать id),то есть таким образом указываем пользователю роль "ADMIN",но можно было и просто сразу указать в roleId цифру 2,так как сделали так,что в базе данных у объекта роли админа id 2)

        // создаем объект в базе данных в таблице AdminFields,в create указываем объект с полем email и значением почты в виде строки,создаем этот объект один раз,а потом этот код закомментируем,чтобы каждый раз этот объект не создавался,а только один раз,создаем этот объект,чтобы потом на фронтенде брать эту почту из базы данных и чтобы потом админ мог ее изменять
        // await models.AdminFields.create({email:'supporteuphoria@gmail.com'});


    }catch(e){

        console.log(e);

    }

}
 
start(); // вызываем нашу функцию start(),чтобы запустить сервер