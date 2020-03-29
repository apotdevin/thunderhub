import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as UpIcon } from '../../assets/icons/arrow-up.svg';
import { ReactComponent as DownIcon } from '../../assets/icons/arrow-down.svg';
import { ReactComponent as ZapIcon } from '../../assets/icons/zap.svg';
import { ReactComponent as ZapOffIcon } from '../../assets/icons/zap-off.svg';
import { ReactComponent as HelpIcon } from '../../assets/icons/help-circle.svg';
import { ReactComponent as SunIcon } from '../../assets/icons/sun.svg';
import { ReactComponent as MoonIcon } from '../../assets/icons/moon.svg';
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg';
import { ReactComponent as EyeOffIcon } from '../../assets/icons/eye-off.svg';
import { ReactComponent as ChevronsUpIcon } from '../../assets/icons/chevrons-up.svg';
import { ReactComponent as ChevronsDownIcon } from '../../assets/icons/chevrons-down.svg';
import { ReactComponent as ChevronLeftIcon } from '../../assets/icons/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from '../../assets/icons/chevron-right.svg';
import { ReactComponent as ChevronUpIcon } from '../../assets/icons/chevron-up.svg';
import { ReactComponent as ChevronDownIcon } from '../../assets/icons/chevron-down.svg';
import { ReactComponent as HomeIcon } from '../../assets/icons/home.svg';
import { ReactComponent as CpuIcon } from '../../assets/icons/cpu.svg';
import { ReactComponent as SendIcon } from '../../assets/icons/send.svg';
import { ReactComponent as ServerIcon } from '../../assets/icons/server.svg';
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg';
import { ReactComponent as EditIcon } from '../../assets/icons/edit.svg';
import { ReactComponent as MoreVerticalIcon } from '../../assets/icons/more-vertical.svg';
import { ReactComponent as AnchorIcon } from '../../assets/icons/anchor.svg';
import { ReactComponent as PocketIcon } from '../../assets/icons/pocket.svg';
import { ReactComponent as GlobeIcon } from '../../assets/icons/globe.svg';
import { ReactComponent as XIcon } from '../../assets/icons/x.svg';
import { ReactComponent as LayersIcon } from '../../assets/icons/layers.svg';
import { ReactComponent as LoaderIcon } from '../../assets/icons/loader.svg';
import { ReactComponent as CircleIcon } from '../../assets/icons/circle.svg';
import { ReactComponent as AlertTriangleIcon } from '../../assets/icons/alert-triangle.svg';
import { ReactComponent as AlertCircleIcon } from '../../assets/icons/alert-circle.svg';
import { ReactComponent as GitCommitIcon } from '../../assets/icons/git-commit.svg';
import { ReactComponent as GitBranchIcon } from '../../assets/icons/git-branch.svg';
import { ReactComponent as RadioIcon } from '../../assets/icons/radio.svg';
import { ReactComponent as CopyIcon } from '../../assets/icons/copy.svg';
import { ReactComponent as ShieldIcon } from '../../assets/icons/shield.svg';
import { ReactComponent as CrosshairIcon } from '../../assets/icons/crosshair.svg';
import { ReactComponent as KeyIcon } from '../../assets/icons/key.svg';
import { ReactComponent as SlidersIcon } from '../../assets/icons/sliders.svg';
import { ReactComponent as UsersIcon } from '../../assets/icons/users.svg';
import { ReactComponent as GitPullRequestIcon } from '../../assets/icons/git-pull-request.svg';
import { ReactComponent as Link } from '../../assets/icons/link.svg';
import { ReactComponent as Menu } from '../../assets/icons/menu.svg';
import { ReactComponent as Mail } from '../../assets/icons/mail.svg';
import { ReactComponent as Github } from '../../assets/icons/github.svg';
import { ReactComponent as Repeat } from '../../assets/icons/repeat.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/check.svg';

export interface IconProps {
    color?: string;
    size?: string;
    fillcolor?: string;
    strokeWidth?: string;
}

const GenericStyles = css`
    height: ${({ size }: IconProps) => (size ? size : '18px')};
    width: ${({ size }: IconProps) => (size ? size : '18px')};
    color: ${({ color }: IconProps) => (color ? color : '')};
    fill: ${({ fillcolor }: IconProps) => (fillcolor ? fillcolor : '')};
    stroke-width: ${({ strokeWidth }: IconProps) =>
        strokeWidth ? strokeWidth : '2px'};
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
export const Eye = styleIcon(EyeIcon);
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
export const AlertCircle = styleIcon(AlertCircleIcon);
export const GitCommit = styleIcon(GitCommitIcon);
export const GitBranch = styleIcon(GitBranchIcon);
export const Radio = styleIcon(RadioIcon);
export const Copy = styleIcon(CopyIcon);
export const Shield = styleIcon(ShieldIcon);
export const Crosshair = styleIcon(CrosshairIcon);
export const Key = styleIcon(KeyIcon);
export const Sliders = styleIcon(SlidersIcon);
export const Users = styleIcon(UsersIcon);
export const GitPullRequest = styleIcon(GitPullRequestIcon);
export const LinkIcon = styleIcon(Link);
export const MenuIcon = styleIcon(Menu);
export const MailIcon = styleIcon(Mail);
export const GithubIcon = styleIcon(Github);
export const RepeatIcon = styleIcon(Repeat);
export const Check = styleIcon(CheckIcon);
