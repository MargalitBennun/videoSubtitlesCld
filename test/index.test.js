const VideoSubtitles = (require('../dist/main')).VideoSubtitles;

describe('Given addSubtitlesTest initialized', () => {
    let videoSubtitles;
    const defaultStartTimeResult = 2.5;
    const defaultEndTimeResult = 3.5;
    const defaultTextLocation = 'g_north';
    const defaultTextStyle = 'arial_40';
    let defaultConf;
    let defaultSubtitles;

    beforeEach(() => {
        videoSubtitles = new VideoSubtitles();
        defaultSubtitles = [{
            'start-timing': '0:2.5',
            'end-timing': '0:3.5',
            'text': 'hello',
        }];
        defaultConf= {
            videoPublicId: 'myVideo',
            textStyle: defaultTextStyle,
            textLocation: defaultTextLocation,
            subtitles: {
                subtitles: defaultSubtitles,
            },
        };
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
        const expectedResult = `l_text:${defaultTextStyle}:${defaultSubtitles[0].text},${defaultTextLocation},y_80,so_${defaultStartTimeResult},eo_${defaultEndTimeResult}`;

        expect(videoSubtitles._convertJsonToUrlParams(defaultSubtitles, defaultTextStyle, defaultTextLocation)).toBe(expectedResult);
    });
    test('Then _convertJsonToUrlParams will escape the text value', () => {
        const text = 'it\'s a test'
        defaultSubtitles[0].text = text;

        const expectedResult = `l_text:${defaultTextStyle}:${encodeURIComponent(text)},${defaultTextLocation},y_80,so_${defaultStartTimeResult},eo_${defaultEndTimeResult}`;

        expect(videoSubtitles._convertJsonToUrlParams(defaultSubtitles, defaultTextStyle, defaultTextLocation)).toBe(expectedResult);
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
        const startTimeResult0 = 2.5;
        const endTimeResult0 = 3.5;
        const startTimeResult1 = 4.5;
        const endTimeResult1 = 5.5;

        const expectedResult = `l_text:${defaultTextStyle}:${encodeURIComponent(subtitles[0].text)},${defaultTextLocation},y_80,so_${startTimeResult0},eo_${endTimeResult0}/` +
        `l_text:${defaultTextStyle}:${subtitles[1].text},${defaultTextLocation},y_80,so_${startTimeResult1},eo_${endTimeResult1}`;

        expect(videoSubtitles._convertJsonToUrlParams(subtitles, defaultTextStyle, defaultTextLocation)).toBe(expectedResult);
    });
    test('Then _getUrl returns a valid URL params with domain res.cloudinary.com', () => {
        const expectedResult = `https://res.cloudinary.com/candidate-evaluation/video/upload/` +
        `l_text:${defaultTextStyle}:${defaultConf.subtitles.subtitles[0].text},${defaultTextLocation},y_80,so_${defaultStartTimeResult},eo_${defaultEndTimeResult}/${defaultConf.videoPublicId}.mp4`;

        expect(videoSubtitles._getUrl(defaultConf)).toBe(expectedResult);
    });
    test('Then _getUrl returns a valid URL params with default text style (arial_60) when not provided', () => {
        delete defaultConf.textStyle;
        const defaultTextStyle = 'arial_60';

        const expectedResult = `https://res.cloudinary.com/candidate-evaluation/video/upload/` +
        `l_text:${defaultTextStyle}:${defaultConf.subtitles.subtitles[0].text},${defaultTextLocation},y_80,so_${defaultStartTimeResult},eo_${defaultEndTimeResult}/${defaultConf.videoPublicId}.mp4`;

        expect(videoSubtitles._getUrl(defaultConf)).toBe(expectedResult);
    });
    test('Then _getUrl returns a valid URL params with default text location (g_south) when not provided', () => {
        delete defaultConf.textLocation;
        const defaultTextLocation = 'g_south';

        const expectedResult = `https://res.cloudinary.com/candidate-evaluation/video/upload/` +
            `l_text:${defaultTextStyle}:${defaultConf.subtitles.subtitles[0].text},${defaultTextLocation},y_80,so_${defaultStartTimeResult},eo_${defaultEndTimeResult}/${defaultConf.videoPublicId}.mp4`;

        expect(videoSubtitles._getUrl(defaultConf)).toBe(expectedResult);
    });
    test('Then addSubtitlesToVideo returns valid cloudinary URL with Promise', () => {
        const expectedResult = `https://res.cloudinary.com/candidate-evaluation/video/upload/` +
            `l_text:${defaultTextStyle}:${defaultConf.subtitles.subtitles[0].text},${defaultTextLocation},y_80,so_${defaultStartTimeResult},eo_${defaultEndTimeResult}/${defaultConf.videoPublicId}.mp4`;

        expect(videoSubtitles.addSubtitlesToVideo(defaultConf)).resolves.toEqual(expectedResult);
    });
});
