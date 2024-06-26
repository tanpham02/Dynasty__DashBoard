import qs from 'qs'
import { Key } from 'react'

import { ProductMain, ProductTypes } from '~/models/product'
import { ListDataResponse, ListResponse, SearchParams } from '~/types'
import {
  PRODUCT_CONFIG_TYPE_URL,
  PRODUCT_FROM_THIRD_PARTY_URL,
  PRODUCT_URL,
} from '../apiUrl'
import axiosService from '../axiosService'

export const productService = {
  getProductFromThirdParty: async (
    params: SearchParams,
  ): Promise<ListResponse<ProductMain>> => {
    return axiosService()({
      baseURL: `${PRODUCT_FROM_THIRD_PARTY_URL}`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  getProductPagination: async (
    params: SearchParams,
  ): Promise<ListDataResponse<ProductMain>> => {
    return axiosService()({
      baseURL: `${PRODUCT_URL}/search`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  getProductDetail: async (id: string): Promise<ProductMain> => {
    return axiosService()({
      baseURL: `${PRODUCT_URL}/${id}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  createProduct: async (products: FormData): Promise<ProductMain> => {
    return axiosService()({
      baseURL: PRODUCT_URL,
      method: 'POST',
      data: products,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  updateProduct: async (
    products?: FormData,
    id?: string,
  ): Promise<ProductMain> => {
    return axiosService()({
      baseURL: `${PRODUCT_URL}/${id}`,
      method: 'PUT',
      data: products,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  deleteProduct: async (ids?: Key[]) => {
    return axiosService()({
      url: `${PRODUCT_URL}`,
      method: 'DELETE',
      params: {
        ids: ids,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error
      })
  },
  changeProductTypeInZaloMiniApp: async (
    ids: number[],
    productTypes: ProductTypes[],
  ) => {
    return axiosService()({
      url: `${PRODUCT_CONFIG_TYPE_URL}`,
      method: 'PATCH',
      params: {
        nhanhVnIds: ids,
        productTypes: productTypes,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error
      })
  },
}
