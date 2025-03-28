import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { api } from '../api';
import { T_Activity, T_ActivitiesListResponse } from '../utils/types';
import { RootState } from '../store'; // Импортируйте RootState из вашего store
import { useSelector } from 'react-redux';
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import { saveSelfEmployed } from './selfEmployedSlice';



interface T_ActivitiesSlice {
    activities: T_Activity[];
    selectedActivity: null | T_Activity
    title?: string;
    new_activity: boolean;
}

const initialState: T_ActivitiesSlice = {
    activities: [],
    title: '',
    selectedActivity: null,
    new_activity: false
};



export const fetchActivities = createAsyncThunk<T_Activity[], void, { state: RootState }>(
    'fetch_activities',
    async function (_, thunkAPI) {
        const state = thunkAPI.getState();
        console.log("Current state:", state); 

        try {
            const response = await api.activities.activitiesList({
                title: state.activities.title,
            }) as  AxiosResponse<T_ActivitiesListResponse>;

            


            thunkAPI.dispatch(saveSelfEmployed({
                self_employed_id: response.data.self_employed_id,
                activity_count: response.data.activity_count
            }))

            console.log("Response data:", response.data); 
            return response.data.activities;  
        } catch (error) {
            console.error("Error in fetchActivities:", error); 
            return thunkAPI.rejectWithValue(error);
        }
    }
);



export const fetchActivity = createAsyncThunk<T_Activity, string, AsyncThunkConfig>(
    "fetch_activity",
    async (id, thunkAPI) => {
        try {
            const response: AxiosResponse<T_Activity | void> = await api.activities.activitiesRead(id);
            return response.data as T_Activity;  
        } catch (error) {
            console.error('Error fetching activity:', error);
            return thunkAPI.rejectWithValue("Activity not found");
        }
    }
)


export const AddToSelfEmployed = createAsyncThunk<void, string, AsyncThunkConfig>(
    "activities/add_activity_to_self-employed",
    async function(id) {
        await api.activities.activitiesAddToSelfEmployedCreate(id)
    }
)
export const deleteActivity = createAsyncThunk<void, string, AsyncThunkConfig>(
    "activities/delete",
    async function(id) {
        await api.activities.activitiesDeleteDelete(id)
    }
)
export const EditActivity = createAsyncThunk<void, { id: string, data: { title: string, description: string, category: string, pic?: File } }, AsyncThunkConfig>(
    "activities/update",
    async function({ id, data }) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      if (data.pic) {
        formData.append('pic', data.pic);
      }
  
      await api.activities.activitiesUpdateUpdate(id, formData);
    }
  );

  export const AddActivity = createAsyncThunk<void, { data: { title: string, description: string, category: string, pic?: File } }, AsyncThunkConfig>(
    "activities/add",
    async function({ data }) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      if (data.pic) {
        formData.append('pic', data.pic);
      }
  
      await api.activities.activitiesCreateCreate(formData); 
    }
  );



const activitiesSlice = createSlice({
    name: 'activities',
    initialState,
    reducers: {
        setTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
        },
        setNewActivity(state, action: PayloadAction<boolean>) {
            state.new_activity = action.payload;
        },
        clearTitle(state) {
            state.title = '';
        },
        clearActivity(state){
            state.selectedActivity=null;
        },
        clearNewActivity(state){
            state.new_activity=false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchActivities.fulfilled, (state:T_ActivitiesSlice, action: PayloadAction<T_Activity[]>) => {
            state.activities = action.payload
        });
        builder.addCase(fetchActivity.fulfilled, (state:T_ActivitiesSlice, action: PayloadAction<T_Activity>) => {
            state.selectedActivity = action.payload
        });
    }
});

export const useTitle = () => useSelector((state: RootState) => state.activities.title);
export const useActivities= () => useSelector((state: RootState) => state.activities.activities);
export const useActivity= () => useSelector((state: RootState) => state.activities.selectedActivity);

export const {
    setTitle,
    clearTitle,
    setNewActivity,
    clearActivity,
    clearNewActivity,
} = activitiesSlice.actions;

export default activitiesSlice.reducer;
