import { useState } from 'react';
import Layout from '../../components/Layout';
import './BookUpload.css';

export default function BookUpload({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    ISBN: '',
    genre: '',
    year_of_publication: '',
    age: '',
    price: '',
    description: ''
  });
  
  const [images, setImages] = useState({
    myimage1: null,
    myimage2: null,
    myimage3: null,
    myimage4: null
  });
  
  const [imagePreviews, setImagePreviews] = useState({
    myimage1: null,
    myimage2: null,
    myimage3: null,
    myimage4: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setImages(prev => ({
        ...prev,
        [imageKey]: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({
          ...prev,
          [imageKey]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageKey) => {
    setImages(prev => ({
      ...prev,
      [imageKey]: null
    }));
    setImagePreviews(prev => ({
      ...prev,
      [imageKey]: null
    }));
    // Reset file input
    const fileInput = document.querySelector(`input[name="${imageKey}"]`);
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const formDataToSend = new FormData();
    
    // Add form fields
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Add images
    Object.keys(images).forEach(key => {
      if (images[key]) {
        formDataToSend.append(key, images[key]);
      }
    });

    try {
      const response = await fetch('/api/book_upload', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitMessage('Book uploaded successfully! 🎉');
        // Reset form
        setFormData({
          title: '',
          author: '',
          ISBN: '',
          genre: '',
          year_of_publication: '',
          age: '',
          price: '',
          description: ''
        });
        setImages({
          myimage1: null,
          myimage2: null,
          myimage3: null,
          myimage4: null
        });
        setImagePreviews({
          myimage1: null,
          myimage2: null,
          myimage3: null,
          myimage4: null
        });
        // Reset all file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
      } else {
        setSubmitMessage(data.error || 'Failed to upload book. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout user={user}>
      <div className="sell-page-container">
        <div className="sell-hero">
          <div className="hero-content">
            <h1 className="hero-title">📚 Sell Your Book</h1>
            <p className="hero-subtitle">Turn your used books into cash! Share them with fellow students and make someone's day.</p>
          </div>
        </div>

        <div className="sell-form-wrapper">
          <div className="form-container">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Book Information Section */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">📖</span>
                  <h2>Book Information</h2>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="title">
                      <span className="label-icon">📝</span>
                      Book Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to Algorithms"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="author">
                      <span className="label-icon">✍️</span>
                      Author Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="e.g., Thomas H. Cormen"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ISBN">
                      <span className="label-icon">🔢</span>
                      ISBN Number
                    </label>
                    <input
                      type="text"
                      id="ISBN"
                      name="ISBN"
                      value={formData.ISBN}
                      onChange={handleInputChange}
                      placeholder="e.g., 978-0262033848"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="genre">
                      <span className="label-icon">🏷️</span>
                      Genre <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science, Fiction, Non-Fiction"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="year_of_publication">
                      <span className="label-icon">📅</span>
                      Year of Publication
                    </label>
                    <input
                      type="number"
                      id="year_of_publication"
                      name="year_of_publication"
                      value={formData.year_of_publication}
                      onChange={handleInputChange}
                      placeholder="e.g., 2009"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">
                      <span className="label-icon">⏰</span>
                      Age of Book (years)
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="e.g., 2"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">💰</span>
                  <h2>Pricing & Description</h2>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="price">
                      <span className="label-icon">💵</span>
                      Price (₹) <span className="required">*</span>
                    </label>
                    <div className="price-input-wrapper">
                      <span className="currency-symbol">₹</span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        min="0"
                        required
                      />
                    </div>
                    <small className="help-text">💡 Tip: Check similar books to set a competitive price!</small>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="description">
                      <span className="label-icon">📄</span>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the condition of your book, any highlights or notes, why you're selling it, etc. A good description helps sell faster!"
                      rows="5"
                    />
                    <small className="help-text">💡 Be honest about the book's condition - it builds trust!</small>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">📸</span>
                  <h2>Book Photos</h2>
                  <p className="section-subtitle">Add up to 4 photos. First image will be the cover photo.</p>
                </div>

                <div className="image-upload-grid">
                  {['myimage1', 'myimage2', 'myimage3', 'myimage4'].map((imageKey, index) => (
                    <div key={imageKey} className="image-upload-item">
                      {imagePreviews[imageKey] ? (
                        <div className="image-preview-wrapper">
                          <img src={imagePreviews[imageKey]} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(imageKey)}
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="image-upload-label">
                          <input
                            type="file"
                            name={imageKey}
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, imageKey)}
                            style={{ display: 'none' }}
                          />
                          <div className="upload-placeholder">
                            <span className="upload-icon">📷</span>
                            <span className="upload-text">
                              {index === 0 ? 'Cover Photo' : `Photo ${index + 1}`}
                            </span>
                            <span className="upload-hint">Click to upload</span>
                          </div>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
                <small className="help-text">💡 Good photos = faster sales! Show the cover, spine, and any wear clearly.</small>
              </div>

              {/* Submit Section */}
              <div className="form-submit-section">
                {submitMessage && (
                  <div className={`submit-message ${submitMessage.includes('successfully') ? 'success' : 'error'}`}>
                    {submitMessage}
                  </div>
                )}
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      List My Book
                    </>
                  )}
                </button>
                <p className="submit-note">
                  By listing your book, you agree to our terms of service. Make sure all information is accurate!
                </p>
              </div>
            </form>
          </div>

          {/* Tips Sidebar */}
          <div className="tips-sidebar">
            <div className="tips-card">
              <h3>💡 Selling Tips</h3>
              <ul className="tips-list">
                <li>
                  <strong>Take clear photos:</strong> Good lighting and multiple angles help buyers trust your listing.
                </li>
                <li>
                  <strong>Be honest:</strong> Mention any highlights, notes, or wear. Transparency builds trust!
                </li>
                <li>
                  <strong>Price competitively:</strong> Check what similar books are selling for on the platform.
                </li>
                <li>
                  <strong>Write a good description:</strong> Include why you're selling, condition details, and any extras.
                </li>
                <li>
                  <strong>Respond quickly:</strong> Fast responses to buyer questions lead to faster sales.
                </li>
              </ul>
            </div>

            <div className="stats-card">
              <h3>📊 Quick Stats</h3>
              <div className="stat-item">
                <span className="stat-value">1000+</span>
                <span className="stat-label">Books Sold</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">500+</span>
                <span className="stat-label">Active Sellers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">95%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
