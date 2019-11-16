import theme from "styled-theming";

export const backgroundColor = theme("mode", {
  light: "#fafafa",
  dark: "#0D0C1D"
});

export const textColor = theme("mode", {
  light: "262626",
  dark: "#EFFFFA"
});

export const cardColor = theme("mode", {
  light: "white",
  dark: "#120338"
});

export const cardBorderColor = theme("mode", {
  light: "#e6e6e6",
  dark: "#22075e"
});

export const progressBackground = theme("mode", {
  light: "rgba(0, 0, 0, 0.05)",
  dark: "rgba(0, 0, 0, 0.05)"
});

export const progressLeft = theme("mode", {
  light: "#faad14",
  dark: "#440bd4"
});

export const progressRight = theme("mode", {
  light: "#fadb14",
  dark: "#fe6b35"
});

export const iconButtonColor = theme("mode", {
  light: "black",
  dark: "white"
});

export const iconButtonHover = theme("mode", {
  light: "#e8e8e8",
  dark: "#e8e8e8"
});

export const iconButtonBack = theme("mode", {
  light: "#f5f5f5",
  dark: "#0D0C1D"
});
