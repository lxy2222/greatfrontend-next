import React, { useState, useEffect, useCallback, useMemo } from "react";
import "@/styles/post.css"

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  body: string;
  userId: number;
}

const baseUrl = "https://jsonplaceholder.typicode.com";
const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${baseUrl}/posts?_limit=100`);
  const data = await response.json();
  return data;
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
    const response = await fetch(`${baseUrl}/comments?postId=${postId}`);
    const data = await response.json();
    return data;
};

const fetchUser = async (userId: number): Promise<User> => {
    const response = await fetch(`${baseUrl}/users/${userId}`);
    const data = await response.json();
    return data;
};

const TestPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [loadingComments, setLoadingComments] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      const userIds = [...new Set(fetchedPosts.map(post => post.userId))];
      const fetchedUsers = await Promise.all(userIds.map(fetchUser));
      const usersMap: Record<number, User> = {};
      fetchedUsers.forEach(user => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
    };

    loadData();
  }, []);

  const visiblePosts = useMemo(() => {
    return posts.slice(0, (currentPage + 1) * postsPerPage);
  }, [posts, currentPage]);

    const handleShowComments = useCallback(async (postId: number) => {
        setExpandedComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
        if (!comments[postId] && !expandedComments[postId]) {
            setLoadingComments(prev => ({...prev, [postId]: true}));
            const fetchedComments = await fetchComments(postId);
            setComments(prevComments => ({...prevComments, [postId]: fetchedComments}));
            setLoadingComments(prev => ({...prev, [postId]: false}));
        }
    }, [comments, expandedComments, fetchComments, setLoadingComments, setComments, setExpandedComments]);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prevPage => prevPage + 1);
  }, []);


  return (
    <div className="container mx-auto w-full">
      <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {visiblePosts.map(post => (
        <div key={post.id} className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-4">{post.body}</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleShowComments(post.id)}>
            {expandedComments[post.id] ? "Hide Comments" : "Show Comments"}
            </button>
          {expandedComments[post.id] && (
            <div className="mt-4">
                {loadingComments[post.id] ? (
                    <p>Loading comments...</p>
                ) : comments[post.id] ? (
                    comments[post.id].map(comment => (
                        <div key={comment.id} className="mt-2 p-2 bg-gray-100 rounded">
                            <p className="font-semibold">User: {users[comment.id]?.name}</p>
                            <p className="text-gray-600">{comment.body}</p>
                        </div>
                    ))
                ) : null}
            </div>
          )}
        </div>
      ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" 
        onClick={handleNextPage} 
            disabled={visiblePosts.length < postsPerPage}>Show more Posts</button>
      </div>
    </div>
  );
};

export default TestPage;
