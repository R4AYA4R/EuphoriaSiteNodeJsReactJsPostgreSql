

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, ICartInitialState, ICatalogInitialState, IUser } from "../types/types";

// создаем объект состояния для этого слайса(редьюсера),указываем ему тип на основе нашего интерфейса ICartInitialState
const initialState:ICartInitialState = {

    updateProductsCart: false // указываем это поле,с помощью него будем отслеживать,когда обновлять товары в корзине по кнопке обновить корзину

}

// создаем и экспортируем slice(то есть редьюсер)
export const cartSlice = createSlice({

    name: 'cartSlice', // указываем название этого slice

    initialState, // указываем дефолтное состояние слайса(можно было написать initialState:initialState,но так как названия поля и значения совпадают,то можно записать просто initialState)

    // создаем здесь actions,которые потом смогут изменять состояние redux toolkit(то есть состояние этого слайса(редьюсера))
    reducers:{

        // в параметре функции можно указать состояние(state) и action payload(данные,которые будем передавать этому action при вызове его в другом файле),указываем тип action payload(второму параметру этого action) PayloadAction и указываем в generic какой тип данных будем передавать потом при вызове этого action,в данном случае в payload передаем объект response(ответ от сервера) с типом на основе нашего интерфейса AuthResponse,который пришел от сервера
        setUpdateProductsCart:(state,action:PayloadAction<boolean>)=>{

            state.updateProductsCart = action.payload; // изменяем поле состояния updateProductsCart у этого слайса(редьюсера) action.payload(данные,которые мы передали этому action при его вызове в другом файле)
 
        }

    }

})