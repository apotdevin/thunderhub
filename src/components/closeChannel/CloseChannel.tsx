import React, { useState } from "react";
import { CLOSE_CHANNEL } from "../../graphql/mutation";
import { useMutation } from "@apollo/react-hooks";

interface CloseChannelProps {
  setModalOpen: (status: boolean) => void;
  channelId: string;
}

export const CloseChannel = ({
  setModalOpen,
  channelId
}: CloseChannelProps) => {
  const [isForce, setIsForce] = useState<boolean>(false);
  // const [target, setTarget] = useState<number>(0);
  // const [tokens, setTokens] = useState<number>(0);

  const [closeChannel] = useMutation(CLOSE_CHANNEL);

  // console.log(data);

  const handleClick = () => {
    closeChannel({ variables: { id: channelId, forceClose: isForce } });
    setModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsForce(true)}>Force Close</button>
      <button onClick={handleClick}>hello</button>
    </>
  );
};
