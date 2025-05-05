import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Tweet from '../components/Tweet';
// import '../sass/TweetDetails.scss';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TweetDetails = () => {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTweetDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/tweets/${id}`);
        setTweet(response.data);

        const repliesResponse = await axios.get(`${API_URL}/tweets/${id}/replies`);
        setReplies(repliesResponse.data);
      } catch (err) {
        console.error('Failed to fetch tweet details', err);
      }
    };

    fetchTweetDetails();
  }, [id]);

  const handleReply = async () => {
    if (!replyContent) {
      alert('Reply content is required');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_URL}/tweets/${id}/replies`,
        { content: replyContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReplies([response.data, ...replies]);
      setReplyContent('');
    } catch (err) {
      console.error('Failed to post reply', err);
      alert('Failed to post reply');
    }
  };

  return (
    <div className="tweet-details">
      <h3 className='ms-2 my-3'>Tweet</h3>

      {tweet ? (
        <Tweet {...tweet} />
      ) : (
        <p>Loading tweet...</p>
      )}

      <div className="replies-section">
        <Form className="ms-2 reply-form">
          <Form.Group controlId='formReplyContent'>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder='Write your reply...'
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
          </Form.Group>
          <Button className='mt-2' variant='primary' onClick={handleReply}>Reply</Button>
        </Form>

        {replies.length === 0 ? (
          <p>No replies yet.</p>
        ) : (
          replies.map((reply) => <Tweet key={reply._id} {...reply} />)
        )}
      </div>
    </div>
  );
};

export default TweetDetails;
