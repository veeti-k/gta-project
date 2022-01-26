import { styled } from "../../stitches.config";
import { green, red } from "@radix-ui/colors";

export const Text = styled("p", {
  all: "unset",
  fontSize: "0.8rem",
  margin: "0",
  padding: "0",

  "@grid1to2": {
    fontSize: "0.9rem",
  },

  "@grid2to3": {
    fontSize: "1rem",
  },

  variants: {
    lessOpaque: {
      true: {
        opacity: 0.3,
      },
    },

    red: {
      true: {
        color: red.red10,
      },
    },

    green: {
      true: {
        color: green.green10,
      },
    },
  },
});

export const Title = styled("h1", {
  all: "unset",
  fontSize: "1rem",
  margin: "0",
  padding: "0",
  fontWeight: 500,

  "@grid1to2": {
    fontSize: "1.1rem",
  },

  "@grid2to3": {
    fontSize: "1.2rem",
  },
});

export const Desc = styled("p", {
  all: "unset",
  fontSize: "1rem",
  paddingBottom: "1rem",

  "@grid1to2": {
    fontSize: "1rem",
  },

  "@grid2to3": {
    fontSize: "1.1rem",
  },
});
