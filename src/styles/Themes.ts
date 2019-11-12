import theme from "styled-theming";

export const backgroundColor = theme("mode", {
  light: "white",
  dark: "#0D0C1D"
});

export const textColor = theme("mode", {
  light: "black",
  dark: "#EFFFFA"
});
