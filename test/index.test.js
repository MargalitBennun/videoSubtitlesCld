const VideoSubtitles = (require('../dist/main')).VideoSubtitles;

describe('Given addSubtitlesTest initialized', () => {
    let videoSubtitles;
    beforeEach(() => {
        videoSubtitles = new VideoSubtitles();
    });
    afterEach(() => {
        videoSubtitles = null;
    });
    test('Then _getSeconds will take format of m:ss.ms and convert it into seconds', () => {
        const time = '1:2.16';
        const expectedResult = 62.16; // '1:2.16' equal to 1*60 + 2.16 = 62.16

        expect(videoSubtitles._getSeconds(time)).toBe(expectedResult);
    });
    test('Then _getSeconds will be able to handle zeros', () => {
        const time = '0:0.0';
        const expectedResult = 0;

        expect(videoSubtitles._getSeconds(time)).toBe(expectedResult);
    });
    test('Then _convertJsonToUrlParams will return valid subtitles parameters', () => {
        const parameters = '0:0.0';
        const subtitles = [{
            'start-timing': '0:2.5',
            'end-timing': '0:3.5',
            'text': 'hello',
        }];
        const location = 'g_north';
        const textStyle = 'arial_40';
        const startTimeResult = 2.5;
        const endTimeResult = 3.5;

        const expectedResult = `l_text:${textStyle}:${subtitles[0].text},${location},y_80,so_${startTimeResult},eo_${endTimeResult}`;

        expect(videoSubtitles._convertJsonToUrlParams(subtitles, textStyle, location)).toBe(expectedResult);
    });
    test('Then _convertJsonToUrlParams will escape the text value', () => {
        const subtitles = [{
            'start-timing': '0:2.5',
            'end-timing': '0:3.5',
            'text': 'it\'s a test',
        }];
        const location = 'g_north';
        const textStyle = 'arial_40';
        const startTimeResult = 2.5;
        const endTimeResult = 3.5;

        const expectedResult = `l_text:${textStyle}:${encodeURIComponent(subtitles[0].text)},${location},y_80,so_${startTimeResult},eo_${endTimeResult}`;

        expect(videoSubtitles._convertJsonToUrlParams(subtitles, textStyle, location)).toBe(expectedResult);
    });
    test('Then _convertJsonToUrlParams join few subtitles with \/ between subtitle to subtitle', () => {
        const subtitles = [{
            'start-timing': '0:2.5',
            'end-timing': '0:3.5',
            'text': 'hello1',
        }, {
            'start-timing': '0:4.5',
            'end-timing': '0:5.5',
            'text': 'hello2',
        }];
        const location = 'g_north';
        const textStyle = 'arial_40';
        const startTimeResult0 = 2.5;
        const endTimeResult0 = 3.5;
        const startTimeResult1 = 4.5;
        const endTimeResult1 = 5.5;

        const expectedResult = `l_text:${textStyle}:${encodeURIComponent(subtitles[0].text)},${location},y_80,so_${startTimeResult0},eo_${endTimeResult0}/` +
        `l_text:${textStyle}:${subtitles[1].text},${location},y_80,so_${startTimeResult1},eo_${endTimeResult1}`;

        expect(videoSubtitles._convertJsonToUrlParams(subtitles, textStyle, location)).toBe(expectedResult);
    });
    test('Then _getUrl returns a valid URL params with domain res.cloudinary.com', () => {
        const subtitles = [{
            'start-timing': '0:2.5',
            'end-timing': '0:3.5',
            'text': 'hello',
        }];
        const conf = {
            videoPublicId: 'myVideo',
            textLocation: 'g_north',
            textStyle: 'arial_40',
            subtitles: {
                subtitles: subtitles,
            },
        };
        const startTimeResult = 2.5;
        const endTimeResult = 3.5;

        const expectedResult = `https://res.cloudinary.com/candidate-evaluation/video/upload/` +
        `l_text:${conf.textStyle}:${subtitles[0].text},${conf.textLocation},y_80,so_${startTimeResult},eo_${endTimeResult}/${conf.videoPublicId}.mp4`;

        expect(videoSubtitles._getUrl(conf)).toBe(expectedResult);
    });
    test('Then _getUrl returns a valid URL params with default text style (arial_60) when not provided', () => {
        const subtitles = [{
            'start-timing': '0:2.5',
            'end-timing': '0:3.5',
            'text': 'hello',
        }];
        const conf = {
            videoPublicId: 'myVideo',
            textLocation: 'g_north',
            subtitles: {
                subtitles: subtitles,
            },
        };
        const defaultTextStyle = 'arial_60';
        const startTimeResult = 2.5;
        const endTimeResult = 3.5;

        const expectedResult = `https://res.cloudinary.com/candidate-evaluation/video/upload/` +
        `l_text:${defaultTextStyle}:${subtitles[0].text},${conf.textLocation},y_80,so_${startTimeResult},eo_${endTimeResult}/${conf.videoPublicId}.mp4`;

        expect(videoSubtitles._getUrl(conf)).toBe(expectedResult);
    });
    test('Then _getUrl returns a valid URL params with default text location (g_south) when not provided', () => {
        const subtitles = [{
            'start-timing': '0:2.5',
            'end-timing': '0:3.5',
            'text': 'hello',
        }];
        const conf = {
            videoPublicId: 'myVideo',
            textStyle: 'arial_40',
            subtitles: {
                subtitles: subtitles,
            },
        };
        const defaultTextLocation = 'g_south';
        const startTimeResult = 2.5;
        const endTimeResult = 3.5;

        const expectedResult = `https://res.cloudinary.com/candidate-evaluation/video/upload/` +
            `l_text:${conf.textStyle}:${subtitles[0].text},${defaultTextLocation},y_80,so_${startTimeResult},eo_${endTimeResult}/${conf.videoPublicId}.mp4`;

        expect(videoSubtitles._getUrl(conf)).toBe(expectedResult);
    });
    test('Then _readSubtitleJsonFile returns parsed valid JSON', done => {
        const fileUrl = 'https://dl6.volafile.org/get/B4qmReje6B80y/subtitles.json';
        videoSubtitles._readSubtitleJsonFile(fileUrl).then((data) => {
            console.log('inside resolve');
            expect(data).toBe('');
            done();
        }).catch((data) => {
            console.log('inside reject');
            done();
        });
    });
});
