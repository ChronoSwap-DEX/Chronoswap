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
    router.push('/addliquidity')
  };

  const tokenPairContent = (
    <div className="flex justify-between items-center w-full">
      <div className="flex-1 flex justify-center">
        <TokenSelectDialog
          tokenId={tokenAInfo?.id}
          counterpart={tokenBInfo?.id}
          onChange={handleTokenAChange}
          tokenBalances={balance} />
      </div>
      <div className="flex-1 flex justify-center">
      <TokenSelectDialog
        tokenId={tokenBInfo?.id}
        counterpart={tokenAInfo?.id}
        onChange={handleTokenBChange}
        tokenBalances={balance}/>
      </div>
      
    </div>
  )

  const handleAddPool = useCallback(async () => {
    try {
      setAddingPool(true)
      if (connectionStatus === 'connected' && explorerProvider !== undefined && tokenAInfo !== undefined && tokenBInfo !== undefined) {
        console.log('creating pool...')
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
      else
      {
        setError(`something failed`)
        setAddingPool(false)
        console.error(`failed to add pool`)
      }
    } catch (error) {
      setError(`${error}`)
      setAddingPool(false)
      console.error(`failed to add pool, error: ${error}`)
    }
  }, [signer, account, connectionStatus, explorerProvider, tokenAInfo, tokenBInfo, updateBalanceForTx])

  const readyToAddPool =
    connectionStatus === 'connected' &&
    tokenAInfo !== undefined &&
    tokenBInfo !== undefined &&
    !addingPool && !completed && 
    error === undefined

  const addPoolButton = (
    <ButtonWithLoader
      disabled={!readyToAddPool}
      onClick={handleAddPool}
      className={"w-6/12 py-3 bg-blue-800 hover:bg-blue-950 rounded-md text-md font-bold mt-4" + (!readyToAddPool ? " " + "disabled" : "")}>
        Add Pool
    </ButtonWithLoader>
    
  );

  return (
    <MainLayout>
      <div className="mt-20"/>
      <div className="p-4 max-w-lg mx-auto bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl text-white border-solid border-indigo-600 border-y border-x">

        <div className="space-y-4">
          <label className="text-xl font-medium">Add Pool</label>

          <div className="relative p-4 overflow-hidden">
            
            <WaitingForTxSubmission open={!!addingPool && !completed} text="Adding Pool"/>
            <TransactionSubmitted open={!!completed} txId={txId!} buttonText="Add Liquidity" onClick={redirectToAddLiquidity} />
            
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
              <Collapse in={!addingPool && !completed && connectionStatus === 'connected' }>
                {
                  <>
                    {tokenPairContent}
                    <div className="spacer"/>
                    {error ? (
                      <p className="block text-md font-medium text-red-600 error">
                        {error}
                      </p>
                    ) : null}
                    <div className="spacer"/>
                  </>
                }
                <div className="flex justify-center">
                  {addPoolButton}
                </div>
                  
              </Collapse>
            </div>

          </div>

        </div>
      
      </div>
    </MainLayout>
    
  );
}

export default AddPool;
