const VideoSubtitles = (require('../dist/main')).VideoSubtitles;

describe('addSubtitlesTest', () => {
    let videoSubtitles;
    beforeEach(() => {
        videoSubtitles = new VideoSubtitles();
    });
    afterEach(() => {
        videoSubtitles = null;
    });
    test('addSubtitlesTest: Then _getSeconds will take format of m:ss.ms and convert it into seconds', () => {
        let videoSubtitles = new VideoSubtitles();

        const time = '1:2.16';
        const expectedResult = 62.16; // '1:2.16' equal to 1*60 + 2.16 = 62.16

        expect(videoSubtitles._getSeconds(time)).toBe(expectedResult);
    });
    test('addSubtitlesTest: Then _getSeconds will be able to handle zeros', () => {
        let videoSubtitles = new VideoSubtitles();

        const time = '0:0.0';
        const expectedResult = 0;

        expect(videoSubtitles._getSeconds(time)).toBe(expectedResult);
    });
});
