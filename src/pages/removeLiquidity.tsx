import { Card, Container, Paper, Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { useCallback, useEffect, useMemo, useState } from "react";
import ButtonWithLoader from "@/components/ButtonWithLoader";
import TokenSelectDialog from "@/components/TokenSelectDialog";
import NumberTextField from "@/components/NumberTextField";
import { TokenInfo } from '@alephium/token-list'
import {
  removeLiquidity,
  RemoveLiquidityDetails,
  getRemoveLiquidityDetails,
  PairTokenDecimals,
  stringToBigInt,
  bigIntToString
} from "../utils/dex";
import { formatUnits } from "ethers/lib/utils";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { useSlippageTolerance } from "../hooks/useSlippageTolerance";
import { useDeadline } from "../hooks/useDeadline";
import { DEFAULT_SLIPPAGE } from "../state/settings/reducer";

import { useTokenPairState } from "../state/useTokenPairState";
import { TransactionSubmitted, WaitingForTxSubmission } from "@/components/Transactions";
import { DetailItem } from "@/components/DetailsItem";
import { useRouter } from 'next/router';
import { useWallet } from "@alephium/web3-react";
import MainLayout from "@/components/mainLayout";

function RemoveLiquidity() {

  const [amountInput, setAmountInput] = useState<string | undefined>(undefined)
  const [amount, setAmount] = useState<bigint | undefined>(undefined)
  const [tokenAInfo, setTokenAInfo] = useState<TokenInfo | undefined>(undefined)
  const [tokenBInfo, setTokenBInfo] = useState<TokenInfo | undefined>(undefined)
  const [totalLiquidityAmount, setTotalLiquidityAmount] = useState<bigint | undefined>(undefined)
  const [removeLiquidityDetails, setRemoveLiquidityDetails] = useState<RemoveLiquidityDetails | undefined>(undefined)
  const [txId, setTxId] = useState<string | undefined>(undefined)
  const [removingLiquidity, setRemovingLiquidity] = useState<boolean>(false)
  const [slippage,] = useSlippageTolerance()
  const [deadline,] = useDeadline()
  const [error, setError] = useState<string | undefined>(undefined)
  const { connectionStatus, signer, account, explorerProvider } = useWallet()
  const { balance: availableBalance, updateBalanceForTx } = useAvailableBalances()
  const router = useRouter();

  const handleTokenAChange = useCallback((tokenInfo) => {
    setTokenAInfo(tokenInfo);
  }, []);

  const handleTokenBChange = useCallback((tokenInfo) => {
    setTokenBInfo(tokenInfo)
  }, []);

  const { tokenPairState, getTokenPairStateError } = useTokenPairState(tokenAInfo, tokenBInfo)

  useEffect(() => {
    setTotalLiquidityAmount(undefined)
    if (tokenPairState !== undefined && getTokenPairStateError === undefined) {
      const balance = availableBalance.get(tokenPairState.tokenPairId)
      setTotalLiquidityAmount(balance === undefined ? 0n : balance)
    }
  }, [tokenPairState, getTokenPairStateError, availableBalance])

  useEffect(() => {
    setRemoveLiquidityDetails(undefined)
    try {
      if (
        tokenPairState !== undefined &&
        tokenAInfo !== undefined &&
        tokenBInfo !== undefined &&
        amount !== undefined &&
        totalLiquidityAmount !== undefined
      ) {
        const result = getRemoveLiquidityDetails(tokenPairState, totalLiquidityAmount, amount)
        setRemoveLiquidityDetails(result)
      }
    } catch (error) {
      setError(`${error}`)
      console.error(`failed to update token amounts: ${error}`)
    }
  }, [tokenPairState, tokenAInfo, tokenBInfo, amount, totalLiquidityAmount])

  const handleAmountChanged = useCallback(
    (event) => {
      setError(undefined)
      setRemoveLiquidityDetails(undefined)
      if (event.target.value === '') {
        setAmount(undefined)
        setAmountInput(undefined)
        return
      }
      setAmountInput(event.target.value)
      try {
        setAmount(stringToBigInt(event.target.value, PairTokenDecimals))
      } catch (error) {
        console.log(`Invalid input: ${event.target.value}, error: ${error}`)
        setError(`${error}`)
      }
    }, []
  )

  const redirectToSwap = () => {
    setTokenAInfo(undefined)
    setTokenBInfo(undefined)
    setAmount(undefined)
    setAmountInput(undefined)
    setTotalLiquidityAmount(undefined)
    setTxId(undefined)
    setRemovingLiquidity(false)
    setRemoveLiquidityDetails(undefined)
    setError(undefined)
    router.push('/swap')
  }

  const tokenPairContent = (
    <div className="flex">
      <TokenSelectDialog
        tokenId={tokenAInfo?.id}
        counterpart={tokenBInfo?.id}
        onChange={handleTokenAChange}
        tokenBalances={availableBalance}
      />
      <TokenSelectDialog
        tokenId={tokenBInfo?.id}
        counterpart={tokenAInfo?.id}
        onChange={handleTokenBChange}
        tokenBalances={availableBalance}
      />
    </div>
  )

  const completed = useMemo(() => txId !== undefined, [txId])
  
  const amountInputBox = (
    <div className="relative bg-gradient-to-br from-blue-950 to-indigo-950 rounded-lg p-2">
      <NumberTextField placeHolder="0.0" value={amountInput !== undefined ? amountInput : ''} onChange={handleAmountChanged} autoFocus={true} disabled={!!removingLiquidity || !!completed}/>
    </div>
  )

  const handleRemoveLiquidity = useCallback(async () => {
    try {
      setRemovingLiquidity(true)
      if (
        connectionStatus === 'connected' &&
        explorerProvider !== undefined &&
        tokenPairState !== undefined &&
        removeLiquidityDetails !== undefined &&
        tokenAInfo !== undefined &&
        tokenBInfo !== undefined &&
        amount !== undefined
      ) {
        if (amount === 0n) {
          throw new Error('the input amount must be greater than 0')
        }

        const result = await removeLiquidity(
          signer,
          explorerProvider,
          account.address,
          tokenPairState,
          amount,
          removeLiquidityDetails.amount0,
          removeLiquidityDetails.amount1,
          slippage === 'auto' ? DEFAULT_SLIPPAGE : slippage,
          deadline
        )
        console.log(`remove liquidity succeed, tx id: ${result.txId}`)
        setTxId(result.txId)
        updateBalanceForTx(result.txId)
        setRemovingLiquidity(false)
      }
    } catch (error) {
      setError(`${error}`)
      setRemovingLiquidity(false)
      console.error(`failed to remove liquidity, error: ${error}`)
    }
  }, [connectionStatus, signer, account, explorerProvider, tokenPairState, tokenAInfo, tokenBInfo, amount, removeLiquidityDetails, slippage, deadline, updateBalanceForTx])

  const readyToRemoveLiquidity =
    connectionStatus === 'connected' &&
    tokenAInfo !== undefined &&
    tokenBInfo !== undefined &&
    amount !== undefined &&
    totalLiquidityAmount !== undefined &&
    removeLiquidityDetails !== undefined &&
    !removingLiquidity && !completed && 
    error === undefined &&
    getTokenPairStateError === undefined
  const removeLiquidityButton = (
    <ButtonWithLoader
      disabled={!readyToRemoveLiquidity}
      onClick={handleRemoveLiquidity}
      className={
        "gradientButton" + (!readyToRemoveLiquidity ? " " + "disabled" : "")
      }
    >
      Remove Liquidity
    </ButtonWithLoader>
  );

  return (
    <MainLayout>
      <div className="mt-20"/>

      <div className="p-4 max-w-lg mx-auto bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl text-white border-solid border-indigo-600 border-y border-x">
            <div className="space-y-4">
                <label className="text-xl font-medium">Remove Liquidity</label>

                <div className="relative p-4">
                    <div className="p-4 overflow-hidden">
                        <WaitingForTxSubmission open={!!removingLiquidity && !completed} text="Removing Liquidity"/>
                        <TransactionSubmitted open={!!completed} txId={txId!} buttonText="Swap Coins" onClick={redirectToSwap}/>

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
                        <Collapse in={!removingLiquidity && !completed && connectionStatus === 'connected'}>
                            {
                            <>
                                {tokenPairContent}
                                <div className="mt-8" />
                                {totalLiquidityAmount !== undefined ? (
                                <>
                                    <div className={"notification"}>
                                    <p className="text-left">Total LP tokens:</p>
                                    <p className="text-right">{formatUnits(totalLiquidityAmount, PairTokenDecimals)}</p>
                                    </div>
                                </>
                                ): null}
                                {amountInputBox}
                                <>
                                <div className={"spacer"} />
                                {error === undefined && getTokenPairStateError === undefined
                                    ? <RemoveLiquidityDetailsCard details={removeLiquidityDetails} amount={amount}/>
                                    : null
                                }
                                {error ? (
                                    <Typography variant="body2" color="error" className={"error"}>
                                    {error}
                                    </Typography>
                                ) : getTokenPairStateError ? (
                                    <Typography variant="body2" color="error" className={"error"}>
                                    {getTokenPairStateError}
                                    </Typography>
                                ) : null}
                                </>
                                <div className={"spacer"} />
                                {removeLiquidityButton}
                            </>
                            }
                        </Collapse>
                        </div>
                    </div>
                </div>

            </div>
      </div>
      
    </MainLayout>
  );
}

function RemoveLiquidityDetailsCard({ details, amount } : { details: RemoveLiquidityDetails | undefined, amount: bigint | undefined }) {
  if (details === undefined || amount === undefined) {
    return null
  }
  const { state, remainShareAmount, remainSharePercentage } = details
  const getTokenAmount = (tokenInfo: TokenInfo): string => {
    const tokenAmount = tokenInfo.id === details.token0Id ? details.amount0 : details.amount1
    return bigIntToString(tokenAmount, tokenInfo.decimals)
  }
  return <Card variant='outlined' style={{ width: '100%', padding: '0', borderRadius: '10px' }}>
    <div style={{ display: 'grid', gridAutoRows: 'auto', gridRowGap: '5px', paddingTop: '10px', paddingBottom: '10px' }}>
      <DetailItem
        itemName={`The number of ${state.token0Info.symbol} you will receive:`}
        itemValue={`${getTokenAmount(state.token0Info)} ${state.token0Info.symbol}`}
      />
      <DetailItem
        itemName={`The number of ${state.token1Info.symbol} you will receive:`}
        itemValue={`${getTokenAmount(state.token1Info)} ${state.token1Info.symbol}`}
      />
      <DetailItem
        itemName={'Remain share amount:'}
        itemValue={`${bigIntToString(remainShareAmount, PairTokenDecimals)}`}
      />
      <DetailItem
        itemName={`Remain share percentage:`}
        itemValue={`${remainSharePercentage} %`}
      />
    </div>
  </Card>
}

export default RemoveLiquidity;
