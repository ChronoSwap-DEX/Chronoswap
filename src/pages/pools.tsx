import { Container, Paper, Typography, Card } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { useState, useCallback } from "react";
import { bigIntToString, PairTokenDecimals, TokenPairState } from "../utils/dex";
import { TokenInfo } from "@alephium/token-list";
import { useTokenPairState } from "../state/useTokenPairState";
import TokenSelectDialog from "@/components/TokenSelectDialog";
import { useAvailableBalances } from "../hooks/useAvailableBalance";
import { DetailItem } from "@/components/DetailsItem";
import BigNumber from "bignumber.js";
import { useWallet } from "@alephium/web3-react";
import MainLayout from "@/components/mainLayout";

function Pool() {
  
  const [tokenAInfo, setTokenAInfo] = useState<TokenInfo | undefined>(undefined)
  const [tokenBInfo, setTokenBInfo] = useState<TokenInfo | undefined>(undefined)
  const { tokenPairState, getTokenPairStateError } = useTokenPairState(tokenAInfo, tokenBInfo)
  const { connectionStatus } = useWallet()
  const { balance } = useAvailableBalances()

  const handleTokenAChange = useCallback((tokenInfo) => {
    setTokenAInfo(tokenInfo)
  }, [])

  const handleTokenBChange = useCallback((tokenInfo) => {
    setTokenBInfo(tokenInfo)
  }, [])

  const tokenPairContent = (
    <div className="flex justify-between items-center w-full">
      <TokenSelectDialog tokenId={tokenAInfo?.id} counterpart={tokenBInfo?.id} onChange={handleTokenAChange} tokenBalances={balance}/>
      <TokenSelectDialog tokenId={tokenBInfo?.id} counterpart={tokenAInfo?.id} onChange={handleTokenBChange} tokenBalances={balance}/>
    </div>
  )

  return (
    <MainLayout>
      <div className="mt-20"/>
        <div className="p-4 max-w-lg mx-auto bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl text-white border-solid border-indigo-600 border-y border-x">
          
          <div className="space-y-4">
          <label className="text-xl font-medium">Pool</label>

            <div className="relative p-4 overflow-hidden">

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

              <Collapse in={connectionStatus === 'connected'}>
              {
                <>
                  {tokenPairContent}
                  <div className={"spacer"} />
                  <div className={"spacer"} />
                    {getTokenPairStateError ? (
                    (
                      <p className="block text-md font-medium text-red-600 error">
                        {getTokenPairStateError}
                      </p>
                      )
                      ) : <PoolDetailsCard state={tokenPairState} balance={balance} />}
                </>
              }
              </Collapse>
            </div>

          </div>
          
        </div>

    </MainLayout>
    
  );
}

function PoolDetailsCard({ state, balance } : { state: TokenPairState | undefined, balance: Map<string, bigint> }) {
  if (state === undefined) {
    return null
  }

  const poolTokenBalance = balance.get(state.tokenPairId) ?? 0n
  const sharePecentage = BigNumber((poolTokenBalance * 100n).toString()).div(BigNumber(state.totalSupply.toString())).toFixed(5)
  return <Card variant='outlined' style={{ width: '100%', padding: '0', borderRadius: '10px' }}>
    <div style={{ display: 'grid', gridAutoRows: 'auto', gridRowGap: '5px', paddingTop: '10px', paddingBottom: '10px' }}>
      <DetailItem
        itemName={`Pooled ${state.token0Info.symbol}:`}
        itemValue={`${bigIntToString(state.reserve0, state.token0Info.decimals)} ${state.token0Info.symbol}`}
      />
      <DetailItem
        itemName={`Pooled ${state.token1Info.symbol}:`}
        itemValue={`${bigIntToString(state.reserve1, state.token1Info.decimals)} ${state.token1Info.symbol}`}
      />
      <DetailItem
        itemName={'Liquidity token total supply:'}
        itemValue={`${bigIntToString(state.totalSupply, PairTokenDecimals)}`}
      />
      <DetailItem
        itemName={'Your LP tokens:'}
        itemValue={`${bigIntToString(poolTokenBalance, PairTokenDecimals)}`}
      />
      <DetailItem
        itemName={'Your pool share:'}
        itemValue={state.totalSupply === 0n ? '0 %' : `${parseFloat(sharePecentage)} %`}
      />
    </div>
  </Card>
}

export default Pool;
