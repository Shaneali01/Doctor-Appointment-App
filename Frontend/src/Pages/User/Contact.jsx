import React, { useEffect, useState } from 'react';
import NewsletterForm from '../../Components/Common/NewsLetter';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ChevronDown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactForm = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value) {
          newErrors.firstName = 'First name is required';
        } else if (value.length < 2 || value.length > 50) {
          newErrors.firstName = 'First name must be 2–50 characters';
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          newErrors.firstName = 'First name can only contain letters, numbers, and spaces';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (value && (value.length < 2 || value.length > 50)) {
          newErrors.lastName = 'Last name must be 2–50 characters';
        } else if (value && !/^[a-zA-Z0-9\s]+$/.test(value)) {
          newErrors.lastName = 'Last name can only contain letters, numbers, and spaces';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (value && !/^\+?\d{7,15}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phone = 'Invalid phone number (7–15 digits)';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'message':
        if (!value) {
          newErrors.message = 'Message is required';
        } else if (value.length < 10 || value.length > 500) {
          newErrors.message = 'Message must be 10–500 characters';
        } else {
          delete newErrors.message;
        }
        break;
      case 'termsAccepted':
        if (!value) {
          newErrors.termsAccepted = 'You must accept the terms';
        } else {
          delete newErrors.termsAccepted;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be 2–50 characters';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, numbers, and spaces';
    }

    // Last Name
    if (formData.lastName && (formData.lastName.length < 2 || formData.lastName.length > 50)) {
      newErrors.lastName = 'Last name must be 2–50 characters';
    } else if (formData.lastName && !/^[a-zA-Z0-9\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters, numbers, and spaces';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone
    if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number (7–15 digits)';
    }

    // Message
    if (!formData.message) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10 || formData.message.length > 500) {
      newErrors.message = 'Message must be 10–500 characters';
    }

    // Terms Accepted
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const errorMessages = Object.values(errors).join(', ');
      toast.error(`Please fix the following: ${errorMessages}`);
      return;
    }

    // Prepare data for Web3Forms
    const web3FormData = {
      access_key: '02d1b2b3-faa6-4df3-8941-41f556d61038',
      ...formData,
      subject: 'New Contact Form Submission',
    };

    try {
      setIsLoading(true);
      // Send to Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(web3FormData),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to submit form');
      }

      toast.success('Form submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        topic: '',
        message: '',
        termsAccepted: false,
      });
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-aos='fade-up' className="min-h-screen flex flex-col items-center p-4">
      <div className="relative w-full h-96 mt-12">
        <img
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9zcGl0YWwlMjBidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D"
          alt="Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute text-white inset-0 flex flex-col justify-center items-center bg-opacity-50 p-4">
          <h2 className="text-lg font-bold">Get In Touch</h2>
          <h1 className="lg:text-5xl text-4xl py-3 text-teal-500 font-bold mb-2">Contact Us</h1>
          <p className="text-center mb-4 font-bold max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <ChevronDown
            className="w-12 h-12 text-teal-500 animate-bounce"
            strokeWidth={3}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl w-full max-w-2xl">
        <div className="grid grid-cols-1 text-gray-700 sm:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label className="mb-2 font-medium">First Name *</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              className={`border-2 p-2 rounded-md ${errors.firstName ? 'border-red-500' : 'border-[#007E85]'}`}
              value={formData.firstName}
              onChange={handleChange}
              onBlur={() => validateField('firstName', formData.firstName)}
              disabled={isLoading}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              className={`border-2 p-2 rounded-md ${errors.lastName ? 'border-red-500' : 'border-[#007E85]'}`}
              value={formData.lastName}
              onChange={handleChange}
              onBlur={() => validateField('lastName', formData.lastName)}
              disabled={isLoading}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`border-2 p-2 rounded-md ${errors.email ? 'border-red-500' : 'border-[#007E85]'}`}
              value={formData.email}
              onChange={handleChange}
              onBlur={() => validateField('email', formData.email)}
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              className={`border-2 p-2 rounded-md ${errors.phone ? 'border-red-500' : 'border-[#007E85]'}`}
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => validateField('phone', formData.phone)}
              disabled={isLoading}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-medium">Topic</label>
          <select
            name="topic"
            className={`border-2 p-2 rounded-md ${errors.topic ? 'border-red-500' : 'border-[#007E85]'}`}
            value={formData.topic}
            onChange={handleChange}
            onBlur={() => validateField('topic', formData.topic)}
            disabled={isLoading}
          >
            <option value="">Select one...</option>
            <option value="support">Support</option>
            <option value="sales">Sales</option>
            <option value="general">General Inquiry</option>
          </select>
          {errors.topic && <p className="text-red-500 text-xs mt-1">{errors.topic}</p>}
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-medium">Message *</label>
          <textarea
            name="message"
            placeholder="Type your message..."
            className={`border-2 p-2 rounded-md w-full ${errors.message ? 'border-red-500' : 'border-[#007E85]'}`}
            rows="4"
            value={formData.message}
            onChange={handleChange}
            onBlur={() => validateField('message', formData.message)}
            disabled={isLoading}
          ></textarea>
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="termsAccepted"
            className={`mr-2 ${errors.termsAccepted ? 'border-red-500' : ''}`}
            checked={formData.termsAccepted}
            onChange={handleChange}
            onBlur={() => validateField('termsAccepted', formData.termsAccepted)}
            disabled={isLoading}
          />
          <label>I accept the terms *</label>
          {errors.termsAccepted && <p className="text-red-500 text-xs ml-2">{errors.termsAccepted}</p>}
        </div>
        <button
          type="submit"
          className="bg-[#007E85] text-white px-4 py-2 rounded-md w-full hover:bg-teal-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 text-teal-500 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>

      <NewsletterForm />
    </div>
  );
};

export default ContactForm;