// Initialize Element Clone Library
document.addEventListener('DOMContentLoaded', function() {
    // Check if library is available
    if (typeof ElementCloner !== 'undefined') {
        console.log('Element Clone Library is ready');
        
        // Example usage functions
        window.cloneElement = function(elementId) {
            return ElementCloner.cloneElement(elementId);
        };
        
        window.cloneAndCapture = function(elementId) {
            // Clone element and add to DOM
            const clonedData = ElementCloner.cloneAndAddToDOM(elementId);
            
            // Use html2canvas to capture the cloned element
            html2canvas(clonedData.element, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
                allowTaint: true,
                height: clonedData.getDimensions().height,
                width: clonedData.getDimensions().width
            }).then(function(canvas) {
                // Create image from canvas
                const image = canvas.toDataURL('image/png');
                
                // Create preview element
                const preview = document.createElement('div');
                preview.className = 'capture-preview';
                preview.innerHTML = `
                    <h3>Element Capture Preview</h3>
                    <img src="${image}" alt="Element capture" style="max-width: 100%; border: 2px solid #ccc; border-radius: 8px;">
                    <div style="margin-top: 15px;">
                        <button onclick="downloadImage('${image}', 'element-capture.png')" style="margin-right: 10px; padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Download Image
                        </button>
                        <button onclick="this.closest('.capture-preview').remove()" style="padding: 8px 16px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Close
                        </button>
                    </div>
                `;
                
                // Remove existing preview if any
                const existingPreview = document.querySelector('.capture-preview');
                if (existingPreview) {
                    existingPreview.remove();
                }
                
                // Add preview to page
                document.body.appendChild(preview);
                
                console.log('Element captured successfully!');
            }).catch(function(error) {
                console.error('Error capturing element:', error);
            }).finally(function() {
                // Clean up cloned element
                clonedData.remove();
            });
        };
        
        window.getFullDimensions = function(elementId) {
            return ElementCloner.getFullDimensions(elementId);
        };
        
        window.checkScrollLimits = function(elementId) {
            return ElementCloner.checkScrollLimits(elementId);
        };
        
        // Add keyboard shortcut for capturing container
        document.addEventListener('keydown', function(event) {
            if (event.key === 'a' || event.key === 'A') {
                cloneAndCapture('container');
            }
        });
        
        console.log('Element Clone functions available:');
        console.log('- cloneElement(elementId): Clone element with scroll limits removed');
        console.log('- cloneAndCapture(elementId): Clone and capture with html2canvas');
        console.log('- getFullDimensions(elementId): Get full dimensions after removing scroll limits');
        console.log('- checkScrollLimits(elementId): Check if element has scroll limits');
        console.log('- Press "a" key to capture container');
    } else {
        console.error('Element Clone Library is not available');
    }
});

// Download function
function downloadImage(dataURL, filename) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

