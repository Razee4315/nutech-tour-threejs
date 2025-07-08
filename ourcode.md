## NuTech 360° Virtual Tour - Codebase Overview (Post-Migration to React Three Fiber)

This document provides an overview of the NuTech 360° Virtual Tour application, focusing on its structure and functionality after migrating from Pannellum to Three.js with React Three Fiber.

### Core Technologies

*   **React**: The base JavaScript library for building the user interface.
*   **React Three Fiber (`@react-three/fiber`)**: A React renderer for Three.js, allowing declarative creation of 3D scenes.
*   **Drei (`@react-three/drei`)**: A collection of useful helpers and abstractions for React Three Fiber (used for camera, controls, HTML embedding).
*   **Three.js**: The underlying WebGL library for 3D graphics.
*   **Styled Components**: For CSS-in-JS styling of UI components.

### Project Structure Highlights

*   **`public/`**: Contains static assets.
    *   `public/images/`: Stores the 360° panoramic images (e.g., `Academic_block.jpg`).
    *   `public/icons/man-walking.png`: Icon used for navigation hotspots.
    *   `index.html`, `manifest.json`, etc.: Standard Create React App files.
*   **`src/`**: Contains the application's React codebase.
    *   **`src/components/TourView.js`**: The main component orchestrating the tour.
    *   **`src/components/R3FPanorama.js`**: The React Three Fiber component responsible for rendering the 360° view and hotspots.
    *   `src/App.js`, `src/index.js`: Standard React application entry points.
*   **`coordinate_finder.html`**: (Root of project) A standalone HTML tool to help determine pitch and yaw coordinates for new hotspots by clicking on an equirectangular image.

### Key Components and Logic

#### 1. `src/components/TourView.js`

This component serves as the central hub for the virtual tour. Its responsibilities include:

*   **State Management**:
    *   `currentLocation`: Tracks the index of the currently displayed scene/image from the `locations` array.
    *   `visitHistory`: An array to keep track of visited locations, enabling the "Previous Location" functionality.
    *   `isLoading`: Boolean to show a loading spinner while the panoramic image is loading.
    *   `modalInfo`: Object to control the visibility and content of the information modal (though info hotspots now use tooltips, this modal might be used for other purposes or can be removed if truly unused).
    *   `showAllViews`: Boolean to toggle the visibility of the modal displaying thumbnails of all available views.
    *   `isFullscreen`: Tracks if the application is in fullscreen mode.
    *   `showTutorial`, `tutorialStep`: Manage the state of the introductory tutorial.
*   **Data Definition (`locations` array)**:
    *   This crucial array holds the configuration for each panoramic scene.
    *   Each location object contains:
        *   `id`: A unique identifier.
        *   `title`: Name of the location (displayed in the UI).
        *   `image`: Path to the panoramic image (e.g., `${process.env.PUBLIC_URL}/images/Main_walkway.jpg`).
        *   `info`: Descriptive text about the location (displayed in the UI).
        *   `hotSpots`: An array of hotspot objects. Each hotspot has:
            *   `pitch`, `yaw`: Spherical coordinates defining its position (obtained using `coordinate_finder.html`).
            *   `type`: Can be `'custom'` (for navigation) or `'info'` (for informational points).
            *   `text`: Text associated with the hotspot. For navigation hotspots, this is the destination; for info hotspots, this is the information itself. Displayed as a tooltip on hover.
            *   `handleClick`: (Only for `type: 'custom'`) A function that takes `setCurrentLocation` and updates the tour to a new scene index.
*   **UI Element Rendering and Logic**:
    *   Renders UI overlays like the `LocationInfo` box, `FullscreenButton`, `HomeButton`, `AllViewsButton`, and `NavigationButton` (for "Previous Location").
    *   Manages modals for "All Views" selection and the tutorial.
*   **Hotspot Click Handling (`handleHotspotClick`)**:
    *   This function is passed as a prop to `R3FPanorama`.
    *   It's triggered when a `'custom'` (navigation) hotspot is clicked within the 3D view.
    *   It calls the `handleClick` method defined in the hotspot's data to change the `currentLocation`.
*   **Panorama Rendering**: Critically, it renders the `<R3FPanorama />` component, passing all necessary data for the current scene (image, hotspots, initial camera settings, etc.).

#### 2. `src/components/R3FPanorama.js`

This component is dedicated to rendering the 3D panoramic experience using React Three Fiber.

*   **Core Setup**:
    *   Uses `<Canvas>` from `@react-three/fiber` to create a WebGL rendering context.
    *   Includes `<PerspectiveCamera>` and `<OrbitControls>` from `@react-three/drei` to manage the 3D camera and user navigation (dragging to look around, zooming).
        *   `rotateSpeed` is set to `-0.5` to match Pannellum's drag direction.
        *   `enablePan` is `false` to prevent moving the camera's target point.
*   **`sphericalToCartesian(pitchPannellum, yawPannellum, radius)` (Helper Function)**:
    *   Converts the pitch and yaw values (from your `locations` data, which follow Pannellum conventions) into 3D Cartesian (x, y, z) coordinates.
    *   The conversion logic `theta = THREE.MathUtils.degToRad(180 - yawPannellum)` is crucial for correctly orienting hotspots relative to the sphere and camera.
*   **`PanoramaSphere` (Internal Sub-component)**:
    *   Creates a Three.js `<mesh>` with a `<sphereGeometry>`. `scale={[-1, 1, 1]}` is used to see the texture from the inside.
    *   The sphere is rotated by `-Math.PI / 2` radians (-90 degrees) on its Y-axis (`rotation={[0, -Math.PI / 2, 0]}`). This orients the panoramic texture correctly so that the part of the image corresponding to `yaw = 0` (center of the equirectangular image) faces the camera's default forward direction.
    *   Uses `useLoader(THREE.TextureLoader, image)` to load the panoramic image.
    *   The loaded texture is applied as a `meshBasicMaterial` to the inside of the sphere (`side={THREE.BackSide}`).
    *   Handles the `onLoad` callback and `autoRotate` functionality (if enabled).
*   **`Hotspot` (Internal Sub-component)**:
    *   Receives a single `spot` object (a hotspot configuration from the `locations` array).
    *   Calculates its 3D `position` using `sphericalToCartesian`.
    *   Uses `<Html center>` from `@react-three/drei` to embed HTML content within the 3D scene at the hotspot's position. This allows for easy styling of hotspots with CSS.
    *   **Appearance & Behavior**:
        *   **Navigation Hotspots (`type: 'custom'`)**: Display the `man-walking.png` icon (from `/public/icons/`). The icon scales up slightly on hover. Clicking triggers the `onHotspotClickCallback` (which is `handleHotspotClick` from `TourView.js`).
        *   **Info Hotspots (`type: 'info'`)**: Display a circular button with an "i". The background darkens slightly on hover. Clicking does nothing.
        *   **Tooltip**: Both types of hotspots display their `text` property in a tooltip when hovered over. The tooltip visibility is managed by an internal `isHovered` state.
*   **Rendering Hotspots**: The `R3FPanorama` component maps over the `hotSpots` array (passed as a prop) and renders an instance of the `Hotspot` sub-component for each one.

### Data Flow for Scene Change

1.  User clicks a navigation hotspot (e.g., the `man-walking.png` icon) in the `R3FPanorama` view.
2.  The `onClick` handler in the `Hotspot` sub-component (within `R3FPanorama.js`) calls `onHotspotClickCallback(spot)`.
3.  This `onHotspotClickCallback` is actually the `handleHotspotClick` function passed down from `TourView.js`.
4.  `handleHotspotClick` in `TourView.js` receives the `spot` data.
5.  It calls `spot.handleClick(setCurrentLocation)`, which is the function defined in your `locations` data (e.g., `(setCurrentLocation) => setCurrentLocation(1)`).
6.  The `setCurrentLocation` state updater in `TourView.js` is called, changing `currentLocation`.
7.  `TourView.js` re-renders.
8.  The `currentData` variable is updated to reflect the new location.
9.  The `<R3FPanorama>` component receives new props (new `image`, `hotSpots` for the new scene, etc.).
10. `R3FPanorama` re-renders, loading the new panoramic image and displaying the hotspots for the new scene.

### Styling

*   **UI Overlays (`TourView.js`)**: Styled using `styled-components`. This includes buttons, modals, informational text boxes, etc.
*   **3D Hotspots (`R3FPanorama.js`)**: Styled using inline CSS within the `<Html>` elements. This provides direct control over their appearance within the 3D context.

### Cleanup from Pannellum

*   The `pannellum-react` dependency has been removed.
*   All uses of the Pannellum component and its specific props/refs have been removed from `TourView.js`.
*   CSS classes specific to Pannellum hotspots (`.pnlm-hotspot`, `cssClass` in data) have been removed.

This overview should help in understanding the current state and workings of your enhanced virtual tour application! 