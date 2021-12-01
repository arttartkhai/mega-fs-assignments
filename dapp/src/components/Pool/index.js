import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import cETH_ABI_Ropsten from '../../constant/ABI/cETH-Ropsten.json';
import cETH_ABI_Rinkeby from '../../constant/ABI/cETH-Rinkeby.json';
import FormCard from './FormCard';
import SETTING from '../../constant/setting';
import { formatNumber } from '../../utils/present';
import { SUPPLIER } from '../../constant/type';
import ModeSelector from './ModeSelector';
import Alert from '../Alert';

const ethDecimals = 18;

const InfoBox = ({ children, ...props }) => (
  <div
    className="p-3 border-2 border-pink-300 rounded-xl text-center"
    {...props}
  >
    {' '}
    {children}
  </div>
);

const Pool = () => {
  const { active, account, chainId, error, library: web3 } = useWeb3React();
  const [cToken, setCToken] = useState(undefined);
  const [errMessage, setErrMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(SUPPLIER.SUPPLY);

  const [userSupplied, setUserSupplied] = useState();
  const [totalSupplied, setTotalSupplied] = useState();
  const [apy, setApy] = useState();

  const [cEthBalance, setCEthBalance] = useState();
  const [cEthExchangeRate, setCEthExchangeRate] = useState();

  // supply
  const [ethBalance, setEthBalance] = useState();

  useEffect(() => {
    if (active) {
      // clear previous state every time when reconnect wallet
      setErrMessage('');
      setIsLoading(false);

      const init = async () => {
        try {
          let cTokenContract;
          let contractBalance;
          // TODO move contract address to constant
          // Rinkeby
          if (chainId === 4) {
            cTokenContract = new web3.eth.Contract(
              cETH_ABI_Rinkeby,
              '0xd6801a1dffcd0a410336ef88def4320d6df1883e'
            );
            contractBalance = await web3.eth.getBalance(
              '0xd6801a1dffcd0a410336ef88def4320d6df1883e'
            );
          }

          // Ropsten
          else if (chainId === 3) {
            cTokenContract = new web3.eth.Contract(
              cETH_ABI_Ropsten,
              '0x859e9d8a4edadfedb5a2ff311243af80f85a91b8'
            );
            contractBalance = await web3.eth.getBalance(
              '0x859e9d8a4edadfedb5a2ff311243af80f85a91b8'
            );
          } else {
            throw new Error('not support chain');
          }

          setCToken(cTokenContract);
          const contractBalanceInEth = web3.utils.fromWei(
            contractBalance,
            'ether'
          );
          setTotalSupplied(
            formatNumber(contractBalanceInEth, SETTING.ui.decimal.totalSupplied)
          );
          // TODO: add event listener for update data
        } catch (e) {
          console.error(e);
          setErrMessage('Please change to Rinkeby network');
        }
      };
      init();
    }
  }, [chainId]);

  useEffect(() => {
    if (cToken) {
      const fetchData = async () => {
        /* get supplied */
        const balanceOfUnderlying =
          web3.utils.toBN(
            await cToken.methods.balanceOfUnderlying(account).call()
          ) / Math.pow(10, ethDecimals);
        setUserSupplied(formatNumber(balanceOfUnderlying));

        const cTokenBalance =
          (await cToken.methods.balanceOf(account).call()) / 1e8;
        setCEthBalance(cTokenBalance);

        let exchangeRateCurrent = await cToken.methods
          .exchangeRateCurrent()
          .call();
        exchangeRateCurrent =
          exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);
        setCEthExchangeRate(exchangeRateCurrent);

        /* calculate APY */
        const ethMantissa = 1e18;
        const blocksPerDay = 6570; // 13.15 seconds per block
        const daysPerYear = 365;
        const supplyRatePerBlock = await cToken.methods
          .supplyRatePerBlock()
          .call();
        const supplyApy =
          (Math.pow(
            (supplyRatePerBlock / ethMantissa) * blocksPerDay + 1,
            daysPerYear
          ) -
            1) *
          100;
        setApy(formatNumber(supplyApy, SETTING.ui.decimal.apy));

        // get balance
        const ethTokenBalance =
          (await web3.eth.getBalance(account)) / Math.pow(10, ethDecimals);
        setEthBalance(ethTokenBalance);
      };
      fetchData();
    }
  }, [cToken]);

  const sendSupplyTx = async (amount) => {
    if (amount > ethBalance && amount > 0) {
      alert('Not sufficient');
      return;
    }

    try {
      setIsLoading(true);

      const receipt = await cToken.methods.mint().send({
        from: account,
        value: web3.utils.toHex(web3.utils.toWei(amount?.toString(), 'ether')),
      });
      // TODO: handle when click reject -> should not show loading

      if (receipt) {
        setIsLoading(false);

        alert('Transaction was submitted');
      }
    } catch (e) {
      console.error(e);
      setErrMessage(e?.message);
    }
  };

  const sendWithdrawTx = async (amount) => {
    if (amount > cEthBalance && amount > 0) {
      alert('Not sufficient');
      return;
    }
    try {
      setIsLoading(true);

      const receipt = await cToken.methods.redeem(amount * 1e8).send({
        from: account,
      });

      if (receipt) {
        setIsLoading(false);
        alert('Transaction was submitted');
      }
    } catch (e) {
      console.error(e);
      setErrMessage(e?.message);
    }
  };

  const calReceivingSupply = (amount) => amount / cEthExchangeRate;
  const calReceivingWithdraw = (amount) => amount * cEthExchangeRate;

  const switchModeTo = (modeType) => {
    setMode(modeType);
  };

  return (
    <>
      {errMessage && <Alert message={errMessage?.toString()} />}

      {active && !errMessage && (
        <>
          <div className="grid grid-cols-3 gap-x-9">
            <InfoBox>Your Supplied: {userSupplied} ETH</InfoBox>
            <InfoBox>Total Supplied: {totalSupplied} ETH</InfoBox>
            <InfoBox>APY: {apy} %</InfoBox>
          </div>
          <div className="flex">
            <ModeSelector mode={mode} switchModeTo={switchModeTo} />
            <div className="flex-grow">
              {mode === SUPPLIER.SUPPLY && (
                <FormCard
                  isLoading={isLoading}
                  data={{
                    title: 'Supply',
                    balance: ethBalance,
                    balanceUnit: 'ETH',
                    receivingUnit: 'cETH',
                    logoClassName: 'eth-logo',
                  }}
                  getReceiving={calReceivingSupply}
                  submitTx={sendSupplyTx}
                />
              )}
              {mode === SUPPLIER.WITHDRAW && (
                <FormCard
                  isLoading={isLoading}
                  data={{
                    title: 'Withdraw',
                    balance: cEthBalance,
                    balanceUnit: 'cETH',
                    receivingUnit: 'ETH',
                    logoClassName: 'cEth-logo',
                  }}
                  getReceiving={calReceivingWithdraw}
                  submitTx={sendWithdrawTx}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Pool;
