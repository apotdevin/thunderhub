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
