$(document).on('ready', function () {
    $('.content-top .pure-button').on('click', function () {
        $this = $(this);

        if ($this.hasClass('pure-button-active')) return;

        var sample = $this.attr('sample');
        $('.content-top .pure-button-active').removeClass('pure-button-active');
        $this.addClass('pure-button-active');

        console.log('Selected: ' + sample);
        console.log('TODO: Fetch and display signals + play');
    });

});
