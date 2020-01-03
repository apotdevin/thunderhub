import styled from 'styled-components';

export const ColLine = styled.div`
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    /* flex-grow: 2; */
    flex-basis: 30%;
`;

export const NodeTitle = styled.div`
    /* padding: 2px; */
    font-size: 16px;
    font-weight: bold;
`;

export const StatusLine = styled.div`
    width: 100%;
    position: relative;
    right: -8px;
    top: -8px;
    display: flex;
    /* flex-direction: column; */
    justify-content: flex-end;
    /* align-items: flex-start; */
    /* z-index: 2; */
    margin: 0 0 -8px 0;
    /* height: 36px; */
    /* margin-left: 5px; */
    /* margin: -8px -7px 0 0; */
`;

export const StatusDot = styled.div`
    margin: 0 2px;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: ${({ color }: { color: string }) => color};
`;

export const DetailLine = styled.div`
    font-size: 14px;
    word-wrap: break-word;
    display: flex;
    justify-content: space-between;
`;

export const MainInfo = styled.div`
    cursor: pointer;
`;
