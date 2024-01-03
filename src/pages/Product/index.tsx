import { Button, Chip, Image, Input, Selection, useDisclosure } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import ModalConfirmDelete, { ModalConfirmDeleteState } from '~/components/ModalConfirmDelete';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import { PATH_NAME } from '~/constants/router';
import useDebounce from '~/hooks/useDebounce';
import usePagination from '~/hooks/usePagination';
import { ProductMain } from '~/models/product';
import { productService } from '~/services/productService';
import { getFullImageUrl } from '~/utils/image';
import { formatCurrencyVND } from '~/utils/number';

const ProductListPage = () => {
  const navigate = useNavigate();

  const columns: ColumnType<ProductMain>[] = [
    {
      align: 'center',
      name: 'STT',
      render: (_product: ProductMain, index?: number) => (index || 0) + 1,
    },
    {
      align: 'center',
      name: 'Hình ảnh',
      render: (product: ProductMain) => (
        <Image
          isBlurred
          isZoomed
          src={getFullImageUrl(product?.image)}
          fallbackSrc="https://via.placeholder.com/80x80"
          alt={product?.name}
          className="w-20 h-20 object-contain"
          loading="lazy"
        />
      ),
    },
    {
      align: 'center',
      name: 'Tên',
      render: (product: ProductMain) => <span className="line-clamp-1">{product?.name}</span>,
    },
    {
      align: 'center',
      name: 'Giá bán',
      render: (product: ProductMain) => formatCurrencyVND(product?.price),
    },
    {
      align: 'end',
      name: 'Loại sản phẩm',
      render: (product: ProductMain) => (
        <Chip color="success" variant="flat">
          Mới
        </Chip>
      ),
    },
    {
      align: 'center',
      name: 'Hành động',
      render: (record: ProductMain) => (
        <Box className="space-x-2">
          <ButtonIcon
            title="Chỉnh sửa sản phẩm"
            icon={EditIcon}
            onClick={() => navigate(`${PATH_NAME.PRODUCT}/${record?._id}`)}
          />
          <ButtonIcon
            title="Xóa sản phẩm này"
            icon={DeleteIcon}
            status="danger"
            onClick={() => onDeleteProduct(record)}
          />
        </Box>
      ),
    },
  ];

  const [valueSearch, setValueSearch] = useState<string>('');
  const [productSelectedKeys, setProductSelectedKeys] = useState<Selection>();
  const { isOpen: isOpenModalDelete, onOpenChange: onOpenChangeModalDelete } = useDisclosure();
  const [modalDelete, setModalDelete] = useState<ModalConfirmDeleteState>({});

  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination();

  const { enqueueSnackbar } = useSnackbar();

  const queryText = useDebounce(valueSearch, 700);
  const [valueFilterFromCategory, setValueFilterFromCategory] = useState<string>();

  const onDeleteProduct = (product?: ProductMain) => {
    if (product && Object.keys(product).length > 0)
      setModalDelete({
        id: product?._id,
        desc: `Bạn có chắc muốn xóa sản phẩm ${product?.name} này không?`,
      });
    else
      setModalDelete({
        desc: `Bạn có chắc muốn xóa tất cả sản phẩm đã chọn không?`,
      });
    onOpenChangeModalDelete();
  };

  const {
    data: productList,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
    refetch: refetchProduct,
  } = useQuery(
    [QUERY_KEY.PRODUCTS, pageIndex, pageSize, queryText, valueFilterFromCategory], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      const params = {
        pageIndex: pageIndex,
        pageSize,
        name: queryText,
      };
      return await productService.getProductPagination(params);
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const { isLoading: isLoadDeleteProduct, mutate: deleteProduct } = useMutation({
    mutationKey: [QUERY_KEY.PRODUCTS_DELETE],
    mutationFn: async () => {
      try {
        let productDeleteIDs = [];
        if (productSelectedKeys === 'all') {
          productDeleteIDs =
            productList?.data
              ?.filter((product) => Boolean(product?._id))
              ?.map((product) => product?._id) || [];
        } else {
          productDeleteIDs = [...(productSelectedKeys || [modalDelete?.id] || [])];
        }
        console.log('🚀 ~ file: index.tsx:144 ~ mutationFn: ~ productDeleteIDs:', productDeleteIDs);

        await productService.deleteProduct(productDeleteIDs as string[]);
        await refetchProduct();
      } catch (err) {
        enqueueSnackbar('Xóa sản phẩm không thành công!', {
          variant: 'error',
        });
        console.log('🚀 ~ file: index.tsx:140 ~ mutationFn: ~ err:', err);
      } finally {
        onCloseModalDeleteProduct();
      }
    },
  });

  const onCloseModalDeleteProduct = () => {
    setProductSelectedKeys(new Set());
    onOpenChangeModalDelete();
  };

  return (
    <Box>
      <CustomBreadcrumb
        pageName="Danh sách sản phẩm"
        routes={[
          {
            label: 'Danh sách sản phẩm',
          },
        ]}
      />
      <Box className="flex justify-between items-center mt-4 mb-2">
        <Input
          size="sm"
          variant="faded"
          label="Tìm kiếm theo tên sản phẩm..."
          classNames={{
            inputWrapper: 'bg-white',
          }}
          className="max-w-[300px]"
          value={valueSearch}
          onValueChange={setValueSearch}
        />
        <Button color="primary" variant="shadow" onClick={() => navigate(PATH_NAME.PRODUCT)}>
          Thêm sản phẩm
        </Button>
      </Box>
      {(productSelectedKeys == 'all' || (productSelectedKeys && productSelectedKeys?.size > 0)) && (
        <Button color="danger" size="sm" className="mb-2" onClick={() => onDeleteProduct()}>
          Xoá tất cả
        </Button>
      )}
      <CustomTable
        rowKey="_id"
        selectedKeys={productSelectedKeys}
        onSelectionChange={setProductSelectedKeys}
        columns={columns}
        data={productList?.data || []}
        isLoading={isLoadingProduct || isFetchingProduct}
        emptyContent="Không có sản phẩm nào"
        tableName="Danh sách sản phẩm"
        pagination={true}
        page={pageIndex + 1}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
        totalPage={productList?.totalPage || 1}
        total={productList?.totalElement || 0}
      />
      <ModalConfirmDelete
        desc={modalDelete?.desc}
        isOpen={isOpenModalDelete}
        isLoading={isLoadDeleteProduct}
        onAgree={deleteProduct}
        onOpenChange={onCloseModalDeleteProduct}
      />
    </Box>
  );
};

export default ProductListPage;
