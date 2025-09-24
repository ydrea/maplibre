// convert-style.js
import fs from "fs";

const inputFile = "style.json";
const outputFile = "croatia-style.json";

// Load original style
const style = JSON.parse(fs.readFileSync(inputFile, "utf8"));

// Replace sources
style.sources = {
  croatia: {
    type: "vector",
    url: "http://localhost:8080/data/croatia.json"
  }
};

// Optionally update sprite/glyphs if you’re serving from tileserver-gl
style.sprite = "http://localhost:8080/sprite";
style.glyphs = "http://localhost:8080/fonts/{fontstack}/{range}.pbf";

// Update all layers to use "croatia" instead of "openmaptiles"
style.layers = style.layers.map(layer => {
  if (layer.source === "openmaptiles") {
    return { ...layer, source: "croatia" };
  }
  return layer;
});

// Save new style
fs.writeFileSync(outputFile, JSON.stringify(style, null, 2));
console.log(`✅ Converted style saved to ${outputFile}`);
