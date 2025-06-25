
// экспортируем класс UserDto
export default class UserDto{

    // указываем,какие поля есть у этого класса
    id;
    email;
    userName;
    role;

    constructor(model){

        this.id = model.id;  // изменяем переменную id этого класса на model.id

        this.email = model.email; // изменяем переменную email этого класса на поле email у model 

        this.userName = model.userName;

        this.role = model.role;  // изменяем переменную role этого класса на поле role у model(в этом поле будет значение поля role у объекта роли со значением роли пользователя в базе данных)

    }

}