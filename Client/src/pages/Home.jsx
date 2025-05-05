import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaImage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../sass/Home.scss';
import Tweet from '../components/Tweet';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [newTweetContent, setNewTweetContent] = useState('');
  const [newTweetImage, setNewTweetImage] = useState(null);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axios.get(`${API_URL}/tweets`);
        setTweets(response.data);
      } catch (err) {
        console.error('Failed to fetch tweets', err);
      }
    };

    fetchTweets();
  }, []);

  const handleNewTweet = async () => {
    if (!newTweetContent) {
      toast.error('Tweet content is required');
      return;
    }

    const formData = new FormData();
    formData.append('content', newTweetContent);
    if (newTweetImage) {
      formData.append('image', newTweetImage);
    }
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_URL}/tweets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTweets([response.data, ...tweets]);
      setShowModal(false);
      setNewTweetContent('');
      setNewTweetImage(null);
      toast.success('Tweet posted successfully');
    } catch (err) {
      console.error('Failed to post tweet', err);
      toast.error('Failed to post tweet');
    }
  };

  const handleImageChange = (e) => {
    setNewTweetImage(e.target.files[0]);
  };

  return (
    <div className="home">
      <div className="home-header">
        <h2>Home</h2>
        <Button className='me-2' variant="primary" onClick={() => setShowModal(true)}>
          Tweet
        </Button>
      </div>

      <div className="tweets">
        {tweets.length === 0 ? (
          <div className="no-tweets-info">
            <p>No tweets available.</p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <Tweet key={tweet._id} {...tweet} />
          ))
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTweetContent">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What's happening?"
                value={newTweetContent}
                onChange={(e) => setNewTweetContent(e.target.value)}
              />
            </Form.Group>
            {newTweetImage && (
              <div className="image-preview-container">
                <img src={URL.createObjectURL(newTweetImage)} alt="Selected" className="tweet-image-preview" />
              </div>
            )}
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                <FaImage size={24} cursor="pointer" />
                <Form.Control type="file" className="d-none" onChange={handleImageChange} />
              </Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleNewTweet}>
            Tweet
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Home;
