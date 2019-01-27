import STATICS from './consts/statics';
import TEMPLATES from './consts/templates';
import { loadJSON } from './utils/utils';

class VideoSubtitles {
    constructor() {    }

    /**
     * Add subtitles to video. Using Cloudinary text overlay API.
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
        return new Promise((resolve, reject) => {
            try {
                loadJSON(fileUrl)
                    .then((json) => {
                        resolve(json);
                        })
                    .catch((err)=>{
                        reject(err);
                        });
            } catch (ex) {
                throw new Error('_readSubtitleJsonFile: Cannot read JSON file: ' + ex.message);
            }
        });
    }
    /**
     * Get URL for video with subtitles
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
            urlParams: this._convertJsonToUrlParams(conf.subtitles.subtitles, textStyle, textLocation),
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
                text: encodeURIComponent(subtitle.text.replace(',', ';')),
                startTime: this._getSeconds(subtitle[STATICS.START_TIME_PARAM]),
                endTime: this._getSeconds(subtitle[STATICS.END_TIME_PARAM]),
                textStyle,
                location,
            });
        });
        return subtitlesStrs.join('/');
    }
    /**
     * Get string represent time, returns time in seconds.
     * @param time - Time format - '[hour]:[minutes].[seconds].' e.g.: 1:10.8
     * @returns {*}
     */
    _getSeconds(time) {
        const SECONDS_IN_MINUTES = 60;

        let temp = time.split(':');

        const minutes = parseInt(temp[0], 10);
        const seconds = parseFloat(temp[1], 10);

        return (minutes * SECONDS_IN_MINUTES) + seconds;
    }
}

export { VideoSubtitles }
