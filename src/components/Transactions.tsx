import { Button, Collapse, Link, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/material/Icon";
import { getExplorerLink } from "../utils/dex";
import CircleLoader from "@/components/CircleLoader";

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
    <>
      <CheckCircleOutlineRoundedIcon
        fontSize={"inherit"}
        className="successIcon"
      />
      <Typography variant='h5'>Transaction Submitted</Typography>
      <div className="spacer" />
      <Link
        target="_blank"
        href={getExplorerLink(txId)}
        rel="noreferrer"
        variant='body2'
      >
        View on Explorer
      </Link>
      <div className="spacer"/>
      <Button onClick={onClick} variant="contained" color="primary" size='large'>
        {buttonText}
      </Button>
    </>
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
