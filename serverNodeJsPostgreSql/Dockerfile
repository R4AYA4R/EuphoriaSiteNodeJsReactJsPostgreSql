# указываем на каком образе будет строиться наш образ,в данном случае указываем,что наш образ будет на основе образа node из dockerhub
FROM node 

# указываем рабочую директорию для нашего приложения,в которой на самом деле находится наше приложение(наши файлы этого приложения) и здесь через пробел указываем директорию(папку),в которой будут лежать все эти файлы нашего приложения(/app в данном случае), обязательно добавляем рабочую директорию и в нее потом копируем файлы,иначе не запускаются тесты командой npm run test,так как если наши файлы тестов находятся в поддиректориях,то докер не может их найти,в данном случае для бэкэнда мы не запускаем тесты командой npm run test(используем это для фронтенда),но здесь лучше тоже указать рабочую директорию
WORKDIR /app

# копируем файлы из нашего проекта в image(образ),то есть в данном случае копируем файл package.json,который сейчас находится у нас в проекте локально на компьютере,в папку /app в образе нашего проекта,чтобы когда сделали новые изменения в коде,и опять надо собрать новый образ,то уже node модули будут браться из кеша,package.json тоже будет из кеша,а новые изменения в коде будут добавлены последней командой COPY . /app 
COPY package.json /app

# устанавливаем node модули на основе инструкций в нашем файле package.json(то есть все зависимости и библотеки,которые указаны в файле package.json),разница между командами RUN и CMD такова,что RUN запускается именно тогда,когда мы собираем образ(то есть будет выполнена один раз при сборке образа,делаем так,чтобы каждый раз при запуске не скачивались node модули(зависимости) с помощью команды npm install),а CMD запускается каждый раз при запуске этого образа(то есть в данном случае чтобы запускать наше приложение)
RUN npm install

# копируем все файлы из текущей локальной директории в папку /app у нашего образа,указываем,что будем брать все файлы из текущей директории,в которой сейчас находится Dockerfile,то есть все файлы из корневой папки проекта(бэкэнда в данном случае),еще через пробел указываем,в какое место в этом образе(image) поместить все эти файлы,если мы укажем там тоже точку,то это значит,что мы положим эти файлы в корень(корневую папку) этого образа(image),но в данном случае указываем,что помещаем эти файлы в рабочую директорию(папку) /app
COPY . /app

# указываем команду,которая будет запущена каждый раз при запуске контейнера,в данном случае чтобы запустить наш сервер
CMD [ "node", "index.js" ]