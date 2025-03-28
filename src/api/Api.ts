/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SelfEmployed {
  /** ID */
  id?: number;
  /**
   * User username
   * @minLength 1
   */
  user_username?: string;
  /**
   * ФИО
   * @minLength 1
   * @maxLength 100
   */
  fio?: string;
  /**
   * ИНН
   * @maxLength 12
   */
  inn?: string | null;
  /**
   * Дата создания
   * @format date-time
   */
  created_date?: string;
  /**
   * Дата изменения
   * @format date-time
   */
  modification_date?: string;
  /**
   * Дата завершения
   * @format date-time
   */
  completion_date?: string | null;
  /**
   * Moderator username
   * @minLength 1
   */
  moderator_username?: string;
  /** Статус */
  status?: "draft" | "deleted" | "formed" | "completed" | "rejected";
}

export interface Activities {
  /** ID */
  id?: number;
  /**
   * Название
   * @minLength 1
   * @maxLength 100
   */
  title: string;
  /**
   * Описание
   * @minLength 1
   */
  description: string;
  /**
   * URL изображения
   * @format uri
   * @maxLength 200
   */
  img_url?: string;
  /**
   * Категория
   * @minLength 1
   * @maxLength 100
   */
  category: string;
  /** Статус */
  status?: "active" | "deleted";
}

export interface SelfEmployedActivities {
  /** ID */
  id?: number;
  self_employed?: SelfEmployed;
  activities?: Activities;
  /** Главная деятельность */
  importance?: boolean;
  /** Деятельность */
  activity: number;
}

export interface UserLogin {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface UserRegister {
  /** ID */
  id?: number;
  /**
   * Имя
   * @maxLength 150
   */
  first_name?: string;
  /**
   * Фамилия
   * @maxLength 150
   */
  last_name?: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
}

export interface User {
  /** ID */
  id?: number;
  /**
   * Адрес электронной почты
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Имя
   * @maxLength 150
   */
  first_name?: string;
  /**
   * Фамилия
   * @maxLength 150
   */
  last_name?: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";
import { getCsrfToken } from "../utils/token";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
    // Добавляем интерцептор для установки заголовков
    this.instance.interceptors.request.use(
      (config) => {
        // Добавляем CSRF токен в заголовки
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          config.headers = {
            ...config.headers,
            'X-CSRFToken': csrfToken,  // Добавляем CSRF токен
          };
        }

        
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  activities = {
    /**
     * No description
     *
     * @tags activities
     * @name ActivitiesList
     * @request GET:/activities/
     * @secure
     */
    activitiesList: (
      query?: {
        /** Фильтр по title */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/activities/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Создает новую деятельность и загружает изображение в MinIO.
     *
     * @tags activities
     * @name ActivitiesCreateCreate
     * @request POST:/activities/create/
     * @secure
     */
    activitiesCreateCreate: (
      data: {
        /** Название деятельности */
        title: string;
        /** Описание деятельности */
        description: string;
        /** Категория деятельности */
        category: string;
        /**
         * Изображение для деятельности
         * @format binary
         */
        pic?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Название деятельности */
          title: string;
          /** Описание деятельности */
          description: string;
          /** Категория деятельности */
          category: string;
          /**
           * Изображение для деятельности
           * @format binary
           */
          pic?: File;
        },
        any
      >({
        path: `/activities/create/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Получает активность по ID. Если активность не найдена — возвращает 404.
     *
     * @tags activities
     * @name ActivitiesRead
     * @request GET:/activities/{activity_id}/
     * @secure
     */
    activitiesRead: (activityId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/activities/${activityId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags activities
     * @name ActivitiesAddToSelfEmployedCreate
     * @request POST:/activities/{activity_id}/add_to_self_employed/
     * @secure
     */
    activitiesAddToSelfEmployedCreate: (activityId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/activities/${activityId}/add_to_self_employed/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Удаляет активность по ID, устанавливая статус 5 (удален). Если активность не найдена — возвращает 404.
     *
     * @tags activities
     * @name ActivitiesDeleteDelete
     * @request DELETE:/activities/{activity_id}/delete/
     * @secure
     */
    activitiesDeleteDelete: (activityId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/activities/${activityId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновляет данные активности по ID. Если активность не найдена — возвращает 404.
     *
     * @tags activities
     * @name ActivitiesImageCreate
     * @request POST:/activities/{activity_id}/image/
     * @secure
     */
    activitiesImageCreate: (
      activityId: string,
      data: {
        /**
         * Изображение для деятельности
         * @format binary
         */
        pic: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Изображение для деятельности
           * @format binary
           */
          pic: File;
        },
        any
      >({
        path: `/activities/${activityId}/image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags activities
     * @name ActivitiesUpdateUpdate
     * @request PUT:/activities/{activity_id}/update/
     * @secure
     */
    activitiesUpdateUpdate: (
      activityId: string,
      data: {
        /** Название деятельности */
        title: string;
        /** Описание деятельности */
        description: string;
        /** Категория деятельности */
        category: string;
        /**
         * Изображение для деятельности
         * @format binary
         */
        pic?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Название деятельности */
          title: string;
          /** Описание деятельности */
          description: string;
          /** Категория деятельности */
          category: string;
          /**
           * Изображение для деятельности
           * @format binary
           */
          pic?: File;
        },
        any
      >({
        path: `/activities/${activityId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  selfEmployedActivities = {
    /**
     * No description
     *
     * @tags self-employed-activities
     * @name SelfEmployedActivitiesActivityUpdateUpdate
     * @request PUT:/self-employed-activities/{s_e_id}/activity/{a_id}/update
     * @secure
     */
    selfEmployedActivitiesActivityUpdateUpdate: (
      sEId: string,
      aId: string,
      data: SelfEmployedActivities,
      params: RequestParams = {},
    ) =>
      this.request<SelfEmployedActivities, any>({
        path: `/self-employed-activities/${sEId}/activity/${aId}/update`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags self-employed-activities
     * @name SelfEmployedActivitiesDeleteDelete
     * @request DELETE:/self-employed-activities/{s_e_id}/delete/{a_id}
     * @secure
     */
    selfEmployedActivitiesDeleteDelete: (sEId: string, aId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/self-employed-activities/${sEId}/delete/${aId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  selfEmployed = {
    /**
     * No description
     *
     * @tags self-employed
     * @name SelfEmployedList
     * @request GET:/self-employed/
     * @secure
     */
    selfEmployedList: (
      query?: {
        /** Статус */
        status?: string;
        /** Начальная дата */
        start_date?: string;
        /** Конечная дата */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/self-employed/`,
        method: "GET",
        query: query,
        headers: params.headers,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags self-employed
     * @name SelfEmployedRead
     * @request GET:/self-employed/{self_employed_id}/
     * @secure
     */
    selfEmployedRead: (selfEmployedId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/self-employed/${selfEmployedId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags self-employed
     * @name SelfEmployedDeleteDelete
     * @request DELETE:/self-employed/{self_employed_id}/delete/
     * @secure
     */
    selfEmployedDeleteDelete: (selfEmployedId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/self-employed/${selfEmployedId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags self-employed
     * @name SelfEmployedUpdateUpdate
     * @request PUT:/self-employed/{self_employed_id}/update/
     * @secure
     */
    selfEmployedUpdateUpdate: (selfEmployedId: string, data: SelfEmployed, params: RequestParams = {}) =>
      this.request<SelfEmployed, any>({
        path: `/self-employed/${selfEmployedId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags self-employed
     * @name SelfEmployedUpdateByCreatorUpdate
     * @request PUT:/self-employed/{self_employed_id}/update_by_creator/
     * @secure
     */
    selfEmployedUpdateByCreatorUpdate: (selfEmployedId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/self-employed/${selfEmployedId}/update_by_creator/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags self-employed
     * @name SelfEmployedUpdateByModeratorUpdate
     * @request PUT:/self-employed/{self_employed_id}/update_by_moderator/
     * @secure
     */
    selfEmployedUpdateByModeratorUpdate: (
      selfEmployedId: string,
      data: {
        status: "completed" | "rejected" | "draft" | "formed";
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          status: "completed" | "rejected" | "draft" | "formed";
        },
        any
      >({
        path: `/self-employed/${selfEmployedId}/update_by_moderator/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserLoginCreate
     * @request POST:/user/login/
     * @secure
     */
    userLoginCreate: (data: UserLogin, params: RequestParams = {}) =>
      this.request<UserLogin, any>({
        path: `/user/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserLogoutCreate
     * @request POST:/user/logout/
     * @secure
     */
    userLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserRegisterCreate
     * @request POST:/user/register/
     * @secure
     */
    userRegisterCreate: (data: UserRegister, params: RequestParams = {}) =>
      this.request<UserRegister, any>({
        path: `/user/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUpdateUpdate
     * @request PUT:/user/{user_id}/update/
     * @secure
     */
    userUpdateUpdate: (userId: string, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/${userId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
