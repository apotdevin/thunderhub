import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as UpIcon } from '../../icons/arrow-up.svg';
import { ReactComponent as DownIcon } from '../../icons/arrow-down.svg';
import { ReactComponent as ZapIcon } from '../../icons/zap.svg';
import { ReactComponent as ZapOffIcon } from '../../icons/zap-off.svg';
import { ReactComponent as HelpIcon } from '../../icons/help-circle.svg';
import { ReactComponent as SunIcon } from '../../icons/sun.svg';
import { ReactComponent as MoonIcon } from '../../icons/moon.svg';
import { ReactComponent as EyeOffIcon } from '../../icons/eye-off.svg';
import { ReactComponent as ChevronsUpIcon } from '../../icons/chevrons-up.svg';
import { ReactComponent as ChevronsDownIcon } from '../../icons/chevrons-down.svg';
import { ReactComponent as ChevronLeftIcon } from '../../icons/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from '../../icons/chevron-right.svg';
import { ReactComponent as ChevronUpIcon } from '../../icons/chevron-up.svg';
import { ReactComponent as ChevronDownIcon } from '../../icons/chevron-down.svg';
import { ReactComponent as HomeIcon } from '../../icons/home.svg';
import { ReactComponent as CpuIcon } from '../../icons/cpu.svg';
import { ReactComponent as SendIcon } from '../../icons/send.svg';
import { ReactComponent as ServerIcon } from '../../icons/server.svg';
import { ReactComponent as SettingsIcon } from '../../icons/settings.svg';
import { ReactComponent as EditIcon } from '../../icons/edit.svg';
import { ReactComponent as MoreVerticalIcon } from '../../icons/more-vertical.svg';
import { ReactComponent as AnchorIcon } from '../../icons/anchor.svg';
import { ReactComponent as PocketIcon } from '../../icons/pocket.svg';
import { ReactComponent as GlobeIcon } from '../../icons/globe.svg';
import { ReactComponent as XIcon } from '../../icons/x.svg';
import { ReactComponent as LayersIcon } from '../../icons/layers.svg';
import { ReactComponent as LoaderIcon } from '../../icons/loader.svg';
import { ReactComponent as CircleIcon } from '../../icons/circle.svg';
import { ReactComponent as AlertTriangleIcon } from '../../icons/alert-triangle.svg';
import { ReactComponent as GitCommitIcon } from '../../icons/git-commit.svg';

interface IconProps {
    color?: string;
    size?: string;
    fillcolor?: string;
}

const GenericStyles = css`
    height: ${({ size }: IconProps) => (size ? size : '18px')};
    width: ${({ size }: IconProps) => (size ? size : '18px')};
    color: ${({ color }: IconProps) => (color ? color : '')};
    fill: ${({ fillcolor }: IconProps) => (fillcolor ? fillcolor : '')};
`;

export const IconCircle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 100%;

    &:hover {
        background-color: #e8e8e8;
    }
`;

const styleIcon = (icon: FunctionComponent) =>
    styled(icon)`
        ${GenericStyles}
    `;

export const QuestionIcon = styleIcon(HelpIcon);
export const Zap = styleIcon(ZapIcon);
export const ZapOff = styleIcon(ZapOffIcon);
export const Anchor = styleIcon(AnchorIcon);
export const Pocket = styleIcon(PocketIcon);
export const Globe = styleIcon(GlobeIcon);
export const UpArrow = styleIcon(UpIcon);
export const DownArrow = styleIcon(DownIcon);
export const Sun = styleIcon(SunIcon);
export const Moon = styleIcon(MoonIcon);
export const EyeOff = styleIcon(EyeOffIcon);
export const ChevronsDown = styleIcon(ChevronsDownIcon);
export const ChevronsUp = styleIcon(ChevronsUpIcon);
export const ChevronLeft = styleIcon(ChevronLeftIcon);
export const ChevronRight = styleIcon(ChevronRightIcon);
export const ChevronUp = styleIcon(ChevronUpIcon);
export const ChevronDown = styleIcon(ChevronDownIcon);
export const Home = styleIcon(HomeIcon);
export const Cpu = styleIcon(CpuIcon);
export const Send = styleIcon(SendIcon);
export const Server = styleIcon(ServerIcon);
export const Settings = styleIcon(SettingsIcon);
export const Edit = styleIcon(EditIcon);
export const MoreVertical = styleIcon(MoreVerticalIcon);
export const XSvg = styleIcon(XIcon);
export const Layers = styleIcon(LayersIcon);
export const Loader = styleIcon(LoaderIcon);
export const Circle = styleIcon(CircleIcon);
export const AlertTriangle = styleIcon(AlertTriangleIcon);
export const GitCommit = styleIcon(GitCommitIcon);
