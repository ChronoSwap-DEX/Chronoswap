import { Card, Container, Paper, Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { useCallback, useState, useMemo } from "react";
import ButtonWithLoader from "@/components/ButtonWithLoader";
import TokenSelectDialog from "@/components//TokenSelectDialog";
import HoverIcon from "@/components/HoverIcon";
import NumberTextField from "@/components//NumberTextField";
import { bigIntToString, getSwapDetails, swap, SwapDetails, tryGetBalance } from "../utils/dex";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { useDeadline } from "../hooks/useDeadline";
import { useSlippageTolerance } from "../hooks/useSlippageTolerance";
import { DEFAULT_SLIPPAGE } from "../state/settings/reducer";
import { useDispatch, useSelector } from 'react-redux'
import { reset, selectTokenIn, selectTokenOut, switchTokens, typeInput } from "../state/swap/actions";
import { useDerivedSwapInfo } from "../state/swap/hooks";
import { selectSwapState } from "../state/swap/selectors";

import { TransactionSubmitted, WaitingForTxSubmission } from "@/components//Transactions";
import BigNumber from "bignumber.js";
import { DetailItem } from "@/components//DetailsItem";
import { useWallet } from "@alephium/web3-react";
import MainLayout from "@/components/mainLayout";

function Swap() {
  
  const [txId, setTxId] = useState<string | undefined>(undefined)
  const [swapping, setSwapping] = useState<boolean>(false)
  const dispatch = useDispatch()
  const [error, setError] = useState<string | undefined>(undefined)
  const [slippage,] = useSlippageTolerance()
  const [deadline,] = useDeadline()
  const { connectionStatus, signer, account, explorerProvider } = useWallet()
  const { balance, updateBalanceForTx } = useAvailableBalances()

  const handleTokenInChange = useCallback((tokenInfo) => {
    dispatch(selectTokenIn(tokenInfo))
  }, [dispatch]);

  const handleTokenOutChange = useCallback((tokenInfo) => {
    dispatch(selectTokenOut(tokenInfo))
  }, [dispatch]);

  const { tokenInInfo, tokenOutInfo } = useSelector(selectSwapState)
  const { tokenInInput, tokenOutInput, tokenInAmount, tokenOutAmount, tokenPairState, swapType } = useDerivedSwapInfo(setError)

  const swapDetails = useMemo(() => {
    if (
      swapType === undefined ||
      tokenPairState === undefined ||
      tokenInAmount === undefined ||
      tokenOutAmount === undefined ||
      tokenInInfo === undefined ||
      tokenOutInfo === undefined
    ) {
      return undefined
    }
    const slippageTolerance = slippage === 'auto' ? DEFAULT_SLIPPAGE : slippage
    return getSwapDetails(swapType, tokenPairState, tokenInInfo, tokenOutInfo, tokenInAmount, tokenOutAmount, slippageTolerance)
  }, [tokenInAmount, tokenOutAmount, tokenPairState, swapType, tokenInInfo, tokenOutInfo, slippage])

  const handleTokenInAmountChange = useCallback((event) => {
    dispatch(typeInput({ type: 'TokenIn', value: event.target.value }))
  }, [dispatch])

  const handleTokenOutAmountChange = useCallback((event) => {
    dispatch(typeInput({ type: 'TokenOut', value: event.target.value }))
  }, [dispatch])

  const switchCallback = useCallback(() => {
    dispatch(switchTokens())
  }, [dispatch]);

  const handleReset = useCallback(() => {
    dispatch(reset())
    setTxId(undefined)
    setSwapping(false)
    setError(undefined)
  }, [dispatch])

  const tokenInBalance = useMemo(() => {
    return tryGetBalance(balance, tokenInInfo)
  }, [balance, tokenInInfo])

  const tokenOutBalance = useMemo(() => {
    return tryGetBalance(balance, tokenOutInfo)
  }, [balance, tokenOutInfo])

  const completed = useMemo(() => txId !== undefined, [txId])

  const sourceContent = (
    <div className="relative bg-gradient-to-br from-blue-950 to-indigo-950 rounded-lg">

      {tokenInBalance ? (<label className="absolute top-0 left-0 ml-2 mt-2 text-sm text-gray-400"> {tokenInInfo?.symbol}: {tokenInBalance} </label>) : null}

      <div className="flex p-1">

        <NumberTextField value={tokenInInput !== undefined ? tokenInInput : ''} onChange={handleTokenInAmountChange} autoFocus={true} disabled={!!swapping || !!completed}/>
        <TokenSelectDialog tokenId={tokenInInfo?.id} counterpart={tokenOutInfo?.id} onChange={handleTokenInChange} tokenBalances={balance}/>
        
      </div>
    </div>
  );

  const middleButton = <HoverIcon onClick={switchCallback} />;

  const targetContent = (
    <div className="relative bg-gradient-to-br from-blue-950 to-indigo-950 rounded-lg">

      {tokenOutBalance ? (<label className="absolute top-0 left-0 ml-2 mt-2 text-sm text-gray-400"> {tokenOutInfo?.symbol}: {tokenOutBalance} </label>) : null}

      <div className="flex p-1">
        <NumberTextField value={tokenOutInput !== undefined ? tokenOutInput : ''} onChange={handleTokenOutAmountChange} disabled={!!swapping || !!completed}/>
        <TokenSelectDialog tokenId={tokenOutInfo?.id} counterpart={tokenInInfo?.id} onChange={handleTokenOutChange} tokenBalances={balance}/>
      </div>
      
    </div>
  );

  const handleSwap = useCallback(async () => {
    try {
      setSwapping(true)
      if (connectionStatus === 'connected' && explorerProvider !== undefined && swapDetails !== undefined) {
        const result = await swap(
          swapDetails,
          balance,
          signer,
          explorerProvider,
          account.address,
          deadline
        )
        console.log(`swap tx submitted, tx id: ${result.txId}`)
        setTxId(result.txId)
        updateBalanceForTx(result.txId)
        setSwapping(false)
      }
    } catch (error) {
      setError(`${error}`)
      setSwapping(false)
      console.error(`failed to swap, error: ${error}`)
    }
  }, [connectionStatus, account, explorerProvider, signer, swapDetails, slippage, deadline, balance, updateBalanceForTx])

  const readyToSwap =
    connectionStatus === 'connected' &&
    !swapping && !completed &&
    error === undefined &&
    swapDetails !== undefined

  const swapButton = (
    <ButtonWithLoader
      disabled={!readyToSwap}
      onClick={handleSwap}
      className={"w-6/12 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow text-md font-bold mt-4" + (!readyToSwap ? " " + "disabled" : "")}>
        Swap
    </ButtonWithLoader>
  );

  return (
    <MainLayout>
      <div className="mt-20"/>
      <div className={"p-4 max-w-lg mx-auto bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl text-white border-solid border-indigo-600 border-y border-x"}>
        <div className="space-y-4">
          <label className="text-xl font-medium">Swap</label>

          <div className="relative p-4 overflow-hidden">
            <WaitingForTxSubmission open={!!swapping && !completed} text="Swapping" />
            <TransactionSubmitted open={!!completed} txId={txId!} buttonText="Swap More Coins" onClick={handleReset} />

            {connectionStatus !== 'connected' ?
              <div className="text-white">
                <p color="red" className="block text-xl font-bold text-red-600 error">
                  Your wallet is not connected!
                </p>

                <p className="block text-md font-medium error">
                  Use the "Connect Alephium" button in the top right, to connect your wallet.
                </p>
              </div> : null
            }

            <div>
              <Collapse in={!swapping && !completed && connectionStatus === 'connected'}>
                {
                  <>
                    {sourceContent}
                    <div className="flex justify-center w-full">
                      {middleButton}
                    </div>
                    
                    {targetContent}
                    {error ? (
                      <p className="block text-md font-medium text-red-600 error">
                        {error}
                      </p>
                    ) : null}
                    <div className="mt-4"/>
                  </>
                }
                <SwapDetailsCard swapDetails={swapDetails}></SwapDetailsCard>
                <div className="flex justify-center">
                  {swapButton}
                </div>
                
              </Collapse>
            </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
}

function formatPriceImpact(impact: number): string {
  if (impact < 0.0001) {
    return '< 0.0001'
  }
  return impact.toFixed(4)
}

function calcPrice(reserveIn: bigint, tokenInDecimals: number, reserveOut: bigint, tokenOutDecimals: number): string {
  const numerator = reserveIn * (10n ** BigInt(tokenOutDecimals))
  const denumerator = reserveOut * (10n ** BigInt(tokenInDecimals))
  const price = BigNumber(numerator.toString()).div(BigNumber(denumerator.toString()))
  const min = BigNumber('0.000001')
  if (price.lt(min)) {
    return `< ${min}`
  }
  return `= ${price.toFixed(6)}`
}

function SwapDetailsCard({ swapDetails } : { swapDetails : SwapDetails | undefined }) {
  if (swapDetails === undefined) {
    return null
  }

  const {
    swapType,
    state,
    tokenInInfo,
    tokenOutInfo,
    tokenOutAmount,
    maximalTokenInAmount,
    minimalTokenOutAmount,
    priceImpact
  } = swapDetails
  const [[reserveIn, tokenInDecimals], [reserveOut, tokenOutDecimals]] = state.token0Info.id === tokenInInfo.id
    ? [[state.reserve0, state.token0Info.decimals], [state.reserve1, state.token1Info.decimals]]
    : [[state.reserve1, state.token1Info.decimals], [state.reserve0, state.token0Info.decimals]]
  return <Card variant='outlined' style={{ width: '100%', padding: '0', borderRadius: '10px' }}>
    <div style={{ display: 'grid', gridAutoRows: 'auto', gridRowGap: '5px', paddingTop: '10px', paddingBottom: '10px' }}>
      <DetailItem
        itemName='Price:'
        itemValue={`1 ${tokenOutInfo.symbol} ${calcPrice(reserveIn, tokenInDecimals, reserveOut, tokenOutDecimals)} ${tokenInInfo.symbol}`}
      />
      <DetailItem
        itemName='Expected Output:'
        itemValue={`${bigIntToString(tokenOutAmount, tokenOutInfo.decimals)} ${tokenOutInfo.symbol}`}
      />
      <DetailItem
        itemName='Price Impact:'
        itemValue={`${formatPriceImpact(priceImpact)} %`}
      />
      <DetailItem
        itemName={swapType === 'ExactIn' ? 'Minimal received after slippage:' : 'Maximum sent after slippage:'}
        itemValue={
          swapType === 'ExactIn'
            ? `${bigIntToString(minimalTokenOutAmount!, tokenOutInfo.decimals)} ${tokenOutInfo.symbol}`
            : `${bigIntToString(maximalTokenInAmount!, tokenInInfo.decimals)} ${tokenInInfo.symbol}`
        }
      />
    </div>
  </Card>
}

export default Swap;
