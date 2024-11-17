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

const Feed = ({ posts, searchQuery, dateOrder, timeFrame }) => {
  // Use the state hook to store filteredPosts
  //   const [posts, setPosts] = useState(allPosts);

  //   // Listen for changes in filteredPosts, update state accordingly
  //   useEffect(() => {
  //     setPosts(allPosts);
  //   }, [allPosts]); // Re-run this whenever filteredPosts changes
  //   console.log('date order:');
  //   console.log(dateOrder);

  //   console.log('time frame');
  //   console.log(timeFrame);

  const [filteredPosts, setFilteredPosts] = useState(posts);

  // Helper function to check if a date is within the given time frame
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
    // Start with original posts
    let updatedPosts = posts;

    // Filter by search query
    if (searchQuery) {
      updatedPosts = updatedPosts.filter(
        (post) =>
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.postName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.posterName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by time frame
    if (timeFrame) {
      updatedPosts = updatedPosts.filter((post) =>
        isWithinTimeFrame(post.dateTime, timeFrame)
      );
    }

    // Sort posts by date
    if (dateOrder === 'newToOld') {
      updatedPosts = updatedPosts.sort(
        (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
      );
    } else if (dateOrder === 'oldToNew') {
      updatedPosts = updatedPosts.sort(
        (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
      );
    }

    // Update the filtered posts state
    setFilteredPosts(updatedPosts);
  }, [posts, searchQuery, timeFrame, dateOrder]); // Depend on posts, searchQuery, timeFrame, and dateOrder

  return (
    <View>
      {filteredPosts === undefined || filteredPosts.length === 0 ? (
        <Text className='text-center text-xl text-gray-500 font-bold'>
          No posts yet. Click the "Add a post" button to add one!
        </Text>
      ) : (
        filteredPosts.map((post, index) => {
          const postDateFormatted = formattedDate(post.dateTime);

          return (
            <View key={index} className='py-4 px-5 bg-white rounded-2xl mb-3'>
              <View className='flex-row items-start'>
                {/* Profile picture */}
                <Image
                  source={{ uri: post.profileIcon }}
                  className='w-11 h-11 rounded-full mr-3'
                />

                {/* Poster name and post title */}
                <View>
                  <Text className='text-xs font-pregular'>
                    {post.posterName}
                  </Text>
                  <Text className='text-lg font-pregular'>{post.postName}</Text>
                </View>

                {/* Date/Time in top right corner */}
                <Text className='text-xs text-gray-500 font-pregular absolute top-0 right-0'>
                  {postDateFormatted}
                </Text>
              </View>

              {/* Post content */}
              <Text className='mt-2 text-sm font-iregular'>{post.content}</Text>
            </View>
          );
        })
      )}
    </View>
  );
};

export default Feed;
