import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import styles from "./TagsBlock.module.scss";


export const TagsBlock = ({ items, isLoading = true }) => {
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
          <a
            key={i}
            href={isLoading ? "#" : `/tags/${name}`}
            className={styles.tag}
          >
            <TagIcon fontSize="small" sx={{ marginRight: 0.5 }} />
            {isLoading ? <Skeleton width={50} /> : name}
          </a>
        ))}
      </Box>
    </div>
  );
};

// import React from 'react';

// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import TagIcon from '@mui/icons-material/Tag';
// import ListItemText from '@mui/material/ListItemText';
// import Skeleton from '@mui/material/Skeleton';

// import { SideBlock } from './SideBlock';

// export const TagsBlock = ({ items, isLoading = true }) => {
//   return (
//     <SideBlock title="Тэги">
//       <List>
//         {(isLoading ? [...Array(5)] : items).map((name, i) => (
//           <a style={{ textDecoration: 'none', color: 'black' }} href={`/tags/${name}`}>
//             <ListItem key={i} disablePadding>
//               <ListItemButton>
//                 <ListItemIcon>
//                   <TagIcon />
//                 </ListItemIcon>
//                 {isLoading ? <Skeleton width={100} /> : <ListItemText primary={name} />}
//               </ListItemButton>
//             </ListItem>
//           </a>
//         ))}
//       </List>
//     </SideBlock>
//   );
// };

