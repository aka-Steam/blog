import React from "react";
import PropTypes from "prop-types";
import { Box, Skeleton } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import styles from "./TagsBlock.module.scss";
import { v4 as uuid } from 'uuid';

export const TagsBlock = ({ items, isLoading = true }) => {
  const uuidBtn = uuid();
  const uuidLink = uuid();

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // Перенос строк при необходимости
          gap: 1, // Расстояние между тегами
        }}
      >
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          isLoading ? (
            <button
              key={uuidBtn + i}
              className={styles.tag}
              style={{ display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'default' }}
              disabled
            >
              <TagIcon fontSize="small" sx={{ marginRight: 0.5 }} />
              <Skeleton width={50} />
            </button>
          ) : (
            <a
              key={uuidLink + i}
              href={`/tags/${name}`}
              className={styles.tag}
            >
              <TagIcon fontSize="small" sx={{ marginRight: 0.5 }} />
              {name}
            </a>
          )
        ))}
      </Box>
    </div>
  );
};

TagsBlock.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool,
};