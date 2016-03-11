$(document).on('ready', function () {
    var selectedSample = undefined;
    var selectedAlgorithm = undefined;
    var waves = {};

    var infoMap = {
        'single_sine': 'WAVE audio, 8 bit, mono, 44100 Hz',
        'linear_voice_music': 'WAVE audio, 8 bit, mono 8000 Hz',
        'linear_voice_voice': 'WAVE audio, 8 bit, mono 8000 Hz',
        'conv_voice_music': 'WAVE audio, 16 bit, mono 16000 Hz',
        'conv_voice_voice': 'WAVE audio, 16 bit, mono 16000 Hz'
    };

    var createWave = function (signal, url) {
        var wave = WaveSurfer.create({
            container: '#' + signal,
            waveColor: 'violet',
            progressColor: 'purple',
            normalize: true
        });

        wave.load(url);
        waves[signal] = wave;

        $('.play-pause[signal=' + signal + ']').on('click', function () {
            var $this = $(this);
            var signalToToggle = $this.attr('signal');
            var wave = waves[signalToToggle];
            wave.playPause();
            if ($this.html() == 'Play') {
                $this.html('Pause');
            } else {
                $this.html('Play');
            }
        });

        $('.slider[signal=' + signal + ']').on('input', function () {
            var $this = $(this);
            var signalToToggle = $this.attr('signal');
            var wave = waves[signalToToggle];
            var zoomLevel = 5*Number($this.val());
            wave.zoom(zoomLevel);
        });
    }

    $('.content-top .pure-button').on('click', function () {
        $this = $(this);

        if ($this.hasClass('pure-button-active')) return;

        var sample = $this.attr('sample');
        $('.content-top .pure-button-active').removeClass('pure-button-active');
        $this.addClass('pure-button-active');

        $('.content-waveforms').show();

        setTimeout(function () {
            $('.content-waveforms .spinner').hide();
            $('.content-waveforms .rest').show();
            $('.content-waveforms .info').html(infoMap[sample]);
            $('.content-algorithm').show();
            selectedSample = sample;
            console.log('Selected: ' + sample);

            var signals = ['os1', 'os2', 'ms1', 'ms2'];
            var urls = ['/original/1', '/original/2', '/mixture/1', '/mixture/2'];

            for (var i = 0; i < 4; i++) {
                var signal = signals[i];
                var url = '/oct/sound/' + sample + urls[i];

                createWave(signal, url);
            }
        }, 750)
    });

    $('.content-algorithm .pure-button').on('click', function () {
        if (selectedSample === undefined) {
            console.log('Wrong click');
            return;
        }

        $this = $(this);

        if ($this.hasClass('pure-button-active')) return;

        var algorithm = $this.attr('algorithm');
        $('.content-algorithm .pure-button-active').removeClass('pure-button-active');
        $this.addClass('pure-button-active');

        selectedAlgorithm = algorithm;
        console.log('Algorithm: ' + algorithm);

        // START TIMER
        $('.content-output').show();
        $('.container').scrollTop($('.container')[0].scrollHeight);

        setTimeout(function () {
            // STOP TIMER
            $.ajax({
                url: '/oct/info/' + selectedSample + '/' + selectedAlgorithm
                     + '_output/stats',
                dataType: 'json',
                success: function(data) {
                    $('.content-output .spinner').hide();
                    $('.content-output .rest').show();
                    $('#time').html(data['time'] + ' sec');
                    $('#coer').html(data['cor']);

                    var signals = ['out1', 'out2'];
                    var base = '/' + selectedAlgorithm + '_output'
                    var urls = [base + '/1', base + '/2'];

                    for (var i = 0; i < 2; i++) {
                        var signal = signals[i];
                        var url = '/oct/sound/' + selectedSample + urls[i];

                        createWave(signal, url);
                    }
                }
            });
        }, 2000);

    });

});
