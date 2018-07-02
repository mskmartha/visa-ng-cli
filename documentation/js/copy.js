// Config ZeroClipboard
ZeroClipboard.config({
    hoverClass: 'btn-clipboard-hover'
})

// Insert copy to clipboard button before .highlight
$('.highlight').each(function () {
    var btnHtml = '<div class="zero-clipboard"><span class="btn-clipboard">Copy</span></div>';
    $(this).before(btnHtml)
});

var zeroClipboard = new ZeroClipboard($('.btn-clipboard'));
var htmlBridge = $('#global-zeroclipboard-html-bridge');

// Handlers for ZeroClipboard
zeroClipboard.on('ready', function (event) {
    htmlBridge
        .data('placement', 'top')
        .attr('title', 'Copy to clipboard')
        .tooltip();

    // Copy to clipboard
    zeroClipboard.on('copy', function (event) {
        var highlight = $(event.target).parent().nextAll('.highlight').first();
        event.clipboardData.setData("text/plain", highlight.text())
    });

    // Notify copy success and reset tooltip title
    zeroClipboard.on('aftercopy', function () {
        htmlBridge
            .attr('title', 'Copied!')
            .tooltip('fixTitle')
            .tooltip('show')
            .attr('title', 'Copy to clipboard')
            .tooltip('fixTitle')
    });
});

// Notify copy failure
zeroClipboard.on('error', function () {
    ZeroClipboard.destroy();
    htmlBridge
        .attr('title', 'Flash required')
        .tooltip('fixTitle')
        .tooltip('show');
});