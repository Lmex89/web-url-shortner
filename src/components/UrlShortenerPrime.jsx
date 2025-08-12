import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { Panel } from 'primereact/panel';
import urlShortenerService from '../services/apiService';
import config from '../config/environment';

const UrlShortenerPrime = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [urlData, setUrlData] = useState(null);
  const toast = useRef(null);
  const shortUrlRef = useRef(null);

  // Debug environment configuration on component mount
  useEffect(() => {
    console.group('🔧 URL Shortener Configuration Debug');
    //console.log('API URL:', config.API_URL);
    console.log('Use Mock API:', config.USE_MOCK_API);
    console.log('Service being used:', config.USE_MOCK_API ? 'MOCK' : 'REAL');
    
    // Show all REACT_APP_ environment variables
    //console.log('All REACT_APP_ variables:');
    Object.keys(import.meta.env)
      .filter(key => key.startsWith('VITE_REACT_APP_'))
      .forEach(key => {
        //console.log(`  ${key}: ${import.meta.env[key]}`);
      });
    console.groupEnd();
  }, []);

  // Validate URL format
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submitted with URL:', originalUrl);
    
    // Reset previous states
    setError('');
    setSuccess(false);
    setShortUrl('');
    setUrlData(null);

    // Validate input
    if (!originalUrl.trim()) {
      setError('Please enter a URL to shorten');
      return;
    }

    if (!isValidUrl(originalUrl.trim())) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    setLoading(true);
    
    console.log('📡 About to call API service...');
    console.log('Service type:', config.USE_MOCK_API ? 'MOCK API' : 'REAL API');

    try {
      const result = await urlShortenerService.shortenUrl(originalUrl.trim());
      
      console.log('📥 API Response:', result);
      
      if (result.success) {
        setShortUrl(result.data.shortUrl);
        setUrlData(result.data);
        setSuccess(true);
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'URL shortened successfully!',
          life: 3000
        });
      } else {
        setError(result.error || 'Failed to shorten URL');
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: result.error || 'Failed to shorten URL',
          life: 5000
        });
      }
    } catch (err) {
      console.error('❌ Error in handleSubmit:', err);
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard functionality
  const copyToClipboard = async () => {
    try {
      if (shortUrlRef.current) {
        shortUrlRef.current.select();
        shortUrlRef.current.setSelectionRange(0, 99999);
      }
      
      await navigator.clipboard.writeText(shortUrl);
      toast.current.show({
        severity: 'success',
        summary: 'Copied!',
        detail: 'Short URL copied to clipboard!',
        life: 2000
      });
    } catch (err) {
      // Fallback for older browsers
      if (shortUrlRef.current) {
        shortUrlRef.current.select();
        document.execCommand('copy');
        toast.current.show({
          severity: 'success',
          summary: 'Copied!',
          detail: 'Short URL copied to clipboard!',
          life: 2000
        });
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to copy to clipboard',
          life: 3000
        });
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setOriginalUrl(e.target.value);
    if (error && e.target.value.trim()) {
      setError('');
    }
  };

  // Clear form
  const handleClear = () => {
    setOriginalUrl('');
    setShortUrl('');
    setError('');
    setSuccess(false);
    setUrlData(null);
  };

  const cardHeader = (
    <div className="text-center">
      <div className="flex align-items-center justify-content-center mb-3">
        <i className="pi pi-link text-6xl text-blue-500 mr-3"></i>
        <h1 className="text-4xl font-bold text-blue-600 m-0">URL Shortener </h1>
      </div>
      <p className="text-600 text-lg m-0">
        By Lmex89 in github
      </p>
      <p className="text-600 text-lg m-0">
        Transform long URLs into short, shareable links
      </p>
    </div>
  );

  return (
    <div className="url-shortener-prime-container min-h-screen flex align-items-center justify-content-center p-4">
      <div className="w-full max-w-4xl">
        <Card 
          header={cardHeader}
          className="main-card-prime shadow-8 border-round-3xl"
        >
          <div className="p-4">
            {/* URL Input Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="field mb-4">
                <label htmlFor="url-input" className="block text-900 font-semibold mb-2">
                  <i className="pi pi-globe mr-2"></i>
                  Enter your long URL:
                </label>
                
                <div className="p-inputgroup">
                  <InputText
                    id="url-input"
                    value={originalUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/very/long/url/that/needs/shortening"
                    disabled={loading}
                    className={`w-full text-lg p-3 ${error ? 'p-invalid' : ''}`}
                    style={{ fontSize: '16px' }}
                  />
                  {originalUrl && (
                    <Button
                      icon="pi pi-times"
                      className="p-button-outlined p-button-secondary"
                      onClick={handleClear}
                      disabled={loading}
                      type="button"
                      tooltip="Clear"
                    />
                  )}
                </div>
                
                {error && (
                  <Message 
                    severity="error" 
                    text={error}
                    className="w-full mt-2"
                  />
                )}
              </div>

              <Button
                type="submit"
                label={loading ? "Shortening URL..." : "Shorten URL"}
                icon={loading ? undefined : "pi pi-cut"}
                loading={loading}
                disabled={loading || !originalUrl.trim()}
                className="w-full p-3 text-lg font-semibold"
                size="large"
              />
            </form>

            {/* Success Result */}
            {success && shortUrl && (
              <div className="fade-in-prime mt-4">
                <Panel 
                  header={
                    <div className="flex align-items-center">
                      <i className="pi pi-check-circle text-green-500 mr-2 text-xl"></i>
                      <span className="font-semibold">URL Shortened Successfully!</span>
                    </div>
                  }
                  className="success-panel"
                  toggleable
                  collapsed={false}
                >
                  {/* Short URL Display */}
                  <div className="field mb-4">
                    <label htmlFor="short-url" className="block text-900 font-semibold mb-2">
                      <i className="pi pi-link mr-2"></i>
                      Your short URL:
                    </label>
                    
                    <div className="p-inputgroup">
                      <InputText
                        ref={shortUrlRef}
                        id="short-url"
                        value={shortUrl}
                        readOnly
                        className="short-url-display-prime text-center font-bold text-lg"
                        style={{ 
                          backgroundColor: '#000000 !important',
                          color: '#ffffff !important',
                          fontFamily: 'monospace',
                          letterSpacing: '0.5px'
                        }}
                      />
                      <Button
                        icon="pi pi-copy"
                        label="Copy"
                        className="copy-btn-prime"
                        onClick={copyToClipboard}
                        tooltip="Copy to clipboard"
                      />
                    </div>
                  </div>

                  {/* URL Stats */}
                  {urlData && (
                    <div className="grid mt-3">
                      <div className="col-12 md:col-6">
                        <div className="text-center p-3">
                          <Badge 
                            value={new Date(urlData.createdAt).toLocaleDateString()} 
                            severity="info"
                            className="text-sm"
                          />
                          <div className="text-600 text-sm mt-1">
                            <i className="pi pi-calendar mr-1"></i>
                            Created
                          </div>
                        </div>
                      </div>
                      <div className="col-12 md:col-6">
                        <div className="text-center p-3">
                          <Badge 
                            value={urlData.clicks || 0} 
                            severity="success"
                            className="text-sm"
                          />
                          <div className="text-600 text-sm mt-1">
                            <i className="pi pi-mouse mr-1"></i>
                            Clicks
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Panel>
              </div>
            )}

            <Divider />

            {/* Features Info */}
            <div className="grid mt-4">
              <div className="col-12 md:col-4">
                <div className="text-center p-3">
                  <i className="pi pi-shield text-green-500 text-4xl mb-3"></i>
                  <h4 className="text-900 font-semibold mb-2">Secure</h4>
                  <p className="text-600 text-sm m-0">Safe & reliable URL shortening</p>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="text-center p-3">
                  <i className="pi pi-bolt text-yellow-500 text-4xl mb-3"></i>
                  <h4 className="text-900 font-semibold mb-2">Fast</h4>
                  <p className="text-600 text-sm m-0">Instant URL processing</p>
                </div>
              </div>
              <div className="col-12 md:col-4">
                <div className="text-center p-3">
                  <i className="pi pi-chart-line text-blue-500 text-4xl mb-3"></i>
                  <h4 className="text-900 font-semibold mb-2">Analytics</h4>
                  <p className="text-600 text-sm m-0">Track clicks and usage</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Toast for notifications */}
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default UrlShortenerPrime; 