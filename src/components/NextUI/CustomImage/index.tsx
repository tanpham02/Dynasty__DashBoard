import { Image, ImageProps } from '@nextui-org/react';
import React, { useState } from 'react';

import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import Preview from '~/components/Preview';
import EyeIcon from '~/assets/svg/eye.svg';

interface CustomImageProps extends ImageProps {
  isPreview?: boolean;
  placement?:
    | 'top'
    | 'bottom'
    | 'right'
    | 'left'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';
  fallbackSrc?: string;
}

const CustomImage: React.FC<CustomImageProps> = (props) => {
  const { isPreview, src, fallbackSrc, placement = 'top' } = props;

  const [visiblePreviewImage, setVisiblePreviewImage] = useState<boolean>(false);

  return (
    <>
      {isPreview && src && (
        <Box
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999999] hidden"
          id="preview-icon"
        >
          <ButtonIcon
            title="Xem trước"
            placement={placement}
            icon={EyeIcon}
            onClick={() => setVisiblePreviewImage(true)}
          />
        </Box>
      )}
      <Image
        src={src}
        {...props}
        classNames={{
          wrapper: 'absolute top-0 left-0 !w-full !h-full flex item-center justify-center',
          img: '!w-full !h-full object-cover p-1',
        }}
        isBlurred
        isZoomed
        fallbackSrc={fallbackSrc}
      />

      <Preview
        srcPreview={src}
        visible={visiblePreviewImage}
        onClose={() => setVisiblePreviewImage(false)}
      />
    </>
  );
};

export default CustomImage;
