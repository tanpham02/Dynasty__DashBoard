import SVG from 'react-inlinesvg';
import SEARCH_ICON from '~ assets/svg/search.svg';
import SelectCustom from '~/components/customs/Select';
import VoucherTable from './VoucherTable';

const VoucherListPage = () => {
  return (
    <>
      <div className='flex flex-row justify-between items-center gap-2 w-full'>
        <span className='font-bold text-xl'>{'Danh sách Voucher'}</span>
        <button className='rounded-lg bg-primary px-4 py-2 font-normal text-white'>Thêm chương trình</button>
      </div>
      <div className='mb-2 flex flex-row justify-between flex-wrap  items-center gap-2'>
        <div className='flex items-center gap-2 lg:w-[75%] md:w-[50%]'>
          <div className='my-2 flex  w-full items-center rounded-lg border-2 border-gray bg-white p-2 dark:bg-boxdark lg:w-[25%] xl:w-[25%]'>
            <SVG src={SEARCH_ICON} />
            <input
              type='text'
              placeholder='Tìm kiếm...'
              className='w-full bg-transparent pl-6 pr-4 focus:outline-none'
            />
          </div>
          <SelectCustom
            className='flex  w-full items-center rounded-lg lg:w-[25%] xl:w-[25%]'
            placeholder='Trạng thái'
          />
          <SelectCustom
            className='flex w-full items-center rounded-lg lg:w-[25%] xl:w-[25%]'
            placeholder='Vai trò'
          />
          <button className='rounded-lg bg-primary px-4 py-2 font-normal text-white  '>Tìm</button>
        </div>
      </div>
      <VoucherTable />
    </>
  );
};

export default VoucherListPage;