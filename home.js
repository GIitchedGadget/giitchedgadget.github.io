document.addEventListener('DOMContentLoaded', function() {
    const discordElement = document.getElementById('discord');
    if (!discordElement) {
        console.error("Discord element not found!");
        return;
    }

    discordElement.addEventListener('click', function() {
        console.log("Discord image clicked!");

        const text = document.getElementById('textToCopy').textContent;
        navigator.clipboard.writeText(text).then(function() {
            console.log('Text successfully copied to clipboard!');

            // Show the tooltip
            const tooltip = document.getElementById('tooltip');
            tooltip.classList.add('visible');

            // Hide the tooltip after 2 seconds
            setTimeout(function() {
                tooltip.classList.remove('visible');
            }, 2000);
        }).catch(function(err) {
            console.error('Unable to copy text: ', err);
        });
    });
});