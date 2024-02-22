import {
  Card,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import CloseIcon from "@mui/material/Icon";
import { bigIntToString, TokenList } from "../utils/dex";
import { TokenInfo } from '@alephium/token-list'
import { MyDialog } from "@/components/MyDialog";

interface TokenSelectProps {
  tokenId: string | undefined
  counterpart: string | undefined
  onChange: any
  tokenBalances: Map<string, bigint>
  style2?: boolean
  mediumSize?: boolean
}

const TokenOptions = ({
  tokenInfo,
  balance,
  onSelect,
  close,
}: {
  tokenInfo: TokenInfo;
  balance: bigint | undefined;
  onSelect: (tokenInfo: TokenInfo) => void;
  close: () => void;
}) => {

  const handleClick = useCallback(() => {
    onSelect(tokenInfo);
    close();
  }, [tokenInfo, onSelect, close]);

  return (
    <ListItem button onClick={handleClick} key={tokenInfo.id}>
      <ListItemIcon>
        <img
          src={tokenInfo.logoURI}
          alt={tokenInfo.name}
          className="icon"
        />
      </ListItemIcon>
      <ListItemText primary={tokenInfo.name} secondary={tokenInfo.symbol}/>
      <ListItemSecondaryAction>
        {balance === undefined ? '0' : bigIntToString(balance, tokenInfo.decimals)}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default function TokenSelectDialog({
  tokenId,
  counterpart,
  onChange,
  tokenBalances,
  style2,
  mediumSize
}: TokenSelectProps) {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [])
  const handleClick = useCallback(() => {
    setOpen(true)
  }, [])

  const info = TokenList.find((tokenInfo) => tokenInfo.id === tokenId)
  const availableTokens = TokenList
    .filter((tokenInfo) => tokenInfo.id !== tokenId && tokenInfo.id !== counterpart)
    .map((token) =>
      <TokenOptions
        key={token.id}
        tokenInfo={token}
        balance={tokenBalances.get(token.id)}
        onSelect={onChange}
        close={handleClose}
      />
    );

  const style = "selectedCard" +
    (style2 ? ' ' + "style2" : '') +
    (mediumSize ? ' ' + "medium" : '')
  return (
    <>
      <Card
        onClick={handleClick}
        raised
        className={style}
      >
        {info ? (
          <>
            <img
              src={info.logoURI}
              className="icon"
              alt={info.name}
            />
            <Typography variant="h6" className="selectedSymbol">
              {info.name}
            </Typography>
          </>
          ): (
            <Typography variant="h6" className="selectedSymbol">
              Select token
            </Typography>
          )
        }
      </Card>
      <MyDialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <div className="flexTitle">
            <div>Select a token</div>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <List>{availableTokens}</List>
      </MyDialog>
    </>
  );
}
