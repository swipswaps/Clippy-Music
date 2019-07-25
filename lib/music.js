const cp = require('child_process');

const opt = require('../options.js');

/**
 * Returns a promise that resolves with a string of this format:
 * [FORMAT]
 * duration=numberOfSeconds
 * [/FORMAT]
 */
function getFFProbeFormatDataContainingDuration(filePath) {
    return new Promise((resolve, reject) => {
        // -v error (high logging)
        // -show_entries format=duration (get the duration data)
        const proc = cp.spawn(opt.ffprobePath, ['-v', 'error', '-show_entries', 'format=duration', filePath]);

        let processOutput = '';
        let processErrorMessage = '';

        proc.stdout.on('data', (data) => {
            processOutput += data.toString();
        });

        proc.stderr.on('data', (data) => {
            processErrorMessage += data.toString();
        });

        proc.on('error', (err) => {
            reject(err);
        });

        proc.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(processErrorMessage));
            } else {
                return resolve(processOutput);
            }
        });
    });
}

module.exports = {
    getDuration(filePath) {
        return getFFProbeFormatDataContainingDuration(filePath)
        .then((ffProbeData) => {
            const durationLine = ffProbeData.split('\n')[1];
            if (durationLine === undefined) throw new Error('');

            const secondsStr = durationLine.split('=')[1];
            if (secondsStr === undefined) throw new Error('');

            return parseFloat(secondsStr);
        });
    },
};