import { Button } from '@nextui-org/react';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import DeleteIcon from '~/assets/svg/delete.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';
import { Attribute } from '~/models/attribute';
import { attributeService } from '~/services/attributeService';

interface AttributeModalProps {
  isOpen?: boolean;
  onOpenChange?(): void;
  onRefetch?(): Promise<any>;
  isEdit?: boolean;
  attributeId?: string;
}
const AttributeModal = ({
  isOpen,
  onOpenChange,
  onRefetch,
  isEdit,
  attributeId,
}: AttributeModalProps) => {
  const forms = useForm<Attribute>();

  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset: resetFormValue,
  } = forms;

  const {
    fields: attributeValue,
    append: appendAttributeValue,
    remove: removeAttributeValue,
  } = useFieldArray({ control, name: 'attributeList' });

  useEffect(() => {
    if (attributeId && isEdit && isOpen) getAttributeDetail();
    else resetFormValue({ name: '', attributeList: [] });
  }, [isEdit, attributeId, isOpen]);

  const getAttributeDetail = async () => {
    try {
      const response = await attributeService.getAttributeById(attributeId);
      if (response && Object.keys(response).length > 0) {
        resetFormValue(response);
      }
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi lấy dữ liệu thuộc tính!');
      onOpenChange?.();
      console.log('🚀 ~ file: index.tsx:125 ~ getAttributeDetail ~ err:', err);
    }
  };

  const onSubmit = async (data: Attribute) => {
    try {
      if (isEdit) await attributeService.updateAttributeById(attributeId, data);
      else await attributeService.createAttribute(data);
      enqueueSnackbar(
        `${isEdit ? 'Chỉnh sửa' : 'Thêm'} thuộc tính thành công!`,
      );
    } catch (err) {
      enqueueSnackbar(
        `Có lỗi xảy ra khi ${isEdit ? 'chỉnh sửa' : 'thêm'} thuộc tính!`,
        {
          variant: 'error',
        },
      );
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
      title={isEdit ? 'Cập nhật thuộc tính' : 'Thêm thuộc tính mới'}
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[800px]"
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <FormProvider {...forms}>
        <div className="space-y-4">
          <FormContextInput
            name="name"
            label="Tên thuộc tính"
            rules={{
              required: 'Vui lòng nhập tên thuộc tính',
            }}
          />
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold">Giá trị thuộc tính</span>
              <div className="space-x-2">
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  isDisabled={!attributeValue?.length}
                  className="font-bold"
                  onClick={() => removeAttributeValue(undefined)}
                >
                  Xóa tất cả
                </Button>
                <Button
                  color="secondary"
                  size="sm"
                  variant="flat"
                  className="bg-sky-100 text-sky-500 font-bold"
                  onClick={() =>
                    appendAttributeValue({
                      name: '',
                      value: '',
                    })
                  }
                >
                  Thêm giá trị
                </Button>
              </div>
            </div>
            <Box className="border border-zinc-200 rounded-xl p-4 shadow">
              <Box className="bg-zinc-200 shadow rounded-lg px-3 py-2 flex gap-2 mb-2">
                <Box className="font-bold flex-1 text-center">STT</Box>
                <Box className="font-bold flex-[3] text-center">
                  Tên giá trị
                </Box>
                <Box className="font-bold flex-[3] text-center">Giá trị</Box>
                <Box className="font-bold flex-1 text-center">Hành động</Box>
              </Box>
              <Box>
                {attributeValue?.map((value, index) => (
                  <Box
                    key={value?.id}
                    className="px-3 py-2 flex items-center gap-2"
                  >
                    <Box className="font-bold flex-1 text-center">
                      <span className="font-bold">{(index || 0) + 1}</span>
                    </Box>
                    <Box className="font-bold flex-[3] text-center">
                      <FormContextInput<Attribute>
                        name={`attributeList.${index}.name` as any}
                        rules={{
                          required: 'Vui lòng nhập tên giá trị thuộc tính!',
                        }}
                      />
                    </Box>
                    <Box className="font-bold flex-[3] text-center">
                      <FormContextInput<Attribute>
                        name={`attributeList.${index}.value` as any}
                        rules={{
                          required: 'Vui lòng nhập giá trị thuộc tính!',
                        }}
                      />
                    </Box>
                    <Box className="font-bold flex-1 text-center">
                      <ButtonIcon
                        icon={DeleteIcon}
                        title="Xóa danh mục này"
                        status="danger"
                        placement="top"
                        onClick={() => removeAttributeValue(index)}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </div>
        </div>
      </FormProvider>
    </CustomModal>
  );
};

export default AttributeModal;
