import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {T_LoginCredentials, T_RegisterCredentials, T_User} from "src/utils/types.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";
import { api } from "../api";
import { useSelector } from 'react-redux';
import { RootState } from "../store";
import { T_UpdateUserData } from "../utils/types";





const initialState: T_User = {
	id: -1,
    moderator_id:-1,
    access_token_moderator:"",
    access_token:"",
	first_name: "",
	last_name: "",
    password:"",
	is_authenticated: false,
    validation_error: false,
    validation_success: false,
    checked: false,
    is_staff: false
}

export const handleCheck = createAsyncThunk<T_User, void, { rejectValue: string }>(
    'user/check',
    async () => {
        // const storedUser = localStorage.getItem('user');
        // console.log('user', storedUser);
        
        
        // if (storedUser) {
           
        //     return JSON.parse(storedUser);
        // }
        

        const response = await api.user.userLoginCreate({}) as AxiosResponse<T_User>;
        return response.data;
    }
  );

export const handleLogin = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "login",
    async function({ username, password }: T_LoginCredentials) {


        const response = await api.user.userLoginCreate(
            {
                username,
                password
            },
        ) as AxiosResponse<T_User>;
        

        console.log('user', response.data.user);
        console.log('user staff', response.data.user.is_staff);
        
        

        return response.data;
    }
);

export const handleRegister = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "register",
    async function({username,first_name, last_name,  password}:T_RegisterCredentials) {
        const response = await api.user.userRegisterCreate({
            username,
            first_name,
            last_name,
            password
        }) as AxiosResponse<T_User>

        // localStorage.setItem('user', JSON.stringify(response.data))
        

        return response.data
    }
)

export const handleLogout = createAsyncThunk<void, object, AsyncThunkConfig>(
    "logout",
    async function() {
        await api.user.userLogoutCreate()
        console.log('out');
        
        // localStorage.removeItem('user');
    }
)


export function updateUserInLocalStorage(updatedUserData: T_UpdateUserData) {
    // Получаем данные пользователя из localStorage
    const storedUser = localStorage.getItem('user');

    // Если пользователь есть в localStorage
    if (storedUser) {
        // Парсим данные пользователя
        const user: T_User = JSON.parse(storedUser);

        // Обновляем нужные поля
        user.first_name = updatedUserData.first_name || user.first_name;
        user.last_name = updatedUserData.last_name || user.last_name;
        user.username = updatedUserData.username || user.username;
        user.password = updatedUserData.password || user.password;

        // Перезаписываем данные пользователя в localStorage
        localStorage.setItem('user', JSON.stringify(user));
        console.log('local', localStorage.getItem('user'));
        
    } else {
        console.error("Пользователь не найден в localStorage.");
    }
}


export const handleUpdateProfile = createAsyncThunk<T_User, object, AsyncThunkConfig>(
    "updateProfile",
    async function(userData:T_RegisterCredentials, thunkAPI) {
        const state = thunkAPI.getState()
        const {username, first_name, last_name, password} = userData
        // updateUserInLocalStorage(userData)
        const response = await api.user.userUpdateUpdate(state.user.id, {
            username,
            first_name,
            last_name,
            password
        }) as AxiosResponse<T_User>

        return response.data
    }
)


const userlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
        setValidationError: (state, action) => {
            state.validation_error = action.payload
        },
        setModerator:(state) =>{
            state.moderator_id= state.id
            state.access_token_moderator=state.access_token
        }
	},
    extraReducers: (builder) => {
        builder.addCase(handleLogin.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.id = action.payload.user.id
            state.username = action.payload.user.username
            state.first_name = action.payload.user.first_name
            state.last_name = action.payload.user.last_name
            state.password = action.payload.user.password
            state.is_staff= action.payload.user.is_staff
            state.access_token=action.payload.access_token
            if(action.payload.user.is_staff){
                state.moderator_id=state.id
                state.access_token_moderator= state.access_token
            }
            
        });
        builder.addCase(handleRegister.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.id = action.payload.id
            state.username = action.payload.username
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.password = action.payload.password
         
        });
        builder.addCase(handleLogout.fulfilled, (state:T_User) => {
            state.is_authenticated = false
            state.id = -1
            state.username = ""
            state.first_name = ""
            state.last_name = ""
            state.password = ""
            state.validation_error = false
        });
        builder.addCase(handleCheck.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.is_authenticated = true
            state.id = action.payload.id
            state.username = action.payload.username
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.password = action.payload.password
            state.checked = true
        });
        builder.addCase(handleCheck.rejected, (state:T_User) => {
            state.is_authenticated = false
            state.id = -1
            state.username = ""
            state.first_name = ""
            state.last_name = ""
            state.password = ""
            state.validation_error = false
            state.checked = true
        });
        builder.addCase(handleUpdateProfile.fulfilled, (state:T_User, action: PayloadAction<T_User>) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.password = action.payload.password
            state.validation_error = false
            state.validation_success = true
        });
        builder.addCase(handleUpdateProfile.rejected, (state:T_User) => {
            state.validation_error = true
            state.validation_success = false
        });
    }
})


export const useF= () => useSelector((state: RootState) => state.user.first_name );


export const {setValidationError, setModerator} = userlice.actions

export default userlice.reducer