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
import { textColor, fontColors } from '../../styles/Themes';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
    MultiButton,
    SingleButton,
} from 'components/buttons/multiButton/MultiButton';
import { AlertCircle } from 'components/generic/Icons';

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

export const CheckboxText = styled.div`
    font-size: 13px;
    color: ${fontColors.grey7};
    text-align: justify;
`;

export const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
`;

export const FixedWidth = styled.div`
    height: 18px;
    width: 18px;
    margin: 0px;
    margin-right: 8px;
`;

export const DangerView = () => {
    const { refreshAccount } = useAccount();

    const renderButton = () => {
        const saved = getStorageSaved();
        if (saved.length > 1) {
            return (
                <MultiButton>
                    {saved.map((entry, index) => {
                        return (
                            <SingleButton
                                key={index}
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
            );
        } else if (saved.length === 1) {
            return (
                <ColorButton
                    color={'red'}
                    onClick={() => {
                        deleteAuth(saved[0].index);
                        refreshAccount();
                    }}
                >
                    {saved[0].name}
                </ColorButton>
            );
        }
        return null;
    };

    return (
        <CardWithTitle>
            <SubTitle>Danger Zone</SubTitle>
            <OutlineCard>
                <SettingsLine>
                    <Sub4Title>Delete Account:</Sub4Title>
                    {renderButton()}
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
                <StyledContainer>
                    <FixedWidth>
                        <AlertCircle color={fontColors.grey7} />
                    </FixedWidth>
                    <CheckboxText>
                        This does not affect in any way your node, only the
                        ThunderHub accounts saved in this browser.
                    </CheckboxText>
                </StyledContainer>
            </OutlineCard>
        </CardWithTitle>
    );
};
