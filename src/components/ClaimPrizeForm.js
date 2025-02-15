import React, { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import './ClaimPrize.css';

const ClaimPrizeForm = ({ onClose, coinAmount }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState({ city: '', state: '' });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'pincode' && value.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const [data] = await response.json();
        if (data.Status === 'Success') {
          const [firstPost] = data.PostOffice;
          setLocation({
            city: firstPost.District,
            state: firstPost.State
          });
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    }
  };

  const sendCongratulationsEmail = async (emailData) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.email,
          name: emailData.name,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Inside ClaimPrizeForm.js
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // First check if user exists with this email or mobile
      const { data: existingUsers, error: userError } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${formData.email},mobile.eq.${formData.mobile}`);
  
      if (userError) throw userError;
  
      if (existingUsers?.length > 0) {
        // Check if any of these users have existing claims
        const { data: existingClaims, error: claimError } = await supabase
          .from('claims')
          .select('id')
          .in('user_id', existingUsers.map(user => user.id));
  
        if (claimError) throw claimError;
  
        if (existingClaims?.length > 0) {
          setError('You have already claimed a prize with this email or mobile number.');
          setLoading(false);
          return;
        }
      }
  
      // If no existing claims, proceed with new user creation
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          coins: coinAmount
        }])
        .select()
        .single();
  
      if (createError) throw createError;
  
      // Record claim
      const { error: claimError } = await supabase
        .from('claims')
        .insert([{
          user_id: newUser.id,
          amount: coinAmount,
          pincode: formData.pincode,
          city: location.city,
          state: location.state
        }]);
  
      if (claimError) throw claimError;
  
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
  
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="claim-form-overlay" onClick={onClose}>
      <div className="claim-form-content" onClick={e => e.stopPropagation()}>
        <h2>Claim Your Voucher</h2>
        
        {error && (
          <div className="claim-alert">
            {error}
          </div>
        )}

        {success ? (
          <div className="claim-alert-success">
            Prize claimed successfully! Check your email for discount details.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Form fields remain the same */}
            <div className="claim-form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="claim-form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="claim-form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div className="claim-form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                placeholder="Enter your pincode"
                value={formData.pincode}
                onChange={handleChange}
                pattern="[0-9]{6}"
                required
              />
            </div>

            {location.city && location.state && (
              <div className="location-display">
                <p>City: {location.city}</p>
                <p>State: {location.state}</p>
              </div>
            )}

            <div className="claim-form-buttons">
              <button
                type="submit"
                className="claim-submit-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Claim Prize'}
              </button>
              <button
                type="button"
                className="claim-cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClaimPrizeForm;