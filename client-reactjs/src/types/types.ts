
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
    rating:number,
    mainImage:string,  // указываем это поле для главной картинки товара
    descImages:string[] // указываем это поле для массива названий картинок с типом string,это будут дополнительные картинки товара для страницы о товаре(ProductItemPage)

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