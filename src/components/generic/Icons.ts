import styled from "styled-components";
import { iconButtonColor } from "../../styles/Themes";
import { ReactComponent as UpIcon } from "../../icons/arrow-up.svg";
import { ReactComponent as DownIcon } from "../../icons/arrow-down.svg";
import { ReactComponent as ZapIcon } from "../../icons/zap.svg";
import { ReactComponent as ZapOffIcon } from "../../icons/zap-off.svg";
import { ReactComponent as HelpIcon } from "../../icons/help-circle.svg";
import { ReactComponent as SunIcon } from "../../icons/sun.svg";
import { ReactComponent as MoonIcon } from "../../icons/moon.svg";
import { ReactComponent as SatoshiIcon } from "../../icons/satoshi.svg";
import { ReactComponent as EuroIcon } from "../../icons/euro.svg";
import { ReactComponent as BitcoinIcon } from "../../icons/bitcoin.svg";
import { ReactComponent as EyeOffIcon } from "../../icons/eye-off.svg";
import { ReactComponent as ChevronUpIcon } from "../../icons/chevrons-up.svg";
import { ReactComponent as ChevronDownIcon } from "../../icons/chevrons-down.svg";
import { ReactComponent as HomeIcon } from "../../icons/home.svg";
import { ReactComponent as CpuIcon } from "../../icons/cpu.svg";
import { ReactComponent as SendIcon } from "../../icons/send.svg";
import { ReactComponent as ServerIcon } from "../../icons/server.svg";
import { ReactComponent as SettingsIcon } from "../../icons/settings.svg";

export const IconCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 100%;

  &:hover {
    background-color: #e8e8e8;
    /* color: #ffffb8; */
  }
`;

export const QuestionIcon = styled(HelpIcon)`
  height: 14px;
`;

export const Zap = styled(ZapIcon)`
  height: 18px;
  color: ${({ color }: { color?: string }) => (color ? color : "black")};
`;

export const ZapOff = styled(ZapOffIcon)`
  height: 18px;
  color: ${({ color }: { color?: string }) => (color ? color : "black")};
`;

export const UpArrow = styled(UpIcon)`
	height: 18px;
	color: ${iconButtonColor};
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;

export const DownArrow = styled(DownIcon)`
	height: 18px;
	color: ${iconButtonColor}
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;
export const Sun = styled(SunIcon)`
	height: 18px;
	color: ${iconButtonColor}
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;
export const Moon = styled(MoonIcon)`
	height: 18px;
	color: ${iconButtonColor}
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;
export const Satoshi = styled(SatoshiIcon)`
	height: 18px;
	color: ${iconButtonColor}
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;
export const Bitcoin = styled(BitcoinIcon)`
	height: 18px;
	color: ${iconButtonColor}
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;
export const Euro = styled(EuroIcon)`
	height: 16px;
	color: ${iconButtonColor}
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;

export const EyeOff = styled(EyeOffIcon)`
	height: 18px;
	color: ${iconButtonColor}
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;

export const ChevronDown = styled(ChevronDownIcon)`
	height: 18px;
	color: ${iconButtonColor}
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;

export const ChevronUp = styled(ChevronUpIcon)`
	height: 18px;
	color: ${iconButtonColor}
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;

export const Home = styled(HomeIcon)`
	height: 18px;
	/* color: ${iconButtonColor} */
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;

export const Cpu = styled(CpuIcon)`
	height: 18px;
	/* color: ${iconButtonColor} */
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;
export const Send = styled(SendIcon)`
	height: 18px;
	/* color: ${iconButtonColor} */
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;
export const Server = styled(ServerIcon)`
	height: 18px;
	/* color: ${iconButtonColor} */
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;
export const Settings = styled(SettingsIcon)`
	height: 18px;
	/* color: ${iconButtonColor} */
	/* color: ${({ color }: { color?: string }) => (color ? color : "black")}; */
`;
