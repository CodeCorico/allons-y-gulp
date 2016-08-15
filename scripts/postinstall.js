'use strict';

var path = require('path'),
    fs = require('fs-extra');

fs.copySync(path.resolve(__dirname, '../gulpfile.js'), path.resolve(__dirname, '../../../gulpfile.js'));
