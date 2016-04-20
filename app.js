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

app.use(express.static('public'));
app.use(express.static(config['octave_code_directory'] + '/sound_files'));

app.get('/sanity', function (req, res) {
  res.send('hello, world!');
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
    scriptMap[algorithm],
    sampleMap[sample]
  ];

  console.log(args);

  cmd = spawn('octave', args);

  cmd.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  cmd.stdout.on('close', function (code) {
    console.log('Command exited with code: ' + String(code));
    res.end(JSON.stringify({ 'status': 'OK', 'code': code }));
  })
});

app.listen(3000, function () {
  console.log('Started frontend server for cocktail party at port 3000');
});
