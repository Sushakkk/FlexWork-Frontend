// store.ts
import { combineReducers, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"
import userReducer from "./slices/userSlice.ts"
import activitiesReducer from './slices/activitiesSlice';
import selfEmployedReducer from './slices/selfEmployedSlice'; 
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['id', "username", "email"]
}

export const store = configureStore({
    reducer: {
        user: persistReducer(persistConfig, userReducer),

        activities: activitiesReducer,
        selfEmployed: selfEmployedReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunkDispatch = ThunkDispatch<RootState, never, never>

export const persister = persistStore(store)

export const useAppDispatch = () => useDispatch<AppDispatch>(); 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


