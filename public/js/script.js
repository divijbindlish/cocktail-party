$(document).on("ready", function () {
    var selectedSample = undefined;
    var selectedAlgorithm = undefined;
    var mixtureType = undefined;
    var waves = {};

    var infoMap = {
        "single_sine": "WAVE audio, 8 bit, mono, 44100 Hz",
        "linear_voice_music": "WAVE audio, 8 bit, mono 8000 Hz",
        "linear_voice_voice": "WAVE audio, 8 bit, mono 8000 Hz",
        "conv_voice_music": "WAVE audio, 16 bit, mono 16000 Hz",
        "conv_voice_voice": "WAVE audio, 16 bit, mono 16000 Hz"
    };

    var createWave = function (signal, url) {
        var wave = WaveSurfer.create({
            container: "#" + signal,
            waveColor: "violet",
            progressColor: "purple",
            normalize: true,
        });

        wave.load(url);
        waves[signal] = wave;

        $(".play-pause[signal=" + signal + "]").on("click", function () {
            var $this = $(this);
            var signalToToggle = $this.attr("signal");
            var wave = waves[signalToToggle];
            wave.playPause();
            if ($this.html() == "Play") {
                $this.html("Pause");
            } else {
                $this.html("Play");
            }
        });

        $(".slider[signal=" + signal + "]").on("input", function () {
            var $this = $(this);
            var signalToToggle = $this.attr("signal");
            var wave = waves[signalToToggle];
            var zoomLevel = 7.5*Number($this.val());
            wave.zoom(zoomLevel);
        });
    }

    $(".mixture-type .pure-button").on("click", function () {
        $this = $(this);

        if ($this.hasClass("pure-button-active")) return;

        mixtureType = $this.attr("info");

        $(".mixture-type .pure-button").removeClass("pure-button-active");
        $this.addClass("pure-button-active");
        var className = "." + mixtureType;
        $(className).show();
    });

    $(".content-top .pure-button").on("click", function () {
        $this = $(this);

        if ($this.hasClass("pure-button-active")) return;

        var sample = $this.attr("sample");
        $(".content-top .pure-button-active").removeClass("pure-button-active");
        $this.addClass("pure-button-active");

        $(".content-waveforms").show();

        setTimeout(function () {
            selectedSample = sample;
            $(".content-waveforms .spinner").hide();
            $(".content-waveforms .rest").show();
            $(".content-waveforms .info").html(infoMap[sample]);
            $(".content-algorithm").show();
            if (mixtureType == "linear") {
                $(".content-algorithm .pure-button[algorithm=svd]").show();
                $(".content-algorithm .pure-button[algorithm=ica]").show();
            } else {
                if (selectedSample != "live") {
                    $(".content-algorithm .pure-button[algorithm=svd]").show();
                    $(".content-algorithm .pure-button[algorithm=ica]").show();
                }
                $(".content-algorithm .pure-button[algorithm=conv]").show();
            }
            console.log("Selected: " + sample);

            var signals = ["os1", "os2", "ms1", "ms2"];
            var urls = [
                "/original_sources/" + sample + "/1.wav",
                "/original_sources/" + sample + "/2.wav",
                "/mixed_sources/" + sample + "/1.wav",
                "/mixed_sources/" + sample + "/2.wav"
            ];

            if (selectedSample == "live") {
                urls = [
                    "/mixed_sources/" + sample + "/1.wav",
                    "/mixed_sources/" + sample + "/2.wav"
                ];
                signals = ["ms1", "ms2"];
            } else {
                $(".yolo").show();
            }

            for (var i = 0; i < urls.length; i++) {
                var signal = signals[i];
                var url = urls[i]

                createWave(signal, url);
            }
        }, 750)
    });

    $(".content-algorithm .pure-button").on("click", function () {
        if (selectedSample === undefined) {
            console.log("Wrong click");
            return;
        }

        $this = $(this);

        if ($this.hasClass("pure-button-active")) return;

        var algorithm = $this.attr("algorithm");
        $(".content-algorithm .pure-button-active").removeClass("pure-button-active");
        $this.addClass("pure-button-active");

        selectedAlgorithm = algorithm;
        console.log("Algorithm: " + algorithm);

        // START TIMER
        $(".content-output").show();
        $(".container").scrollTop($(".container")[0].scrollHeight);

        setTimeout(function () {
            // STOP TIMER
            var base = "/" + selectedAlgorithm + "_output/" + selectedSample;

            $(".content-output .spinner").hide();
            $(".content-output .rest").show();
            var signals = ["out1", "out2"];
            var urls = [base + "/1.wav", base + "/2.wav"];

            for (var i = 0; i < 2; i++) {
                var signal = signals[i];
                var url = urls[i];
                createWave(signal, url);
            }

            if (selectedSample == "live") {
                return;
            } else {
                $(".swag").show();
            }

            $.ajax({
                url: base + "/stats.json",
                dataType: "json",
                success: function(data) {
                    $("#time").html(data["time"] + " sec");
                    $("#coer").html(data["cor"]);
                    if (mixtureType == "conv") {
                        return;
                    }

                    $("#final").show();
                    $("#final").on("click", function () {
                        $("#final").hide();
                        $(".content-graphs").show();
                        $(".container").scrollTop($(".container")[0].scrollHeight);

                        setTimeout(function () {
                            $(".content-graphs .spinner").hide();
                            $(".content-graphs .rest").show();

                            var urls = [
                                base + "/origDist.png",
                                base + "/mixDist.png",
                                base + "/outDist.png"
                            ];
                            var signals = ["os", "ms", "out"];

                            if (selectedAlgorithm == "ica") {
                                urls.push(base + "/whiteDist.png");
                                signals.push("white")
                                $(".graph-container[signal=white]").show();
                                if (selectedSample == "singleSine") {
                                    for (var i = 1; i <= 4; i++) {
                                        urls.push(base + "/hist" + i.toString() + ".png");
                                        signals.push("hist" + i.toString());
                                    }
                                    $(".graph-container[for=ica]").show();
                                }
                            }

                            for (var i = 0; i < signals.length; i++) {
                                var url = urls[i];
                                var signal = signals[i];

                                $(".graph-container[signal=" + signal + "]").append("<img src=\"" + url + "\">");
                            }

                        }, 1500);
                    });

                    $("#final").trigger("click");
                }
            });
        }, 2500);

    });

});
