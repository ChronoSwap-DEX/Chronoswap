import { Button, Collapse, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/material/Icon";
import { getExplorerLink } from "../utils/dex";
import CircleLoader from "@/components/CircleLoader";
import { TiTick } from "react-icons/ti";
import Link from "next/link"


interface TransactionSubmitProps {
  open: boolean
  txId: string
  buttonText: string
  onClick: () => void
}

export function TransactionSubmitted({
  open,
  txId,
  buttonText,
  onClick
}: TransactionSubmitProps) {

  return <Collapse in={open}>
    <div className="flex flex-col items-center justify-center">
      <TiTick size={120}/>
      <h2 className="text-xl font-bold tracking-wider">Transaction Submitted</h2>
      <div className="mt-4" />
      <Link href={getExplorerLink(txId)} className="underline text-md font-bold">
        View on Explorer
      </Link>
      <div className="mt-4"/>
      <button onClick={onClick} className="w-6/12 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow text-md font-bold mt-4">
        {buttonText}
      </button>
    </div>
  </Collapse>
}

interface WaitingForTxSubmissionProps {
  open: boolean
  text: string
}

export function WaitingForTxSubmission({ open, text } : WaitingForTxSubmissionProps) {

  return <div className="loaderHolder">
    <Collapse in={open}>
      <div className="loaderHolder">
        <CircleLoader />
        <div className="spacer"/>
        <div className="spacer"/>
        <Typography variant="h5">{text}</Typography>
        <div className="spacer"/>
      </div>
    </Collapse>
  </div>
}
