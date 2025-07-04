
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, ICatalogInitialState, IUser } from "../types/types";

// создаем объект состояния для этого слайса(редьюсера),указываем ему тип на основе нашего интерфейса ICatalogInitialState
const initialState:ICatalogInitialState = {

    catalogCategory:'' // указываем поле catalogCategory со значением пустой строки по дефолту,делаем это,чтобы на странице Home.tsx пользователь мог выбрать категорию товаров каталога и сразу перейти на страницу каталога,где будут показаны товары уже с этой выбранной категорией

}

// создаем и экспортируем slice(то есть редьюсер)
export const catalogSlice = createSlice({

    name: 'catalogSlice', // указываем название этого slice

    initialState, // указываем дефолтное состояние слайса(можно было написать initialState:initialState,но так как названия поля и значения совпадают,то можно записать просто initialState)

    // создаем здесь actions,которые потом смогут изменять состояние redux toolkit(то есть состояние этого слайса(редьюсера))
    reducers:{

        // в параметре функции можно указать состояние(state) и action payload(данные,которые будем передавать этому action при вызове его в другом файле),указываем тип action payload(второму параметру этого action) PayloadAction и указываем в generic какой тип данных будем передавать потом при вызове этого action,в данном случае в payload передаем объект response(ответ от сервера) с типом на основе нашего интерфейса AuthResponse,который пришел от сервера
        setCategoryCatalog:(state,action:PayloadAction<string>)=>{

            state.catalogCategory = action.payload; // изменяем поле состояния catalogCategory у этого слайса(редьюсера) на action.payload(данные,которые мы передали этому action при его вызове в другом файле)
 
        }

    }

})