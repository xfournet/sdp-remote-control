# Ayant changé de FAI ce projet n'est plus maintenu

This is a Chrome extension to control TV Box of SFR french ISP.
 
Cette extension Chrome permet de contrôler la box SFR/Red Décodeur Plus (STB7) via une télécommande virtuelle.

L'utilisation du clavier est également possible quand la télécommande est affichée.


### Installation
* Installer depuis [Chrome Web Store](https://chrome.google.com/webstore/detail/ioopfmbbhnhmojlejphdamlfimpfgdia)
* Si nécessaire, configurer l'adresse du décodeur dans les [options de la télécommande](chrome-extension://ioopfmbbhnhmojlejphdamlfimpfgdia/options.html)

### Limitations actuelles:
* les touches "TV Power" et "Source" ne sont pas activées faute de connaissance des codes associés
* la répétition de certaines touches (Volume +/-, Programme +/-, flèches directionnelles) n'est pas implémentée
* l'autodétection de l'adresse IP du décodeur n'est possible que sur les OS qui l'implémente nativement (MacOS X) ou via un service complémentaire (Windows avec le service [Apple Bonjour](https://support.apple.com/kb/DL999)). Sur les systèmes ne supportant pas mDNS une configuration manuelle de l'IP est nécessaire dans les options de la télécommande
