'use client';

import HeaderText from '@/modules/common/header-text';
import { useEffect, useState } from 'react';
import PostCard from './post-card';

const Posts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const accessToken =
        process.env
          .NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;
      console.log({ accessToken });

      const response = await fetch(
        `https://graph.facebook.com/543889322136808/feed?fields=message,created_time,attachments&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.data);
    } catch (err: any) {
      setError(
        err.message || 'Failed to fetch posts'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTweets = async () => {
    try {
      const response = await fetch(
        'http://localhost:8000/tama/tweets'
      ); // Proxy endpoint

      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  // Replace 'TwitterDev' with the target username

  useEffect(() => {
    fetchPosts();
    fetchTweets();
  }, []);

  if (isLoading) {
    return (
      <div className='text-center mt-10'>
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-500 mt-10'>
        {error}
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col gap-10 mb-16'>
      <HeaderText
        title='Social Media Highlights'
        subtitle='Catch up on our latest updates and stories from Facebook and Twitter'
      />
      <div className='grid gap-6  md:grid-cols-2 grid-cols-1'>
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default Posts;
