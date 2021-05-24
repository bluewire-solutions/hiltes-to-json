# hiltes-to-json

Converts Hiltes exports in .0000 file type to json. File structure is "csv" like with data type in the first column. Refer to source code for details on file structure. This module also restructures the data in certrain ways and provides in data.products structure.

## Quick Start

```
npm install --save hiltes-to-json
```

```javascript
const Hiltes = require('hiltes-to-json')

// ...

const data = await Hiltes('./WS000001.0000')
const erpProducts = data.products
```
