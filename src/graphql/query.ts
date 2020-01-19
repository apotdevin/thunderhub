import gql from 'graphql-tag';

export const GET_NETWORK_INFO = gql`
    query GetNetworkInfo($auth: String!) {
        getNetworkInfo(auth: $auth) {
            averageChannelSize
            channelCount
            maxChannelSize
            medianChannelSize
            minChannelSize
            nodeCount
            notRecentlyUpdatedPolicyCount
            totalCapacity
        }
    }
`;

export const GET_CAN_CONNECT = gql`
    query GetNodeInfo($auth: String!) {
        getNodeInfo(auth: $auth) {
            alias
        }
    }
`;

export const GET_NODE_INFO = gql`
    query GetNodeInfo($auth: String!) {
        getNodeInfo(auth: $auth) {
            chains
            color
            active_channels_count
            closed_channels_count
            alias
            is_synced_to_chain
            peers_count
            pending_channels_count
            version
        }
        getChainBalance(auth: $auth)
        getPendingChainBalance(auth: $auth)
        getChannelBalance(auth: $auth) {
            confirmedBalance
            pendingBalance
        }
    }
`;

export const GET_CHANNEL_AMOUNT_INFO = gql`
    query GetChannelAmountInfo($auth: String!) {
        getNodeInfo(auth: $auth) {
            active_channels_count
            closed_channels_count
            pending_channels_count
        }
    }
`;

export const GET_BALANCES = gql`
    query GetNodeInfo($auth: String!) {
        getChainBalance(auth: $auth)
        getPendingChainBalance(auth: $auth)
        getChannelBalance(auth: $auth) {
            confirmedBalance
            pendingBalance
        }
    }
`;

export const GET_CHANNELS = gql`
    query GetChannels($auth: String!) {
        getChannels(auth: $auth) {
            capacity
            commit_transaction_fee
            commit_transaction_weight
            id
            is_active
            is_closing
            is_opening
            is_partner_initiated
            is_private
            is_static_remote_key
            local_balance
            local_reserve
            partner_public_key
            received
            remote_balance
            remote_reserve
            sent
            time_offline
            time_online
            transaction_id
            transaction_vout
            unsettled_balance
            partner_node_info {
                alias
                capacity
                channel_count
                color
                updated_at
            }
        }
    }
`;

export const GET_PENDING_CHANNELS = gql`
    query GetPendingChannels($auth: String!) {
        getPendingChannels(auth: $auth) {
            close_transaction_id
            is_active
            is_closing
            is_opening
            local_balance
            local_reserve
            partner_public_key
            received
            remote_balance
            remote_reserve
            sent
            transaction_fee
            transaction_id
            transaction_vout
            partner_node_info {
                alias
                capacity
                channel_count
                color
                updated_at
            }
        }
    }
`;

export const GET_CLOSED_CHANNELS = gql`
    query GetClosedChannels($auth: String!) {
        getClosedChannels(auth: $auth) {
            capacity
            close_confirm_height
            close_transaction_id
            final_local_balance
            final_time_locked_balance
            id
            is_breach_close
            is_cooperative_close
            is_funding_cancel
            is_local_force_close
            is_remote_force_close
            partner_public_key
            transaction_id
            transaction_vout
            partner_node_info {
                alias
                capacity
                channel_count
                color
                updated_at
            }
        }
    }
`;

export const GET_RESUME = gql`
    query GetResume($auth: String!, $token: String) {
        getResume(auth: $auth, token: $token) {
            token
            resume
        }
    }
`;

export const GET_BITCOIN_PRICE = gql`
    query GetBitcoinPrice {
        getBitcoinPrice
    }
`;

export const GET_BITCOIN_FEES = gql`
    query GetBitcoinFees {
        getBitcoinFees {
            fast
            halfHour
            hour
        }
    }
`;

export const GET_FORWARD_REPORT = gql`
    query GetForwardReport($time: String, $auth: String!) {
        getForwardReport(time: $time, auth: $auth)
    }
`;

export const GET_LIQUID_REPORT = gql`
    query GetLiquidReport($auth: String!) {
        getChannelReport(auth: $auth) {
            local
            remote
            maxIn
            maxOut
        }
    }
`;

export const GET_FORWARD_CHANNELS_REPORT = gql`
    query GetForwardChannelsReport(
        $time: String
        $order: String
        $type: String
        $auth: String!
    ) {
        getForwardChannelsReport(
            time: $time
            order: $order
            auth: $auth
            type: $type
        )
    }
`;

export const GET_IN_OUT = gql`
    query GetInOut($auth: String!, $time: String) {
        getInOut(auth: $auth, time: $time) {
            invoices
            payments
            confirmedInvoices
            unConfirmedInvoices
        }
    }
`;

export const GET_CHAIN_TRANSACTIONS = gql`
    query GetChainTransactions($auth: String!) {
        getChainTransactions(auth: $auth) {
            block_id
            confirmation_count
            confirmation_height
            created_at
            fee
            id
            output_addresses
            tokens
        }
    }
`;

export const GET_FORWARDS = gql`
    query GetForwards($auth: String!, $time: String) {
        getForwards(auth: $auth, time: $time) {
            forwards {
                created_at
                fee
                fee_mtokens
                incoming_channel
                incoming_alias
                incoming_color
                mtokens
                outgoing_channel
                outgoing_alias
                outgoing_color
                tokens
            }
            token
        }
    }
`;

export const GET_CONNECT_INFO = gql`
    query GetNodeInfo($auth: String!) {
        getNodeInfo(auth: $auth) {
            public_key
            uris
        }
    }
`;

export const GET_BACKUPS = gql`
    query GetBackups($auth: String!) {
        getBackups(auth: $auth)
    }
`;

export const VERIFY_BACKUPS = gql`
    query VerifyBackups($auth: String!, $backup: String!) {
        verifyBackups(auth: $auth, backup: $backup)
    }
`;

export const RECOVER_FUNDS = gql`
    query RecoverFunds($auth: String!, $backup: String!) {
        recoverFunds(auth: $auth, backup: $backup)
    }
`;

export const CHANNEL_FEES = gql`
    query GetChannelFees($auth: String!) {
        getChannelFees(auth: $auth) {
            alias
            color
            baseFee
            feeRate
            transactionId
            transactionVout
        }
    }
`;
