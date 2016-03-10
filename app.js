var express = require('express');
var spawn = require('child_process').spawn;

var app = express();

var config = require('./config/config.json');

var sampleMap = {
    'single_sine': 'singleSine',
    'linear_voice_music': '2',
    'linear_voice_voice': '3',
    'conv_voice_music': '8',
    'conv_voice_voice': '5'
};

var scriptMap = {
    'ica': config['octave_code_directory'] + '/separateUsingICA.m',
    'svd': config['octave_code_directory'] + '/separateUsingSVD.m'
};

var extensionMap = {
    'sound': 'wav',
    'graph': 'png',
};

var directoryMap = {
    'original': config['octave_code_directory']
                + '/sound_files/original_sources',
    'mixture': config['octave_code_directory']
                + '/sound_files/mixed_sources',
    'svd_output': config['octave_code_directory']
                + '/sound_files/svd_output',
    'ica_output': config['octave_code_directory']
                + '/sound_files/ica_output'
};

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('hello, world!');
});

app.get('/oct/:type/:sample/:directory/:number', function (req, res) {
    var extension = req.params.type;
    var sample = req.params.sample;
    var directory = req.params.directory;
    var number = req.params.number;

    if (! (sample in sampleMap) || ! (directory in directoryMap)
        || ! (number == '1' || number == '2')
        || ! (extension in extensionMap)) {
        res.status(404);
        res.end('Not Found');
        return;
    }

    var path = directoryMap[directory] + '/' + sampleMap[sample]
        + '/' + number + '.' + extensionMap[extension];

    console.log('File requested: ' + path);

    res.sendFile(path);
});

app.get('/run/:algorithm/:sample', function (req, res) {
    var algorithm = req.params.algorithm;
    var sample = req.params.sample;

    if (! (algorithm in scriptMap) || ! (sample in sampleMap)) {
        res.status(404);
        res.end('Not Found');
        return;
    }

    console.log('Run: ' + algorithm.toUpperCase() + ', ' + sample);

    var args = [
        config['octave_code_directory'] + '/' + scriptMap[algorithm],
        sampleMap[sample]
    ];

    cmd = spawn('octave', args);

    cmd.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    cmd.stdout.on('close', function (code) {
        console.log('Command exited with code: ' + String(code));
        res.end(JSON.stringify({ 'status': 'OK' }));
    })
});

app.listen(3000, function () {
    console.log('Started frontend server for cocktail party at port 3000');
});
