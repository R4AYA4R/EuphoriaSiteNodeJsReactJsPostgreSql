
export interface IProduct{
    id:number,
    name:string,
    categoryId:number, // это поле для категории,просто в нашей базе данных мы сделали так,чтобы category и type можны было определять по id
    typeId:number,
    descText:string,
    price:number,
    priceDiscount:number, // указываем это поле для цены со скидкой
    amount:number,
    totalPrice:number,
    sizes:string[], // указываем поле для размеров,это будет массив значений string
    rating:number,
    mainImage:string,  // указываем это поле для главной картинки товара
    descImages:string[] // указываем это поле для массива названий картинок с типом string,это будут дополнительные картинки товара для страницы о товаре(ProductItemPage)

}

// создаем и экспортируем наш тип для объекта товара корзины(IProductCart),указываем,что этот тип IProductCart расширяется(extends) на основе нашего интерфейса(типа) IProduct,то есть в этом типе IProductCart будут все поля,которые есть в типе IProduct и к этим полям будут добавлены поля,которые мы указываем при создании этого типа IProductCart(в данном случае добавляются еще поля usualProductId и userId), в данном случае не указываем,что мы расширяем наш тип IProductCart на основе типа IProduct,так как в объекте товара корзины будем делать поле size не как массив,а просто как строку
export interface IProductCart{

    id:number,
    name:string,
    categoryId:number, // это поле для категории,просто в нашей базе данных мы сделали так,чтобы category и type можны было определять по id
    typeId:number,
    descText:string,
    price:number,
    priceDiscount:number, // указываем это поле для цены со скидкой
    amount:number,
    totalPrice:number,
    rating:number,
    mainImage:string,  // указываем это поле для главной картинки товара
    descImages:string[] // указываем это поле для массива названий картинок с типом string,это будут дополнительные картинки товара для страницы о товаре(ProductItemPage)

    size:string, // указываем поле для размера
    
    usualProductId:number, // указываем это поле,чтобы туда потом указывать значение id обычного товара из каталога,чтобы потом можно было перейти на страницу этого обычного товара из корзины

    userId:number, // указываем это поле,чтобы указать значение id объекта пользователя,чтобы потом показывать в корзине товары только для определенного авторизованно пользователя

}

// создаем тип для data (данных),которые приходят от сервера для пагинации(при пагинации от сервера приходит объект data с полями products(внутри count(количество объектов товаров всего,которые пришли от сервера) и rows(сами объекты товаров,но на конкретной странице пагинации,указываем ему тип на основе нашего интерфейса IProduct и что это массив)),также поле maxPriceAllProducts(максимальная цена товара из всех) и поле allProductsForCount(чтобы указать потом количество товаров для каждой категории и тд),можно указать так объект products с типом полей,а можно этот тип объекта products вынести в отдельный тип,типа отдельный интерфейс и тут его указать этому полю products,но оставили уже так
export interface IProductsCatalogResponse{
    products:{
        count:number,
        rows:IProduct[]
    },
    maxPriceAllProducts:number,
    allProductsForCount:IProduct[]
}

// создаем и экспортируем интерфейс для объекта пользователя,который приходит от сервера
export interface IUser{
    id:number,
    email:string,
    userName:string,
    role:string
}

// создаем и экспортируем интерфейс для объекта состояния редьюсера для пользователя,указываем ему поле user на основе нашего интерфейса IUser,и остальные поля
export interface IUserInitialState{
    user:IUser,
    isAuth:boolean,
    isLoading:boolean
}

// создаем и экспортируем наш интерфейс для AuthResponse
export interface AuthResponse{
    // указываем здесь поля этого интерфейса(типа) для объекта
    accessToken:string,
    refreshToken:string,
    user:IUser // указываем,что поле user - это объект на основе нашего интерфеса IUser(с теми полями, которые описаны в IUser)

}

export interface IComment{
    id:number,
    name:string,
    text:string,
    rating:number,
    createdTime:string,
    productId:number,
    // указываем поле для объекта для ответа от админа на этот комментарий,указываем знак вопроса после названия этого поля,чтобы указать,что это поле необязательное,то есть оно может быть не указано,то есть может быть с типом undefined
    adminReply?:{
        text:string,
        createdTime:string
    }
}

// создаем тип для данных,которые приходят от сервера для пагинации комментариев для товара(при пагинации от сервера приходит объект data с полями массивов объектов комментариев,которые пришли от сервера) 
export interface ICommentResponse{
    allComments:IComment[], // указываем поле для всех комментариев,еще не отфильтрованных для отдельного товара
    allCommentsForProduct:IComment[], // указываем поле для всех комментариев,уже отфильтрованных для отдельного товара

    // указываем поле для всех комментариев для одной страницы пагинации
    commentsForPagination:{
        count:number, // поле count - это количество объектов комментариев всего для этого товара,а не на отдельной странице пагинации
        rows:IComment[] // поле rows - это сами объекты комментариев,но на конкретной странице))
    }
    
}

export interface ICatalogInitialState{
    catalogCategory:string
}

export interface IProductsCartResponse{

    allProductsCartForUser:IProductCart[], // указываем поле для всех товаров корзины,уже отфильтрованных для отдельного авторизованного пользователя

    // указываем поле для всех товаров корзины для одной страницы пагинации(в данном случае в этом поле будет объект с полями count и rows)
    productsCartForPagination:{
        count:number, // поле count - это количество объектов товаров корзины всего для конкретного пользователя,а не на отдельной странице пагинации
        rows:IProductCart[] // поле rows - это сами объекты товаров корзины,но на конкретной странице пагинации))
    } 

}


export interface ICartInitialState{
    updateProductsCart:boolean
}