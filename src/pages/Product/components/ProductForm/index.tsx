import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Svg from 'react-inlinesvg';
import { useNavigate } from 'react-router-dom';

import DescriptionIcon from '~/assets/svg/description.svg';
import Box from '~/components/Box';
import FormContextCKEditor from '~/components/NextUI/Form/FormContextCKEditor';
import Upload, { onChangeUploadState } from '~/components/Upload';
import { PATH_NAME } from '~/constants/router';
import { AttributeValue, ProductMain } from '~/models/product';
import { productService } from '~/services/productService';
import ProductAttributeCard from '../ProductAttributeCard';
import ProductInfoCard from '../ProductInfoCard';
import { getFullImageUrl } from '~/utils/image';

interface ProductFormProps {
  currentProduct?: ProductMain;
  isEdit?: boolean;
}

const ProductForm = ({ currentProduct, isEdit }: ProductFormProps) => {
  const forms = useForm<ProductMain>();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [productImage, setProductImage] = useState<onChangeUploadState>({});

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = forms;

  // mai mot doc code chac dien, category lú hơn này chủ yếu là fill dâtta cho dung thoi, de demo thu

  useEffect(() => {
    if (isEdit && currentProduct && Object.keys(currentProduct).length > 0) {
      reset({
        ...currentProduct,
        categoryId: Array.isArray(currentProduct?.categoryId)
          ? [...currentProduct?.categoryId]
          : [currentProduct?.categoryId],
        productAttributeList: currentProduct?.productAttributeList?.map((attribute) => {
          return {
            ...attribute,
            productAttributeItem: attribute?.productAttributeItem?.map((attributeValue) => {
              const attributeValueData = attributeValue.attributeId
                ? JSON.parse(attributeValue.attributeId)
                : '';

              return {
                ...attributeValue,
                name: attributeValueData?.name,
                attributeId: attributeValueData?._id,
              };
            }),
          };
        }),
      });
      if (currentProduct?.image) {
        setProductImage({
          srcPreview: getFullImageUrl(currentProduct.image),
        });
      }
    }
  }, [isEdit, currentProduct]);

  const onSubmit = async (data: ProductMain) => {
    try {
      const formData = new FormData();

      const jsonData = JSON.stringify({
        ...data,
        categoryId: [...(data?.categoryId || [])]?.[0],
        types: [...(data?.types || [])],
        productAttributeList: data?.productAttributeList?.map((attribute) => {
          return {
            ...attribute,
            productAttributeItem: attribute?.productAttributeItem?.map((attributeValue) => {
              return {
                attributeId: isEdit ? attributeValue?.attributeId : attributeValue?._id,
                priceAdjustmentValue: attributeValue?.priceAdjustmentValue,
              };
            }),
          };
        }),
      });

      formData.append('productInfo', jsonData);

      if (productImage?.srcRequest) {
        formData.append('file', productImage.srcRequest);
      }

      if (isEdit) await productService.updateProduct(formData, currentProduct?._id);
      else await productService.createProduct(formData);
      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Tạo'} sản phẩm thành công!`);
      navigate(PATH_NAME.PRODUCT_LIST);
    } catch (err) {
      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Tạo'} sản phẩm thất bại!`, {
        variant: 'error',
      });
      console.log('🚀 ~ file: index.tsx:47 ~ onSubmit ~ err:', err);
    }
  };

  return (
    <FormProvider {...forms}>
      <Box className="space-y-4">
        <Box className="grid xl:grid-cols-2 gap-4">
          <ProductInfoCard />
          <Card>
            <CardHeader>
              <Svg src={DescriptionIcon} className="w-5 h-5 mr-2" />
              <span className="text-lg font-bold">Mô tả sản phẩm</span>
            </CardHeader>
            <Divider />
            <CardBody className="py-0">
              <FormContextCKEditor name="description" />
            </CardBody>
          </Card>
        </Box>
        <Card>
          <CardHeader>
            <Svg src={DescriptionIcon} className="w-5 h-5 mr-2" />
            <span className="text-lg font-bold">Hình ảnh sản phẩm</span>
          </CardHeader>
          <Divider />
          <CardBody>
            <Box className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6 2xl:grid-cols-8">
              <Upload
                onChange={({ srcPreview, srcRequest }: onChangeUploadState) => {
                  setProductImage({
                    srcPreview,
                    srcRequest,
                  });
                }}
                src={productImage?.srcPreview}
                loading="lazy"
                description="Tải lên"
                isPreview
              />
            </Box>
          </CardBody>
        </Card>
        <ProductAttributeCard isEdit={isEdit} />
      </Box>
      <Button
        color="primary"
        variant="shadow"
        className="mt-2"
        isLoading={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        {isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
      </Button>
    </FormProvider>
  );
};

export default ProductForm;
