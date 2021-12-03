/* eslint-disable react-hooks/exhaustive-deps */
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import cETH_ABI_Ropsten from '../../contract/ABI/cETH-Ropsten.json';
import cETH_ABI_Rinkeby from '../../contract/ABI/cETH-Rinkeby.json';
import {
  rinkeby as rinkebyContract,
  ropsten as ropstenContact,
} from '../../contract/address';
import FormCard from './FormCard';
import SETTING from '../../constant/setting';
import {
  formatNumber,
  countDecimals,
  getUrlExplorer,
} from '../../utils/present';
import { SUPPLIER, MODAL } from '../../constant/type';
import ModeSelector from './ModeSelector';
import Alert from '../Alert';
import InfoBox from './InfoBox';

const ETH_DECIMAL = 18;

const Pool = ({ openPopup, ...rest }) => {
  const { active, account, chainId, library: web3 } = useWeb3React();
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
          // Rinkeby
          if (chainId === 4) {
            cTokenContract = new web3.eth.Contract(
              cETH_ABI_Rinkeby,
              rinkebyContract.cEth
            );
            contractBalance = await web3.eth.getBalance(rinkebyContract.cEth);
          }

          // Ropsten
          else if (chainId === 3) {
            cTokenContract = new web3.eth.Contract(
              cETH_ABI_Ropsten,
              ropstenContact.cEth
            );
            contractBalance = await web3.eth.getBalance(ropstenContact.cEth);
          } else {
            throw new Error('not support chain');
          }

          setCToken(cTokenContract);
          const contractBalanceInEth = web3.utils.fromWei(
            contractBalance,
            'ether'
          );
          setTotalSupplied(formatNumber(contractBalanceInEth));
          // TODO: add event listener for update data
        } catch (e) {
          console.error(e);
          setErrMessage('Please change to Rinkeby network or Ropsten network');
        }
      };
      init();
    }
  }, [chainId]);

  const fetchData = async () => {
    if (cToken && web3) {
      /* get supplied */
      const balanceOfUnderlying =
        web3.utils.toBN(
          await cToken.methods.balanceOfUnderlying(account).call()
        ) / Math.pow(10, ETH_DECIMAL);
      setUserSupplied(formatNumber(balanceOfUnderlying));

      const cTokenBalance =
        (await cToken.methods.balanceOf(account).call()) / 1e8;
      setCEthBalance(cTokenBalance);

      let exchangeRateCurrent = await cToken.methods
        .exchangeRateCurrent()
        .call();
      exchangeRateCurrent =
        exchangeRateCurrent / Math.pow(10, 18 + ETH_DECIMAL - 8);
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
        (await web3.eth.getBalance(account)) / Math.pow(10, ETH_DECIMAL);
      setEthBalance(ethTokenBalance);
    }
  };

  useEffect(() => {
    if (cToken) {
      fetchData();
    }
  }, [cToken, account]);

  const sendSupplyTx = async (amount) => {
    if (amount > ethBalance && amount > 0) {
      openPopup({ type: MODAL.FAILED, message: 'Not sufficient' });
      return;
    }

    if (countDecimals(amount) > ETH_DECIMAL) {
      openPopup({ type: MODAL.FAILED, message: 'Too many decimal' });
      return;
    }

    try {
      setIsLoading(true);

      const receipt = await cToken.methods.mint().send({
        from: account,
        value: web3.utils.toHex(web3.utils.toWei(amount?.toString(), 'ether')),
      });

      if (receipt) {
        setIsLoading(false);
        openPopup({
          type: MODAL.SUCCESS,
          message: 'Transaction was submitted',
          url: getUrlExplorer(chainId, receipt?.transactionHash),
        });

        fetchData();
      }
    } catch (e) {
      console.error(e);
      setErrMessage(e?.message);
      setIsLoading(false);
    }
  };

  const sendWithdrawTx = async (amount) => {
    if (amount > cEthBalance && amount > 0) {
      openPopup({ type: MODAL.FAILED, message: 'Not sufficient' });
      return;
    }

    if (countDecimals(amount) > 8) {
      openPopup({ type: MODAL.FAILED, message: 'Too many decimal' });
      return;
    }

    try {
      setIsLoading(true);

      const BN = web3.utils.BN;
      const amountBN = new BN(amount * 1e8);

      const receipt = await cToken.methods.redeem(amountBN.toNumber()).send({
        from: account,
      });

      if (receipt) {
        setIsLoading(false);
        openPopup({
          type: MODAL.SUCCESS,
          message: 'Transaction was submitted',
          url: getUrlExplorer(chainId, receipt?.transactionHash),
        });
        fetchData();
      }
    } catch (e) {
      console.error(e);
      setErrMessage(e?.message);
      setIsLoading(false);
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

      {active && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
            <InfoBox
              title={'Your Supplied'}
              data={`${userSupplied} ETH (${formatNumber(cEthBalance)} cETH)`}
            />
            <InfoBox title={'Total Supplied'} data={`${totalSupplied} ETH`} />
            <InfoBox title={'APY'} data={`${apy} %`} />
          </div>
          <div className="flex flex-col md:flex-row">
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
