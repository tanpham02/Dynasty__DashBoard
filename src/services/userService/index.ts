import { Users } from '~/models/user';
import axiosService from '../axiosService';
import { FIND_USER_BY_CRITERIA_URL, USER_URL } from '../apiUrl';
import { ListDataResponse, SearchParams } from '~/types';
import qs from 'qs';

const userService = {
  searchUserByCriteria: async (params: SearchParams): Promise<ListDataResponse<Users>> => {
    return axiosService()({
      url: `${FIND_USER_BY_CRITERIA_URL}`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getUserByUserId: async (id: string): Promise<Users> => {
    return axiosService()({
      baseURL: `${USER_URL}/${id}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  createUser: async (data: FormData): Promise<Users> => {
    return axiosService()({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      baseURL: `${USER_URL}`,
      method: 'POST',
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },

  updateUser: async (data: FormData, userId: string): Promise<Users> => {
    return axiosService()({
      method: 'PATCH',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      baseURL: `${USER_URL}/${userId}`,
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  deleteUser: async (ids: string[]) => {
    return axiosService()({
      baseURL: `${USER_URL}`,
      method: 'DELETE',
      params: {
        ids: ids,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};

export default userService;
