$(document).on('ready', function () {
    var selectedSample = undefined;
    var selectedAlgorithm = undefined;
    var waves = {};

    $('.content-top .pure-button').on('click', function () {
        $this = $(this);

        if ($this.hasClass('pure-button-active')) return;

        var sample = $this.attr('sample');
        $('.content-top .pure-button-active').removeClass('pure-button-active');
        $this.addClass('pure-button-active');

        $('.content-algorithm').show();

        $('.content-waveforms').show();

        selectedSample = sample;
        console.log('Selected: ' + sample);

        firstPass = false;
        var signals = ['os1', 'os2', 'ms1', 'ms2'];
        var urls = ['/original/1', '/original/2', '/mixture/1', '/mixture/2'];

        for (var i = 0; i < 4; i++) {
            var signal = signals[i];
            var url = '/oct/sound/' + sample + urls[i];

            var wave = WaveSurfer.create({
                container: '#' + signal,
                waveColor: 'violet',
                progressColor: 'purple'
            });

            wave.load(url);
            waves[signal] = wave;
        }

        $('.content-waveforms .play-pause').on('click', function () {
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

        $('.content-waveforms .slider').on('input', function () {
            var $this = $(this);
            var signalToToggle = $this.attr('signal');
            var wave = waves[signalToToggle];
            var zoomLevel = 5*Number($this.val());
            wave.zoom(zoomLevel);
        })
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
        console.log('TODO: Fetch results');
    });

});
