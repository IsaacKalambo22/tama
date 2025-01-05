'use client';

import CustomLoader from '@/modules/common/custom-loader';
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

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) {
    return <CustomLoader />;
  }

  if (error) {
    return (
      <div className='text-center text-red-500 mt-10'>
        {error}
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto flex w-full flex-col gap-8 mb-16'>
      <HeaderText
        title='Social Media Highlights'
        subtitle='Stay connected with our latest updates and stories from Facebook and Twitter'
      />
      <div className='max-w-4xl mx-auto flex flex-col gap-10'>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))
        ) : (
          <p className='text-center text-gray-500'>
            No posts available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Posts;
