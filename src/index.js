import readFile from 'fs-readfile-promise';
import STATICS from './consts/statics';
import TEMPLATES from './consts/templates';

class VideoSubtitles {
    constructor() {    }

    /**
     *
     * @param conf {Object} - subtitles configuration
     * @param {string} conf.videoPublicId - a String which represents the Cloudinary publicId of the video we want to add subtitles to.
     * @param {string} conf.subtitlesFile - URL to a JSON containing the strings to present and their timing in the video.
     * with the format of - { Subtitles:[{start-timing, end-timing, text}] }. needs to supply subtitlesFile or subtitles
     * @param {JSON} conf.subtitles - a JSON containing the strings to present and their timing in the video.
     * with the format of - { Subtitles:[{start-timing, end-timing, text}] }. needs to supply subtitlesFile or subtitles
     * @param {string} conf.textStyle - text style, e.g. arial_60.
     * @param {string} conf.textLocation - subtitles location (up, down, center, etc.) e.g. g_south.
     * @returns {string}
     */
    async addSubtitlesToVideo(conf) {
        try {
            const subtitles = conf.subtitles ? conf.subtitles : await this._readSubtitleJsonFile(conf.subtitlesFile);
            return this._getUrl({
                subtitles,
                ...conf
            });
        } catch (ex) {
            throw ex;
        }
    }

    async _readSubtitleJsonFile(fileUrl) {
        try {
            const jsonFile = await readFile(fileUrl);
            return JSON.parse(jsonFile);
        } catch (ex) {
            throw new Error('_readSubtitleJsonFile: Cannot read JSON file: ' + ex.message);
        }
    }
    /**
     *
     * @param conf {Object} - subtitles configuration
     * @param {string} conf.videoPublicId - a String which represents the Cloudinary publicId of the video we want to add subtitles to.
     * @param {JSON} conf.subtitles - JSON with the format of - { Subtitles:[{start-timing, end-timing, text}] }
     * @param {string} conf.textStyle - text style, e.g. arial_60.
     * @param {string} conf.textLocation - subtitles location (up, down, center, etc.) e.g. g_south.
     * @returns {string}
     */
    _getUrl(conf) {
        const textStyle = conf.textStyle || STATICS.DEFAULT_TEXT_STYLE;
        const textLocation = conf.textLocation || STATICS.DEFAULT_TEXT_LOCATION;

        return TEMPLATES.SUBTITLES_URL({
            domain: STATICS.DOMAIN,
            urlParams: this._convertJsonToUrlParams(conf.subtitles, textStyle, textLocation),
            videoPublicId: conf.videoPublicId,
        });
    }
    /**
     * Get URL Parameters for embedded subtitles
     * @param subtitles {Array} Array of subtitles definition: {start-timing, end-timing, text}
     * @param textStyle {String}
     * @param location {String}
     * @returns {*}
     */
    _convertJsonToUrlParams(subtitles, textStyle, location) {
        const subtitlesStrs = subtitles.map((subtitle) => {
            return TEMPLATES.SUBTITLES_PARAMS({
                startTime: this._getSeconds(subtitle[STATICS.START_TIME_PARAM]),
                endTime: this._getSeconds(subtitle[STATICS.END_TIME_PARAM]),
                text: subtitle.text,
            });
        });
        return subtitlesStrs.join(',');
    }
    /**
     * Get string represent time, returns time in seconds.
     * @param time - Time format - '[hour]:[minutes].[seconds].' e.g.: 1:10.8
     * @returns {*}
     */
    _getSeconds(time) {
        const MINUTES_IN_HOUR = 60;
        const SECONDS_IN_MINUTES = 60;

        let temp = time.split(':');

        const hours = temp[0];

        temp = temp[1].split('.');

        const minutes = temp[0];
        const seconds = parseInt(temp[1], 10);

        return (hours * MINUTES_IN_HOUR * SECONDS_IN_MINUTES) + (minutes * SECONDS_IN_MINUTES) + seconds;
    }
}

const videoSubtitles = new VideoSubtitles();

export default {
    addSubtitlesToVideo: videoSubtitles.addSubtitlesToVideo,
};