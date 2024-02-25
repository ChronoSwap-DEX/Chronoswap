import MainLayout from "@/components/mainLayout";

import { useCallback, useMemo, useState } from "react";
import { mintChonrex } from "../utils/dex";
import { useWallet } from "@alephium/web3-react";


function Mint() {

    const { signer, account, connectionStatus, explorerProvider } = useWallet()

    const handleMint = useCallback(async () => {

        if (signer){
            const result = await mintChonrex(signer, "1000000000000000000000", "1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH")
        }
    },[explorerProvider, signer, account])

    return (
        <MainLayout>
            <div className="mt-20"/>
            <div className="p-4 max-w-lg mx-auto bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl text-white border-solid border-indigo-600 border-y border-x" >
                <button onClick={handleMint}>mint</button>
            </div>
            
        </MainLayout>
    );
}

export default Mint