import React from 'react';
import {
    Card,
    CardWithTitle,
    SubTitle,
    SingleLine,
    SimpleButton,
    Sub4Title,
} from '../../components/generic/Styled';
import { getStorageSaved, deleteStorage } from '../../utils/storage';
import { useAccount } from '../../context/AccountContext';
import styled from 'styled-components';
import { deleteAuth } from '../../utils/auth';
import { textColor } from '../../styles/Themes';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
    MultiButton,
    SingleButton,
} from 'components/buttons/multiButton/MultiButton';

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
                    <Sub4Title>Delete Account:</Sub4Title>
                    <MultiButton>
                        {getStorageSaved().map((entry, index) => {
                            return (
                                <SingleButton
                                    color={'red'}
                                    onClick={() => {
                                        deleteAuth(entry.index);
                                        refreshAccount();
                                    }}
                                >
                                    {entry.name}
                                </SingleButton>
                            );
                        })}
                    </MultiButton>
                </SettingsLine>
                <SettingsLine>
                    <Sub4Title>Delete all Accounts and Settings:</Sub4Title>
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
