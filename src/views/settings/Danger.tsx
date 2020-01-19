import React from 'react';
import {
    Card,
    CardWithTitle,
    SubTitle,
    SingleLine,
    SimpleButton,
} from '../../components/generic/Styled';
import { getStorageSaved, deleteStorage } from '../../utils/storage';
import { useAccount } from '../../context/AccountContext';
import styled from 'styled-components';
import { deleteAuth } from '../../utils/auth';
import { textColor } from '../../styles/Themes';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';

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
    const { refreshAccount } = useAccount();

    return (
        <CardWithTitle>
            <SubTitle>Danger Zone</SubTitle>
            <OutlineCard>
                <SettingsLine>
                    <SubTitle>Delete Account:</SubTitle>
                    <ButtonRow>
                        {getStorageSaved().map((entry, index) => {
                            return (
                                <ColorButton
                                    withMargin={'0 0 0 8px'}
                                    color={'red'}
                                    onClick={() => {
                                        deleteAuth(entry.index);
                                        refreshAccount();
                                    }}
                                >
                                    {entry.name}
                                </ColorButton>
                            );
                        })}
                    </ButtonRow>
                </SettingsLine>
                <SettingsLine>
                    <SubTitle>Delete all Accounts and Settings:</SubTitle>
                    <ButtonRow>
                        <ColorButton
                            color={'red'}
                            onClick={() => {
                                deleteStorage();
                                refreshAccount();
                            }}
                        >
                            Delete All
                        </ColorButton>
                    </ButtonRow>
                </SettingsLine>
            </OutlineCard>
        </CardWithTitle>
    );
};
