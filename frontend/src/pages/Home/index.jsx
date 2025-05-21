import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';

import { Post } from '../../components/Post';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import { v4 as uuid } from 'uuid';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts } = useSelector((state) => state.posts);
  const uuidPost = uuid();

  const isPostsLoading = (posts.status === 'loading') || (posts.status === 'error');

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  return (
    <Grid container spacing={4}>
      <Grid xs={12} item>
        {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
          isPostsLoading ? (
            <Post key={uuidPost + index} isLoading={true} />
          ) : (
            <Post
              key={obj.id}
              id={obj.id}
              title={obj.title}
              imageUrl={
                obj.imageUrl
                  ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                  : ""
              }
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={!!userData && !!obj.user && userData.id === obj.user.id}
            />
          )
        )}
      </Grid>
    </Grid>
  );
};
