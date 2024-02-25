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
import Image from "next/image"
import { MdClose } from "react-icons/md";

interface TokenSelectProps {
  tokenId: string | undefined
  counterpart: string | undefined
  onChange: any
  tokenBalances: Map<string, bigint>
  className?: string
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
  
  const typographyProps = {
    className: "text-white",
    fontFamily: 'Poppins, sans-serif'
  };

  return (
    <ListItem button onClick={handleClick} key={tokenInfo.id}>
      <ListItemIcon>
        <img src={tokenInfo.logoURI} alt={tokenInfo.name} className="icon"/>
      </ListItemIcon>
      <ListItemText primaryTypographyProps={typographyProps} primary={tokenInfo.name} 
                    secondaryTypographyProps={typographyProps} secondary={tokenInfo.symbol} />
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
  className
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
    
  return (
    <>
      <button
        onClick={handleClick}
        className={`${className} w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow text-md font-medium m-4 flex items-center justify-center`}>
        {info ? (
          <>
            <Image
              src={info.logoURI}
              className="icon"
              alt={info.name} width={32} height={32}/>

            <h6 className="p-2 text-white">
              {info.name}
            </h6>
          </>
          ): (
            <h6 className="p-2 text-white">
              Select token
            </h6>
          )
        }
      </button>

      <MyDialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle className=" bg-blue-950 text-white">
          <div className="flexTitle">
            <div>Select a token</div>
            <IconButton onClick={handleClose}>
              <MdClose className="text-white"/>
            </IconButton>
          </div>
        </DialogTitle>
        <List className="bg-blue-950  text-white">{availableTokens}</List>
      </MyDialog>
    </>
  );
}
