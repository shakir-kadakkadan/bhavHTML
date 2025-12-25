// how to run
// node upload-itr-jsons.cjs


const fs = require('fs');
const path = require('path');
const https = require('https');

const DB_URL = 'https://bhavpc-default-rtdb.asia-southeast1.firebasedatabase.app';
const SOURCE_DIR = '/Users/shakir/BhavAppData/DATA/itrjsons';

function uploadFile(filename, content) {
  return new Promise((resolve, reject) => {
    const filenameWithoutExt = path.parse(filename).name;
    const url = `${DB_URL}/itrjsons/${filenameWithoutExt}.json`;

    const urlObj = new URL(url);
    const data = JSON.stringify(content);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✓ Uploaded: ${filenameWithoutExt}`);
          resolve(responseData);
        } else {
          console.error(`✗ Failed to upload ${filenameWithoutExt}: ${res.statusCode}`);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`✗ Error uploading ${filenameWithoutExt}:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  try {
    // Check if directory exists
    if (!fs.existsSync(SOURCE_DIR)) {
      console.error(`Error: Directory not found: ${SOURCE_DIR}`);
      process.exit(1);
    }

    // Read all files in directory
    const files = fs.readdirSync(SOURCE_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log('No JSON files found in directory.');
      return;
    }

    console.log(`Found ${jsonFiles.length} JSON file(s) to upload...\n`);

    // Upload each file
    for (const file of jsonFiles) {
      const filePath = path.join(SOURCE_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');

      try {
        await uploadFile(file, content);
      } catch (error) {
        console.error(`Failed to upload ${file}:`, error.message);
      }
    }

    console.log('\n✓ Upload process completed!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
