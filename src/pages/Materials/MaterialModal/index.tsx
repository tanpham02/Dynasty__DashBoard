import { Button } from '@nextui-org/react';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { DatePicker } from 'antd';

import DeleteIcon from '~/assets/svg/delete.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import { globalLoading } from '~/components/GlobalLoading';
import CustomModal from '~/components/NextUI/CustomModal';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { FormContextInput } from '~/components/NextUI/Form';
import { Category } from '~/models/category';
import { Material, MaterialInformation } from '~/models/materials';
import { categoryService } from '~/services/categoryService';

interface MaterialModalProps {
  isOpen?: boolean;
  onOpenChange?(): void;
  onRefetch?(): Promise<any>;
  isEdit?: boolean;
  categoryId?: string;
}
const MaterialModal = ({
  isOpen,
  onOpenChange,
  onRefetch,
  isEdit,
  categoryId,
}: MaterialModalProps) => {
  const forms = useForm<Material>();

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset: resetFormValue,
    control,
  } = forms;

  const {
    fields: materials,
    remove: removeMaterial,
    append: appendMaterial,
  } = useFieldArray({
    control,
    name: 'materialInfo',
  });

  const columns: ColumnType<Category>[] = [
    {
      name: 'Tên nguyên liệu',
      render: (_record: MaterialInformation, index?: number) => (
        <FormContextInput
          name={`materialInfo.${index}.name`}
          rules={{
            required: 'Vui lòng nhập tên nguyên liệu!',
          }}
        />
      ),
    },
    {
      name: 'Giá nhập',
      width: 200,
      render: (_record: MaterialInformation, index?: number) => (
        <FormContextInput
          name={`materialInfo.${index}.price`}
          type="number"
          rules={{
            required: 'Vui lòng nhập giá nguyên liệu!',
          }}
        />
      ),
    },
    {
      name: 'Số lượng',
      width: 200,
      render: (_record: MaterialInformation, index?: number) => (
        <FormContextInput
          name={`materialInfo.${index}.quantity`}
          type="number"
          rules={{
            required: 'Vui lòng nhập số lượng nguyên liệu!',
            min: {
              value: 0.01,
              message: 'Số lượng nguyên liệu nhập không được nhỏ hơn 0!',
            },
          }}
        />
      ),
    },
    {
      name: 'Đơn vị tính',
      width: 200,
      render: (_record: MaterialInformation, index?: number) => (
        <FormContextInput
          name={`materialInfo.${index}.unit`}
          rules={{
            required: 'Vui lòng nhập đơn vị tính nguyên liệu!',
          }}
        />
      ),
    },
    {
      name: <Box className="flex justify-center">Hành động</Box>,
      width: 100,
      render: (_record: MaterialInformation, index?: number) => (
        <Box className="flex justify-center">
          <ButtonIcon
            icon={DeleteIcon}
            title="Xóa danh nguyên liệu nhập này"
            status="danger"
            onClick={() => removeMaterial(index)}
          />
        </Box>
      ),
    },
  ];

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (categoryId && isEdit && isOpen) getMaterialDetail();
    else resetFormValue({ materialInfo: [] });
  }, [isEdit, categoryId, isOpen]);

  const getMaterialDetail = async () => {
    try {
      globalLoading.show();
      const response = await categoryService.getCategoryById(categoryId);
      if (response && Object.keys(response).length > 0) {
        resetFormValue(response);
      }
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi lấy dữ liệu hóa đơn nhập nguyên liệu!');
      onOpenChange?.();
      console.log('🚀 ~ file: index.tsx:125 ~ getMaterialDetail ~ err:', err);
    } finally {
      setTimeout(() => {
        globalLoading.hide();
      }, 1000);
    }
  };

  const onSubmit = async (data: Category) => {
    try {
      const formData = new FormData();

      // if (isEdit || isCreateChildrenCategory) {
      //   await categoryService.updateCategory(
      //     !isCreateChildrenCategory ? categoryId : parentCategoryId,
      //     formData,
      //   );
      //   // if (
      //   //   isCreateChildrenCategory &&
      //   //   categoryId &&
      //   //   data?.childrenCategory?.parentId === parentCategoryId
      //   // )
      //   //   await categoryService.deleteCategoryByIds([categoryId]);
      // } else {
      //   await categoryService.createCategory(formData);
      // }

      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Thêm'} danh mục thành công!`);
    } catch (err) {
      enqueueSnackbar(`Có lỗi xảy ra khi ${isEdit ? 'chỉnh sửa' : 'thêm'} danh mục!`, {
        variant: 'error',
      });
      console.log('🚀 ~ file: index.tsx:69 ~ onSubmit ~ err:', err);
    } finally {
      await onRefetch?.();
      onOpenChange?.();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Cập nhật hóa đơn nhập hàng' : 'Thêm hóa đơn nhập hàng mới'}
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[1200px]"
      isDismissable={false}
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <FormProvider {...forms}>
        <Box className="space-y-4">
          <DatePicker placeholder="Ngày nhập hàng" />
          <Box className="flex justify-between items-end mb-2">
            <span className="font-bold text-base">Danh sách nguyên liệu</span>
            <Box className="space-x-2">
              <Button
                color="danger"
                size="sm"
                variant="flat"
                className="font-bold"
                onClick={() => removeMaterial(undefined)}
              >
                Xóa tất cả
              </Button>
              <Button
                color="default"
                size="sm"
                className="bg-sky-100 text-sky-500 font-bold"
                onClick={() => appendMaterial({ name: '', price: 0, quantity: 0, unit: '' })}
              >
                Thêm nguyên liệu nhập
              </Button>
            </Box>
          </Box>
          <CustomTable key="id" columns={columns} data={materials || []} isLoading={false} />
        </Box>
      </FormProvider>
    </CustomModal>
  );
};

export default MaterialModal;
