import { PATH_NAME, ROUTER_KEY } from '../constants/router';
import USER_LIST_ICON from '~/assets/svg/customer.svg';
import GEAR_ICON from '~ assets/svg/gear.svg';
import STAFF_ICON from '~ assets/svg/staff.svg';
import CART_ICON from '~/assets/svg/cart-shopping-sidebar.svg';
import PRODUCTS_ICON from '~/assets/svg/product-sidebar.svg';
import MATERIAL_ICON from '~/assets/svg/material-sidebar.svg';
import VOUCHER_ICON from '~/assets/svg/voucher-sidebar.svg';

const routeSideBar = [
  // {
  //   key: ROUTER_KEY.STATISTIC,
  //   path: PATH_NAME.NEW_CUSTOMER_STATISTIC,
  //   title: 'Báo cáo & Thống kê',
  //   menu: [
  //     {
  //       key: ROUTER_KEY.STATISTIC,
  //       path: PATH_NAME.REVENUE_STATISTIC,
  //       title: 'Doanh thu trên Mini App',
  //       icon: CHART_ICON,
  //       child: [],
  //     },
  //     {
  //       key: ROUTER_KEY.STATISTIC,
  //       path: PATH_NAME.NEW_CUSTOMER_STATISTIC,
  //       title: 'Khách hàng mới trên Mini App',
  //       icon: CUSTOMER_ICON,
  //       child: [],
  //     },
  //   ],
  // },
  {
    key: ROUTER_KEY.STAFF_MANAGEMENT,
    path: PATH_NAME.STAFF_MANAGEMENT,
    title: 'Nhân viên',
    menu: [
      {
        key: ROUTER_KEY.STAFF_MANAGEMENT,
        path: PATH_NAME.STAFF_MANAGEMENT,
        title: 'Quản lí nhân viên',
        icon: STAFF_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.CUSTOMER,
    path: PATH_NAME.CUSTOMER_LIST,
    title: 'Khách hàng',
    menu: [
      {
        key: ROUTER_KEY.CUSTOMER,
        path: PATH_NAME.CUSTOMER_LIST,
        title: 'Danh sách khách hàng',
        icon: USER_LIST_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.PRODUCT,
    path: PATH_NAME.PRODUCT_LIST,
    title: 'Sản phẩm',
    menu: [
      {
        key: ROUTER_KEY.PRODUCT,
        path: PATH_NAME.PRODUCT_LIST,
        title: 'Danh sách sản phẩm',
        icon: PRODUCTS_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.ORDER,
    path: PATH_NAME.ORDER,
    title: 'Đơn hàng',
    menu: [
      {
        key: ROUTER_KEY.ORDER,
        path: PATH_NAME.ORDER,
        title: 'Quản lí đơn hàng',
        icon: CART_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.MATERIAL,
    path: PATH_NAME.MATERIAL,
    title: 'Nguyên liệu',
    menu: [
      {
        key: ROUTER_KEY.MATERIAL,
        path: PATH_NAME.MATERIAL,
        title: 'Quản lí nguyên liệu',
        icon: MATERIAL_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.GENERAL_SETTING,
    title: 'Cấu hình',
    icon: GEAR_ICON,
    menu: [
      {
        key: ROUTER_KEY.VOUCHER,
        path: PATH_NAME.VOUCHERS,
        title: 'Mã giảm giá',
        icon: VOUCHER_ICON,
        child: [],
      },
    ],
  },
];

export default routeSideBar;
