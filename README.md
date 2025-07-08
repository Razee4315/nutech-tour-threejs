# NuTech 360° Virtual Tour

## Project Overview

This is a React-based 360° Virtual Tour application that allows users to explore the NUTECH University campus through interactive panoramic images with customizable hotspots. Built with React Three Fiber for immersive 3D panoramic viewing.

## ✨ Features

### Core Features
- **360° Panoramic Image Viewing** - Immersive campus exploration
- **Interactive Hotspots** - Navigate between locations and view information
- **Interactive Satellite Map** - Real campus satellite view with clickable location markers
- **Multiple Location Navigation** - 14 different campus locations to explore
- **Responsive Design** - Works on desktop and mobile devices

### Enhanced Navigation
- **Full Map Integration** - Direct link to Google Earth for detailed campus view
- **Visual Direction Indicators** - START text and directional arrows on the road
- **Smart Navigation History** - Previous location functionality
- **Tutorial System** - Interactive guide for first-time users

### UI/UX Features
- **Glassmorphism Design** - Modern, elegant interface
- **Fullscreen Mode** - Immersive viewing experience
- **All Views Gallery** - Quick thumbnail navigation between locations
- **Loading States** - Smooth transitions between panoramas

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository
```bash
git clone https://github.com/Razee4315/nutech-tour-threejs.git
cd nutech-tour-threejs
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

## Running the Project

To run the project locally:

```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`

## 🎯 Understanding Hotspots

### What are Hotspots?

Hotspots are interactive points on a 360° panoramic image that users can click to:
- Navigate between scenes
- Display contextual information
- Provide visual guidance
- Trigger custom actions

### Hotspot Types in This Project

1. **Custom Hotspots (Navigation)**
   - Allow navigation between different campus locations
   - Display walking icon (`man-walking.png`)
   - Defined with `type: "custom"`

2. **Info Hotspots**
   - Display informational content about campus features
   - Show as circular "i" buttons
   - Defined with `type: "info"`

3. **START Text**
   - Large white text painted on the road at main entrance
   - Guides users to the beginning of the tour
   - Defined with `type: "start"`

4. **Directional Arrows**
   - White arrows showing navigation direction
   - Appear on pathways to guide user flow
   - Defined with `type: "arrow"`

### Hotspot Configuration Example

```javascript
{
  pitch: -10,  // Vertical position (degrees)
  yaw: 0,      // Horizontal position (degrees)
  type: "custom",
  text: "Go to Academic Block",
  handleClick: (setCurrentLocation) => {
    setCurrentLocation(0);  // Navigate to Academic Block
  }
}
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── TourView.js          # Main tour component with all locations
│   ├── R3FPanorama.js       # React Three Fiber panorama renderer
│   └── Welcome.js           # Welcome screen component
├── App.js                   # Main application component
└── index.js                 # Application entry point

public/
├── images/                  # 360° panoramic images
│   ├── Academic_block.jpg
│   ├── Campus_Pathway.jpg
│   ├── main_entrance.jpg
│   ├── satellite_img.png    # Campus satellite view
│   └── ... (other campus images)
└── icons/
    └── man-walking.png      # Navigation hotspot icon
```

## 🌍 Campus Locations

The tour includes 14 different campus locations:

1. **Main Entrance** - Starting point with START text and directional guidance
2. **Academic Block** - Main academic building complex
3. **Campus Pathway** - Connecting pathways between buildings
4. **Main Walkway** - Primary route through campus
5. **Admin Block** - Administrative offices and services
6. **Campus Viewpoint** - Scenic overview of the campus
7. **Admin Pathway** - Route to administrative building
8. **Atrium** - Central hub with student facilities
9. **Computer Lab** - Technology and computing facilities
10. **Library First Floor** - Ground floor library space
11. **Library Second Floor** - Upper level library area
12. **Faculty and Girls Cafe** - Dining and social space
13. **Auditorium External View** - Event venue exterior
14. **Classroom** - Academic learning space

## 🗺️ Interactive Satellite Map

The application features an interactive satellite map showing:
- **Real satellite imagery** of NUTECH University campus
- **Interactive location markers** - Click to jump to any location
- **Current location indicator** - Highlighted marker showing your position
- **Full Map button** - Direct link to Google Earth for detailed exploration

## 🛠️ Technologies Used

- **React** - Frontend framework
- **React Three Fiber** - 3D rendering and panorama display
- **Three.js** - 3D graphics library
- **Styled Components** - CSS-in-JS styling
- **@react-three/drei** - Three.js helpers and controls
- **@react-three/fiber** - React renderer for Three.js

## 🚀 Recent Updates

### v2.0 - React Three Fiber Migration
- Migrated from Pannellum to React Three Fiber for better performance
- Enhanced 3D panorama rendering with WebGL
- Improved hotspot interaction and positioning

### v1.5 - Enhanced Navigation
- Added interactive satellite map with real campus imagery
- Implemented Full Map button with Google Earth integration
- Added START text and directional arrows for better user guidance

### v1.4 - UI/UX Improvements
- Implemented glassmorphism design language
- Added tutorial system for new users
- Enhanced responsive design for mobile devices

## 🐛 Troubleshooting

- Ensure all images are in the correct format (jpg/png)
- Check browser console for any errors
- Verify Node.js and npm versions
- Clear browser cache if experiencing loading issues
- Ensure WebGL is enabled in your browser for 3D features

## 👥 Contact

**Our Team Members:**
- **Saqlain Abbas** - Lead Developer (saqlainrazee@gmail.com)
- **Aleena Tahir** - (aleenatahirf23@nutech.edu.pk)
- **Aena Habib** - (aenahabibf23@nutech.edu.pk)
- **Sadia Mazhar** - (saidamazharf23@nutech.edu.pk)
- **Malaika Akhtar** - (malaikaakhtarf23@nutech.edu.pk)

**Project Links:**
- **Live Demo:** [https://razee4315.github.io/nutech-tour-threejs/](https://razee4315.github.io/nutech-tour-threejs/)
- **Repository:** [https://github.com/Razee4315/nutech-tour-threejs](https://github.com/Razee4315/nutech-tour-threejs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for NUTECH University by the Development Team*
