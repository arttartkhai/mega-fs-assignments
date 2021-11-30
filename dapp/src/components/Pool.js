import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
// TODO: use Rinkeby
import cETH_ABI from  '../constant/ABI/cETH-Ropsten.json'

const ethDecimals = 18;

const InfoBox = ({children, ...props}) => (
  <div className="p-3 border-2 border-pink-300 rounded-xl text-center" {...props}> {children}</div>
)

const Pool = () => {
  const { active, account, error, library: web3 } = useWeb3React();
  const [cToken, setCToken] = useState(undefined)
  const [errMessage, setErrMessage] = useState('')
  const [loading, setLoading] = useState(false)


  const [userSupplied, setUserSupplied] = useState()
  const [totalSupplied, setTotalSupplied] = useState()
  const [apy, setApy] = useState()
  
  const [cEthBalance, setCEthBalance] = useState()
  const [cEthExchangeRate, setCEthExchangeRate] = useState()

  // supply
  const [ethBalance, setEthBalance] = useState()
  const [inputSupplyAmount, setInputSupplyAmount] = useState('')
  // withdraw
  const [inputWithdrawAmount, setInputWithdrawAmount] = useState('')

  useEffect(() => {
    if (active) {
      const init = async () => {

        //   Ropsten
        const cTokenContract = new web3.eth.Contract(cETH_ABI, '0x859e9d8a4edadfedb5a2ff311243af80f85a91b8');
        //   Rinkeby
        // const cTokenContract = new web3.eth.Contract(cETH_ABI, '0xd6801a1dffcd0a410336ef88def4320d6df1883e');

        setCToken(cTokenContract)

        // TODO: add event listener for update data
      }
      init()
    }
  }, [active])

  useEffect(() => {
    if (cToken) {
      const fetchData = async () => {
        // TODO research again what is total supply
        const contractBalance = await web3.eth.getBalance("0x859e9d8a4edadfedb5a2ff311243af80f85a91b8")
        // TODO use Rinkeby !!!!!!!!!!!!
        // const contractBalance = await web3.eth.getBalance("0xd6801a1dffcd0a410336ef88def4320d6df1883e")
        setTotalSupplied(web3.utils.fromWei(contractBalance, 'ether'))

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
        let ethTokenBalance = await web3.eth.getBalance(account) / Math.pow(10, ethDecimals);
        setEthBalance(ethTokenBalance)
      }

      fetchData()
    }
  }, [cToken])

  const handleOnChangeSupplyInput = (e) => {
    setInputSupplyAmount(e.target.value)
  }
  const handleOnChangeWithdrawInput = (e) => {
    setInputWithdrawAmount(e.target.value)
  }

  const handleOnSupply = async () => {  
    if (inputSupplyAmount > ethBalance) {
      alert('Not sufficient')
      setInputSupplyAmount('')
      return
    }
    try {
      setLoading(true)

      const receipt = await cToken.methods.mint().send({
        from: account,
        value: web3.utils.toHex(web3.utils.toWei(inputSupplyAmount, 'ether'))
      });

      if (receipt) {
        console.log("🚀 ~ file: Pool.js ~ line 100 ~ handleOnSupply ~ receipt", receipt)
        setLoading(false)
        alert('Transaction was submitted')
      }
    } catch (e) {
      console.error(e)
      setErrMessage(e)
    }
  }

  const handleOnWithdraw = async () => {
    if (inputWithdrawAmount > cEthBalance) {
      alert('Not sufficient')
      setInputWithdrawAmount('')
      return
    }
    try {
      setLoading(true)

      const receipt =await cToken.methods.redeem(inputWithdrawAmount * 1e8).send({
        from: account,
      })

      if (receipt) {
        console.log("🚀 ~ file: Pool.js ~ line 127 ~ handleOnWithdraw ~ receipt", receipt)
        setLoading(false)
        alert('Transaction was submitted')
      }
    } catch (e) {
      console.error(e)
      setErrMessage(e)
    }
  }

  const handleOnClickMaxSupply = () => {
    setInputSupplyAmount(ethBalance)
  }
  const handleOnClickMaxWithdraw = () => {
    setInputWithdrawAmount(cEthBalance)
  }

  return (
    <>
    {errMessage && <span>Error: {errMessage?.toString()}</span>}
    <div>loading: {loading ? 'true' : 'false'}</div>
    {active && 
        <>
            <div className="grid grid-cols-3 gap-x-9">
                <InfoBox>Your Supplied: {userSupplied} ETH</InfoBox>
                <InfoBox>Total Supplied: {totalSupplied} ETH</InfoBox>
                <InfoBox>APY: {apy} %</InfoBox>
            </div>
            <div className="wallet-info">
                <p>cEthExchangeRate: {cEthExchangeRate}</p>
            </div>
            <div className='flex flex-col'>
              <h1>Supply</h1>
              <p>Balance: {ethBalance} ETH</p>
              <span className='self-end text-md text-blue-400 underline cursor-pointer' onClick={handleOnClickMaxSupply}>Max</span>
              <input type="number" className='w-half px-2 pb-1.5 text-primary text-base font-light rounded-md border-2 border-pink-300' onChange={handleOnChangeSupplyInput} value={inputSupplyAmount} />
              <p>Receiving: {inputSupplyAmount / cEthExchangeRate} cETH</p>
              <button onClick={handleOnSupply}>Supply</button>
            </div>
            <div className='flex flex-col'>
              <h1>Withdraw</h1>
              <p>Balance: {cEthBalance} cETH</p>
              <span className='self-end text-md text-blue-400 underline cursor-pointer' onClick={handleOnClickMaxWithdraw}>Max</span>
              <input type="number" className='w-half px-2 pb-1.5 text-primary text-base font-light rounded-md border-2 border-pink-300' onChange={handleOnChangeWithdrawInput} value={inputWithdrawAmount} />
              <p>Receiving: {inputWithdrawAmount * cEthExchangeRate} ETH</p>
              <button onClick={handleOnWithdraw}>Withdraw</button>
            </div>
        </>
    }
    </>
  );
};

export default Pool;
