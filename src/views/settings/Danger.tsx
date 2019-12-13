import React, { useContext } from 'react';
import {
    Card,
    CardWithTitle,
    SubTitle,
    SingleLine,
    SimpleButton,
} from '../../components/generic/Styled';
import { getStorageSaved, deleteStorage } from '../../utils/storage';
import { AccountContext } from '../../context/AccountContext';
import styled from 'styled-components';
import { deleteAuth } from '../../utils/auth';
import { textColor } from '../../styles/Themes';

export const ButtonRow = styled.div`
    width: auto;
    display: flex;
`;

const OutlineCard = styled(Card)`
    &:hover {
        border: 1px solid red;
    }
`;

export const SettingsLine = styled(SingleLine)`
    margin: 10px 0;
`;

export const SettingsButton = styled(SimpleButton)`
    padding: 10px;

    &:hover {
        border: 1px solid ${textColor};
    }
`;

export const DangerView = () => {
    const { refreshAccount } = useContext(AccountContext);

    return (
        <CardWithTitle>
            <SubTitle>Danger Zone</SubTitle>
            <OutlineCard>
                <SettingsLine>
                    <SubTitle>Delete Account:</SubTitle>
                    <ButtonRow>
                        {getStorageSaved().map((entry, index) => {
                            return (
                                <SettingsButton
                                    onClick={() => {
                                        deleteAuth(entry.index);
                                        refreshAccount();
                                    }}
                                    key={index}
                                >
                                    {entry.name}
                                </SettingsButton>
                            );
                        })}
                    </ButtonRow>
                </SettingsLine>
                <SettingsLine>
                    <SubTitle>Delete all Accounts and Settings:</SubTitle>
                    <ButtonRow>
                        <SettingsButton
                            onClick={() => {
                                deleteStorage();
                                refreshAccount();
                            }}
                        >
                            Delete All
                        </SettingsButton>
                    </ButtonRow>
                </SettingsLine>
            </OutlineCard>
        </CardWithTitle>
    );
};
