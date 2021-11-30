import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
// TODO: use Rinkeby
import cETH_ABI from  '../constant/ABI/cETH-Ropsten.json'
import web3 from 'web3'

const ethDecimals = 18;

const Pool = () => {
  const { active, chainId, account, error, library } = useWeb3React();
  const [userSupplied, setUserSupplied] = useState()
  const [totalSupplied, setTotalSupplied] = useState()
  const [apy, setApy] = useState()
  const [cEthBalance, setCEthBalance] = useState()
  const [cEthExchangeRate, setCEthExchangeRate] = useState()


  const [myBalance, setMyBalance] = useState()
  
  useEffect(() => {
    if (active) {
      const init = async () => {
        //   Ropsten
        const cToken = new library.eth.Contract(cETH_ABI, '0x859e9d8a4edadfedb5a2ff311243af80f85a91b8');

        //   Rinkeby
        // const cETH = new library.eth.Contract(cETH_ABI, '0xd6801a1dffcd0a410336ef88def4320d6df1883e');

        // TODO fix this
        const totalSupplyValue = await cToken.methods.totalSupply().call()
        setTotalSupplied(web3.utils.fromWei(totalSupplyValue, 'ether'))

        /* get supplied */
        const balanceOfUnderlying = web3.utils.toBN(await cToken.methods
         .balanceOfUnderlying(account).call()) / Math.pow(10, ethDecimals);
    
        console.log("ETH supplied to the Compound Protocol:", balanceOfUnderlying, '\n');
        setUserSupplied(balanceOfUnderlying)
        
        let cTokenBalance = await cToken.methods.balanceOf(account).call() / 1e8;
        setCEthBalance(cTokenBalance)
        console.log("My wallet's cETH Token Balance:", cTokenBalance, '\n');
    
        let exchangeRateCurrent = await cToken.methods.exchangeRateCurrent().call();
        exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);
        console.log("Current exchange rate from cETH to ETH:", exchangeRateCurrent, '\n');
        setCEthExchangeRate(exchangeRateCurrent)

        /* calculate APY */
        const ethMantissa = 1e18;
        const blocksPerDay = 6570; // 13.15 seconds per block
        const daysPerYear = 365;

        const supplyRatePerBlock = await cToken.methods.supplyRatePerBlock().call();
        const supplyApy = (((Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
        setApy(supplyApy)

        // get balance
        let ethBalance = await library.eth.getBalance(account) / Math.pow(10, ethDecimals);
        setMyBalance(ethBalance)


      }
      init()
    }
  }, [active])

  const handleOnSupply = async () => {
    //     // Mint some cETH by supplying ETH to the Compound Protocol
    //     await cEthContract.methods.mint().send({
    //     from: myWalletAddress,
    //     gasLimit: web3.utils.toHex(250000),
    //     gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
    //     value: web3.utils.toHex(web3.utils.toWei('1', 'ether'))
    // });
  }

  return (
    <>
    {active && 
        <>
            <div className="wallet-info">
                <p cal>Your Supplied: {userSupplied} ETH</p>
                <p>Total Supplied: {totalSupplied} ETH</p>
                <p>APY: {apy} %</p>
            </div>
            <div className="wallet-info">
                <p>Balance: {myBalance} ETH</p>
                <p>---------------------------------------</p>
                <p>cEthBalance: {cEthBalance}</p>
                <p>cEthExchangeRate: {cEthExchangeRate}</p>
            </div>
        </>
    
    }

    </>
  );
};

export default Pool;
