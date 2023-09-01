import { sortBy, uniqBy } from 'lodash';
import { Forward } from '../../graphql/types';

export const sortByNode = (order: string, forwardArray: Forward[]) => {
  const cleaned = forwardArray.map(f => {
    let value = 1;

    if (order === 'fee') {
      value = f.fee;
    } else if (order === 'tokens') {
      value = f.tokens;
    }

    return {
      incoming_alias: f.incoming_channel_info?.node2_info.alias || 'Unknown',
      incoming_channel: f.incoming_channel,
      outgoing_alias: f.outgoing_channel_info?.node2_info.alias || 'Unknown',
      outgoing_channel: f.outgoing_channel,
      value,
    };
  });

  const incomingNodes = cleaned.map(f => ({
    alias: f.incoming_alias,
    channel: f.incoming_channel,
  }));
  const outgoingNodes = cleaned.map(f => ({
    alias: f.outgoing_alias,
    channel: f.outgoing_channel,
  }));

  const uniqueNodes = uniqBy([...incomingNodes, ...outgoingNodes], 'channel');
  const nodeLength = uniqueNodes.length;

  const incoming: number[] = new Array(nodeLength).fill(0);
  const outgoing: number[] = new Array(nodeLength).fill(0);

  cleaned.forEach(f => {
    const inIndex = uniqueNodes.findIndex(
      n => n.channel === f.incoming_channel
    );
    const outIndex = uniqueNodes.findIndex(
      n => n.channel === f.outgoing_channel
    );

    const currentIncoming = incoming[inIndex];
    const currentOutgoing = outgoing[outIndex];

    incoming[inIndex] = currentIncoming + f.value;
    outgoing[outIndex] = currentOutgoing + f.value;
  });

  let maxIn = 0;
  let maxOut = 0;

  const final = uniqueNodes.map((n, index) => {
    const incomingValue = incoming[index];
    const outgoingValue = outgoing[index];

    maxIn = Math.max(maxIn, incomingValue);
    maxOut = Math.max(maxOut, outgoingValue);

    return {
      alias: n.alias,
      channel: n.channel,
      incoming: incomingValue,
      outgoing: outgoingValue,
    };
  });

  return {
    final: sortBy(final, f => f.incoming + f.outgoing).reverse(),
    maxIn,
    maxOut,
  };
};
