// pages/liquidity.tsx
import { useCallback, useMemo, useState } from "react";

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

import { TransactionSubmitted, WaitingForTxSubmission } from "@/components/Transactions";
import { DetailItem } from "@/components/DetailsItem";

import { useWallet } from "@alephium/web3-react";
import { useRouter } from "next/router";

export default function AddLiquidity() {

  const [txId, setTxId] = useState<string | undefined>(undefined)
  const [addingLiquidity, setAddingLiquidity] = useState<boolean>(false)
  const [slippage,] = useSlippageTolerance()
  const [deadline,] = useDeadline()
  const dispatch = useDispatch()
  const [error, setError] = useState<string | undefined>(undefined)
  const { signer, account, connectionStatus, explorerProvider } = useWallet()
  const { balance, updateBalanceForTx } = useAvailableBalances()
  const router = useRouter();

  const handleTokenAChange = useCallback((tokenInfo: any) => {
    dispatch(selectTokenA(tokenInfo))
  }, [dispatch]);

  const handleTokenBChange = useCallback((tokenInfo: any) => {
    dispatch(selectTokenB(tokenInfo))
  }, [dispatch]);

  const { tokenAInfo, tokenBInfo } = useSelector(selectMintState)
  const { tokenAInput, tokenBInput, tokenAAmount, tokenBAmount, tokenPairState, addLiquidityDetails } = useDerivedMintInfo(setError)

  const handleTokenAAmountChange = useCallback((event: any) => {
    const hasLiquidity = tokenPairState !== undefined && tokenPairState.reserve0 > 0n
    dispatch(typeInput({ type: 'TokenA', value: event.target.value, hasLiquidity }))
  }, [dispatch, tokenPairState])

  const handleTokenBAmountChange = useCallback((event: any) => {
    const hasLiquidity = tokenPairState !== undefined && tokenPairState.reserve0 > 0n
    dispatch(typeInput({ type: 'TokenB', value: event.target.value, hasLiquidity }))
  }, [dispatch, tokenPairState])

  const completed = useMemo(() => txId !== undefined, [txId])

  const redirectToSwap = () => {
    dispatch(reset())
    setTxId(undefined)
    setAddingLiquidity(false)
    setError(undefined)
    router.push("/swap");
  }

  const tokenABalance = useMemo(() => {
    return tryGetBalance(balance, tokenAInfo)
  }, [balance, tokenAInfo])

  const tokenBBalance = useMemo(() => {
    return tryGetBalance(balance, tokenBInfo)
  }, [balance, tokenBInfo])

  const sourceContent = (
    <div className={classes.tokenContainerWithBalance}>
      <div className={classes.inputRow}>
        <TokenSelectDialog
          tokenId={tokenAInfo?.id}
          counterpart={tokenBInfo?.id}
          onChange={handleTokenAChange}
          tokenBalances={balance}
          style2={true}
        />
        <NumberTextField
          className={classes.numberField}
          value={tokenAInput !== undefined ? tokenAInput : ''}
          onChange={handleTokenAAmountChange}
          autoFocus={true}
          InputProps={{ disableUnderline: true }}
          disabled={!!addingLiquidity || !!completed}
        />
      </div>
      {tokenABalance ?
        (<Typography className={classes.balance}>
          Balance: {tokenABalance}
        </Typography>) : null}
    </div>
  );
  const targetContent = (
    <div className={classes.tokenContainerWithBalance}>
      <div className={classes.inputRow}>
        <TokenSelectDialog
          tokenId={tokenBInfo?.id}
          counterpart={tokenAInfo?.id}
          onChange={handleTokenBChange}
          tokenBalances={balance}
        />
        <NumberTextField
          className={classes.numberField}
          value={tokenBInput !== undefined ? tokenBInput : ''}
          onChange={handleTokenBAmountChange}
          InputProps={{ disableUnderline: true }}
          disabled={!!addingLiquidity || !!completed}
        />
      </div>
      {tokenBBalance ?
        (<Typography className={classes.balance}>
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
      className={
        classes.gradientButton + (!readyToAddLiquidity ? " " + classes.disabled : "")
      }
    >
      Add Liquidity
    </ButtonWithLoader>
  );

  return (
    <MainLayout>
        <div className="p-4 max-w-lg mx-auto bg-gradient-to-br from-blue-950 to-indigo-800 rounded-2xl text-white border-solid border-indigo-600 border-y border-x">
            <Container className={classes.centeredContainer} maxWidth="sm">
          <div className={classes.titleBar}></div>
          <Typography variant="h4" color="textSecondary">
            Add Liquidity
          </Typography>
          <div className={classes.spacer} />
          <Paper className={classes.mainPaper}>
            <WaitingForTxSubmission
              open={!!addingLiquidity && !completed}
              text="Adding Liquidity"
            />
            <TransactionSubmitted
              open={!!completed}
              txId={txId!}
              buttonText="Swap Coins"
              onClick={redirectToSwap}
            />
            {connectionStatus !== 'connected' ?
              <div>
                <Typography variant="h6" color="error" className={classes.error}>
                  Your wallet is not connected
                </Typography>
              </div> : null
            }
            <div>
              <Collapse in={!addingLiquidity && !completed && connectionStatus === 'connected'}>
                {
                  <>
                    {sourceContent}
                    <div className={classes.spacer} />
                    {targetContent}
                    {error ? (
                      <Typography variant="body2" color="error" className={classes.error}>
                        {error}
                      </Typography>
                    ) : null}
                    <div className={classes.spacer} />
                  </>
                }
                <AddLiquidityDetailsCard details={addLiquidityDetails} slippage={slippage === 'auto' ? DEFAULT_SLIPPAGE : slippage}></AddLiquidityDetailsCard>
                {addLiquidityButton}
              </Collapse>
            </div>
          </Paper>
          <div className={classes.spacer} />
        </Container>
        </div>
    </MainLayout>
      
  );
}
  