// const axios = require('axios');

// async function inspectTileFromServer(z, x, y) {
//     try {
//         const url = `https://mjestopodsuncem.synology.me/tiles/osm_croatia/${z}/${x}/${y}.pbf`;
//         console.log(`🌐 Requesting tile: ${url}`);
        
//         const response = await axios.get(url, {
//             responseType: 'arraybuffer',
//             timeout: 10000,
//         });

//         const data = response.data;
//         console.log(`📊 Response size: ${data.byteLength} bytes`);
//         console.log(`📡 HTTP Status: ${response.status} ${response.statusText}`);
        
//         if (data.byteLength === 0) {
//             console.log('❌ Tile exists but is empty (0 bytes)');
//             return;
//         }

//         // Save the tile to inspect its raw content
//         const fs = require('fs');
//         const filename = `tile-${z}-${x}-${y}.pbf`;
//         fs.writeFileSync(filename, Buffer.from(data));
//         console.log(`💾 Tile saved as: ${filename}`);

//         // Try to parse with different methods
//         await parseTileWithMethod1(data, z, x, y);
        
//     } catch (error) {
//         console.error('❌ INSPECTION FAILED:');
//         if (error.response) {
//             console.error(`   HTTP ${error.response.status}: ${error.response.statusText}`);
//         } else {
//             console.error(`   Error: ${error.message}`);
//         }
//     }
// }

// // Method 1: Using vector-tile with proper Pbf import
// async function parseTileWithMethod1(data, z, x, y) {
//     try {
//         console.log('\n🔍 METHOD 1: Using @mapbox/vector-tile\n');
        
//         const VectorTile = require('@mapbox/vector-tile').VectorTile;
//         const Pbf = require('pbf');
        
//         const pbf = new Pbf(Buffer.from(data));
//         const tile = new VectorTile(pbf);

//         const layerNames = Object.keys(tile.layers);
//         console.log(`✅ Found ${layerNames.length} layer(s):`);
        
//         let totalFeatures = 0;
//         for (const layerName of layerNames) {
//             const layer = tile.layers[layerName];
//             const featureCount = layer.length;
//             totalFeatures += featureCount;
            
//             console.log(`\n🏷️  LAYER: "${layerName}"`);
//             console.log(`   📈 Features: ${featureCount}`);
//             console.log(`   📏 Extent: ${layer.extent}`);
            
//             if (featureCount > 0) {
//                 // Sample first feature
//                 const feature = layer.feature(0);
//                 console.log(`   📋 Geometry type: ${getGeometryType(feature.type)}`);
//                 console.log(`   🔑 Properties: ${JSON.stringify(feature.properties)}`);
//             }
//         }
        
//         console.log(`\n📊 SUMMARY: ${totalFeatures} features across ${layerNames.length} layers`);
//         return true;
        
//     } catch (error) {
//         console.log(`   ❌ Method 1 failed: ${error.message}`);
//         return false;
//     }
// }

// function getGeometryType(type) {
//     const types = {
//         1: 'Point',
//         2: 'LineString', 
//         3: 'Polygon'
//     };
//     return types[type] || `Unknown(${type})`;
// }

// // Use command line arguments
// const z = process.argv[2] || '0';
// const x = process.argv[3] || '0';  
// const y = process.argv[4] || '0';

// console.log(`🎯 Inspecting vector tile at z=${z}, x=${x}, y=${y}\n`);
// inspectTileFromServer(z, x, y);

const axios = require('axios');
const fs = require('fs');

async function hexInspectTile(z, x, y) {
    try {
        const url = `https://mjestopodsuncem.synology.me/tiles/osm_croatia/${z}/${x}/${y}.pbf`;
        console.log(`🌐 Requesting: ${url}`);
        
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const data = Buffer.from(response.data);
        
        console.log(`✅ Downloaded: ${data.length} bytes`);
        console.log(`📡 Status: ${response.status}\n`);
        
        // Show first 200 bytes in hex and ASCII
        console.log('🔍 FIRST 200 BYTES (hex + ASCII):');
        console.log('=' .repeat(60));
        
        const chunkSize = 16;
        for (let i = 0; i < Math.min(200, data.length); i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            
            // Hex portion
            let hexLine = '';
            for (let j = 0; j < chunk.length; j++) {
                hexLine += chunk[j].toString(16).padStart(2, '0') + ' ';
            }
            hexLine = hexLine.padEnd(48, ' ');
            
            // ASCII portion
            let asciiLine = '';
            for (let j = 0; j < chunk.length; j++) {
                const char = chunk[j];
                asciiLine += (char >= 32 && char <= 126) ? String.fromCharCode(char) : '.';
            }
            
            console.log(hexLine + '  ' + asciiLine);
        }
        
        // Look for layer names in the binary data
        console.log('\n🔍 SEARCHING FOR LAYER NAMES:');
        const text = data.toString('latin1');
        const commonLayers = ['water', 'landuse', 'transportation', 'buildings', 'landcover', 'boundaries', 'places', 'natural'];
        
        commonLayers.forEach(layer => {
            if (text.includes(layer)) {
                console.log(`   ✅ Found: "${layer}"`);
            }
        });
        
        // Save for further analysis
        const filename = `tile-${z}-${x}-${y}.pbf`;
        fs.writeFileSync(filename, data);
        console.log(`\n💾 Saved as: ${filename}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

const z = process.argv[2] || '0';
const x = process.argv[3] || '0';
const y = process.argv[4] || '0';

hexInspectTile(z, x, y);