import { template } from '../utils/utils';

export default {
    SUBTITLES_URL: template`https://${'domain'}/candidate-evaluation/video/upload/${'urlParams'}/${'videoPublicId'}.mp4`,
    SUBTITLES_PARAMS: template`l_text:${'textStyle'}:${'text'},${'location'},y_80,so_${'startTime'},eo_${'endTime'}`,
};
