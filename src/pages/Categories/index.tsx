import {
  Button,
  Chip,
  Input,
  Selection,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import SVG from 'react-inlinesvg';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import ModalConfirmDelete, {
  ModalConfirmDeleteState,
} from '~/components/ModalConfirmDelete';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import useDebounce from '~/hooks/useDebounce';
import { Category, CategoryStatus } from '~/models/category';
import { categoryService } from '~/services/categoryService';
import CategoryModal from './CategoryModal';
import usePagination from '~/hooks/usePagination';

const Categories = () => {
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
  } = useDisclosure();

  const {
    isOpen: isOpenModalDelete,
    onOpen: onOpenModalDelete,
    onOpenChange: onOpenChangeModalDelete,
  } = useDisclosure();

  const [searchCategory, setSearchCategory] = useState<string>('');
  const [modalDelete, setModalDelete] = useState<ModalConfirmDeleteState>();
  const [categorySelectedKeys, setCategorySelectedKeys] = useState<Selection>();
  const [modal, setModal] = useState<{
    isEdit?: boolean;
    categoryId?: string;
  }>();

  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination();

  const { enqueueSnackbar } = useSnackbar();

  const searchCategoryDebounce = useDebounce(searchCategory, 500);

  const columns: ColumnType<Category>[] = [
    {
      key: '_id',
      align: 'center',
      name: 'STT',
      render: (_category: Category, index?: number) => (index || 0) + 1,
    },
    {
      key: 'name',
      align: 'center',
      name: 'Tên danh mục',
      render: (category: Category) => category?.name,
    },
    {
      key: 'products',
      align: 'center',
      name: 'Số lượng sản phẩm',
      render: (category: Category) => category?.products?.length || 0,
    },
    {
      key: 'priority',
      align: 'center',
      name: 'Thứ tự hiển thị',
      render: (category: Category) => category?.priority || 0,
    },
    {
      key: 'status',
      align: 'center',
      name: 'Trạng thái',
      render: (category: Category) => (
        <Chip
          color={
            category?.status === CategoryStatus.ACTIVE ? 'success' : 'danger'
          }
          variant="flat"
          classNames={{
            content: 'font-semibold',
          }}
        >
          {category?.status === CategoryStatus.ACTIVE
            ? 'Đang kinh doanh'
            : 'Ngưng kinh doanh'}
        </Chip>
      ),
    },
    {
      key: 'id',
      align: 'center',
      name: 'Hành động',
      render: (category: Category) => (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Chỉnh sửa thuộc tính" showArrow>
            <span
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => handleOpenModalEdit(category)}
            >
              <SVG src={EditIcon} />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Xóa thuộc tính này" showArrow>
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => handleOpenDeleteModal(category)}
            >
              <SVG src={DeleteIcon} />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isFetching: isFetchingCategories,
    isRefetching: isRefetchingCategories,
    refetch: refetchCategory,
  } = useQuery(
    [QUERY_KEY.ATTRIBUTE, searchCategoryDebounce, pageIndex, pageSize],
    async () =>
      await categoryService.getCategoryByCriteria({
        pageSize: pageSize,
        pageIndex: pageIndex,
        name: searchCategoryDebounce,
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleOpenDeleteModal = (category: Category) => {
    setModalDelete({
      id: category?._id,
      desc: `Bạn có chắc muốn xóa danh mục ${category?.name} này không?`,
    });
    onOpenModalDelete();
  };

  const handleOpenModalEdit = (category: Category) => {
    setModal({ isEdit: true, categoryId: category?._id });
    onOpenModal();
  };

  const handleOpenModalAddAttribute = () => {
    setModal({});
    onOpenModal();
  };

  const handleDeleteAttribute = async () => {
    try {
      setModalDelete((prev) => ({ ...prev, isLoading: true }));
      await categoryService.deleteCategoryByIds(
        modalDelete?.id ? [modalDelete.id] : [],
      );
      enqueueSnackbar('Xóa danh mục thành công!');
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi xóa danh mục!', {
        variant: 'error',
      });
      console.log(
        '🚀 ~ file: index.tsx:112 ~ handleDeleteAttribute ~ err:',
        err,
      );
    } finally {
      await refetchCategory();
      setModalDelete({});
      onOpenChangeModalDelete();
    }
  };

  return (
    <div>
      <CustomBreadcrumb
        pageName="Danh mục sản phẩm"
        routes={[
          {
            label: 'Danh mục sản phẩm',
          },
        ]}
      />
      <div className="flex justify-between items-end mb-2">
        <Input
          label="Tìm kiếm tên danh mục..."
          size="sm"
          className="max-w-[250px]"
          color="primary"
          variant="faded"
          value={searchCategory}
          onValueChange={setSearchCategory}
          classNames={{
            inputWrapper: 'bg-white',
          }}
        />
        <Button
          color="primary"
          variant="shadow"
          onClick={handleOpenModalAddAttribute}
        >
          Thêm danh mục
        </Button>
      </div>
      <CustomTable
        pagination
        rowKey="_id"
        columns={columns}
        data={categories?.data}
        tableName="Danh mục sản phẩm"
        emptyContent="Không có danh mục nào"
        selectedKeys={categorySelectedKeys}
        onSelectionChange={setCategorySelectedKeys}
        totalPage={categories?.totalPage}
        page={pageIndex + 1}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
        isLoading={
          isLoadingCategories || isFetchingCategories || isRefetchingCategories
        }
      />
      <CategoryModal
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
        onRefetch={refetchCategory}
        {...modal}
      />
      <ModalConfirmDelete
        isOpen={isOpenModalDelete}
        onOpenChange={onOpenChangeModalDelete}
        desc={modalDelete?.desc}
        onAgree={handleDeleteAttribute}
        isLoading={modalDelete?.isLoading}
      />
    </div>
  );
};

export default Categories;
