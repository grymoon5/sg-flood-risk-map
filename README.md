# 🌊 Singapore Flood Risk Map

An interactive web application that visualizes real-time flood alerts and historical flood data across Singapore, empowering residents to assess their neighborhood's flood risk and take preparatory action.

**Created for #30DaysMapChallenge 2025 | Theme: Water**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-deployed-url.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

---

## 🎯 Project Overview

### Problem Statement
Many Singapore residents lack easy access to:
- Historical flood data for their specific neighborhood
- Real-time flood alerts during heavy rainfall
- Risk assessment tools to evaluate their property's vulnerability
- Actionable preparedness information

### Solution
This interactive web application addresses these gaps by:
- Integrating real-time flood event data from PUB Singapore's API
- Visualizing 10 years of historical flood incidents
- Providing postal code-based risk assessment
- Offering emergency preparedness resources

---

## ✨ Features

### Core Functionality
- **🔍 Postal Code Search**: Check flood risk by entering any Singapore postal code
- **🗺️ Interactive Map**: Leaflet.js map with clickable markers showing flood hotspots
- **📊 Real-time Alerts**: Live flood event data from PUB Singapore
- **📈 Risk Classification**: Algorithm-based risk levels (High/Medium/Low)
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **🔗 Social Sharing**: Share map with community groups

### Data Visualization
- Historical flood frequency by location (2015-2025)
- Color-coded severity indicators
- Pop-up details on map markers
- Statistical dashboard

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript 5.0+ |
| **Styling** | Tailwind CSS 4.0 |
| **Mapping** | Leaflet.js 1.9.4 |
| **Icons** | Lucide React |
| **Deployment** | Vercel |
| **Data Source** | PUB Singapore API, Data.gov.sg |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sg-flood-map.git
   cd sg-flood-map
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

---

## 📊 Data Sources

### Primary Data Source
**PUB Singapore Flood Alert API**
- Endpoint: `https://data.gov.sg/api/action/datastore_search?resource_id=d_f1404e08587ce555b9ea3f565e2eb9a3`
- Update Frequency: Real-time
- Provider: Public Utilities Board (PUB), Singapore
- Documentation: [data.gov.sg](https://data.gov.sg/datasets/d_f1404e08587ce555b9ea3f565e2eb9a3/view)

### Historical Data
- Source: Data.gov.sg historical flood incident records
- Time Period: 2015-2025 (10 years)
- Data Points: Location coordinates, incident frequency, severity classification

---

## 🔧 Configuration

### Environment Variables
No environment variables required for basic functionality. All APIs used are public and open access.

### API Rate Limits
- PUB API: Check data.gov.sg documentation for current limits
- Implemented client-side caching to minimize requests

---

## 📱 Usage

### For Residents

1. **Check Your Neighborhood Risk**
   - Enter your 6-digit postal code
   - View risk level classification
   - See historical incident count

2. **Explore the Map**
   - Click on markers to view location details
   - Zoom and pan to explore different areas
   - View pop-ups with incident statistics

3. **Stay Informed**
   - Monitor real-time flood alerts
   - Download emergency preparedness guide
   - Share with community groups

### For Developers

**Extending the Application:**

```typescript
// Add new flood hotspot
const newHotspot: FloodHotspot = {
  name: 'Location Name',
  lat: 1.xxxx,
  lng: 103.xxxx,
  frequency: 5,
  severity: 'medium'
};
```

**Customizing Risk Algorithm:**

```typescript
const getRiskLevel = (frequency: number): RiskLevel => {
  if (frequency >= 10) return { level: 'High Risk', ... };
  if (frequency >= 6) return { level: 'Medium Risk', ... };
  return { level: 'Lower Risk', ... };
};
```

---

## 🗺️ Roadmap

### Phase 1: MVP ✅
- [x] Real-time PUB API integration
- [x] Interactive Leaflet map
- [x] Postal code search
- [x] Risk classification algorithm
- [x] Responsive design

### Phase 2: Enhanced Features (In Progress)
- [ ] OneMap API integration for Singapore basemap
- [ ] Time-series visualization of flood patterns
- [ ] Historical trend analysis charts
- [ ] Export data functionality

### Phase 3: Advanced Features (Planned)
- [ ] SMS alert subscription system
- [ ] Crowdsourced flood reporting
- [ ] Multi-language support (English, Mandarin, Malay, Tamil)
- [ ] Progressive Web App (PWA) capabilities
- [ ] Offline mode with cached data

---

## 🤝 Contributing

Contributions are welcome! This project serves the public good and benefits from community input.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and TypeScript conventions
- Add comments for complex logic
- Update README if adding new features
- Test thoroughly before submitting PR
- Ensure mobile responsiveness

---

## 📄 License

This project is licensed under the MIT License - see the (LICENSE) file for details.

**Note:** While the code is open source, please respect the data usage terms of PUB Singapore and data.gov.sg.


---

## 📞 Contact & Support

### Report Issues
Found a bug or have a feature request?
- Open an issue: [GitHub Issues](https://github.com/grymoon5/sg-flood-risk-map)
- Email: eaishwarya273@gmail.com

---

## 🌟 Star History

If this project helps you or your community, please consider giving it a star! ⭐


---

## 🔗 Related Resources

- [PUB Flood Alert System](https://www.pub.gov.sg/)
- [Data.gov.sg](https://data.gov.sg/)
- [OneMap API](https://www.onemap.gov.sg/docs/)
- [Singapore Weather API](https://data.gov.sg/collections?topics=Environment)

---

## 📝 Changelog

### Version 1.0.0 (2025-11-12)
- Initial release
- Real-time PUB API integration
- Interactive Leaflet map
- Postal code search functionality
- Risk classification system
- Responsive design
- Social sharing features

---

## ⚠️ Disclaimer

This application is for informational purposes only. While we strive for accuracy, flood risk assessment should not be used as the sole basis for decision-making. Always refer to official PUB alerts and follow guidance from Singapore Civil Defence Force (SCDF) during emergencies.

**Emergency Contacts:**
- SCDF Emergency: 995
- PUB Hotline: (1800-2255-782)

---

**Built with ❤️ for the Singapore community | #30DaysMapChallenge 2025**