import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ViewToken } from 'react-native';

import LazyImage from '../../components/LazyImage';

import {
  Post,
  Header,
  Avatar,
  Name,
  Description,
  Loading,
} from './styles';

interface IAuthor {
  id: number;
  name: string;
  avatar: string;
}

interface IFeed {
  id: number;
  image: string;
  small: string;
  aspectRatio: number;
  description: string;
  authorId: number;
  author: IAuthor;
}

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<IFeed[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState<number[]>([]);

  const loadPage = useCallback(async (pageNumber = page, shouldRefresh = false) => {
    if (total && pageNumber === total) return;
    if (loading) return;

    setLoading(true);

    const response = await fetch(
      `http://localhost:3000/feed?_expand=author&limit=5&_page=${pageNumber}`,
    );
    const data = await response.json();
    const totalResponse = Number(response.headers.get('X-Total-Count'));

    setTotal(Math.floor(totalResponse / 5));
    setFeed(shouldRefresh ? data : [...feed, ...data]);
    setPage(pageNumber + 1);
    setLoading(false);
  }, [page, feed, total, loading]);

  useEffect(() => {
    loadPage();
  }, []);

  const refreshList = useCallback(async () => {
    setRefreshing(true);

    await loadPage(1, true);

    setRefreshing(false);
  }, [loadPage]);

  const handleViewableChanged = useCallback(({ changed }) => {
    setViewable(changed.map(({ item }: {item: any}) => item.id));
  }, []);

  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={(post) => String(post.id)}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 10,
        }}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        refreshing={refreshing}
        ListFooterComponent={loading ? <Loading /> : null}
        renderItem={({ item }) => (
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name}</Name>
            </Header>

            <LazyImage
              shouldLoad={viewable.includes(item.id)}
              aspectRatio={item.aspectRatio}
              smallSource={item.small}
              source={item.image}
            />

            <Description>
              <Name>{item.author.name}</Name>
              {' '}
              {item.description}
            </Description>
          </Post>
        )}
      />
    </View>
  );
};

export default Feed;
