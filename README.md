# Element Clone Library

A utility library for cloning HTML elements with scroll limits removed, designed to work with html2canvas for full content capture.

## Features

- ✅ Clone any HTML element with full content
- ✅ Remove scroll limits automatically (max-height, overflow)
- ✅ Recursively process all child elements
- ✅ Get accurate dimensions after removing scroll limits
- ✅ Check scroll limit status of elements
- ✅ Clean DOM management with automatic cleanup
- ✅ No dependencies on html2canvas (use separately)
- ✅ Cross-browser compatibility

## Installation

Include the library directly:
```html
<script src="capture-library.js"></script>
```

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
    <script src="capture-library.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body>
    <div id="my-container">
        <!-- Your content here -->
    </div>
    
    <script>
        // Clone element with scroll limits removed
        const clonedElement = elementCloneLib.cloneElement('my-container');
        
        // Or clone and add to DOM temporarily
        const clonedData = elementCloneLib.cloneAndAddToDOM('my-container');
        
        // Use with html2canvas
        html2canvas(clonedData.element, {
            scale: 2,
            height: clonedData.getDimensions().height,
            width: clonedData.getDimensions().width
        }).then(canvas => {
            const image = canvas.toDataURL('image/png');
            // Handle the image...
        });
        
        // Clean up
        clonedData.remove();
    </script>
</body>
</html>
```

## API Reference

### Core Methods

#### `cloneElement(target, options)`
Clone element and remove scroll limits.

```javascript
// Basic clone
const cloned = elementCloneLib.cloneElement('my-container');

// With options
const cloned = elementCloneLib.cloneElement('my-container', {
    position: 'off-screen', // or 'visible'
    styles: {
        backgroundColor: 'white',
        padding: '20px'
    }
});
```

#### `cloneAndAddToDOM(target, options)`
Clone element, add to DOM, and return management object.

```javascript
const clonedData = elementCloneLib.cloneAndAddToDOM('my-container');

// Access cloned element
const element = clonedData.element;

// Get dimensions
const dimensions = clonedData.getDimensions();
console.log(dimensions.width, dimensions.height);

// Clean up when done
clonedData.remove();
```

#### `getFullDimensions(target)`
Get element dimensions after removing scroll limits.

```javascript
const dimensions = elementCloneLib.getFullDimensions('my-container');
console.log('Full width:', dimensions.width);
console.log('Full height:', dimensions.height);
```

#### `checkScrollLimits(target)`
Check if element has scroll limits.

```javascript
const limits = elementCloneLib.checkScrollLimits('my-container');
console.log('Has max-height:', limits.hasMaxHeight);
console.log('Has overflow:', limits.hasOverflow);
console.log('Max height value:', limits.maxHeight);
```

### Utility Methods

#### `checkStyleSeted(element, property)`
Check if a CSS property is set on an element.

```javascript
const hasHeight = elementCloneLib.checkStyleSeted(element, 'height');
const hasWidth = elementCloneLib.checkStyleSeted(element, 'width');
```

#### `removeScrollLimits(element)`
Remove scroll limits from element and all children.

```javascript
elementCloneLib.removeScrollLimits(element);
```

## Options

### Clone Options
```javascript
{
    position: 'off-screen',  // 'off-screen' | 'visible'
    styles: {                // Additional styles to apply
        backgroundColor: 'white',
        padding: '20px'
    }
}
```

## Examples

### Basic Usage with html2canvas
```javascript
// Clone element
const clonedData = elementCloneLib.cloneAndAddToDOM('my-container');

// Capture with html2canvas
html2canvas(clonedData.element, {
    scale: 2,
    backgroundColor: null,
    height: clonedData.getDimensions().height,
    width: clonedData.getDimensions().width
}).then(canvas => {
    const image = canvas.toDataURL('image/png');
    // Download or display image
    downloadImage(image, 'screenshot.png');
}).finally(() => {
    // Clean up
    clonedData.remove();
});
```

### Advanced Usage
```javascript
// Check if element needs cloning
const limits = elementCloneLib.checkScrollLimits('my-container');
if (limits.hasMaxHeight || limits.hasOverflow) {
    // Element has scroll limits, clone it
    const clonedData = elementCloneLib.cloneAndAddToDOM('my-container');
    
    // Use cloned element for capture
    html2canvas(clonedData.element, {
        scale: 3,
        height: clonedData.getDimensions().height,
        width: clonedData.getDimensions().width
    }).then(canvas => {
        // Process canvas...
    }).finally(() => {
        clonedData.remove();
    });
} else {
    // Element has no scroll limits, use original
    html2canvas(document.getElementById('my-container'));
}
```

### React/Vue Integration
```javascript
// React component
function CaptureButton({ elementId }) {
    const handleCapture = async () => {
        const clonedData = elementCloneLib.cloneAndAddToDOM(elementId);
        
        try {
            const canvas = await html2canvas(clonedData.element, {
                scale: 2,
                height: clonedData.getDimensions().height,
                width: clonedData.getDimensions().width
            });
            
            const image = canvas.toDataURL('image/png');
            // Handle image...
        } finally {
            clonedData.remove();
        }
    };
    
    return <button onClick={handleCapture}>Capture</button>;
}

// Vue component
export default {
    methods: {
        async captureElement() {
            const clonedData = elementCloneLib.cloneAndAddToDOM(this.elementId);
            
            try {
                const canvas = await html2canvas(clonedData.element, {
                    scale: 2,
                    height: clonedData.getDimensions().height,
                    width: clonedData.getDimensions().width
                });
                
                const image = canvas.toDataURL('image/png');
                // Handle image...
            } finally {
                clonedData.remove();
            }
        }
    }
}
```

## How It Works

1. **Clone Element**: Creates a deep clone of the target element
2. **Remove Scroll Limits**: Recursively removes `max-height`, `overflow`, and `overflow-y` from all elements
3. **Position**: Places cloned element off-screen or visible as needed
4. **Capture Ready**: Element is ready for html2canvas with full content visible
5. **Cleanup**: Automatic cleanup when using `cloneAndAddToDOM`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- No external dependencies
- Designed to work with html2canvas (optional)

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 