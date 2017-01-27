import download from "../src/download.js";
import vo from "vo";
import fs from "fs";
import path from "path";

describe('download', () => {
  var outputDirectory = 'test-out';

  it('should do nothing on empty array', function () {
    var testTimeout = 5 * 1000;
    this.timeout(testTimeout);
    var generator = download([])();

    var next = generator.next();
    var nightmarejs = next.value;
    expect(nightmarejs).to.be.ok;
    expect(next.done).to.be.false;

    next = generator.next();
    expect(next.done).to.be.true;
  });

  it('should fetch and save google.com index page', function (done) {
    var testTimeout = 20 * 1000;
    this.timeout(testTimeout);

    var links = ['http://www.google.com'];
    var run = download(links, {
      outputDirectory: outputDirectory,
      fetchTimeout: testTimeout - 1000,
      showBrowser: false
    });

    vo([run])
      .then(foo => {
        var createdDirectory = path.resolve(outputDirectory, 'www.google.com');

        expect(createdDirectory).to.be.a.directory();
        var createdFile = path.resolve(createdDirectory, 'httpwww.google.com.txt');
        expect(createdFile).to.be.a.file();

        fs.unlink(createdFile, function (err) {
          if (err) {
            console.log('Cannot delete file', err);
          }
          done();
        });
      })
      .catch(err => done(err));
  });


  it('should take screenshot of google.com index page', function (done) {
    var testTimeout = 20 * 1000;
    this.timeout(testTimeout);

    var links = ['http://www.google.com'];
    var run = download(links, {
      outputDirectory: outputDirectory,
      fetchTimeout: testTimeout - 1000,
      showBrowser: false,
      screenshot: true,
      html: false
    });

    vo([run])
      .then(foo => {
        var createdDirectory = path.resolve(outputDirectory, 'www.google.com');

        expect(createdDirectory).to.be.a.directory();
        var createdFile = path.resolve(createdDirectory, 'httpwww.google.com.png');
        expect(createdFile).to.be.a.file();

        fs.unlink(createdFile, function (err) {
          if (err) {
            console.log('Cannot delete file', err);
          }
          done();
        });
      })
      .catch(err => done(err));
  });

  it('should create pdf of google.com index page', function (done) {
    var testTimeout = 20 * 1000;
    this.timeout(testTimeout);

    var links = ['http://www.google.com'];
    var run = download(links, {
      outputDirectory: outputDirectory,
      fetchTimeout: testTimeout - 1000,
      showBrowser: false,
      pdf: true,
      html: false
    });

    vo([run])
      .then(foo => {
        var createdDirectory = path.resolve(outputDirectory, 'www.google.com');

        expect(createdDirectory).to.be.a.directory();
        var createdFile = path.resolve(createdDirectory, 'httpwww.google.com.pdf');
        expect(createdFile).to.be.a.file();

        fs.unlink(createdFile, function (err) {
          if (err) {
            console.log('Cannot delete file', err);
          }
          done();
        });
      })
      .catch(err => done(err));
  });

});
