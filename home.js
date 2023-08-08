document.addEventListener('DOMContentLoaded', function() {
    const discordElement = document.getElementById('discord');
    if (!discordElement) {
        console.error("Discord element not found!");
        return;
    }

    discordElement.addEventListener('click', function() {

        const text = document.getElementById('textToCopy').textContent;
        navigator.clipboard.writeText(text).then(function() {

            const tooltip = document.getElementById('tooltip');
            tooltip.classList.add('visible');

            setTimeout(function() {
                tooltip.classList.remove('visible');
            }, 2000);
        }).catch(function(err) {
            console.error('Unable to copy text: ', err);
        });
    });
});