import { useEffect, useState } from 'react';

const ProcessingButton = () => (
  <button
    type="button"
    className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-700 rounded-2xl py-2 w-full transition duration-150 ease-in disabled:cursor-not-allowed"
    disabled
  >
    <span className="mr-2 uppercase">Submitting</span>
    <span>
      <svg
        className="h-6 w-6 animate-spin"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </span>
  </button>
);

const FormCard = ({ isLoading, data, getReceiving, submitTx, ...rest }) => {
  const { title, balance, balanceUnit, receivingUnit } = data;
  //   const title = 'Supply';
  //   const balance = 12312312313;
  //   const balanceUnit = 'ETH';
  //   const receiving = 1234;
  //   const receivingUnit = 'cETH';
  //   let isLoading = false;

  const [amountValue, setAmountValue] = useState('');
  const [receivingAmount, setReceivingAmount] = useState(0);

  useEffect(() => {
    if (amountValue) {
      setReceivingAmount(getReceiving(amountValue));
    }
  }, [amountValue]);

  const setAmountToMax = () => {
    setAmountValue(balance);
  };

  const handleOnChange = (e) => {
    setAmountValue(e.target.value);
  };

  const handleOnSubmit = async () => {
    await submitTx(amountValue);
    setAmountValue('');
    setReceivingAmount(0);
  };

  return (
    <>
      <div
        className="flex flex-col w-2/4 bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-3xl w-50 max-w-md"
        {...rest}
      >
        <div className="font-medium self-center text-xl sm:text-3xl text-gray-800">
          {title}
        </div>
        <div className="mt-10 ">
          <div className="flex flex-col mb-5">
            <div className="mb-1 text-xs text-right tracking-wide text-gray-600">
              Balance: {balance} {balanceUnit}
            </div>
            <div
              className="self-end text-sm text-blue-400 underline cursor-pointer"
              onClick={setAmountToMax}
            >
              Max
            </div>
            <div className="relative">
              <div className=" inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400 ">
                {/* TODO: put ETH LOGO */}
                <i className="fas fa-at text-blue-500"></i>
              </div>
              <input
                type="number"
                className="w-full px-2 pb-1.5 text-primary text-base text-right font-light rounded-md border-2 border-pink-300"
                placeholder={`0 ${balanceUnit}`}
                value={amountValue}
                onChange={handleOnChange}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Receiving</span>
            <span>
              {receivingAmount} {receivingUnit}
            </span>
          </div>
          <div className="mt-5 flex w-full">
            {isLoading ? (
              <ProcessingButton />
            ) : (
              <button
                onClick={handleOnSubmit}
                className=" flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-700 rounded-2xl py-2 w-full transition duration-150 ease-in disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!amountValue}
              >
                <span className="mr-2 uppercase">{title}</span>
                <span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormCard;
