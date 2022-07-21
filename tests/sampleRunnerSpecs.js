import customTestSuite from '../src/index.js';

var customRunner = customTestSuite.customRunner;

customRunner.run('../**/*Test*.js');