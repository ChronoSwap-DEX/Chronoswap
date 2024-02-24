import { IconButton } from "@mui/material";
import { useCallback, useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { MdArrowDownward } from "react-icons/md";

export default function HoverIcon({ onClick }: { onClick: () => void }) {
  const [showSwap, setShowSwap] = useState(false);

  const hovered = useCallback(() => {
    setShowSwap(true);
  }, []);

  const unHovered = useCallback(() => {
    setShowSwap(false);
  }, []);
  return (
    <IconButton onClick={onClick} onMouseOver={hovered} onMouseOut={unHovered}>
      {showSwap ? (
        <AiOutlineSwap fontSize={"32"} className="text-white" />
      ) : (
        <MdArrowDownward fontSize={"32"} className="text-white" />
      )}
    </IconButton>
  );
}
