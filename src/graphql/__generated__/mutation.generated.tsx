import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
import * as Types from '../types';

export type CloseChannelMutationVariables = {
  id: Types.Scalars['String'];
  auth: Types.AuthType;
  forceClose?: Types.Maybe<Types.Scalars['Boolean']>;
  target?: Types.Maybe<Types.Scalars['Int']>;
  tokens?: Types.Maybe<Types.Scalars['Int']>;
};

export type CloseChannelMutation = { __typename?: 'Mutation' } & {
  closeChannel?: Types.Maybe<
    { __typename?: 'closeChannelType' } & Pick<
      Types.CloseChannelType,
      'transactionId' | 'transactionOutputIndex'
    >
  >;
};

export type OpenChannelMutationVariables = {
  amount: Types.Scalars['Int'];
  partnerPublicKey: Types.Scalars['String'];
  auth: Types.AuthType;
  tokensPerVByte?: Types.Maybe<Types.Scalars['Int']>;
  isPrivate?: Types.Maybe<Types.Scalars['Boolean']>;
};

export type OpenChannelMutation = { __typename?: 'Mutation' } & {
  openChannel?: Types.Maybe<
    { __typename?: 'openChannelType' } & Pick<
      Types.OpenChannelType,
      'transactionId' | 'transactionOutputIndex'
    >
  >;
};

export type PayInvoiceMutationVariables = {
  request: Types.Scalars['String'];
  auth: Types.AuthType;
  tokens?: Types.Maybe<Types.Scalars['Int']>;
};

export type PayInvoiceMutation = { __typename?: 'Mutation' } & {
  pay?: Types.Maybe<
    { __typename?: 'payType' } & Pick<Types.PayType, 'is_confirmed'>
  >;
};

export type CreateInvoiceMutationVariables = {
  amount: Types.Scalars['Int'];
  auth: Types.AuthType;
};

export type CreateInvoiceMutation = { __typename?: 'Mutation' } & {
  createInvoice?: Types.Maybe<
    { __typename?: 'invoiceType' } & Pick<Types.InvoiceType, 'request'>
  >;
};

export type CreateAddressMutationVariables = {
  nested?: Types.Maybe<Types.Scalars['Boolean']>;
  auth: Types.AuthType;
};

export type CreateAddressMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'createAddress'
>;

export type PayAddressMutationVariables = {
  auth: Types.AuthType;
  address: Types.Scalars['String'];
  tokens?: Types.Maybe<Types.Scalars['Int']>;
  fee?: Types.Maybe<Types.Scalars['Int']>;
  target?: Types.Maybe<Types.Scalars['Int']>;
  sendAll?: Types.Maybe<Types.Scalars['Boolean']>;
};

export type PayAddressMutation = { __typename?: 'Mutation' } & {
  sendToAddress?: Types.Maybe<
    { __typename?: 'sendToType' } & Pick<
      Types.SendToType,
      'confirmationCount' | 'id' | 'isConfirmed' | 'isOutgoing' | 'tokens'
    >
  >;
};

export type UpdateFeesMutationVariables = {
  auth: Types.AuthType;
  transactionId?: Types.Maybe<Types.Scalars['String']>;
  transactionVout?: Types.Maybe<Types.Scalars['Int']>;
  baseFee?: Types.Maybe<Types.Scalars['Int']>;
  feeRate?: Types.Maybe<Types.Scalars['Int']>;
};

export type UpdateFeesMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'updateFees'
>;

export type PayViaRouteMutationVariables = {
  auth: Types.AuthType;
  route: Types.Scalars['String'];
};

export type PayViaRouteMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'payViaRoute'
>;

export type RemovePeerMutationVariables = {
  auth: Types.AuthType;
  publicKey: Types.Scalars['String'];
};

export type RemovePeerMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'removePeer'
>;

export type AddPeerMutationVariables = {
  auth: Types.AuthType;
  publicKey: Types.Scalars['String'];
  socket: Types.Scalars['String'];
  isTemporary?: Types.Maybe<Types.Scalars['Boolean']>;
};

export type AddPeerMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'addPeer'
>;

export type SendMessageMutationVariables = {
  auth: Types.AuthType;
  publicKey: Types.Scalars['String'];
  message: Types.Scalars['String'];
  messageType?: Types.Maybe<Types.Scalars['String']>;
  tokens?: Types.Maybe<Types.Scalars['Int']>;
  maxFee?: Types.Maybe<Types.Scalars['Int']>;
};

export type SendMessageMutation = { __typename?: 'Mutation' } & Pick<
  Types.Mutation,
  'sendMessage'
>;

export const CloseChannelDocument = gql`
  mutation CloseChannel(
    $id: String!
    $auth: authType!
    $forceClose: Boolean
    $target: Int
    $tokens: Int
  ) {
    closeChannel(
      id: $id
      forceClose: $forceClose
      targetConfirmations: $target
      tokensPerVByte: $tokens
      auth: $auth
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
export type CloseChannelMutationFn = ApolloReactCommon.MutationFunction<
  CloseChannelMutation,
  CloseChannelMutationVariables
>;

/**
 * __useCloseChannelMutation__
 *
 * To run a mutation, you first call `useCloseChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCloseChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [closeChannelMutation, { data, loading, error }] = useCloseChannelMutation({
 *   variables: {
 *      id: // value for 'id'
 *      auth: // value for 'auth'
 *      forceClose: // value for 'forceClose'
 *      target: // value for 'target'
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function useCloseChannelMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CloseChannelMutation,
    CloseChannelMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CloseChannelMutation,
    CloseChannelMutationVariables
  >(CloseChannelDocument, baseOptions);
}
export type CloseChannelMutationHookResult = ReturnType<
  typeof useCloseChannelMutation
>;
export type CloseChannelMutationResult = ApolloReactCommon.MutationResult<
  CloseChannelMutation
>;
export type CloseChannelMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CloseChannelMutation,
  CloseChannelMutationVariables
>;
export const OpenChannelDocument = gql`
  mutation OpenChannel(
    $amount: Int!
    $partnerPublicKey: String!
    $auth: authType!
    $tokensPerVByte: Int
    $isPrivate: Boolean
  ) {
    openChannel(
      amount: $amount
      partnerPublicKey: $partnerPublicKey
      auth: $auth
      tokensPerVByte: $tokensPerVByte
      isPrivate: $isPrivate
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
export type OpenChannelMutationFn = ApolloReactCommon.MutationFunction<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;

/**
 * __useOpenChannelMutation__
 *
 * To run a mutation, you first call `useOpenChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOpenChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [openChannelMutation, { data, loading, error }] = useOpenChannelMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      partnerPublicKey: // value for 'partnerPublicKey'
 *      auth: // value for 'auth'
 *      tokensPerVByte: // value for 'tokensPerVByte'
 *      isPrivate: // value for 'isPrivate'
 *   },
 * });
 */
export function useOpenChannelMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    OpenChannelMutation,
    OpenChannelMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    OpenChannelMutation,
    OpenChannelMutationVariables
  >(OpenChannelDocument, baseOptions);
}
export type OpenChannelMutationHookResult = ReturnType<
  typeof useOpenChannelMutation
>;
export type OpenChannelMutationResult = ApolloReactCommon.MutationResult<
  OpenChannelMutation
>;
export type OpenChannelMutationOptions = ApolloReactCommon.BaseMutationOptions<
  OpenChannelMutation,
  OpenChannelMutationVariables
>;
export const PayInvoiceDocument = gql`
  mutation PayInvoice($request: String!, $auth: authType!, $tokens: Int) {
    pay(request: $request, auth: $auth, tokens: $tokens) {
      is_confirmed
    }
  }
`;
export type PayInvoiceMutationFn = ApolloReactCommon.MutationFunction<
  PayInvoiceMutation,
  PayInvoiceMutationVariables
>;

/**
 * __usePayInvoiceMutation__
 *
 * To run a mutation, you first call `usePayInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payInvoiceMutation, { data, loading, error }] = usePayInvoiceMutation({
 *   variables: {
 *      request: // value for 'request'
 *      auth: // value for 'auth'
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function usePayInvoiceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PayInvoiceMutation,
    PayInvoiceMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PayInvoiceMutation,
    PayInvoiceMutationVariables
  >(PayInvoiceDocument, baseOptions);
}
export type PayInvoiceMutationHookResult = ReturnType<
  typeof usePayInvoiceMutation
>;
export type PayInvoiceMutationResult = ApolloReactCommon.MutationResult<
  PayInvoiceMutation
>;
export type PayInvoiceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PayInvoiceMutation,
  PayInvoiceMutationVariables
>;
export const CreateInvoiceDocument = gql`
  mutation CreateInvoice($amount: Int!, $auth: authType!) {
    createInvoice(amount: $amount, auth: $auth) {
      request
    }
  }
`;
export type CreateInvoiceMutationFn = ApolloReactCommon.MutationFunction<
  CreateInvoiceMutation,
  CreateInvoiceMutationVariables
>;

/**
 * __useCreateInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvoiceMutation, { data, loading, error }] = useCreateInvoiceMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useCreateInvoiceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateInvoiceMutation,
    CreateInvoiceMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateInvoiceMutation,
    CreateInvoiceMutationVariables
  >(CreateInvoiceDocument, baseOptions);
}
export type CreateInvoiceMutationHookResult = ReturnType<
  typeof useCreateInvoiceMutation
>;
export type CreateInvoiceMutationResult = ApolloReactCommon.MutationResult<
  CreateInvoiceMutation
>;
export type CreateInvoiceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateInvoiceMutation,
  CreateInvoiceMutationVariables
>;
export const CreateAddressDocument = gql`
  mutation CreateAddress($nested: Boolean, $auth: authType!) {
    createAddress(nested: $nested, auth: $auth)
  }
`;
export type CreateAddressMutationFn = ApolloReactCommon.MutationFunction<
  CreateAddressMutation,
  CreateAddressMutationVariables
>;

/**
 * __useCreateAddressMutation__
 *
 * To run a mutation, you first call `useCreateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAddressMutation, { data, loading, error }] = useCreateAddressMutation({
 *   variables: {
 *      nested: // value for 'nested'
 *      auth: // value for 'auth'
 *   },
 * });
 */
export function useCreateAddressMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateAddressMutation,
    CreateAddressMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateAddressMutation,
    CreateAddressMutationVariables
  >(CreateAddressDocument, baseOptions);
}
export type CreateAddressMutationHookResult = ReturnType<
  typeof useCreateAddressMutation
>;
export type CreateAddressMutationResult = ApolloReactCommon.MutationResult<
  CreateAddressMutation
>;
export type CreateAddressMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateAddressMutation,
  CreateAddressMutationVariables
>;
export const PayAddressDocument = gql`
  mutation PayAddress(
    $auth: authType!
    $address: String!
    $tokens: Int
    $fee: Int
    $target: Int
    $sendAll: Boolean
  ) {
    sendToAddress(
      auth: $auth
      address: $address
      tokens: $tokens
      fee: $fee
      target: $target
      sendAll: $sendAll
    ) {
      confirmationCount
      id
      isConfirmed
      isOutgoing
      tokens
    }
  }
`;
export type PayAddressMutationFn = ApolloReactCommon.MutationFunction<
  PayAddressMutation,
  PayAddressMutationVariables
>;

/**
 * __usePayAddressMutation__
 *
 * To run a mutation, you first call `usePayAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payAddressMutation, { data, loading, error }] = usePayAddressMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      address: // value for 'address'
 *      tokens: // value for 'tokens'
 *      fee: // value for 'fee'
 *      target: // value for 'target'
 *      sendAll: // value for 'sendAll'
 *   },
 * });
 */
export function usePayAddressMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PayAddressMutation,
    PayAddressMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PayAddressMutation,
    PayAddressMutationVariables
  >(PayAddressDocument, baseOptions);
}
export type PayAddressMutationHookResult = ReturnType<
  typeof usePayAddressMutation
>;
export type PayAddressMutationResult = ApolloReactCommon.MutationResult<
  PayAddressMutation
>;
export type PayAddressMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PayAddressMutation,
  PayAddressMutationVariables
>;
export const UpdateFeesDocument = gql`
  mutation UpdateFees(
    $auth: authType!
    $transactionId: String
    $transactionVout: Int
    $baseFee: Int
    $feeRate: Int
  ) {
    updateFees(
      auth: $auth
      transactionId: $transactionId
      transactionVout: $transactionVout
      baseFee: $baseFee
      feeRate: $feeRate
    )
  }
`;
export type UpdateFeesMutationFn = ApolloReactCommon.MutationFunction<
  UpdateFeesMutation,
  UpdateFeesMutationVariables
>;

/**
 * __useUpdateFeesMutation__
 *
 * To run a mutation, you first call `useUpdateFeesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFeesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFeesMutation, { data, loading, error }] = useUpdateFeesMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      transactionId: // value for 'transactionId'
 *      transactionVout: // value for 'transactionVout'
 *      baseFee: // value for 'baseFee'
 *      feeRate: // value for 'feeRate'
 *   },
 * });
 */
export function useUpdateFeesMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateFeesMutation,
    UpdateFeesMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateFeesMutation,
    UpdateFeesMutationVariables
  >(UpdateFeesDocument, baseOptions);
}
export type UpdateFeesMutationHookResult = ReturnType<
  typeof useUpdateFeesMutation
>;
export type UpdateFeesMutationResult = ApolloReactCommon.MutationResult<
  UpdateFeesMutation
>;
export type UpdateFeesMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateFeesMutation,
  UpdateFeesMutationVariables
>;
export const PayViaRouteDocument = gql`
  mutation PayViaRoute($auth: authType!, $route: String!) {
    payViaRoute(auth: $auth, route: $route)
  }
`;
export type PayViaRouteMutationFn = ApolloReactCommon.MutationFunction<
  PayViaRouteMutation,
  PayViaRouteMutationVariables
>;

/**
 * __usePayViaRouteMutation__
 *
 * To run a mutation, you first call `usePayViaRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayViaRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payViaRouteMutation, { data, loading, error }] = usePayViaRouteMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      route: // value for 'route'
 *   },
 * });
 */
export function usePayViaRouteMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PayViaRouteMutation,
    PayViaRouteMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    PayViaRouteMutation,
    PayViaRouteMutationVariables
  >(PayViaRouteDocument, baseOptions);
}
export type PayViaRouteMutationHookResult = ReturnType<
  typeof usePayViaRouteMutation
>;
export type PayViaRouteMutationResult = ApolloReactCommon.MutationResult<
  PayViaRouteMutation
>;
export type PayViaRouteMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PayViaRouteMutation,
  PayViaRouteMutationVariables
>;
export const RemovePeerDocument = gql`
  mutation RemovePeer($auth: authType!, $publicKey: String!) {
    removePeer(auth: $auth, publicKey: $publicKey)
  }
`;
export type RemovePeerMutationFn = ApolloReactCommon.MutationFunction<
  RemovePeerMutation,
  RemovePeerMutationVariables
>;

/**
 * __useRemovePeerMutation__
 *
 * To run a mutation, you first call `useRemovePeerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePeerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePeerMutation, { data, loading, error }] = useRemovePeerMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      publicKey: // value for 'publicKey'
 *   },
 * });
 */
export function useRemovePeerMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemovePeerMutation,
    RemovePeerMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    RemovePeerMutation,
    RemovePeerMutationVariables
  >(RemovePeerDocument, baseOptions);
}
export type RemovePeerMutationHookResult = ReturnType<
  typeof useRemovePeerMutation
>;
export type RemovePeerMutationResult = ApolloReactCommon.MutationResult<
  RemovePeerMutation
>;
export type RemovePeerMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RemovePeerMutation,
  RemovePeerMutationVariables
>;
export const AddPeerDocument = gql`
  mutation AddPeer(
    $auth: authType!
    $publicKey: String!
    $socket: String!
    $isTemporary: Boolean
  ) {
    addPeer(
      auth: $auth
      publicKey: $publicKey
      socket: $socket
      isTemporary: $isTemporary
    )
  }
`;
export type AddPeerMutationFn = ApolloReactCommon.MutationFunction<
  AddPeerMutation,
  AddPeerMutationVariables
>;

/**
 * __useAddPeerMutation__
 *
 * To run a mutation, you first call `useAddPeerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPeerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPeerMutation, { data, loading, error }] = useAddPeerMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      publicKey: // value for 'publicKey'
 *      socket: // value for 'socket'
 *      isTemporary: // value for 'isTemporary'
 *   },
 * });
 */
export function useAddPeerMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddPeerMutation,
    AddPeerMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    AddPeerMutation,
    AddPeerMutationVariables
  >(AddPeerDocument, baseOptions);
}
export type AddPeerMutationHookResult = ReturnType<typeof useAddPeerMutation>;
export type AddPeerMutationResult = ApolloReactCommon.MutationResult<
  AddPeerMutation
>;
export type AddPeerMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddPeerMutation,
  AddPeerMutationVariables
>;
export const SendMessageDocument = gql`
  mutation SendMessage(
    $auth: authType!
    $publicKey: String!
    $message: String!
    $messageType: String
    $tokens: Int
    $maxFee: Int
  ) {
    sendMessage(
      auth: $auth
      publicKey: $publicKey
      message: $message
      messageType: $messageType
      tokens: $tokens
      maxFee: $maxFee
    )
  }
`;
export type SendMessageMutationFn = ApolloReactCommon.MutationFunction<
  SendMessageMutation,
  SendMessageMutationVariables
>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      auth: // value for 'auth'
 *      publicKey: // value for 'publicKey'
 *      message: // value for 'message'
 *      messageType: // value for 'messageType'
 *      tokens: // value for 'tokens'
 *      maxFee: // value for 'maxFee'
 *   },
 * });
 */
export function useSendMessageMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SendMessageMutation,
    SendMessageMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SendMessageMutation,
    SendMessageMutationVariables
  >(SendMessageDocument, baseOptions);
}
export type SendMessageMutationHookResult = ReturnType<
  typeof useSendMessageMutation
>;
export type SendMessageMutationResult = ApolloReactCommon.MutationResult<
  SendMessageMutation
>;
export type SendMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SendMessageMutation,
  SendMessageMutationVariables
>;
