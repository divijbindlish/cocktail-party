$(document).on('ready', function () {
    var selectedSample = undefined;
    var selectedAlgorithm = undefined;

    $('.content-top .pure-button').on('click', function () {
        $this = $(this);

        if ($this.hasClass('pure-button-active')) return;

        var sample = $this.attr('sample');
        $('.content-top .pure-button-active').removeClass('pure-button-active');
        $this.addClass('pure-button-active');

        selectedSample = sample;
        console.log('Selected: ' + sample);
        console.log('TODO: Fetch and display signals + play');
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
