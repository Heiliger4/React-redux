import { createTheme } from "@mui/material/styles";

const customDarkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111",
      paper: "#18181b",
    },
    text: {
      primary: "#fff",
      secondary: "#aaa",
    },
    primary: {
      main: "#ff9800",
      contrastText: "#fff",
    },
    secondary: {
      main: "#23272f",
      contrastText: "#fff",
    },
  },
});

export default customDarkTheme;
