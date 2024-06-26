import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Svg from 'react-inlinesvg';

import DeleteIcon from '~/assets/svg/delete.svg';
import GridLayoutIcon from '~/assets/svg/grid-layout.svg';
import WarningIcon from '~/assets/svg/warning.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import { FormContextInput } from '~/components/NextUI/Form';
import { QUERY_KEY } from '~/constants/queryKey';
import { Attribute, AttributeValue } from '~/models/attribute';
import { ProductMain } from '~/models/product';
import { attributeService } from '~/services/attributeService';

interface ProductAttributeCardProps {
  isEdit?: boolean;
}

const ProductAttributeCard = ({ isEdit }: ProductAttributeCardProps) => {
  const { control, setValue } = useFormContext<ProductMain>();

  const [attributeSelected, setAttributeSelected] = useState<Attribute[]>([]);
  const [attributeIds, setAttributeIds] = useState<string[]>([]);

  const {
    fields: productAttributes,
    append: appendProductAttribute,
    remove: removeProductAttribute,
  } = useFieldArray({
    control,
    name: 'productAttributeList',
  });

  const { data: attributes } = useQuery(
    [QUERY_KEY.ATTRIBUTE],
    async () => await attributeService.getAllAttributes(),
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    removeProductAttribute(undefined);
    setValue('productAttributeList', []);
    if (attributeSelected.length > 0) {
      generateCombinations(0, [], []);
      setValue(
        'attributeIds',
        attributeSelected?.map((attribute) => attribute?._id) as string[],
      );
    }
  }, [JSON.stringify(attributeSelected)]);

  // useEffect(() => {
  //   const oldProductAttribute = getValues('attributeMapping');
  //   if (isEdit && Array.isArray(oldProductAttribute) && oldProductAttribute.length > 0) {
  //     setAttributeSelected(oldProductAttribute as Attribute[]);
  //     setAttributeIds((oldProductAttribute?.map((attribute) => attribute?._id) as string[]) || []);
  //     // isCheckedAttributeBefore.current = true;
  //   }
  // }, [isEdit, getValues('attributeMapping')]);

  const generateCombinations = useCallback(
    (
      index: number,
      currentCombination: string[],
      attributeValue: AttributeValue[],
    ) => {
      if (index === attributeSelected?.length && currentCombination) {
        appendProductAttribute(
          {
            label: currentCombination.join(' - '),
            productAttributeItem: attributeValue,
          },
          {
            shouldFocus: false,
          },
        );
      }

      if (attributeSelected?.[index]?.attributeList?.length === 0) {
        generateCombinations(index + 1, currentCombination, attributeValue);
      } else if (
        attributeSelected?.[index]?.attributeList &&
        Array.isArray(attributeSelected?.[index]?.attributeList) &&
        attributeSelected[index].attributeList.length > 0
      ) {
        for (const attr of attributeSelected[index].attributeList || []) {
          generateCombinations(
            index + 1,
            attr?.label
              ? [...currentCombination, attr?.label]
              : [...currentCombination],
            attr ? [...attributeValue, attr] : [...attributeValue],
          );
        }
      }
    },
    [attributeSelected],
  );

  const handleChangeAttributeSelected = (
    checked: boolean,
    attribute: Attribute,
  ) => {
    if (checked) {
      setAttributeSelected((prev) => [...prev, attribute]);
    } else {
      setAttributeSelected(
        attributeSelected?.filter((item) => item?._id != attribute?._id) || [],
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <Svg src={GridLayoutIcon} className="w-5 h-5 mr-2" />
        <span className="text-lg font-bold">Thuộc tính sản phẩm</span>
      </CardHeader>
      <Divider />
      <CardBody className="p-6 space-y-4">
        {isEdit && (
          <Box className="mb-1 flex items-center bg-orange-100 p-2 rounded-lg">
            <Svg
              src={WarningIcon}
              className="bg-orange-500 text-white w-5 h-5 rounded-full mr-2"
            />
            <span>
              Vui lòng cập nhật lại giá bán cộng thêm cho từng thuộc tính nếu
              thay đổi lựa chọn!
            </span>
          </Box>
        )}
        <CheckboxGroup value={attributeIds} onValueChange={setAttributeIds}>
          <Box className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-5 2xl:grid-cols-7">
            {attributes?.map((attribute, index) => (
              <Checkbox
                key={index}
                value={attribute?._id}
                // checked={attributeIds?.includes(attribute?._id)}
                onValueChange={(checked) =>
                  handleChangeAttributeSelected(checked, attribute)
                }
              >
                {attribute?.name}
              </Checkbox>
            ))}
          </Box>
        </CheckboxGroup>
        <Box className="border border-zinc-200 rounded-xl p-4 shadow">
          <Box className="bg-zinc-200 shadow rounded-lg px-3 py-2 flex gap-2 mb-2">
            <Box className="font-bold flex-[2] text-center">Tên hiển thị</Box>
            <Box className="font-bold flex-[2] text-center">Tên thuộc tính</Box>
            <Box className="font-bold flex-[3] text-center">
              Giá bán cộng thêm
            </Box>
            <Box className="font-bold flex-1 text-center">Hành động</Box>
          </Box>
          <Box>
            {Array.isArray(productAttributes) &&
            productAttributes.length > 0 ? (
              productAttributes.map((attribute, index) => (
                <Box
                  key={attribute?.id}
                  className={`px-3 py-2 flex items-center gap-2 ${
                    index % 2 == 1 && 'bg-zinc-100 rounded-md'
                  }`}
                >
                  <Box className="flex-[2] text-center">{attribute?.label}</Box>
                  <Box className="flex justify-around flex-col gap-8 flex-[2] text-center">
                    {attribute?.productAttributeItem?.map((attributeValue) => (
                      <span className="block my-auto">
                        - {attributeValue?.label}
                      </span>
                    ))}
                  </Box>
                  <Box className="font-bold flex-[3] text-center">
                    <Box className="space-y-1">
                      {attribute?.productAttributeItem?.map(
                        (attributeItem, fieldIndex) => (
                          <FormContextInput
                            key={attributeItem?._id}
                            type="number"
                            name={`productAttributeList.${index}.productAttributeItem.${fieldIndex}.priceAdjustmentValue`}
                            endContent={<span className="font-bold">đ</span>}
                          />
                        ),
                      )}
                    </Box>
                  </Box>
                  <Box className="font-bold flex-1 text-center">
                    <ButtonIcon
                      icon={DeleteIcon}
                      title="Xóa sản phẩm con này"
                      onClick={() => removeProductAttribute(index)}
                      status="danger"
                    />
                  </Box>
                </Box>
              ))
            ) : (
              <Box className="py-8 text-center font-medium text-zinc-400">
                Không có biển thể sản phẩm nào
              </Box>
            )}
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default ProductAttributeCard;
