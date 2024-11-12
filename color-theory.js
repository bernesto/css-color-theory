/**
* MIT License
* 
* Copyright (c) 2024 S V S
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* Color Theory Extractor & Rotator
* A JavaScript library for extracting and generating color palettes from images
* based on color theory, psychology, and accessibility principles.
* 
* Version: 1.0.0
* Author: Brian Ernesto
* Repository: https://github.com/bernesto/color-theory-extractor
*/


// Base tertiary colors and their psychological weights
const TERTIARY_COLORS = {
  red: { 
    hue: 0, 
    psychology: 'excitement',
    weight: 1.0,
    rgb: [255, 0, 0]
  },
  redOrange: { 
    hue: 30, 
    psychology: 'energy',
    weight: 0.9,
    rgb: [255, 63, 0]
  },
  orange: { 
    hue: 60, 
    psychology: 'creativity',
    weight: 0.85,
    rgb: [255, 127, 0]
  },
  yellowOrange: { 
    hue: 90, 
    psychology: 'optimism',
    weight: 0.8,
    rgb: [255, 191, 0]
  },
  yellow: { 
    hue: 120, 
    psychology: 'positivity',
    weight: 0.75,
    rgb: [255, 255, 0]
  },
  yellowGreen: { 
    hue: 150, 
    psychology: 'growth',
    weight: 0.8,
    rgb: [191, 255, 0]
  },
  green: { 
    hue: 180, 
    psychology: 'health',
    weight: 0.9,
    rgb: [0, 255, 0]
  },
  blueGreen: { 
    hue: 210, 
    psychology: 'calm',
    weight: 0.85,
    rgb: [0, 255, 191]
  },
  blue: { 
    hue: 240, 
    psychology: 'trust',
    weight: 1.0,
    rgb: [0, 0, 255]
  },
  bluePurple: { 
    hue: 270, 
    psychology: 'wisdom',
    weight: 0.9,
    rgb: [63, 0, 255]
  },
  purple: { 
    hue: 300, 
    psychology: 'luxury',
    weight: 0.85,
    rgb: [127, 0, 255]
  },
  redPurple: { 
    hue: 330, 
    psychology: 'passion',
    weight: 0.8,
    rgb: [191, 0, 255]
  }
};

/**
 * Color Theory Based Extractor and Palette Generator
 * 
 * Color Psychology Weights (0-1.2):
 * - 1.2: Primary importance in context
 * - 1.1: Strong relevance
 * - 1.0: Base weight
 * - 0.9: Moderate relevance
 * - 0.8: Supporting role
 */
// Color context definitions with psychological weights
const COLOR_CONTEXTS = {
  TECH: {
    blue: 1.2,      // Primary - Trust, Stability
    blueGreen: 1.1, // Innovation
    purple: 1.1     // Creativity
  },
  NATURE: {
    green: 1.2,     // Primary - Health, Growth
    yellowGreen: 1.1, // Freshness
    blueGreen: 1.0   // Harmony
  },
  ENERGY: {
    red: 1.2,       // Primary - Excitement
    orange: 1.1,    // Vitality
    yellow: 1.0     // Optimism
  },
  LUXURY: {
    purple: 1.2,    // Primary - Royalty
    redPurple: 1.1, // Elegance
    blue: 1.0       // Trustworthiness
  }
};

const SCHEME_PRESETS = {
  VIBRANT: {
    saturationRange: [0.5, 1.0],
    tintRange: [0.3, 0.7]
  },
  PASTEL: {
    saturationRange: [0.2, 0.6],
    tintRange: [0.6, 0.9]
  },
  DARK: {
    saturationRange: [0.3, 0.8],
    tintRange: [0.1, 0.5]
  }
};

const HUE_RANGES = {
  // Hue ranges to exclude (in degrees)
  EXCLUDE: [
    { min: 15, max: 40 },   // Brown
    { min: 50, max: 60 }    // Muddy yellow
  ],
  // Specific hue ranges to include (overrides excludes)
  INCLUDE: {
    REDS: { min: 345, max: 15 },
    ORANGES: { min: 15, max: 45 },
    YELLOWS: { min: 45, max: 75 },
    GREENS: { min: 75, max: 165 },
    CYANS: { min: 165, max: 195 },
    BLUES: { min: 195, max: 255 },
    PURPLES: { min: 255, max: 285 },
    MAGENTAS: { min: 285, max: 345 }
  }
};

// Color blindness simulation matrices
const COLORBLIND_MATRICES = {
  PROTANOPIA: [
    [0.567, 0.433, 0, 0],
    [0.558, 0.442, 0, 0],
    [0, 0.242, 0.758, 0],
    [0, 0, 0, 1]
  ],
  DEUTERANOPIA: [
    [0.625, 0.375, 0, 0],
    [0.7, 0.3, 0, 0],
    [0, 0.3, 0.7, 0],
    [0, 0, 0, 1]
  ],
  TRITANOPIA: [
    [0.95, 0.05, 0, 0],
    [0, 0.433, 0.567, 0],
    [0, 0.475, 0.525, 0],
    [0, 0, 0, 1]
  ]
};

/**
 * Weight System Explanation:
 * 
 * proximityWeight (0.3 default):
 * - Determines how much we favor colors that are close to our defined tertiary colors
 * - Higher values (e.g., 0.4-0.5) will strongly prefer colors that closely match our tertiary colors
 * - Lower values (e.g., 0.1-0.2) will be more flexible in color selection
 * - Works in balance with other weights:
 * 
 * psychologyWeight (0.4 default):
 * - How much we favor colors based on their psychological associations
 * - Higher values prefer colors that match the context (e.g., blue for TECH)
 * 
 * frequencyWeight (0.3 default):
 * - How much we favor colors based on their prevalence in the image
 * - Higher values prefer colors that cover more area
 * 
 * Total of weights should equal 1.0
 * 
 * Example calculations:
 * totalScore = (proximityScore * proximityWeight) +
 *              (psychologyScore * psychologyWeight) +
 *              (frequencyScore * frequencyWeight)
 * 
 * proximity score examples:
 * 1.0 = exact match to tertiary color
 * 0.8 = very close to tertiary color
 * 0.5 = somewhat similar to tertiary color
 * 0.2 = quite different from tertiary color
 * 0.0 = completely different from any tertiary color
 *
 * Frequency Thresholds:
 * - minFrequency: 0.05 (5% of image) - Minimum area for color consideration
 * - High frequency: > 0.2 (20% of image)
 * - Medium frequency: 0.1-0.2 (10-20% of image)
 * - Low frequency: 0.05-0.1 (5-10% of image)
 * 
 * Tonal Ranges:
 * - Lightness: 0 (black) to 1 (white)
 * - Saturation: 0 (grayscale) to 1 (full saturation)
 * - Default tint range: 0.2-0.8 (avoiding extremes)
 * - Default saturation range: 0.3-1.0 (moderately saturated to full)
 */
class ColorTheoryExtractor {
  constructor(element = null, options = {}) {
    // Default configuration
    const defaults = {
      color: null,  // If set, skips color extraction and uses this color
      minFrequency: 0.05,
      psychologyWeight: 0.4,
      frequencyWeight: 0.3,
      proximityWeight: 0.3,
      tintRange: [0.2, 0.8],
      saturationRange: [0.3, 1.0],
      minimumScore: 0,          // Minimum score threshold (0 means any score is valid)
      fallbackColor: '#3B82F6', // Default fallback if no colors found/valid
      context: 'TECH',
      scheme: 'VIBRANT',
      harmonyPaletteSaturation: 0.85,
      harmonyPaletteLightness: 0.25,
      debug: false,
      
      maxDimension: 400,
      sampleRate: 4,
      copySpace: {
        mode: 'auto',        // 'auto', 'left', 'right', 'top', 'bottom', 'center'
        selector: null,      // CSS selector for text container if different from main element
        area: null,          // Or explicit { x, y, width, height } in percentages
        padding: 20          // Padding around the text area in pixels
      },
      imagePosition: 'center',  // CSS background-position value
      imageFit: 'cover',        // CSS background-size value
      
      hueFiltering: {
        mode: 'EXCLUDE',          
        excludeRanges: HUE_RANGES.EXCLUDE,
        includeRanges: [
          HUE_RANGES.INCLUDE.REDS,
          HUE_RANGES.INCLUDE.BLUES,
          HUE_RANGES.INCLUDE.GREENS
        ]
      },
      // Accessibility
      accessibilityChecks: true,
      minimumContrast: 4.5,
      simulateColorBlindness: false,
      colorBlindnessType: 'DEUTERANOPIA'
    };

    // Merge configurations
    this.options = this.mergeConfigurations(defaults, options, element);
    
    // Apply color scheme preset if specified
    if (this.options.scheme && SCHEME_PRESETS[this.options.scheme]) {
      this.options = {
        ...this.options,
        ...SCHEME_PRESETS[this.options.scheme]
      };
    }
  }

  mergeConfigurations(defaults, options, element) {
    // Start with defaults
    let config = { ...defaults };

    // Apply passed options
    config = { ...config, ...options };

    // If element exists, apply data attributes
    if (element) {
      const attributes = this.getAttributeConfiguration(element);
      config = { ...config, ...attributes };
    }

    return config;
  }

  getAttributeConfiguration(element) {
    const config = {};
    
    const attributeMap = {
      'context': { type: 'string', transform: v => v.toUpperCase() },
      'scheme': { type: 'string', transform: v => v.toUpperCase() },
      'weight': { type: 'number', prop: 'psychologyWeight' },
      'frequency': { type: 'number', prop: 'minFrequency' },
      'shade': { type: 'number', prop: 'tintRange.0' },
      'tint': { type: 'number', prop: 'tintRange.1' },
      'desat': { type: 'number', prop: 'saturationRange.0' },
      'sat': { type: 'number', prop: 'saturationRange.1' },
      'debug': { type: 'boolean' }
    };

    for (const [attr, settings] of Object.entries(attributeMap)) {
      const value = element.dataset[attr];
      if (value !== undefined) {
        let processed;
        
        switch (settings.type) {
          case 'number':
            processed = Number(value);
            break;
          case 'boolean':
            processed = value === 'true';
            break;
          case 'string':
            processed = settings.transform ? settings.transform(value) : value;
            break;
        }

        if (settings.prop) {
          const [obj, index] = settings.prop.split('.');
          if (!config[obj]) config[obj] = [];
          config[obj][index] = processed;
        } else {
          config[attr] = processed;
        }
      }
    }

    return config;
  }

  // Main extraction methods
  extractPaletteFromImageUrl(url) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('Invalid image URL'));
        return;
      }
      
      // Check for color override at global level
      if (this.options.color) {
        const palette = this.generatePalette(this.options.color);
        palette.debugScores = []; // Empty since we skipped processing
        resolve(palette);
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Get processed colors and debug info
        const {bestColor, debugScores, allColors} = this.processImage(img);

        // If no color met our criteria but we have colors to choose from
        let finalColor = bestColor;
        if (!finalColor && allColors.length > 0) {
          // Use the highest scoring color regardless of threshold
          const highestScoring = debugScores[0];
          finalColor = highestScoring.color;
          console.warn('No color met criteria, using highest scoring color:', highestScoring);
        }

        // If still no color, use fallback
        if (!finalColor) {
          finalColor = this.options.fallbackColor || '#3B82F6'; // Default blue
          console.warn('Using fallback color:', finalColor);
        }

        const palette = this.generatePalette(finalColor);
        palette.debugScores = debugScores;
        resolve(palette);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.crossOrigin = "Anonymous";
      img.src = url;
    });
  }

  extractPaletteFromImage(element) {
    return new Promise((resolve, reject) => {
      if (!element?.src) {
        reject(new Error('No image src found'));
        return;
      }
      
      this.extractPaletteFromImageUrl(element?.src)
        .then(resolve)
        .catch(reject);
    });
  }

  extractPaletteFromBackgroundImage(element) {
    return new Promise((resolve, reject) => {
      const style = window.getComputedStyle(element);
      const bgImage = style.backgroundImage;
      
      if (!bgImage || bgImage === 'none') {
        reject(new Error('No background image found'));
        return;
      }
      
      const url = bgImage.match(/url\(['"]?(.*?)['"]?\)/)?.[1];
      if (!url) {
        reject(new Error('Invalid background image URL'));
        return;
      }
      
      this.extractPaletteFromImageUrl(url)
        .then(resolve)
        .catch(reject);
    });
  }

  // Image processing
  processImage(img) {
    const { colorFrequencies, totalPixels } = this.analyzeImageColors(img);
    const viableColors = this.filterViableColors(colorFrequencies, totalPixels);
    return this.findBestColor(viableColors);
  }

  // Palette application helpers
  addPalette(palette, element = document.documentElement) {
    const {
      dominant,
      accent1,
      accent2,
      accent3,
      accent4,
      standard,
      foreColor,
      altForeColor,
      imageForeColor,
      complementary,
      analogous,
      splitComplementary,
      triadic,
      isLight,
      isDark,
      isExtreme,
      contrastRatios,
      textArea
    } = palette;
    
    // Palette colors
    element.style.setProperty('--theme-primary', dominant);
    element.style.setProperty('--theme-accent-1', accent1);
    element.style.setProperty('--theme-accent-2', accent2);
    element.style.setProperty('--theme-accent-3', accent3);
    element.style.setProperty('--theme-accent-4', accent4);
    element.style.setProperty('--theme-standard', standard);
    
    // Fore Colors
    element.style.setProperty('--theme-fore-color', foreColor);
    element.style.setProperty('--theme-alt-fore-color', altForeColor);
   
    // Image fore color with shadow
    const textElement = textArea ? element.querySelector(this.options.copySpace?.selector) : element;
    if (textElement) {
        textElement.style.setProperty('--theme-img-fore-color', imageForeColor.color);
        textElement.style.setProperty('--theme-img-fore-shadow', imageForeColor.shadowColor);
        
        if (imageForeColor.needsTextShadow) {
            textElement.classList.add('needs-text-shadow');
        } else {
            textElement.classList.remove('needs-text-shadow');
        }
    }
    
    // Harmony colors
    element.style.setProperty('--theme-complementary', complementary);
    element.style.setProperty('--theme-analogous-1', analogous.color1);
    element.style.setProperty('--theme-analogous-2', analogous.color2);
    element.style.setProperty('--theme-split-1', splitComplementary.color1);
    element.style.setProperty('--theme-split-2', splitComplementary.color2);
    element.style.setProperty('--theme-triadic-1', triadic.color1);
    element.style.setProperty('--theme-triadic-2', triadic.color2);
    
    // Contrast Meta
    element.style.setProperty('--theme-is-light', Number(isLight));
    element.style.setProperty('--theme-is-dark', Number(isDark));
    element.style.setProperty('--theme-is-extreme', Number(isExtreme)); // Maybe use different hover states or 

    if (this.options.accessibilityChecks) {
      this.validateAccessibility(palette);
    }
  }

  showPalette(palette, element) {
    const {debugScores} = palette;
    const block = (color, section, title) => {
      const div = document.createElement("div");
      div.className = "color";
      if(section){
        div.className += " clear";
        div.dataset.section = section;
      }
      if(title){
        div.title = title;
      }
      div.style.setProperty('--color', `var(${color})`);
      return div;
    };
    
    element.append(block('--theme-primary'));
    element.append(block('--theme-accent-1'));
    element.append(block('--theme-accent-2'));
    element.append(block('--theme-accent-3'));
    element.append(block('--theme-accent-4'));
    element.append(block('--theme-standard'));
    
    element.append(block('--theme-primary', 'complementary'));
    element.append(block('--theme-complementary'));
    
    element.append(block('--theme-primary', 'analogous'));
    element.append(block('--theme-analogous-1'));
    element.append(block('--theme-analogous-2'));
    
    element.append(block('--theme-primary', 'split'));
    element.append(block('--theme-split-1'));
    element.append(block('--theme-split-2'));
    
    element.append(block('--theme-primary', 'triadic'));
    element.append(block('--theme-triadic-1'));
    element.append(block('--theme-triadic-2'));
    
    element.append(block('--theme-fore-color', 'fore color, alt, & image'));
    element.append(block('--theme-alt-fore-color'));
    element.append(block('--theme-img-fore-color'));
    
    if (this.options.debug && debugScores) {
      debugScores.forEach((score, i) => {
        element.append(block(
          `--score-${i}`,
          i === 0 ? '(Debugger: below threshold)' : null,
          JSON.stringify(score)
        ));
        element.style.setProperty(`--score-${i}`, score.color);
      });
    }
  }
  
  // Core color processing methods for the ColorTheoryExtractor class

  analyzeImageColors(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const scale = Math.min(1, this.options.maxDimension / Math.max(img.width, img.height));
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const colorFrequencies = new Map();
    let totalPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
      const [h, s, l] = this.rgbToHsl(r, g, b);
      
      // Apply all color filtering
      if (!this.isValidColor(r, g, b, h, s, l)) continue;

      const key = this.quantizeColor(r, g, b);
      colorFrequencies.set(key, (colorFrequencies.get(key) || 0) + 1);
      totalPixels++;
    }

    return { colorFrequencies, totalPixels };
  }

  isValidColor(r, g, b, h, s, l) {
    // Check tonal ranges
    if (l < this.options.tintRange[0] || l > this.options.tintRange[1]) return false;
    if (s < this.options.saturationRange[0] || s > this.options.saturationRange[1]) return false;
    
    // Check hue validity
    if (!this.isValidHue(h)) return false;
    
    // Check for neutrals/skin tones
    if (this.isNeutralColor(r, g, b)) return false;
    if (this.isLikelySkinTone(r, g, b)) return false;

    return true;
  }

  isValidHue(h) {
    const hueDegrees = h * 360;
    const { mode, excludeRanges, includeRanges } = this.options.hueFiltering;

    if (mode === 'EXCLUDE' || mode === 'BOTH') {
      for (const range of excludeRanges) {
        if (hueDegrees >= range.min && hueDegrees <= range.max) {
          return false;
        }
      }
    }

    if (mode === 'INCLUDE' || mode === 'BOTH') {
      let isIncluded = false;
      for (const range of includeRanges) {
        if (hueDegrees >= range.min && hueDegrees <= range.max) {
          isIncluded = true;
          break;
        }
      }
      if (!isIncluded) return false;
    }

    return true;
  }

  filterViableColors(colorFrequencies, totalPixels) {
    const viableColors = new Map();
    
    for (const [color, frequency] of colorFrequencies.entries()) {
      const relativeFrequency = frequency / totalPixels;
      if (relativeFrequency >= this.options.minFrequency) {
        viableColors.set(color, {
          frequency: relativeFrequency,
          rgb: this.hexToRgb(color)
        });
      }
    }

    return viableColors;
  }

  findBestColor(viableColors) {
    let bestColor = null;
    let bestScore = -1;
    let debugScores = [];

    for (const [color, data] of viableColors.entries()) {
      const proximityScore = this.calculateProximityScore(data.rgb);
      const psychologyScore = this.calculatePsychologyScore(data.rgb);
      const frequencyScore = data.frequency;

      const totalScore = 
        (proximityScore * this.options.proximityWeight) +
        (psychologyScore * this.options.psychologyWeight) +
        (frequencyScore * this.options.frequencyWeight);

      debugScores.push({
        color,
        proximityScore,
        psychologyScore,
        frequencyScore,
        totalScore,
        breakdown: {
          proximity: proximityScore * this.options.proximityWeight,
          psychology: psychologyScore * this.options.psychologyWeight,
          frequency: frequencyScore * this.options.frequencyWeight
        }
      });
    }

    // Sort all scores descending
    debugScores.sort((a, b) => b.totalScore - a.totalScore);

    // Only set bestColor if it meets minimum score threshold
    if (debugScores.length > 0 && 
        debugScores[0].totalScore >= (this.options.minimumScore || 0)) {
      bestColor = debugScores[0].color;
    }

    return {
      bestColor,
      debugScores,
      allColors: debugScores.map(s => s.color)
    };
  }

  calculateProximityScore(rgb) {
    let bestProximity = 0;
    
    for (const color of Object.values(TERTIARY_COLORS)) {
      const distance = this.calculateColorDistance(rgb, color.rgb);
      const proximity = 1 - distance;
      bestProximity = Math.max(bestProximity, proximity);
    }

    return bestProximity;
  }

  calculatePsychologyScore(rgb) {
    let bestScore = 0;
    
    for (const [name, color] of Object.entries(TERTIARY_COLORS)) {
      const distance = this.calculateColorDistance(rgb, color.rgb);
      const contextWeight = COLOR_CONTEXTS[this.options.context]?.[name] || 1.0;
      const score = (1 - distance) * color.weight * contextWeight;
      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  calculateColorDistance(rgb1, rgb2) {
    // Using a weighted Euclidean distance for better perceptual accuracy
    const [r1, g1, b1] = rgb1;
    const [r2, g2, b2] = rgb2;
    
    const rMean = (r1 + r2) / 2;
    const rWeight = 2 + (rMean / 256);
    const gWeight = 4.0;
    const bWeight = 2 + ((255 - rMean) / 256);
    
    return Math.sqrt(
      rWeight * Math.pow(r1 - r2, 2) +
      gWeight * Math.pow(g1 - g2, 2) +
      bWeight * Math.pow(b1 - b2, 2)
    ) / Math.sqrt(rWeight * 65025 + gWeight * 65025 + bWeight * 65025); // Normalize to 0-1
  }

  isNeutralColor(r, g, b) {
    const avg = (r + g + b) / 3;
    const deviation = Math.sqrt(
      Math.pow(r - avg, 2) +
      Math.pow(g - avg, 2) +
      Math.pow(b - avg, 2)
    ) / 255;

    const warmth = (r - b) / 255;
    
    return deviation < 0.2 && warmth > 0 && warmth < 0.5;
  }

  isLikelySkinTone(r, g, b) {
    // Basic skin tone detection
    return (
      r > 150 && r < 255 &&
      g > 100 && g < 200 &&
      b > 80 && b < 170 &&
      r > g && g > b &&
      (r - g) < 60
    );
  }

  validateAccessibility(palette) {
    const backgroundColors = [
      palette.dominant,
      palette.accent1,
      palette.accent2
    ];

    const textColors = [
      '#FFFFFF',
      '#000000',
      palette.accent3,
      palette.accent4
    ];

    const issues = [];

    for (const bg of backgroundColors) {
      for (const text of textColors) {
        const contrast = this.calculateContrastRatio(bg, text);
        if (contrast < this.options.minimumContrast) {
          issues.push({
            background: bg,
            text: text,
            contrast: contrast,
            required: this.options.minimumContrast
          });
        }
      }
    }

    if (issues.length > 0 && this.options.debug) {
      console.warn('Accessibility Issues:', issues);
    }

    return issues;
  }

  calculateContrastRatio(color1, color2) {
    const l1 = this.calculateRelativeLuminance(this.hexToRgb(color1));
    const l2 = this.calculateRelativeLuminance(this.hexToRgb(color2));
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  calculateRelativeLuminance(rgb) {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  simulateColorBlindness(color, type = this.options.colorBlindnessType) {
    const rgb = this.hexToRgb(color);
    const matrix = COLORBLIND_MATRICES[type];
    
    if (!matrix) return color;
    
    const [r, g, b] = rgb.map(v => v / 255);
    const simulated = [
      r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2],
      r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2],
      r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]
    ];
    
    return this.rgbToHex(
      Math.round(simulated[0] * 255),
      Math.round(simulated[1] * 255),
      Math.round(simulated[2] * 255)
    );
  }
  // Color harmony generation methods for the ColorTheoryExtractor class

  generatePalette(dominantColor, textArea = null) {
    if (!dominantColor) return null;

    const rgb = this.hexToRgb(dominantColor);
    const [h, s, l] = this.rgbToHsl(...rgb);

    // Handle extreme lightness cases
    let adjustedH = h;
    let adjustedS = s;
    let adjustedL = l;

    // For very light colors
    if (l > 0.9) {
      adjustedL = 0.85;  // Pull back from white
      adjustedS = Math.max(s, 0.3);  // Ensure some saturation
    }
    // For very dark colors
    else if (l < 0.1) {
      adjustedL = 0.15;  // Pull back from black
      adjustedS = Math.max(s, 0.3);  // Ensure some saturation
    }

    // Determine foreground colors based on contrast
    const whiteLuminance = this.calculateRelativeLuminance([255, 255, 255]);
    const blackLuminance = this.calculateRelativeLuminance([0, 0, 0]);
    const colorLuminance = this.calculateRelativeLuminance(rgb);

    const whiteContrast = (whiteLuminance + 0.05) / (colorLuminance + 0.05);
    const blackContrast = (colorLuminance + 0.05) / (blackLuminance + 0.05);

    const foreColor = whiteContrast >= blackContrast ? '#FFFFFF' : '#000000';
    const altForeColor = whiteContrast >= blackContrast ? '#000000' : '#FFFFFF';
    
    let imageForeColor = {
        color: foreColor,
        shadowColor: foreColor === '#FFFFFF' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
        needsTextShadow: true,
        contrast: Math.max(whiteContrast, blackContrast)
    };

    if (textArea) {
      // Sample colors from the text area region
      const areaColors = this.sampleAreaColors(textArea);
      // Determine best contrast color for that specific region
      imageForeColor = this.determineTextColor(areaColors);
    }

    return {
      // Original color
      dominant: dominantColor,

      // Adjusted variations
      accent1: this.adjustColor([...rgb], { lightness: 0.2 }),     // 20% lighter
      accent2: this.adjustColor([...rgb], { lightness: -0.2 }),    // 20% darker
      accent3: this.adjustColor([...rgb], { lightness: 0.4 }),     // 40% lighter
      accent4: this.adjustColor([...rgb], { lightness: -0.4 }),    // 40% darker
      standard: this.adjustColor([...rgb], { saturation: -0.2 }),  // 20% less saturated

      // Text colors with best contrast
      foreColor,          // Primary text color (best contrast)
      altForeColor,       // Alternative text color
      imageForeColor,

      // Harmonies (using adjusted color if needed)
      complementary: this.generateComplementary(adjustedH, adjustedS, adjustedL),
      analogous: this.generateAnalogous(adjustedH, adjustedS, adjustedL),
      splitComplementary: this.generateSplitComplementary(adjustedH, adjustedS, adjustedL),
      triadic: this.generateTriadic(adjustedH, adjustedS, adjustedL),

      // Meta information
      isLight: l > 0.5,
      isDark: l <= 0.5,
      isExtreme: l > 0.9 || l < 0.1,
      contrastRatios: {
        withWhite: whiteContrast,
        withBlack: blackContrast
      },
      
      textArea // Include the analyzed area in the palette
    };
  }
  
  sampleAreaColors(area) {
    // Convert percentages to pixels
    const x = Math.floor(area.x * this.canvas.width / 100);
    const y = Math.floor(area.y * this.canvas.height / 100);
    const width = Math.floor(area.width * this.canvas.width / 100);
    const height = Math.floor(area.height * this.canvas.height / 100);

    // Get image data for the text area
    const imageData = this.ctx.getImageData(x, y, width, height);
    const pixels = imageData.data;

    // Sample colors from the area
    const colors = [];
    const sampleRate = 4; // Sample every 4th pixel for performance

    for (let i = 0; i < pixels.length; i += sampleRate * 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];

      if (a < 128) continue; // Skip transparent pixels

      colors.push([r, g, b]);
    }

    return colors;
  }
  
  determineTextColor(colors) {
    if (!colors.length) return {
      color: '#FFFFFF',
      shadowColor: 'rgba(0,0,0,0.5)'
    };

    // Calculate average luminance of the area
    let totalLuminance = 0;
    let dominantColor = { r: 0, g: 0, b: 0, count: 0 };

    colors.forEach(([r, g, b]) => {
      const luminance = this.calculateRelativeLuminance([r, g, b]);
      totalLuminance += luminance;
      
      // Track dominant color for shadow calculation
      dominantColor.r += r;
      dominantColor.g += g;
      dominantColor.b += b;
      dominantColor.count++;
    });

    const averageLuminance = totalLuminance / colors.length;
    
    // Average the background color
    const avgBackground = {
      r: Math.round(dominantColor.r / dominantColor.count),
      g: Math.round(dominantColor.g / dominantColor.count),
      b: Math.round(dominantColor.b / dominantColor.count)
    };

    // Test contrast with white and black
    const whiteContrast = (1.05) / (averageLuminance + 0.05);
    const blackContrast = (averageLuminance + 0.05) / 0.05;

    // Calculate color variance for noise detection
    let varianceSum = 0;
    colors.forEach(([r, g, b]) => {
      const luminance = this.calculateRelativeLuminance([r, g, b]);
      varianceSum += Math.pow(luminance - averageLuminance, 2);
    });
    const variance = varianceSum / colors.length;
    const isNoisy = variance > 0.1;

    // Calculate shadow color based on background
    const createShadowColor = (baseColor, alpha) => {
      // Invert the color and darken/lighten based on luminance
      const shadowColor = {
        r: 255 - baseColor.r,
        g: 255 - baseColor.g,
        b: 255 - baseColor.b
      };

      // Adjust shadow intensity based on contrast needs
      const intensity = isNoisy ? 0.7 : 0.5;
      
      // Create different shadow colors for light/dark text
      if (averageLuminance > 0.5) {
        // For dark text on light background
        return `rgba(0,0,0,${intensity})`;
      } else {
        // For light text on dark background
        return `rgba(255,255,255,${intensity})`;
      }
    };

    // Make decision based on contrast and variance
    if (whiteContrast >= 4.5 && blackContrast < 4.5) {
      return {
        color: '#FFFFFF',
        needsTextShadow: isNoisy,
        shadowColor: createShadowColor(avgBackground, isNoisy ? 0.7 : 0.5),
        contrast: whiteContrast
      };
    } else if (blackContrast >= 4.5 && whiteContrast < 4.5) {
      return {
        color: '#000000',
        needsTextShadow: isNoisy,
        shadowColor: createShadowColor(avgBackground, isNoisy ? 0.7 : 0.5),
        contrast: blackContrast
      };
    } else {
      const color = averageLuminance > 0.5 ? '#000000' : '#FFFFFF';
      return {
        color,
        needsTextShadow: isNoisy || Math.min(whiteContrast, blackContrast) < 4.5,
        shadowColor: createShadowColor(avgBackground, isNoisy ? 0.7 : 0.5),
        contrast: color === '#FFFFFF' ? whiteContrast : blackContrast
      };
    }
}

  generateComplementary(h, s, l) {
    const complementaryH = (h + 0.5) % 1;
    return this.hslToHex(
      complementaryH,
      Math.max(s, this.options.harmonyPaletteSaturation),
      this.options.harmonyPaletteLightness || l
    );
  }

  generateAnalogous(h) {
    return {
      color1: this.hslToHex(
        (h + 1/12) % 1,
        this.options.harmonyPaletteSaturation,
        this.options.harmonyPaletteLightness
      ),
      color2: this.hslToHex(
        (h - 1/12 + 1) % 1,
        this.options.harmonyPaletteSaturation,
        this.options.harmonyPaletteLightness
      )
    };
  }

  generateSplitComplementary(h) {
    return {
      color1: this.hslToHex(
        (h + 0.42) % 1,
        this.options.harmonyPaletteSaturation,
        this.options.harmonyPaletteLightness
      ),
      color2: this.hslToHex(
        (h + 0.58) % 1,
        this.options.harmonyPaletteSaturation,
        this.options.harmonyPaletteLightness
      )
    };
  }

  generateTriadic(h) {
    return {
      color1: this.hslToHex(
        (h + 1/3) % 1,
        this.options.harmonyPaletteSaturation,
        this.options.harmonyPaletteLightness
      ),
      color2: this.hslToHex(
        (h + 2/3) % 1,
        this.options.harmonyPaletteSaturation,
        this.options.harmonyPaletteLightness
      )
    };
  }

  // Color adjustment and conversion utilities
  adjustColor(rgb, { lightness = 0, saturation = 0 }) {
    let [h, s, l] = this.rgbToHsl(...rgb);

    // Adjust saturation (multiplicative for more natural feel)
    if (saturation !== 0) {
      s = Math.max(0, Math.min(1, s * (1 + saturation)));
    }

    // Adjust lightness (additive for predictable steps)
    if (lightness !== 0) {
      l = Math.max(0, Math.min(1, l + lightness));
    }

    return this.hslToHex(h, s, l);
  }

  // Color space conversion utilities
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    
    if (max === min) return [0, 0, l];
    
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    let h;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    
    return [h / 6, s, l];
  }

  hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }

  rgbToHex(r, g, b) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  hslToHex(h, s, l) {
    const rgb = this.hslToRgb(h, s, l);
    return this.rgbToHex(...rgb);
  }

  quantizeColor(r, g, b) {
    const levels = 16;
    const step = 255 / (levels - 1);
    const qr = Math.round(r / step) * step;
    const qg = Math.round(g / step) * step;
    const qb = Math.round(b / step) * step;
    return `#${qr.toString(16).padStart(2, '0')}${qg.toString(16).padStart(2, '0')}${qb.toString(16).padStart(2, '0')}`;
  }
}

class ColorTheoryRotator {
  constructor(images, backgroundElement, options = {}) {
    this.images = images;
    this.backgroundElement = typeof backgroundElement === 'string' 
      ? document.querySelector(backgroundElement) 
      : backgroundElement;
    
    this.currentIndex = 0;
    this.preloadedImages = new Map();
    // Default global options
    this.options = {
      enableRotation: false, 
      interval: 30000,
      fadeTime: 1000,
      backgroundTransition: true,
      imageFit: 'cover',
      randomStart: false,
      // Default color extractor options that can be overridden per image
      colorExtractorOptions: {
        context: 'TECH',
        scheme: 'VIBRANT',
        debug: false
      },
      ...options
    };
    
    // Set initial index based on randomStart option
    this.currentIndex = this.options.randomStart 
      ? Math.floor(Math.random() * this.images.length)
      : 0;
    
    if (!this.backgroundElement) {
      console.error('Background element not found');
      return;
    }

    this.extractor = new ColorTheoryExtractor(null, this.options.colorExtractorOptions);
    this.setupBackgroundTransitions();
    this.preloadImages();
  }
  
  analyzeTextArea(element, options) {
    const textElement = options.copySpace.selector ? 
      element.querySelector(options.copySpace.selector) : 
      element;

    if (!textElement) return null;

    // Get the relative position of the text within the background
    const containerBounds = element.getBoundingClientRect();
    const textBounds = textElement.getBoundingClientRect();

    // Convert to percentages relative to container
    const area = {
      x: (textBounds.left - containerBounds.left) / containerBounds.width * 100,
      y: (textBounds.top - containerBounds.top) / containerBounds.height * 100,
      width: textBounds.width / containerBounds.width * 100,
      height: textBounds.height / containerBounds.height * 100
    };

    return area;
  }
  
  // Method to manually set a random image
  setRandomImage() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.currentIndex = Math.floor(Math.random() * this.images.length);
    this.processNextImage();
    this.startRotation();
  }

  setupBackgroundTransitions() {
    // Add transition styles to background element
    const currentTransition = window.getComputedStyle(this.backgroundElement).transition;
    this.backgroundElement.style.transition = currentTransition 
      ? `${currentTransition}, background-image ${this.options.fadeTime}ms ease`
      : `background-image ${this.options.fadeTime}ms ease`;
      
    this.backgroundElement.style.backgroundSize = this.options.imageFit;
    this.backgroundElement.style.backgroundPosition = this.options.imagePosition;
  }

  preloadImages() {
    const loadingPromises = this.images.map(imageConfig => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.preloadedImages.set(imageConfig.url, {
            image: img,
            options: imageConfig.options
          });
          resolve(img);
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${imageConfig.url}`));
        img.src = imageConfig.url;
      });
    });

    Promise.all(loadingPromises)
      .then(() => {
        console.log('All images preloaded');
        this.startRotation();
      })
      .catch(error => {
        console.error('Error preloading images:', error);
      });
  }

  async processNextImage(skipIndexUpdate = false) {
    const currentImage = this.images[this.currentIndex];
    const preloadedData = this.preloadedImages.get(currentImage.url);
   
    if (!preloadedData) {
      console.error('Image not preloaded:', currentImage.url);
      return;
    }

    try {
      const imageOptions = {
        ...this.options.colorExtractorOptions,
        ...currentImage.options
      };
      
      const imageExtractor = new ColorTheoryExtractor(null, imageOptions);
      const palette = await imageExtractor.extractPaletteFromImageUrl(currentImage.url);
      
      document.documentElement.classList.add('palette-transition');
      if (this.options.backgroundTransition) {
        this.backgroundElement.classList.add('background-transition');
      }
      
      this.backgroundElement.style.backgroundImage = `url('${currentImage.url}')`;
      this.backgroundElement.style.backgroundPosition = currentImage.options?.imagePosition || this.options.imagePosition;
      imageExtractor.addPalette(palette);
      
      setTimeout(() => {
        document.documentElement.classList.remove('palette-transition');
        if (this.options.backgroundTransition) {
          this.backgroundElement.classList.remove('background-transition');
        }
      }, this.options.fadeTime);

      // Only update index if not skipped
      if (!skipIndexUpdate) {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  startRotation() {
    // Process first image immediately if not already processed
    if (!this.processedFirstImage) {
      this.processNextImage();
      this.processedFirstImage = true;
    }
    
    // Set up interval only if rotation is enabled
    if (this.options.enableRotation) {
      this.intervalId = setInterval(() => {
        this.next();
      }, this.options.interval);
    }
  }

  stopRotation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  changeInterval(newInterval) {
    this.options.interval = newInterval;
    if (this.intervalId) {
      this.stopRotation();
      this.startRotation();
    }
  }

   // Method to manually advance to next image
  next() {
    this.stopRotation();
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.processNextImage(true).then(() => {
      if (this.options.enableRotation) {
        this.startRotation();
      }
    });
  }

  // Method to manually go to previous image
  previous() {
    this.stopRotation();
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.processNextImage(true).then(() => {
      if (this.options.enableRotation) {
        this.startRotation();
      }
    });
  }
}

// Usage example:
function initializeColorRotation() {
  debugger;
  const rotatorImages = [
  {
    url: 'https://003.neoreef.com/Documents%20and%20Settings/150/Site%20Documents/Site%20Pictures/Remote-Work/remotework.webp',
    options: {
      color: '#113322',           // A hexadecimal color value
      context: 'NATURE',          // TECH, NATURE, ENERGY, LUXURY
      scheme: 'DARK',             // VIBRANT, PASTEL, DARK
      psychologyWeight: 0.4,      // 0-1 range
      frequencyWeight: 0.2,       // 0-1 range
      proximityWeight: 0.3,       // 0-1 range
      
      // Color filtering
      minFrequency: 0.05,         // Minimum area for color consideration
      tintRange: [0.2, 0.8],      // Lightness range
      saturationRange: [0.3, 1.0],// Saturation range
      
      // Harmony generation
      harmonyPaletteSaturation: 0.85,
      harmonyPaletteLightness: 0.25,
      
      // Hue filtering
      hueFiltering: {
        mode: 'BOTH',             // 'EXCLUDE', 'INCLUDE', or 'BOTH'
        excludeRanges: HUE_RANGES.EXCLUDE,
        includeRanges: [
          // HUE_RANGES.INCLUDE.BLUES,
          HUE_RANGES.INCLUDE.GREENS
        ]
      },
      
      // Accessibility
      accessibilityChecks: true,
      minimumContrast: 4.5,
      simulateColorBlindness: false,
      colorBlindnessType: 'DEUTERANOPIA',
      
      // Image positioning
      imagePosition: 'top left',  // CSS background-position
      imageFit: 'cover',          // CSS background-size
      
      // Debug
      debug: false
    }
  },
  {
    url: 'https://003.neoreef.com/Documents%20and%20Settings/150/Site%20Documents/Site%20Pictures/Gaming/gaming.webp',
    options: {
      context: 'TECH',
      scheme: 'DARK',
      imagePosition: 'center center'
    }
  },
    {
    url: 'https://003.neoreef.com/Documents%20and%20Settings/150/Site%20Documents/Site%20Pictures/VOIP/voip_residential_hero.webp',
    options: {
      context: 'TECH',
      scheme: 'DARK',
      imagePosition: 'center center'
    }
  },
    {
    url: 'https://003.neoreef.com/Documents%20and%20Settings/150/Site%20Documents/Site%20Pictures/VOIP/voip_business_hero.webp',
    options: {
      context: 'LUXURY',
      scheme: 'DARK',
      imagePosition: 'center center'
    }
  },
  {
    url: 'https://003.neoreef.com/Documents%20and%20Settings/150/Site%20Documents/Site%20Pictures/Streaming/streaming.webp',
    options: {
      context: 'LUXURY',
      scheme: 'DARK',
      imagePosition: 'center center'
    }
  },
  {
    url: 'http://003.neoreef.com/Documents%20and%20Settings/150/Site%20Documents/Site%20Pictures/Security/delivery.webp',
    options: {
      context: 'LUXURY',
      scheme: 'PASTEL',
      imagePosition: 'center center'
    }
  }
];
  
  const rotator = new ColorTheoryRotator(
    rotatorImages,
    '.hero-background', // or pass DOM element
    {
      enableRotation: false,
      randomStart: true,
      interval: 4000,
      fadeTime: 1000,
      copySpace: {
        mode: 'auto',
        selector: '.hero-text'
      },
      colorExtractorOptions: {
        debug: true
      }
    }
  );

  // Optional: Add controls
  window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      rotator.stopRotation();
    } else {
      rotator.startRotation();
    }
  });

  // Optional: Add keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      rotator.next();
    } else if (e.key === 'ArrowLeft') {
      rotator.previous();
    }
  });

  return rotator;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const rotator = initializeColorRotation();
});


/**
 * The following are various examples of how this class can be used. From basic 
 * instance based usage, to more advanced versions. 
 *
 */
const testUrl = 'https://003.neoreef.com/Documents%20and%20Settings/150/Site%20Documents/Site%20Pictures/Streaming/streaming.webp';

// Basic Usage Examples
const basicExamples = () => {
  // Basic usage with default settings
  const extractor = new ColorTheoryExtractor();
  
  // From background image
  const hero = document.querySelector('.hero-section');
  extractor.extractPaletteFromBackgroundImage(hero)
    .then(palette => {
      extractor.addPalette(palette);
    })
    .catch(console.error);

  // From image element
  const imgElement = document.querySelector('img.feature-image');
  extractor.extractPaletteFromImage(imgElement)
    .then(palette => {
      extractor.addPalette(palette);
    })
    .catch(console.error);

  // From URL directly
  extractor.extractPaletteFromImageUrl(testUrl)
    .then(palette => {
      extractor.addPalette(palette);
    })
    .catch(console.error);
};

// Advanced Configuration Examples
const advancedExamples = () => {
  // Tech-focused with high contrast
  const techExtractor = new ColorTheoryExtractor(null, {
    context: 'TECH',
    psychologyWeight: 0.5,
    minimumContrast: 5.0,
    scheme: 'VIBRANT',
    hueFiltering: {
      mode: 'INCLUDE',
      includeRanges: [
        HUE_RANGES.INCLUDE.BLUES,
        HUE_RANGES.INCLUDE.CYANS,
        HUE_RANGES.INCLUDE.PURPLES
      ]
    }
  });

  // Nature-focused with pastel scheme
  const natureExtractor = new ColorTheoryExtractor(null, {
    context: 'NATURE',
    scheme: 'PASTEL',
    hueFiltering: {
      mode: 'INCLUDE',
      includeRanges: [
        HUE_RANGES.INCLUDE.GREENS,
        HUE_RANGES.INCLUDE.YELLOWS,
        HUE_RANGES.INCLUDE.BLUES
      ]
    }
  });

  // Luxury-focused with dark scheme
  const luxuryExtractor = new ColorTheoryExtractor(null, {
    context: 'LUXURY',
    scheme: 'DARK',
    hueFiltering: {
      mode: 'INCLUDE',
      includeRanges: [
        HUE_RANGES.INCLUDE.PURPLES,
        HUE_RANGES.INCLUDE.REDS,
        HUE_RANGES.INCLUDE.BLUES
      ]
    }
  });
};

// Accessibility and Color Blindness Examples
const accessibilityExamples = () => {
  const accessibleExtractor = new ColorTheoryExtractor(null, {
    accessibilityChecks: true,
    minimumContrast: 4.5,
    simulateColorBlindness: true,
    colorBlindnessType: 'DEUTERANOPIA'
  });
};

// Debug Mode Examples
const debugExamples = () => {
  const debugExtractor = new ColorTheoryExtractor(null, {
    debug: true,
    minFrequency: 0.05,
    psychologyWeight: 0.4,
    proximityWeight: 0.3,
    frequencyWeight: 0.3
  });
};

// Custom Display Example
const customDisplayExample = () => {
  const extractor = new ColorTheoryExtractor();
  
  extractor.extractPaletteFromImageUrl(testUrl)
    .then(palette => {
      // Create custom color swatches
      const createSwatch = (color, label) => {
        const swatch = document.createElement('div');
        swatch.style.backgroundColor = color;
        swatch.textContent = label;
        return swatch;
      };

      const container = document.createElement('div');
      container.className = 'custom-palette';

      // Add main colors
      container.appendChild(createSwatch(palette.dominant, 'Primary'));
      container.appendChild(createSwatch(palette.accent1, 'Light Accent'));
      container.appendChild(createSwatch(palette.accent2, 'Dark Accent'));

      // Add harmonies
      container.appendChild(createSwatch(palette.complementary, 'Complementary'));
      container.appendChild(createSwatch(palette.analogous.color1, 'Analogous 1'));
      container.appendChild(createSwatch(palette.analogous.color2, 'Analogous 2'));

      // Add to page
      document.body.appendChild(container);
    });
};

// Example with all options specified
const completeExample = () => {
  const extractor = new ColorTheoryExtractor(null, {
    // Color detection settings
    minFrequency: 0.05,
    psychologyWeight: 0.4,
    frequencyWeight: 0.3,
    proximityWeight: 0.3,
    
    // Color ranges
    tintRange: [0.2, 0.8],
    saturationRange: [0.3, 1.0],
    
    // Context and scheme
    context: 'TECH',
    scheme: 'VIBRANT',
    
    // Harmony generation
    harmonyPaletteSaturation: 0.85,
    harmonyPaletteLightness: 0.25,
    
    // Processing settings
    maxDimension: 400,
    sampleRate: 4,
    
    // Hue filtering
    hueFiltering: {
      mode: 'BOTH',
      excludeRanges: HUE_RANGES.EXCLUDE,
      includeRanges: [
        HUE_RANGES.INCLUDE.REDS,
        HUE_RANGES.INCLUDE.BLUES,
        HUE_RANGES.INCLUDE.GREENS
      ]
    },
    
    // Accessibility
    accessibilityChecks: true,
    minimumContrast: 4.5,
    simulateColorBlindness: false,
    colorBlindnessType: 'DEUTERANOPIA',
    
    // Debug
    debug: true
  });
};

// Batch Processing Example
const batchProcessingExample = () => {
  // Process all background images
  document.querySelectorAll('.background-image').forEach(element => {
    const extractor = new ColorTheoryExtractor(element, {
      debug: true
    });
    
    extractor.extractPaletteFromBackgroundImage(element)
      .then(palette => {
        extractor.addPalette(palette, element);
        extractor.showPalette(palette, element);
      })
      .catch(console.error);
  });

  // Process all images
  document.querySelectorAll('img').forEach(element => {
    const extractor = new ColorTheoryExtractor(element);
    
    extractor.extractPaletteFromImage(element)
      .then(palette => {
        const paletteDiv = document.createElement('div');
        paletteDiv.className = 'palette';
        element.parentElement.appendChild(paletteDiv);
        extractor.addPalette(palette, paletteDiv);
        extractor.showPalette(palette, paletteDiv);
      })
      .catch(console.error);
  });
  
  const urlExtractor = new ColorTheoryExtractor();
  urlExtractor.extractPaletteFromImageUrl(testUrl)
    .then(palette => {
      let urls = document.querySelector('.urls')
      let img = document.createElement("img");
      img.src = testUrl;
      let div = document.createElement("div");
      div.className = "palette";
      urls.appendChild(img);
      urls.appendChild(div);
      urlExtractor.addPalette(palette, div);
      urlExtractor.showPalette(palette, div);
    });
};


// Run a batch on this page
batchProcessingExample();
