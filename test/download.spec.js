import download from "../src/download.js";
import vo from "vo";

describe('download', () => {

  it('should fetch and save google.com index page', function (done) {
    var testTimeout = 15 * 1000;
    this.timeout(testTimeout);
    var outputDirectory = 'test-out';

    var links = ['http://www.google.com'];
    var run = download(links, {
      outputDirectory: outputDirectory,
      fetchTimeout: testTimeout - 1000,
      showBrowser: false
    });

    vo([run])
      .then(foo => {
        var createdDirectory = outputDirectory + '/' + 'www.google.com';

        expect(createdDirectory).to.be.a.directory();
        expect(createdDirectory + '/' + 'httpwww.google.com.txt').to.be.a.file();

        done();
      })
      .catch(err => done(err));
  });

});
