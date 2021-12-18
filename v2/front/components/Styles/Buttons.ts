import { blackA, blue, gray, green, red } from "@radix-ui/colors";
import { styled } from "../../stitches.config";

export const BaseBtn = styled("button", {
  all: "unset",
  appearance: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderRadius: 3,
  transition: "0.2s",

  variants: {
    disabled: {
      true: {
        opacity: 0.3,
        cursor: "not-allowed",

        "&:focus:not(:focus-visible)": {
          outline: "none",
          boxShadow: "none",
        },
      },
    },
    transparent: {
      true: {
        backgroundColor: "transparent",

        "@media (hover: hover)": {
          "&:hover": { backgroundColor: blackA.blackA9 },
        },
      },
    },
    gray: {
      true: {
        backgroundColor: gray.gray6,
        color: gray.gray12,

        "@media (hover: hover)": {
          "&:hover": { backgroundColor: gray.gray7 },
          "&:focus": { boxShadow: `0 0 0 2px ${gray.gray9}` },
        },
      },
    },

    white: {
      true: {
        backgroundColor: "white",
        color: "black",

        "@media (hover: hover)": {
          "&:hover": { backgroundColor: gray.gray5 },
          "&:focus": { boxShadow: `0 0 0 2px ${gray.gray6}` },
        },
      },
    },
    blue: {
      true: {
        backgroundColor: blue.blue5,
        color: blue.blue11,

        "@media (hover: hover)": {
          "&:hover": { backgroundColor: blue.blue6 },
          "&:focus": { boxShadow: `0 0 0 2px ${blue.blue6}` },
        },
      },
    },
    red: {
      true: {
        backgroundColor: red.red7,
        color: red.red12,

        "@media (hover: hover)": {
          "&:hover": { backgroundColor: red.red8 },
          "&:focus": { boxShadow: `0 0 0 2px ${red.red8}` },
        },
      },
    },
    green: {
      true: {
        backgroundColor: green.green5,
        color: green.green11,

        "@media (hover: hover)": {
          "&:hover": { backgroundColor: green.green6 },
          "&:focus": { boxShadow: `0 0 0 2px ${green.green6}` },
        },
      },
    },
  },
});
