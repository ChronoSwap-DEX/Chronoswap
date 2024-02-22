import { Container, Paper, Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { TokenInfo } from "@alephium/token-list"
import { useCallback, useEffect, useMemo, useState } from "react";
import ButtonWithLoader from "@/components/ButtonWithLoader";
import { tokenPairExist, createTokenPair } from "../utils/dex";
import { useAvailableBalances } from "../hooks/useAvailableBalance";

import TokenSelectDialog from "@/components/TokenSelectDialog";

import { useRouter } from 'next/router';

import { TransactionSubmitted, WaitingForTxSubmission } from "@/components/Transactions";

import { useWallet } from "@alephium/web3-react";
import MainLayout from "@/components/mainLayout";

function AddPool() {

  const [tokenAInfo, setTokenAInfo] = useState<TokenInfo | undefined>(undefined)
  const [tokenBInfo, setTokenBInfo] = useState<TokenInfo | undefined>(undefined)
  const [txId, setTxId] = useState<string | undefined>(undefined)
  const [addingPool, setAddingPool] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const { account, signer, connectionStatus, nodeProvider, explorerProvider } = useWallet()
  const { balance, updateBalanceForTx } = useAvailableBalances()
  const router = useRouter();

  useEffect(() => {
    async function checkContractExist() {
      if (tokenAInfo !== undefined && tokenBInfo !== undefined && connectionStatus === 'connected' && nodeProvider !== undefined) {
        try {
          const exist = await tokenPairExist(nodeProvider, tokenAInfo.id, tokenBInfo.id)
          if (exist) setError(`token pair already exist`)
        } catch (err) {
          setError(`${err}`)
        }
      }
    }

    setError(undefined)
    checkContractExist()
  }, [tokenAInfo, tokenBInfo, nodeProvider, connectionStatus])

  const handleTokenAChange = useCallback((tokenInfo) => {
    setTokenAInfo(tokenInfo)
  }, [])

  const handleTokenBChange = useCallback((tokenInfo) => {
    setTokenBInfo(tokenInfo)
  }, [])

  const completed = useMemo(() => txId !== undefined, [txId])

  const redirectToAddLiquidity = () => {
    setTokenAInfo(undefined)
    setTokenBInfo(undefined)
    setTxId(undefined)
    setAddingPool(false)
    setError(undefined)
    router.push('/addpool')
  };

  const tokenPairContent = (
    <div className="flex">
      <TokenSelectDialog
        tokenId={tokenAInfo?.id}
        counterpart={tokenBInfo?.id}
        onChange={handleTokenAChange}
        tokenBalances={balance}
        mediumSize={true}
      />
      <TokenSelectDialog
        tokenId={tokenBInfo?.id}
        counterpart={tokenAInfo?.id}
        onChange={handleTokenBChange}
        tokenBalances={balance}
        mediumSize={true}
      />
    </div>
  )

  const handleAddPool = useCallback(async () => {
    try {
      setAddingPool(true)
      if (connectionStatus === 'connected' && explorerProvider !== undefined && tokenAInfo !== undefined && tokenBInfo !== undefined) {
        const result = await createTokenPair(
          signer,
          explorerProvider,
          account.address,
          tokenAInfo.id,
          tokenBInfo.id
        )
        console.log(`add pool succeed, tx id: ${result.txId}, token pair id: ${result.tokenPairId}`)
        setTxId(result.txId)
        updateBalanceForTx(result.txId)
        setAddingPool(false)
      }
    } catch (error) {
      setError(`${error}`)
      setAddingPool(false)
      console.error(`failed to add pool, error: ${error}`)
    }
  }, [signer, account, connectionStatus, explorerProvider, tokenAInfo, tokenBInfo, updateBalanceForTx])

  const readyToAddPool =
    connectionStatus === 'connected'
    tokenAInfo !== undefined &&
    tokenBInfo !== undefined &&
    !addingPool && !completed && 
    error === undefined
  const addPoolButton = (
    <ButtonWithLoader
      disabled={!readyToAddPool}
      onClick={handleAddPool}
      className={"gradientButton" + (!readyToAddPool ? " " + "disabled" : "")}
    >
      Add Pool
    </ButtonWithLoader>
  );

  return (
    <MainLayout>
      <Container className="centeredContainer text-white" maxWidth="sm">
      <div className="titleBar "></div>
        Add Pool
      <div className="spacer"/>
      <Paper className="mainPaper">
        <WaitingForTxSubmission
          open={!!addingPool && !completed}
          text="Adding Pool"
        />
        <TransactionSubmitted
          open={!!completed}
          txId={txId!}
          buttonText="Add Liquidity"
          onClick={redirectToAddLiquidity}
        />
        {connectionStatus !== 'connected' ?
          <div>
            <Typography variant="h6" color="error" className="error">
              Your wallet is not connected
            </Typography>
          </div> : null
        }
        <div>
          <Collapse in={!addingPool && !completed && connectionStatus === 'connected'}>
            {
              <>
                {tokenPairContent}
                <div className="spacer"/>
                {error ? (
                  <Typography variant="body2" color="error" className="error">
                    {error}
                  </Typography>
                ) : null}
                <div className="spacer"/>
              </>
            }
            {addPoolButton}
          </Collapse>
        </div>
      </Paper>
      <div className="spacer" />
    </Container>
    </MainLayout>
    
  );
}

export default AddPool;
