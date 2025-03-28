import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { api } from '../api';
import { RootState } from '../store';
import { T_SelfEmployed, T_SelfEmployedFilters } from '../utils/types';
import { NEXT_YEAR, PREV_YEAR } from '../utils/consts';
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import { useSelector } from 'react-redux';

interface T_SelfEmployedSlice {
    self_employed_id: number | null;
    activity_count: number;
    detail_self_employed: T_SelfEmployed | null;
    self_employed: T_SelfEmployed[];
    filters: T_SelfEmployedFilters;
}

const initialState: T_SelfEmployedSlice = {
    self_employed_id: null,
    detail_self_employed: null,
    activity_count: 0,
    self_employed: [],
    filters: {
        status: 'draft',
        start_date: '',
        end_date:'',
        username:''
    },
};

export const fetchSelfEmployed = createAsyncThunk<T_SelfEmployed, string>(
  'self-employed/id',
  async (self_employed_id) => {
      const response = await api.selfEmployed.selfEmployedRead(self_employed_id) ;
      return response.data;
  }
);

export const fetchAllSelfEmployed = createAsyncThunk<T_SelfEmployed[], void, { state: RootState }>(
    "self-employed/fetchAll",
    async (_, thunkAPI) => {
        const { filters } = thunkAPI.getState().selfEmployed; // Извлекаем фильтры из состояния

        console.log('get all', filters  );
        const response = await api.selfEmployed.selfEmployedList({
            status: filters.status,
            start_date: filters.start_date,
            end_date: filters.end_date
        })

        
        return response.data.self_employed ;
    }
);

export const updateSelfEmployed = createAsyncThunk<void, { id: string, fio: string }, AsyncThunkConfig>(
    "self-employed/update_self-employed",
    async ({ id, fio }) => {
      console.log('self_employed_id in updateSelfEmployed', id);
      const response = await api.selfEmployed.selfEmployedUpdateUpdate(id, {
        fio: fio,
      });
      console.log('result update', response.data);
    }
  );






export const deleteSelfEmployed = createAsyncThunk<void, string, AsyncThunkConfig>(
    "self-employed/delete_draft",
    async (id) => {
        await api.selfEmployed.selfEmployedDeleteDelete(id); 
    
    }
  );
  
  
export const formSelfEmployed = createAsyncThunk<void, string, AsyncThunkConfig>(
    "self-employed/delete_draft",
    async (id) => {
         await api.selfEmployed.selfEmployedUpdateByCreatorUpdate(id); 
    }
  );
export const updateByModeratorHandler= createAsyncThunk<void,  { id: string, status: string }, AsyncThunkConfig>(
    "self-employed/modetator",
    async ({id, status}) => {
         await api.selfEmployed.selfEmployedUpdateByModeratorUpdate(id, {
            status: status,
          }); 
    }
  );
  
  
  export const deleteActivityFromSelfEmployed = createAsyncThunk<
  void, // возвращаемый тип
  { self_employed_id: string, activity_id: string }, // тип параметров
  AsyncThunkConfig
>(
  'self-employed/delete_activity',
  async ({ self_employed_id, activity_id }) => {
  

    const response = await api.selfEmployedActivities.selfEmployedActivitiesDeleteDelete(
        self_employed_id, 
        activity_id
      );
      

    
  }
);



export const updateImportance = createAsyncThunk< 
void, // возвращаемый тип
{ self_employed_id: string, activity_id: string, importance: boolean }, // тип параметров
AsyncThunkConfig
>(
'self-employed/update_importance', // исправленный тип действия
async ({ self_employed_id, activity_id, importance }) => {
  
  const data = { importance };

  const response = await api.selfEmployedActivities.selfEmployedActivitiesActivityUpdateUpdate(
    self_employed_id, 
    activity_id, 
    data, // передаем объект данных
  );

}
);


  
  




const SelfEmployedSlice = createSlice({
    name: 'self_employed',
    initialState,
    reducers: {
        saveSelfEmployed: (state, action: PayloadAction<{ self_employed_id: number, activity_count: number }>) => {
            state.self_employed_id = action.payload.self_employed_id;
            state.activity_count = action.payload.activity_count;
        },
        updateFilters: (state, action: PayloadAction<T_SelfEmployedFilters>) => {
            state.filters = action.payload; // Обновляем фильтры в состоянии
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSelfEmployed.fulfilled, (state, action: PayloadAction<T_SelfEmployed>) => {
            state.detail_self_employed = action.payload;
        });
        builder.addCase(fetchAllSelfEmployed.fulfilled, (state, action: PayloadAction<T_SelfEmployed[]>) => {
            state.self_employed = action.payload;
        });
    },
});


export const useSelfEmployedID= () => useSelector((state: RootState) => state.selfEmployed.self_employed_id);
export const useActivityCount= () => useSelector((state: RootState) => state.selfEmployed.activity_count);
export const { saveSelfEmployed, updateFilters } = SelfEmployedSlice.actions;

export default SelfEmployedSlice.reducer;
