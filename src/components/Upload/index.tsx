import { ImageProps } from '@nextui-org/react';
import SVG from 'react-inlinesvg';

import UploadIcon from '~/assets/svg/upload.svg';
import Box from '../Box';
import CustomImage from '../NextUI/CustomImage';

export interface onChangeUploadState {
  srcPreview?: any;
  srcRequest?: any;
}
interface UploadProps extends ImageProps {
  onChange?: (props: onChangeUploadState | any) => void;
  className?: string;
  isPreview?: boolean;
  description?: string;
}

const Upload: React.FC<UploadProps> = (props) => {
  const { isPreview = false, src } = props;
  const handleChangeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onload = function () {
      props.onChange?.({
        srcPreview: reader.result,
        srcRequest: file,
      });
    };

    reader.readAsDataURL(file as any);
  };

  return (
    <>
      <div
        id="FileUpload"
        className={`relative aspect-square mx-auto cursor-pointer appearance-none border-2 border-dashed border-primary bg-gray rounded-${props.radius}`}
      >
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
          onChange={(e) => {
            props.onChange?.({
              srcPreview: '',
              srcRequest: '',
            });
            handleChangeFileUpload(e);
          }}
        />

        {!props.src ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col space-y-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
              <SVG src={UploadIcon} className="text-[#3C50E0]" />
            </span>
            {!props?.description ? (
              <>
                <p className="text-center line-clamp-1">
                  <span className="text-primary line-clamp-1">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="mt-1.5 text-center hidden sm:block line-clamp-1">
                  SVG, PNG, JPG or GIF
                </p>
                <p className="text-center hidden sm:block line-clamp-1">
                  (max, 800 X 800px)
                </p>
              </>
            ) : (
              <Box className="text-center">{props.description}</Box>
            )}
          </div>
        ) : (
          <CustomImage isPreview={isPreview} src={src} {...(props as any)} />
        )}
      </div>
    </>
  );
};

export default Upload;
