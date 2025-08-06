# URL Shortener React App with PrimeNG

A modern, responsive React application for shortening long URLs with a beautiful PrimeNG UI. This app consumes REST API endpoints to provide URL shortening services with clipboard functionality, real-time feedback, and advanced responsive design.

## 🚀 Features

- **Modern PrimeNG UI**: Beautiful, professional design using PrimeNG components
- **Enhanced Responsive Design**: Advanced responsive breakpoints for all devices
- **URL Validation**: Real-time URL validation with user-friendly error messages
- **One-Click Copy**: Easy clipboard functionality for shortened URLs
- **Loading States**: Visual feedback during API requests with PrimeNG spinners
- **Toast Notifications**: Real-time success/error notifications using PrimeNG Toast
- **Mobile Responsive**: Optimized for all device sizes with PrimeFlex
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Mock API**: Built-in mock service for development and testing
- **Accessibility**: Enhanced accessibility features and keyboard navigation
- **Print Support**: Optimized print styles

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **PrimeReact** - Professional React UI component library
- **PrimeFlex** - CSS utility framework for responsive design
- **PrimeIcons** - Comprehensive icon library
- **Bootstrap 5** - Additional CSS framework support
- **Axios** - HTTP client for API requests
- **React Toastify** - Additional toast notifications

## 📱 Responsive Design Features

### 📏 **Breakpoint System:**
- **Extra Small (< 576px)**: Mobile phones - Single column layout, stacked inputs
- **Small (576px - 768px)**: Landscape phones - Optimized spacing and typography
- **Medium (768px - 992px)**: Tablets - Two-column stats, three-column features
- **Large (992px - 1200px)**: Small desktops - Enhanced spacing and larger components
- **Extra Large (> 1200px)**: Large desktops - Maximum width with optimal readability

### 🎨 **Responsive Features:**
- **Adaptive Typography**: Font sizes scale based on screen size
- **Flexible Layouts**: Components rearrange for optimal viewing
- **Touch-Friendly**: Larger touch targets on mobile devices
- **Optimized Images**: Icons and elements scale appropriately
- **Smart Navigation**: Input groups stack vertically on mobile
- **Progressive Enhancement**: Enhanced features on larger screens

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14.0 or higher)
- npm (version 6.0 or higher) or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/web-url-shortener.git
   cd web-url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or with yarn:
   ```bash
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   REACT_APP_API_URL=https://your-api-endpoint.com/v1
   REACT_APP_USE_MOCK_API=true
   
   # App Configuration
   REACT_APP_NAME=URL Shortener
   REACT_APP_VERSION=1.0.0
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm start
```
or with yarn:
```bash
yarn start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
```
or with yarn:
```bash
yarn build
```

## 🔌 API Integration

### Backend API Endpoints

The application expects the following REST API endpoints:

#### 1. Shorten URL (POST)
```
POST /shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}

Response:
{
  "shortUrl": "https://short.ly/abc123",
  "originalUrl": "https://example.com/very/long/url",
  "id": "abc123",
  "createdAt": "2023-12-07T10:30:00.000Z",
  "clicks": 0
}
```

#### 2. Get Original URL (GET)
```
GET /expand/{shortCode}

Response:
{
  "originalUrl": "https://example.com/very/long/url",
  "shortUrl": "https://short.ly/abc123",
  "clicks": 25,
  "createdAt": "2023-12-07T10:30:00.000Z"
}
```

### Configuration

Update the `.env` file to configure your API:

- **REACT_APP_API_URL**: Your backend API base URL
- **REACT_APP_USE_MOCK_API**: Set to `true` to use mock data for development

## 🎨 UI Components

### PrimeNG Components Used

1. **Card Component**
   - Professional card layout with header
   - Glassmorphism design with hover effects
   - Responsive padding and margins

2. **InputText Component**
   - Enhanced input validation
   - Hover and focus states
   - Integrated with PrimeNG validation

3. **Button Component**
   - Loading states with built-in spinner
   - Hover animations and transitions
   - Icon integration with PrimeIcons

4. **Toast Component**
   - Professional notification system
   - Multiple severity levels
   - Auto-dismiss functionality

5. **Panel Component**
   - Collapsible result display
   - Gradient styling for success states
   - Integrated header with icons

6. **Badge Component**
   - Statistics display
   - Color-coded severity levels
   - Responsive sizing

### Main Features

1. **URL Input Field**
   - PrimeNG InputText with validation
   - Real-time URL format validation
   - Clear button functionality with animation

2. **Short URL Display**
   - **Black background with white text** (as requested)
   - Monospace font for better readability
   - One-click copy to clipboard functionality
   - PrimeNG styling integration

3. **Loading States**
   - PrimeNG ProgressSpinner during API requests
   - Disabled form elements during processing
   - Smooth loading animations

4. **Responsive Design**
   - PrimeFlex utility classes
   - Mobile-first approach with advanced breakpoints
   - Optimized for all screen sizes

## 📱 Responsive Behavior

### Mobile (< 576px)
- Single column layout
- Stacked input groups
- Larger touch targets
- Simplified navigation
- Condensed typography

### Tablet (768px - 992px)
- Two-column statistics display
- Three-column feature grid
- Optimized spacing
- Enhanced readability

### Desktop (> 1200px)
- Maximum width container
- Enhanced typography
- Larger interactive elements
- Advanced hover effects

## 📱 Usage

1. **Enter a URL**: Paste or type a long URL in the PrimeNG InputText field
2. **Validation**: Real-time URL format validation with PrimeNG Message component
3. **Shorten**: Click the PrimeNG Button to process the request
4. **Copy**: Use the integrated copy button to copy the shortened URL
5. **Feedback**: Receive instant PrimeNG Toast notifications

## 🔧 Customization

### PrimeNG Theming

The app uses the Lara Light Blue theme. You can change themes by updating the CSS import in `src/index.js`:

```javascript
import 'primereact/resources/themes/your-theme/theme.css';
```

Available themes include:
- `lara-light-blue`
- `lara-dark-blue`
- `md-light-indigo`
- `bootstrap4-light-blue`
- And many more...

### Responsive Breakpoints

Customize responsive behavior in `src/index.css`:

```css
/* Custom breakpoint */
@media (min-width: 1400px) {
  .url-shortener-prime-container {
    padding: 4rem;
  }
}
```

### PrimeFlex Utilities

Use PrimeFlex classes for quick responsive adjustments:

```javascript
<div className="col-12 md:col-6 lg:col-4 xl:col-3">
  // Content adapts to screen size
</div>
```

## 🚨 Error Handling

Enhanced error handling with PrimeNG components:

- **Network Errors**: Connection issues with Toast notifications
- **Validation Errors**: PrimeNG Message components for form validation
- **API Errors**: Server-side error responses with detailed messages
- **User Feedback**: PrimeNG Toast system for all error types

## 🧪 Development Features

### Mock API

```javascript
// Enable mock API in .env
REACT_APP_USE_MOCK_API=true
```

### Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers with responsive design

## 📦 Project Structure

```
src/
├── components/
│   ├── UrlShortener.js          # Original Bootstrap component
│   └── UrlShortenerPrime.js     # New PrimeNG component
├── services/
│   └── apiService.js            # API service with real and mock implementations
├── App.js                       # Main app component (using PrimeNG)
├── index.js                     # App entry point with PrimeNG imports
└── index.css                    # Enhanced styles with responsive design
```

## 🎯 Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all components
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast Mode**: Enhanced styles for accessibility
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respects user motion preferences

## 🖨️ Print Support

The application includes optimized print styles:
- Clean layout without interactive elements
- High contrast for better printing
- Optimized spacing and typography

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- PrimeReact team for the excellent UI component library
- PrimeFlex team for the responsive utility framework
- Bootstrap team for the additional CSS framework
- React team for the excellent JavaScript library
- All contributors who help improve this project

---

**Made with ❤️ using React, PrimeNG, and responsive design best practices** 