import { SUPPLIER } from '../../constant/type';

const ModeSelector = ({ mode, switchModeTo }) => {
  const isSelectingSupply = mode === SUPPLIER.SUPPLY;
  const isSelectingWithdraw = mode === SUPPLIER.WITHDRAW;
  return (
    <div className="flex flex-row md:flex-col gap-3">
      <button
        className={`relative  text-white p-5 w-52 rounded-2xl text-2xl font-medium overflow-hidden bg-blue-500 ${
          isSelectingWithdraw && 'opacity-50'
        }`}
        onClick={() => switchModeTo(SUPPLIER.SUPPLY)}
      >
        Supply
        <div
          className={`ribbon text-sm whitespace-no-wrap px-4 bg-pink-500 ${
            isSelectingWithdraw && 'opacity-50'
          }`}
        >
          Beta
        </div>
      </button>
      <button
        className={`md:mt-3 relative  text-white p-5 w-52 rounded-2xl text-2xl font-medium overflow-hidden bg-blue-500 ${
          isSelectingSupply && 'opacity-50'
        }`}
        onClick={() => switchModeTo(SUPPLIER.WITHDRAW)}
      >
        Withdraw
        <div
          className={`ribbon text-sm whitespace-no-wrap px-4 bg-pink-500 ${
            isSelectingSupply && 'opacity-50'
          }`}
        >
          Beta
        </div>
      </button>
    </div>
  );
};

export default ModeSelector;
