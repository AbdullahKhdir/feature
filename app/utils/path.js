'use strict';


const path = require('path');
/*
 !Deprecated
 */
/* 
  ? module.exports = path.dirname(process.mainModule.filename);
 */
module.exports = path.dirname(require.main.filename);