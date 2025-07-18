import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { catalogSlice } from "./catalogSlice";
import { cartSlice } from "./cartSlice";

// если несколько редьюсеров на сайте,то можно их объединить с помощью combineReducers и передать потом в store
const reducers = combineReducers({

    userSlice: userSlice.reducer, // указываем слайс(редьюсер) для авторизации пользователя,указываем через точку редьюсер из нашего слайса,так как не эспортировали его отдельно,но и так можно

    catalogSlice: catalogSlice.reducer, // указываем слайс(редьюсер) для категории каталога,указываем через точку редьюсер из нашего слайса,так как не эспортировали его отдельно,но и так можно

    cartSlice: cartSlice.reducer // указываем еще один слайс(редьюсер) для отслеживания нажатия кнопки на обновление данных товаров в корзине

})

// создаем и экспортируем store
export const store = configureStore({
    
    reducer:reducers // указываем в reducer наш редьюсер(в данном случае мы объединили редьюсеры с помощью combineReducers и поместили в переменную reducers,их и указываем)

})

export type RootState = ReturnType<typeof store.getState>; // экспортируем тип,который берем у нашего состояния в store с помощью getState,это будет тип для нашего состояния store,в котором будут все наши slice(редьюсеры)