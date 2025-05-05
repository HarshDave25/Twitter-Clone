import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { FaCalendarAlt, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';
import axios from 'axios';
import '../sass/Profile.scss';
import Tweet from '../components/Tweet';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        fetchUserTweets(response.data._id);
        checkFollowingStatus(response.data._id);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    };

    const fetchUserTweets = async (userId) => {
      try {
        const response = await axios.get(`${API_URL}/tweets/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserTweets(response.data);
      } catch (err) {
        console.error('Failed to fetch user tweets', err);
      }
    };

    const checkFollowingStatus = async (userId) => {
      try {
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(response.data.following.includes(userId));
      } catch (err) {
        console.error('Failed to check following status', err);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleFollow = async () => {
    const token = localStorage.getItem('token');

    try {
      if (isFollowing) {
        await axios.post(`${API_URL}/users/unfollow/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/users/follow/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to follow/unfollow user', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <div className="profile-cover">
        <div className="profile-header">
          {user.profilePic && <Image className='profile-pic' src={`${API_URL}/${user.profilePic}`} alt="Profile" roundedCircle />}
          <div className="profile-actions">
            <Button variant={isFollowing ? 'secondary' : 'dark'} onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
        </div>
      </div>
      <div className="profile-details">
        <h2 className='profile-name'>{user.name}</h2>
        <div className='profile-handle'>@{user.username}</div>
        <div className="profile-info">
            <div><FaMapMarkerAlt /> {user.location}</div>
            <div><FaBirthdayCake /> {new Date(user.dob).toLocaleDateString()}</div>
            <div><FaCalendarAlt /> Joined {new Date(user.joined).toLocaleDateString()}</div>
        </div>
          <div className="follow-info">
            <span>{user.following.length} Following</span>
            <span>{user.followers.length} Followers</span>
          </div>
      </div>
      <div className="tweets-section">
        {userTweets.map(tweet => (
          <Tweet key={tweet._id} {...tweet} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
