// src/FeedbackForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackForm.css'; // Create this file

function FeedbackForm() {
    const [rating, setRating] = useState('');
    const [feedbackText, setFeedbackText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/feedback/', {
                user_id: 1, // Replace with actual user ID
                therapist_id: 1, // Replace with actual therapist ID
                rating: rating,
                feedback_text: feedbackText,
            });
            alert('Feedback submitted!');
            setRating('');
            setFeedbackText('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback.');
        }
    };

    return (
        <div className="feedback-container">
            <h3>HOW WOULD YOU RATE YOUR EXPERIENCE?</h3>
            <hr /> {/* Add the horizontal rule here */}
            <div className="rating-container">
                <button className={`rating-button ${rating === 'Excellent' ? 'selected' : ''}`} onClick={() => setRating('Excellent')}>
                    <span role="img" aria-label="Excellent">😃</span><br />Excellent
                </button>
                <button className={`rating-button ${rating === 'Great' ? 'selected' : ''}`} onClick={() => setRating('Great')}>
                    <span role="img" aria-label="Great">🙂</span><br />Great
                </button>
                <button className={`rating-button ${rating === 'Good' ? 'selected' : ''}`} onClick={() => setRating('Good')}>
                    <span role="img" aria-label="Good">😐</span><br />Good
                </button>
                <button className={`rating-button ${rating === 'Okay' ? 'selected' : ''}`} onClick={() => setRating('Okay')}>
                    <span role="img" aria-label="Okay">😕</span><br />Okay
                </button>
                <button className={`rating-button ${rating === 'Bad' ? 'selected' : ''}`} onClick={() => setRating('Bad')}>
                    <span role="img" aria-label="Bad">🙁</span><br />Bad
                </button>
                <button className={`rating-button ${rating === 'Very Bad' ? 'selected' : ''}`} onClick={() => setRating('Very Bad')}>
                    <span role="img" aria-label="Very Bad">😞</span><br />Very Bad
                </button>
            </div>
            <textarea
                placeholder="TELL US ABOUT YOUR EXPERIENCE"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
            />
            <button className="submit-button" onClick={handleSubmit}>SUBMIT</button>
        </div>
    );
}

export default FeedbackForm;