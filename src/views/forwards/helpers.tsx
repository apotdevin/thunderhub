import { Forward } from 'src/graphql/types';
import { ReportType } from '../home/reports/forwardReport/ForwardReport';

export const getChordMatrix = (order: ReportType, forwardArray: Forward[]) => {
  const cleaned = forwardArray.map(f => {
    let value = 1;

    if (order === 'fee') {
      value = f.fee;
    } else if (order === 'tokens') {
      value = f.tokens;
    }

    return {
      aliasIn: f.incoming_node?.alias || 'Unknown',
      aliasOut: f.outgoing_node?.alias || 'Unknown',
      value,
    };
  });

  const incomingNodes = cleaned.map(f => f.aliasIn);
  const outgoingNodes = cleaned.map(f => f.aliasOut);

  const uniqueNodes = [...new Set(incomingNodes), ...new Set(outgoingNodes)];
  const nodeLength = uniqueNodes.length;

  const matrix = new Array(nodeLength);

  for (let i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(nodeLength).fill(0);
  }

  cleaned.forEach(f => {
    const inIndex = uniqueNodes.indexOf(f.aliasIn);
    const outIndex = uniqueNodes.indexOf(f.aliasOut);

    const previousValue = matrix[inIndex][outIndex];
    const previousOutValue = matrix[outIndex][inIndex];

    matrix[inIndex][outIndex] = previousValue + f.value;
    matrix[outIndex][inIndex] = previousOutValue + f.value;
  });

  return { uniqueNodes, matrix };
};
