const fs = require('fs');

function inspectPBFSimple(filename) {
    if (!filename) {
        console.error('Please provide a PBF filename');
        process.exit(1);
    }

    if (!fs.existsSync(filename)) {
        console.error(`File not found: ${filename}`);
        process.exit(1);
    }

    try {
        const pbfData = fs.readFileSync(filename);
        console.log(`📁 File: ${filename}`);
        console.log(`📊 File size: ${(pbfData.length / 1024).toFixed(2)} KB`);
        console.log(`🔍 First 100 bytes (hex):`);
        
        // Print first 100 bytes in hex to see the structure
        console.log(pbfData.slice(0, 100).toString('hex'));
        
        // Try to identify if it's a vector tile by looking for common patterns
        const header = pbfData.slice(0, 4).toString('hex');
        console.log(`\n📋 File header (first 4 bytes): ${header}`);
        
        // Vector tiles often start with specific patterns
        if (header === '1a0a') {
            console.log('✅ This looks like a Protocol Buffer file');
        }
        
        // Try to find layer names by searching for common strings
        const textContent = pbfData.toString('latin1');
        const commonLayerNames = ['water', 'landuse', 'transportation', 'buildings', 'boundaries'];
        
        console.log('\n🔍 Searching for common layer names:');
        commonLayerNames.forEach(layer => {
            if (textContent.includes(layer)) {
                console.log(`   ✅ Found reference to: ${layer}`);
            }
        });
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const filename = process.argv[2];
inspectPBFSimple(filename);