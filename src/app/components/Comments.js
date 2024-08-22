"use client";

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const COMMENTS_PER_PAGE = 10;

export default function Comments({ postSlug }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ author: '', content: '' })
  const [replyTo, setReplyTo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalComments, setTotalComments] = useState(0)
  const formRef = useRef(null)
  const nameInputRef = useRef(null)  // New ref for the name input

  const fetchComments = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error, count } = await supabase
        .from('bllog')
        .select('*', { count: 'exact' })
        .eq('post_slug', postSlug)
        .order('created_at', { ascending: false })
        .range(page * COMMENTS_PER_PAGE, (page + 1) * COMMENTS_PER_PAGE - 1)

      if (error) throw error

      const nestedComments = nestComments(data)
      setComments(prevComments => page === 0 ? nestedComments : [...prevComments, ...nestedComments])
      setHasMore(count > (page + 1) * COMMENTS_PER_PAGE)
      setTotalComments(count)
    } catch (error) {
      setError('Failed to fetch comments. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [postSlug, page])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  useEffect(() => {
    if (replyTo && nameInputRef.current) {
      nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      nameInputRef.current.focus()  // This will also focus the input field
    }
  }, [replyTo])

  function nestComments(comments) {
    const commentMap = {}
    const rootComments = []

    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] }
    })

    comments.forEach(comment => {
      if (comment.parent_id) {
        commentMap[comment.parent_id].replies.push(commentMap[comment.id])
      } else {
        rootComments.push(commentMap[comment.id])
      }
    })

    return rootComments
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('bllog')
        .insert([
          { 
            post_slug: postSlug,
            author_name: newComment.author,
            content: newComment.content,
            parent_id: replyTo
          }
        ])

      if (error) throw error

      setNewComment({ author: '', content: '' })
      setReplyTo(null)
      setPage(0)
      fetchComments()
    } catch (error) {
      setError('Failed to submit comment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function loadMore() {
    setPage(prevPage => prevPage + 1)
  }

  function CommentItem({ comment, depth = 0 }) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4 ${depth > 0 ? 'border-l-2 border-blue-500' : ''}`}>
        <p className="font-bold text-gray-800 dark:text-gray-200">{comment.author_name}</p>
        <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {new Date(comment.created_at).toLocaleString()}
        </p>
        <button 
          onClick={() => setReplyTo(comment.id)} 
          className="text-blue-500 hover:text-blue-600 mt-2"
        >
          Reply
        </button>
        {comment.replies && comment.replies.length > 0 && (
          <div className={`mt-4 ${depth > 0 ? 'ml-1' : 'ml-4'}`}>
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Comments ({totalComments})</h2>
      
      <form ref={formRef} onSubmit={handleSubmit} className="mb-8">
        <input
          ref={nameInputRef}  // Add this ref to the name input
          type="text"
          placeholder="Your name"
          value={newComment.author}
          onChange={(e) => setNewComment({...newComment, author: e.target.value})}
          className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          required
        />
        <textarea
          placeholder="Your comment"
          value={newComment.content}
          onChange={(e) => setNewComment({...newComment, content: e.target.value})}
          className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-y min-h-[100px]"
          required
        />
        <button 
          type="submit" 
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : (replyTo ? 'Submit Reply' : 'Submit Comment')}
        </button>
        {replyTo && (
          <button 
            onClick={() => setReplyTo(null)} 
            className="w-full mt-2 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
          >
            Cancel Reply
          </button>
        )}
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="space-y-4 mb-6">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
      
      {hasMore && (
        <button 
          onClick={loadMore}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More Comments'}
        </button>
      )}
    </div>
  )
}