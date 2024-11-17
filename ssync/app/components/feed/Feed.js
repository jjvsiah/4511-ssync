import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';

const formattedDate = (timestamp) => {
  const postDate = new Date(timestamp);
  const day = postDate.getDate();
  const month = postDate.getMonth() + 1;
  const year = postDate.getFullYear();
  let hours = postDate.getHours();
  const minutes = postDate.getMinutes().toString().padStart(2, '0');
  const isPM = hours >= 12;
  hours = hours % 12 || 12;
  const ampm = isPM ? 'PM' : 'AM';

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

const PostContent = ({ post }) => (
  <View>
    <Text className='mt-2 text-sm font-iregular'>{post.content}</Text>
  </View>
);

const PostReplies = ({ replies }) => (
  <View>
    {replies.map((reply, replyIndex) => (
      <View
        key={replyIndex}
        style={{
          marginLeft: 10,
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            position: 'relative',
          }}>
          {/* Profile Image */}
          <Image
            source={{ uri: reply.profileIcon }}
            className='w-9 h-9 rounded-full ml-3 mr-3'
          />
          {/* Reply Content */}
          <View style={{ flex: 1 }}>
            <Text className='text-xs font-pregular'>{reply.posterName}</Text>
            <Text className='text-sm font-pregular'>{reply.content}</Text>
          </View>
          {/* Date */}
          <Text
            className='text-xs text-gray-500 font-pregular'
            style={{ position: 'absolute', right: 0 }}>
            {formattedDate(reply.dateTime)}
          </Text>
        </View>
        {/* Grey line on the left */}
        <View
          style={{
            position: 'absolute',
            left: -5,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: '#cdcdce',
          }}
        />
      </View>
    ))}
  </View>
);

const Feed = ({ posts, searchQuery, dateOrder, timeFrame }) => {
  const [filteredPosts, setFilteredPosts] = useState(posts);

  const isWithinTimeFrame = (postDate, timeFrame) => {
    const now = new Date();
    const postTime = new Date(postDate);

    switch (timeFrame) {
      case 'today':
        return now.toDateString() === postTime.toDateString();
      case 'pastWeek':
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        return postTime >= sevenDaysAgo;
      case 'pastMonth':
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        return postTime >= thirtyDaysAgo;
      case 'allTime':
        return true; // No filtering by time
      default:
        return false;
    }
  };

  useEffect(() => {
    let updatedPosts = posts;

    if (searchQuery) {
      updatedPosts = updatedPosts.filter((post) => {
        // Check if the post content matches the search query
        const postMatches =
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.postName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.posterName.toLowerCase().includes(searchQuery.toLowerCase());

        // Check if any reply content matches the search query
        const repliesMatch =
          post.replies &&
          post.replies.some(
            (reply) =>
              reply.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              reply.posterName.toLowerCase().includes(searchQuery.toLowerCase())
          );

        // Include post if it matches or if any of the replies match
        return postMatches || repliesMatch;
      });
    }

    if (timeFrame) {
      updatedPosts = updatedPosts.filter((post) =>
        isWithinTimeFrame(post.dateTime, timeFrame)
      );
    }

    if (dateOrder === 'newToOld') {
      updatedPosts = updatedPosts.sort(
        (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
      );
    } else if (dateOrder === 'oldToNew') {
      updatedPosts = updatedPosts.sort(
        (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
      );
    }

    setFilteredPosts(updatedPosts);
  }, [posts, searchQuery, timeFrame, dateOrder]);

  if (!filteredPosts || filteredPosts.length === 0) {
    return (
      <Text className='text-center text-xl text-gray-500 font-bold'>
        No posts found. Click the "Add a post" button to add one!
      </Text>
    );
  }

  return (
    <View>
      {filteredPosts.map((post, index) => {
        const postDateFormatted = formattedDate(post.dateTime);

        return (
          <View key={index} className='py-4 px-5 bg-white rounded-2xl mb-3'>
            <View className='flex-row items-start'>
              <Image
                source={{ uri: post.profileIcon }}
                className='w-11 h-11 rounded-full mr-3'
              />
              <View>
                <Text className='text-xs font-pregular'>{post.posterName}</Text>
                <Text className='text-lg font-pregular'>{post.postName}</Text>
              </View>
              <Text className='text-xs text-gray-500 font-pregular absolute top-0 right-0'>
                {postDateFormatted}
              </Text>
            </View>
            <PostContent post={post} />
            {/* Place the replies outside the original post container */}
            <View className='ml-3 mt-4'>
              {post.replies && post.replies.length > 0 && (
                <PostReplies replies={post.replies} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Feed;
