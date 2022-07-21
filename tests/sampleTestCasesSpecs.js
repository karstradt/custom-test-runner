import customSuite from '../src/index.js';

const customTestSuite = customSuite.customTestSuite;

customTestSuite.testIt("Title", function () {
    console.log("Hi there, my first case");
});

customTestSuite.only("This is the only thing", function () {
    console.log("The only test case to be run");
})

customTestSuite.suppress("This is a suppressed function", function () {
    console.log("Just a suppressed test case");
})
