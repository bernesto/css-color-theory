# Color Theory Extractor & Rotator

A sophisticated JavaScript library for extracting and generating color palettes from images using color theory, psychology, and accessibility principles. This library helps create cohesive, psychologically informed color schemes while ensuring accessibility standards and providing smooth transitions for dynamic applications.

## Features

- **Intelligent Color Extraction**
  - Analyzes images to find dominant and accent colors
  - Filters out undesirable colors (skin tones, muddy colors, etc.)
  - Considers color psychology and context (Tech, Nature, Energy, Luxury)

- **Color Theory Based**
  - Generates harmonious color palettes
  - Supports multiple color schemes (Vibrant, Pastel, Dark)
  - Creates complementary, analogous, split-complementary, and triadic color harmonies

- **Accessibility Focused**
  - Ensures WCAG contrast compliance
  - Generates appropriate text colors with shadows
  - Supports color blindness simulation

- **Dynamic Image Handling**
  - Supports background image rotation
  - Smooth transitions between colors and images
  - Preloads images for optimal performance

## Installation

```html
<script src="color-theory-extractor.js"></script>
```

## Basic Usage

### Single Image Color Extraction
```javascript
const extractor = new ColorTheoryExtractor();

// From a background image
extractor.extractPaletteFromBackgroundImage(element)
  .then(palette => {
    extractor.addPalette(palette);
  });

// From an image element
extractor.extractPaletteFromImage(imgElement)
  .then(palette => {
    extractor.addPalette(palette);
  });

// From a URL
extractor.extractPaletteFromImageUrl('image.jpg')
  .then(palette => {
    extractor.addPalette(palette);
  });
```

### Image Rotation with Color Extraction
```javascript
const rotatorImages = [
  {
    url: 'image1.jpg',
    options: {
      context: 'TECH',
      scheme: 'VIBRANT'
    }
  },
  {
    url: 'image2.jpg',
    options: {
      context: 'NATURE',
      scheme: 'PASTEL'
    }
  }
];

const rotator = new ColorTheoryRotator(
  rotatorImages,
  '.hero-background',
  {
    enableRotation: true,
    randomStart: true,
    interval: 4000,
    fadeTime: 1000
  }
);
```

## Configuration Options

### Color Extraction Options
```javascript
{
  context: 'TECH',          // TECH, NATURE, ENERGY, LUXURY
  scheme: 'VIBRANT',        // VIBRANT, PASTEL, DARK
  psychologyWeight: 0.4,    // Weight for psychological factors
  frequencyWeight: 0.3,     // Weight for color frequency
  proximityWeight: 0.3,     // Weight for tertiary color proximity
  
  // Color filtering
  minFrequency: 0.05,       // Minimum area for color consideration
  tintRange: [0.2, 0.8],    // Lightness range
  saturationRange: [0.3, 1.0], // Saturation range
  
  // Accessibility
  accessibilityChecks: true,
  minimumContrast: 4.5,
  simulateColorBlindness: false,
  colorBlindnessType: 'DEUTERANOPIA'
}
```

### Rotator Options
```javascript
{
  enableRotation: true,     // Enable automatic rotation
  randomStart: true,        // Start with random image
  interval: 4000,           // Time between rotations (ms)
  fadeTime: 1000,          // Transition duration (ms)
  imageFit: 'cover',       // CSS background-size
  imagePosition: 'center'   // CSS background-position
}
```

## Generated Palette Properties
```javascript
{
  dominant: '#FF0000',          // Main color
  accent1: '#FF6666',          // 20% lighter
  accent2: '#CC0000',          // 20% darker
  accent3: '#FF9999',          // 40% lighter
  accent4: '#990000',          // 40% darker
  standard: '#CC3333',         // Less saturated
  
  foreColor: '#FFFFFF',        // Primary text color
  altForeColor: '#000000',     // Alternative text color
  imageForeColor: {            // Image area text color
    color: '#FFFFFF',
    shadowColor: 'rgba(0,0,0,0.5)',
    needsTextShadow: true
  },
  
  // Color harmonies
  complementary: '#00FF00',
  analogous: { color1, color2 },
  splitComplementary: { color1, color2 },
  triadic: { color1, color2 }
}
```

## CSS Variables

The library sets the following CSS custom properties:
```css
:root {
  --theme-primary: #color;
  --theme-accent-1: #color;
  --theme-accent-2: #color;
  --theme-accent-3: #color;
  --theme-accent-4: #color;
  --theme-standard: #color;
  
  --theme-fore-color: #color;
  --theme-alt-fore-color: #color;
  --theme-img-fore-color: #color;
  --theme-img-fore-shadow: rgba(color);
  
  --theme-complementary: #color;
  --theme-analogous-1: #color;
  --theme-analogous-2: #color;
  --theme-split-1: #color;
  --theme-split-2: #color;
  --theme-triadic-1: #color;
  --theme-triadic-2: #color;
}
```

## Browser Support

- Modern browsers supporting:
  - CSS Custom Properties
  - Canvas API
  - Promises
  - ES6+ features

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Brian Ernesto [@bernesto]([https://x.com/bernesto])
