export interface T_SelfEmployed {
    self_employed:{
      id: number;
    user_username: string;
    fio: string;
    inn: string | null;
    created_date: string;
    modification_date: string;
    completion_date: string | null;
    moderator_username: string;
    status: "draft" | "deleted" | "formed" | "completed" | "rejected";
    }
    activities: T_Activity_M[]
  }




  export interface T_Activity_M {
    id: number;
    title: string;
    img_url: string;
    importance:boolean
  }
  

  export type T_SelfEmployedFilters = {
    start_date: string
    end_date: string
    status: string
    username: string
}
  
  export type T_Activities = {

    id: number;
    title: string;
    description: string;
    img_url: string;
    category: string;
    status: "active" | "deleted";
  }


  export interface T_Activity {
    id: number;
    title: string;
    status: string;
    img_url: string;
    description: string;
    category: string;
  }
  




  export type T_ActivitiesListResponse = {
    activities: T_Activity[],
    self_employed_id: number,
    activity_count: number
}






export type T_LoginCredentials = {
  username: string
  password: string
}

// Типы данных для обновления
export interface T_UpdateUserData {
  username?: string;
  first_name?: string;
  last_name?: string;
  password?: string;  // если вы обновляете пароль
}




export type T_RegisterCredentials = {
  first_name: string
  last_name: string
  username: string
  password: string
}


export type T_User = {
  id: number
  first_name: string
  last_name: string
  password: string
  is_authenticated: boolean
  validation_error: boolean
  validation_success: boolean
  checked: boolean
}


