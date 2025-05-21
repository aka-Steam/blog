import React from "react";
import styles from "./SideBlock.module.scss";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";

export const SideBlock = ({ title, children }) => {
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

SideBlock.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
