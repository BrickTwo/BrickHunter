<template>
  <div>
    <h1>Disclaimer</h1>
    <p>BrickHunter ist eine nicht durch LEGO authorisierte Browsererweiterung die den Anwender bei einer Pick a Brick oder Steine & Teile Bestellung unterstützt. Für die durchführung der Bestellung wird keine Verantwortung übernommen, dies gilt insbesondere für das korrekte auffinden sowie befüllen des Warenkorbes eines gesuchten Teiles in Form, Farbe, Preis und Anzahl. Der Anwender ist aufgefodert, die Bestellung vor dem Absenden im LEGO Shop nochmals zu prüfen.</p>
    <p>BrickHunter ist darauf programmiert, die automatisch durchgeführten interaktionen sowohl mit der LEGO als auch mit der BrickLink Website so gering wie möglich zu halten. Für evtl. durch BrickHunter verursachte Fehler oder Sperrungen auf den genannten Webseiten übernimmt BrickHunter keine verantwortung.</p>
    <h1>Lizenz</h1>
    <p>BrickHunter steht unter der <a @click="link('https://github.com/BrickTwo/BrickHunter/blob/master/LICENSE')" href="">GPL-3.0</a> Lizenz.</p>
    <p>Source Code verfügbar auf <a @click="link('https://github.com/BrickTwo/BrickHunter')" href="">GitHub</a>.</p>
  </div>
</template>

<script>
export default {
    methods: {
        link(value){
            browser.tabs.create({ url: value })
        }
    }
}
</script>