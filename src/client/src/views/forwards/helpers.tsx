import { sortBy } from 'lodash';
import { Forward } from '../../graphql/types';

export const getChordMatrix = (order: string, forwardArray: Forward[]) => {
  const cleaned = forwardArray.map(f => {
    let value = 1;

    if (order === 'fee') {
      value = f.fee;
    } else if (order === 'tokens') {
      value = f.tokens;
    }

    return {
      incoming_channel: f.incoming_channel,
      outgoing_channel: f.outgoing_channel,
      value,
    };
  });

  const incomingNodes = cleaned.map(f => f.incoming_channel);
  const outgoingNodes = cleaned.map(f => f.outgoing_channel);

  const uniqueNodes = [
    ...Array.from(new Set(incomingNodes)),
    ...Array.from(new Set(outgoingNodes)),
  ];
  const nodeLength = uniqueNodes.length;

  const matrix = new Array(nodeLength);

  for (let i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(nodeLength).fill(0);
  }

  cleaned.forEach(f => {
    const inIndex = uniqueNodes.indexOf(f.incoming_channel);
    const outIndex = uniqueNodes.indexOf(f.outgoing_channel);

    const previousValue = matrix[inIndex][outIndex];
    const previousOutValue = matrix[outIndex][inIndex];

    matrix[inIndex][outIndex] = previousValue + f.value;
    matrix[outIndex][inIndex] = previousOutValue + f.value;
  });

  return { uniqueNodes, matrix };
};

export const sortByNode = (order: string, forwardArray: Forward[]) => {
  const cleaned = forwardArray.map(f => {
    let value = 1;

    if (order === 'fee') {
      value = f.fee;
    } else if (order === 'tokens') {
      value = f.tokens;
    }

    return {
      incoming_channel: f.incoming_channel,
      outgoing_channel: f.outgoing_channel,
      value,
    };
  });

  const incomingNodes = cleaned.map(f => f.incoming_channel);
  const outgoingNodes = cleaned.map(f => f.outgoing_channel);

  const uniqueNodes = [
    ...Array.from(new Set(incomingNodes)),
    ...Array.from(new Set(outgoingNodes)),
  ];
  const nodeLength = uniqueNodes.length;

  const incoming = new Array(nodeLength).fill(0);
  const outgoing = new Array(nodeLength).fill(0);

  cleaned.forEach(f => {
    const inIndex = uniqueNodes.indexOf(f.incoming_channel);
    const outIndex = uniqueNodes.indexOf(f.outgoing_channel);

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
      channel: n,
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
