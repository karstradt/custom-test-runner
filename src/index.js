import {findFiles} from '@karstradt/find-specific-files';
import logger from '@karstradt/console-logger';
import path from 'path';
import url from 'url';

//actual list of test cases
let testCases = [];

//priority List
let priorityTestCases = [];

//suppressed cases list
let suppressedTestCases = [];

const runThisArrayOFTestCases = function (testCasesArr) {
    for(let i=0; i<testCasesArr.length; i++) {
        const currentTestCase = testCasesArr[i];

        logger.logInfo(currentTestCase.title);
        currentTestCase.fn();
        console.log("");
    }
}

const customRunner = function () {
    this.run = function (startPath) {
        logger.logNotify("Running the custom test runner.");

        const callerFilePath = process.argv[1];

        console.log(callerFilePath);
        
        let rootPath = path.resolve(callerFilePath, '../');

        const filePaths = findFiles(rootPath, startPath);

        const refinedFilePaths = filePaths.filter(item => {
            return item.indexOf('node_modules') < 0;
        })

        if(refinedFilePaths.length>0) {
            for(let i=0; i<refinedFilePaths.length; i++) {
                const convertedPath = url.pathToFileURL(refinedFilePaths[i]);

                import(convertedPath).then(function () {
                    logger.logInfo(`running file ${refinedFilePaths[i]}`);

                    if(priorityTestCases.length > 0) {
                        runThisArrayOFTestCases(priorityTestCases)
                    } else if (testCases.length > 0){
                        runThisArrayOFTestCases(testCases)
                    }
                });
            }
        }
    }
};

const customTestSuite = function customTestSuite(){
    this.testIt = function (title, fn) {
        testCases.push({
            title: title,
            fn: fn
        })
    }

    this.only = function (title, fn) {
        priorityTestCases.push({
            title: title,
            fn: fn
        })
    }

    this.suppress = function (title, fn) {
        suppressedTestCases.push({
            title: title,
            fn: fn
        })
    }
}

/* ************************************************************************
customRunner CLASS DEFINITION
************************************************************************ */
customRunner.instance = null;

customRunner.getInstance = function () {
    if(this.instance === null) {
        this.instance = new customRunner();
    }

    return this.instance;
}

/* ************************************************************************
customTestSuite CLASS DEFINITION
************************************************************************ */
customTestSuite.instance = null;

/**
 * customTestSuite getInstance definition
 * @return customTestSuite class
 */
customTestSuite.getInstance = function(){
    if(this.instance === null){
        this.instance = new customTestSuite();
    }
    return this.instance;
}



export default {
    customTestSuite: customTestSuite.getInstance(),
    customRunner: customRunner.getInstance()
}