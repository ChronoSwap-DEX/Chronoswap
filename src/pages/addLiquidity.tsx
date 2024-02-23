import { Card, Container, Paper, Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { useCallback, useMemo, useState } from "react";
import ButtonWithLoader from "@/components/ButtonWithLoader";
import TokenSelectDialog from "@/components/TokenSelectDialog";
import NumberTextField from "@/components/NumberTextField";
import { addLiquidity, bigIntToString, PairTokenDecimals, minimalAmount, AddLiquidityDetails, tryGetBalance } from "../utils/dex";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { useSlippageTolerance } from "../hooks/useSlippageTolerance";
import { useDeadline } from "../hooks/useDeadline";
import { DEFAULT_SLIPPAGE } from "../state/settings/reducer";
import { useDispatch, useSelector } from 'react-redux'
import { reset, selectTokenA, selectTokenB, typeInput } from "../state/mint/actions";
import { useDerivedMintInfo } from "../state/mint/hooks";
import { selectMintState } from "../state/mint/selectors";

import { useRouter } from 'next/router';
import { TransactionSubmitted, WaitingForTxSubmission } from "@/components/Transactions";
import { DetailItem } from "@/components/DetailsItem";
import { useWallet } from "@alephium/web3-react";
import MainLayout from "@/components/mainLayout";

function AddLiquidity() {
  
  const [txId, setTxId] = useState<string | undefined>(undefined)
  const [addingLiquidity, setAddingLiquidity] = useState<boolean>(false)
  const [slippage,] = useSlippageTolerance()
  const [deadline,] = useDeadline()
  const dispatch = useDispatch()
  const [error, setError] = useState<string | undefined>(undefined)
  const { signer, account, connectionStatus, explorerProvider } = useWallet()
  const { balance, updateBalanceForTx } = useAvailableBalances()
  const router = useRouter();

  const handleTokenAChange = useCallback((tokenInfo) => {
    dispatch(selectTokenA(tokenInfo))
  }, [dispatch]);

  const handleTokenBChange = useCallback((tokenInfo) => {
    dispatch(selectTokenB(tokenInfo))
  }, [dispatch]);

  const { tokenAInfo, tokenBInfo } = useSelector(selectMintState)
  const { tokenAInput, tokenBInput, tokenAAmount, tokenBAmount, tokenPairState, addLiquidityDetails } = useDerivedMintInfo(setError)

  const handleTokenAAmountChange = useCallback((event) => {
    const hasLiquidity = tokenPairState !== undefined && tokenPairState.reserve0 > 0n
    dispatch(typeInput({ type: 'TokenA', value: event.target.value, hasLiquidity }))
  }, [dispatch, tokenPairState])

  const handleTokenBAmountChange = useCallback((event) => {
    const hasLiquidity = tokenPairState !== undefined && tokenPairState.reserve0 > 0n
    dispatch(typeInput({ type: 'TokenB', value: event.target.value, hasLiquidity }))
  }, [dispatch, tokenPairState])

  const completed = useMemo(() => txId !== undefined, [txId])

  const redirectToSwap = () => {
    dispatch(reset())
    setTxId(undefined)
    setAddingLiquidity(false)
    setError(undefined)
    router.push('/addliquidity')
  }

  const tokenABalance = useMemo(() => {
    return tryGetBalance(balance, tokenAInfo)
  }, [balance, tokenAInfo])

  const tokenBBalance = useMemo(() => {
    return tryGetBalance(balance, tokenBInfo)
  }, [balance, tokenBInfo])

  const sourceContent = (
    <div>
      <div className="inputRow">
        <TokenSelectDialog
          tokenId={tokenAInfo?.id}
          counterpart={tokenBInfo?.id}
          onChange={handleTokenAChange}
          tokenBalances={balance} />

        <NumberTextField
          className="numberField"
          value={tokenAInput !== undefined ? tokenAInput : ''}
          onChange={handleTokenAAmountChange}
          autoFocus={true}
          InputProps={{ disableUnderline: true }}
          disabled={!!addingLiquidity || !!completed}
        />
        
      </div>
      {tokenABalance ?
        (<Typography className="balance">
          Balance: {tokenABalance}
        </Typography>) : null}
    </div>
  );
  const targetContent = (
    <div className="">
      <div className="inputRow">
        <TokenSelectDialog
          tokenId={tokenBInfo?.id}
          counterpart={tokenAInfo?.id}
          onChange={handleTokenBChange}
          tokenBalances={balance}
        />
        <NumberTextField
          className="numberField"
          value={tokenBInput !== undefined ? tokenBInput : ''}
          onChange={handleTokenBAmountChange}
          InputProps={{ disableUnderline: true }}
          disabled={!!addingLiquidity || !!completed}
        />
      </div>
      {tokenBBalance ?
        (<Typography className="balance">
          Balance: {tokenBBalance}
        </Typography>) : null}
    </div>
  );

  const handleAddLiquidity = useCallback(async () => {
    try {
      setAddingLiquidity(true)
      if (
        connectionStatus === 'connected' &&
        explorerProvider !== undefined &&
        tokenPairState !== undefined &&
        tokenAInfo !== undefined &&
        tokenBInfo !== undefined &&
        tokenAAmount !== undefined &&
        tokenBAmount !== undefined
      ) {
        const result = await addLiquidity(
          balance,
          signer,
          explorerProvider,
          account.address,
          tokenPairState,
          tokenAInfo,
          tokenBInfo,
          tokenAAmount,
          tokenBAmount,
          slippage === 'auto' ? DEFAULT_SLIPPAGE : slippage,
          deadline
        )
        console.log(`add liquidity succeed, tx id: ${result.txId}`)
        setTxId(result.txId)
        updateBalanceForTx(result.txId)
        setAddingLiquidity(false)
      }
    } catch (error) {
      setError(`${error}`)
      setAddingLiquidity(false)
      console.error(`failed to add liquidity, error: ${error}`)
    }
  }, [connectionStatus, explorerProvider, signer, account, tokenPairState, tokenAInfo, tokenBInfo, tokenAAmount, tokenBAmount, slippage, deadline, balance, updateBalanceForTx])

  const readyToAddLiquidity =
    connectionStatus === 'connected' &&
    tokenAInfo !== undefined &&
    tokenBInfo !== undefined &&
    tokenAAmount !== undefined &&
    tokenBAmount !== undefined &&
    !addingLiquidity && !completed && 
    error === undefined
  const addLiquidityButton = (
    <ButtonWithLoader
      disabled={!readyToAddLiquidity}
      onClick={handleAddLiquidity}
      className={"w-6/12 py-3 bg-blue-800 hover:bg-blue-950 rounded-md text-md font-bold mt-4" + (!readyToAddLiquidity ? " " + "disabled" : "")}
    >
      Add Liquidity
    </ButtonWithLoader>
  );

  return (
    <MainLayout>
      <div className="p-4 max-w-lg mx-auto bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl text-white border-solid border-indigo-600 border-y border-x" >

        <div className="space-y-4">
        <label className="block text-lg">Add Liquidity</label>

        <div className="relative">
          <div className="p-4 overflow-hidden">
            <WaitingForTxSubmission open={!!addingLiquidity && !completed}  text="Adding Liquidity" />
          <TransactionSubmitted open={!!completed} txId={txId!} buttonText="Swap Coins" onClick={redirectToSwap}/>
          
          {connectionStatus !== 'connected' ?
            <div>
              <Typography variant="h6" color="error" className={"error"}>
                Your wallet is not connected
              </Typography>
            </div> : null
          }

          <div>
            <Collapse in={!addingLiquidity && !completed && connectionStatus === 'connected'}>
              {
                <>
                  {sourceContent}
                  <div className={"spacer"} />
                  {targetContent}
                  {error ? (
                    <p className="block text-md font-medium text-red-600 error">
                      {error}
                    </p>
                  ) : null}
                  <div className={"spacer"} />
                </>
              }
              <AddLiquidityDetailsCard details={addLiquidityDetails} slippage={slippage === 'auto' ? DEFAULT_SLIPPAGE : slippage}></AddLiquidityDetailsCard>
              <div className="flex justify-center">
                {addLiquidityButton}
              </div>
              
            </Collapse>
          </div>
          </div>
        </div>

        </div>
        
      </div>
    </MainLayout>
    
  );
}

function AddLiquidityDetailsCard({ details, slippage } : { details: AddLiquidityDetails | undefined, slippage: number }) {
  if (details === undefined) {
    return null
  }

  const { state, tokenAId, shareAmount, sharePercentage, amountA, amountB } = details
  const [tokenA, tokenB] = tokenAId === state.token0Info.id
      ? [{ info: state.token0Info, amount: amountA }, { info: state.token1Info, amount: amountB }]
      : [{ info: state.token1Info, amount: amountA }, { info: state.token0Info, amount: amountB }]
  return <Card variant='outlined' style={{ width: '100%', padding: '0', borderRadius: '10px' }}>
    <div style={{ display: 'grid', gridAutoRows: 'auto', gridRowGap: '5px', paddingTop: '10px', paddingBottom: '10px' }}>
      <DetailItem
        itemName='Liquidity token amount:'
        itemValue={`${bigIntToString(shareAmount, PairTokenDecimals)}`}
      />
      <DetailItem
        itemName='Share percentage:'
        itemValue={`${sharePercentage} %`}
      />
      <DetailItem
        itemName={`Minimal amount of ${tokenA.info.symbol} after slippage:`}
        itemValue={`${bigIntToString(minimalAmount(tokenA.amount, slippage), tokenA.info.decimals)} ${tokenA.info.symbol}`}
      />
      <DetailItem
        itemName={`Minimal amount of ${tokenB.info.symbol} after slippage:`}
        itemValue={`${bigIntToString(minimalAmount(tokenB.amount, slippage), tokenB.info.decimals)} ${tokenB.info.symbol}`}
      />
    </div>
  </Card>
}

export default AddLiquidity;
