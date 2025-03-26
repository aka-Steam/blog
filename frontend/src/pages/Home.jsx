import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
// import { TagsBlock } from '../components/TagsBlock';
// import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  // const { posts, tags } = useSelector((state) => state.posts);
  const { posts } = useSelector((state) => state.posts);

  const isPostsLoading = (posts.status === 'loading') || (posts.status === 'error');
  // const isTagsLoading = tags.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  return (
    <>
      {/* <TagsBlock items={tags.items} isLoading={isTagsLoading} />
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs> */}
      <Grid container spacing={4}>
        <Grid xs={12} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
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
                isEditable={userData?.id === obj.user.id}
              />
            )
          )}
        </Grid>
        {/* <Grid xs={4} item>
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Степан Семенович",
                  avatarUrl: "https://mui.com/static/images/avatar/4.jpg",
                },
                text: "Это тестовый комментарий. Продам гараж, звонить 88005556677",
              },
              {
                user: {
                  fullName: "Саня Друг",
                  avatarUrl: "https://mui.com/static/images/avatar/6.jpg",
                },
                text: "Брат, пост просто шедевр брат. Ты мне как брат брат",
              },
            ]}
            isLoading={false}
          />
        </Grid> */}
      </Grid>
    </>
  );
};
