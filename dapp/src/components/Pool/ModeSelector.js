import { SUPPLIER } from '../../constant/type';

const ModeSelector = ({ mode, switchModeTo }) => {
  return (
    <>
      <button
        className={`relative  text-white p-5 w-52 rounded-2xl text-2xl font-medium overflow-hidden bg-blue-${
          mode === SUPPLIER.SUPPLY ? '500' : '300'
        }`}
        onClick={() => switchModeTo(SUPPLIER.SUPPLY)}
      >
        Supply
        <div
          className={`ribbon text-sm whitespace-no-wrap px-4 bg-pink-${
            mode === SUPPLIER.SUPPLY ? '500' : '300'
          }`}
        >
          Beta
        </div>
      </button>
      <button
        className={`mt-3 relative  text-white p-5 w-52 rounded-2xl text-2xl font-medium overflow-hidden bg-blue-${
          mode === SUPPLIER.WITHDRAW ? '500' : '300'
        }`}
        onClick={() => switchModeTo(SUPPLIER.WITHDRAW)}
      >
        Withdraw
        <div
          className={`ribbon text-sm whitespace-no-wrap px-4 bg-pink-${
            mode === SUPPLIER.WITHDRAW ? '500' : '300'
          }`}
        >
          Beta
        </div>
      </button>
    </>
  );
};

export default ModeSelector;
