const assert = require('chai').assert;
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const format = require('../index');

describe('XML formatter', function () {

    const assertFormat = function(context, src, formatterOptions) {
        glob.sync(src).forEach(file => {
            const outputFile = file.replace('-input', '-output');
            it('Assert: ' + path.basename(outputFile), function() {
                const fileContents = fs.readFileSync(file).toString('utf8');
                const formattedContents = format(fileContents, formatterOptions);
                const formattedContents2 = format(formattedContents, formatterOptions);
                let expectedContents = fs.readFileSync(outputFile).toString('utf8').trimEnd();
                const lineSeparator = formatterOptions.lineSeparator || '\r\n';
                const relativeFilePath = path.relative(process.cwd(), file);

                expectedContents = expectedContents.replace(/\r/g, '').replace(/\n/g, lineSeparator);

                assert.equal(formattedContents, expectedContents, 'Formatted Content for ' + relativeFilePath);
                assert.equal(formattedContents2, expectedContents, 'Idempotence test for ' + relativeFilePath);
            });
        });
    }

    describe('should format XML with comments', function(done) {
        assertFormat(this, 'test/data1/xml*-input.xml', {}, done);
    });

    describe('should format XML without comments', function(done) {
        assertFormat(this, 'test/data2/xml*-input.xml', {filter: (node) => node.type !== 'Comment'}, done);
    });

    describe('should format XML without indenting text content when option is enabled:', function(done) {
        assertFormat(this, 'test/data3/xml*-input.xml', {collapseContent: true}, done);
    });

    describe('should format XML with various node types', function(done) {
        assertFormat(this, 'test/data4/xml*-input.xml', {}, done);
    });

    describe('should format XML with the custom line separator', function(done) {
        assertFormat(this, 'test/data5/xml*-input.xml', {lineSeparator: '\n'}, done);
    });

    describe('should format XML that already contains line breaks', function(done) {
        assertFormat(this, 'test/data6/xml*-input.xml', {}, done);
    });

    describe('should format XML adding a whitespace before self closing tag', function(done) {
        assertFormat(this, 'test/data7_white-space-on-closing-tag/xml*-input.xml', {whiteSpaceAtEndOfSelfclosingTag: true}, done);
    });

    describe('should escape a double quote in an attribute value', function(done) {
        assertFormat(this, 'test/data8/xml*-input.xml', {}, done);
    });

    describe('should format XML without indentation and line separation', function(done) {
        assertFormat(this, 'test/data9/xml*-input.xml', {indentation: '', lineSeparator: ''}, done);
    });

});
