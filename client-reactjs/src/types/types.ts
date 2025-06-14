
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