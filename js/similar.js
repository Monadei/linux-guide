(function() {
  // Родственные связи для каждой страницы дистрибутива
  var RELATED = {
    // Debian
    'ubuntu':      ['mint', 'pop-os', 'zorin', 'elementary', 'kubuntu', 'xubuntu', 'lubuntu'],
    'mint':        ['ubuntu', 'lmde', 'zorin', 'elementary', 'pop-os'],
    'lmde':        ['mint', 'debian', 'ubuntu'],
    'pop-os':      ['ubuntu', 'mint', 'elementary', 'zorin'],
    'zorin':       ['mint', 'ubuntu', 'elementary', 'deepin'],
    'elementary':  ['ubuntu', 'zorin', 'mint', 'deepin'],
    'debian':      ['ubuntu', 'mint', 'lmde', 'mxlinux'],
    'kali':        ['parrot', 'blackarch', 'debian', 'tails', 'qubes'],
    'parrot':      ['kali', 'blackarch', 'tails', 'qubes'],
    'mxlinux':     ['debian', 'antix', 'lmde'],
    'antix':       ['mxlinux', 'puppy', 'debian', 'tinycore'],
    'puppy':       ['antix', 'tinycore', 'slitaz'],
    'deepin':      ['elementary', 'zorin', 'ubuntu'],
    'raspberry-pi-os': ['debian', 'ubuntu', 'armbian'],
    'kde-neon':    ['kubuntu', 'ubuntu', 'kde-linux'],
    'lubuntu':     ['xubuntu', 'kubuntu', 'ubuntu', 'antix'],
    'xubuntu':     ['lubuntu', 'kubuntu', 'ubuntu'],
    'kubuntu':     ['lubuntu', 'xubuntu', 'ubuntu', 'kde-neon'],
    'ubuntu-budgie': ['ubuntu', 'mint', 'elementary'],
    'ubuntu-mate': ['ubuntu', 'mint', 'xubuntu'],
    'ubuntu-studio': ['ubuntu', 'kubuntu', 'avlinux'],
    'avlinux':     ['ubuntu-studio', 'mxlinux', 'kubuntu'],
    'kde-linux':   ['kde-neon', 'kubuntu', 'fedora'],
    'nebios':      ['ubuntu', 'pop-os', 'elementary'],
    'anduinos':    ['zorin', 'mint', 'ubuntu'],
    'makulu-lindoz': ['mint', 'zorin', 'ubuntu'],
    'mx-moksha':   ['mxlinux', 'bodhi'],
    'bodhi':       ['mxlinux', 'antix', 'puppy'],
    'regolith':    ['ubuntu', 'archcraft'],
    'kaisen':      ['debian', 'kali', 'parrot'],
    'nitrux':      ['debian', 'solus', 'pop-os'],
    'rhino':       ['ubuntu', 'pop-os', 'debian'],
    'vanilla':     ['ubuntu', 'fedora-silverblue', 'nixos'],
    'linuxlite':   ['mint', 'lubuntu', 'xubuntu'],
    'vinari':      ['debian', 'mxlinux', 'lubuntu'],
    
    // Red Hat
    'fedora':      ['centos-stream', 'almalinux', 'rocky', 'nobara', 'bazzite'],
    'almalinux':   ['rocky', 'centos-stream', 'fedora', 'oracle-linux'],
    'rocky':       ['almalinux', 'centos-stream', 'fedora', 'oracle-linux'],
    'centos-stream': ['fedora', 'almalinux', 'rocky'],
    'oracle-linux': ['almalinux', 'rocky', 'centos-stream'],
    'nobara':      ['fedora', 'bazzite', 'cachyos', 'garuda'],
    'bazzite':     ['nobara', 'fedora', 'steamos', 'chimeraos'],
    'fedora-silverblue': ['fedora-kinoite', 'fedora-coreos', 'bazzite', 'vanilla'],
    'fedora-kinoite': ['fedora-silverblue', 'fedora-coreos', 'bazzite'],
    'fedora-coreos': ['fedora-silverblue', 'fedora-kinoite', 'talos'],
    'asahi':       ['fedora', 'ubuntu'],
    'hummingbird': ['fedora', 'fedora-coreos'],
    'ultramarine': ['fedora', 'nobara'],
    'vojtux':      ['fedora'],
    
    // Arch
    'arch':        ['endeavouros', 'manjaro', 'artix', 'cachyos'],
    'endeavouros': ['arch', 'manjaro', 'cachyos', 'archcraft'],
    'manjaro':     ['arch', 'endeavouros', 'cachyos'],
    'cachyos':     ['arch', 'garuda', 'nobara', 'bazzite'],
    'garuda':      ['arch', 'cachyos', 'manjaro', 'steamos'],
    'steamos':     ['bazzite', 'chimeraos', 'garuda', 'arch'],
    'blackarch':   ['arch', 'kali', 'parrot'],
    'archcraft':   ['arch', 'regolith', 'endeavouros'],
    'rebornos':    ['arch', 'endeavouros'],
    'blendos':     ['arch', 'vanilla', 'fedora-silverblue'],
    'noid':        ['void', 'arch'],
    'agarimos':    ['void', 'arch'],
    'shanios':     ['arch', 'fedora-silverblue', 'vanilla'],
    'omega':       ['arch', 'lubuntu', 'antix'],
    'elysiaos':    ['arch', 'archcraft', 'garuda'],
    'kazeta':      ['chimeraos', 'batocera', 'steamos'],
    'porteus':     ['slackware', 'arch'],
    'chimera':     ['alpine', 'void', 'slackware'],
    
    // SUSE
    'opensuse':    ['microos', 'opensuse-aeon', 'opensuse-kalpa'],
    'microos':     ['opensuse', 'opensuse-aeon', 'opensuse-kalpa', 'fedora-coreos'],
    'opensuse-aeon': ['opensuse', 'microos', 'opensuse-kalpa', 'silverblue'],
    'opensuse-kalpa': ['opensuse', 'microos', 'opensuse-aeon'],
    
    // Независимые
    'gentoo':      ['calculate', 'redcore', 'void', 'slackware'],
    'void':        ['gentoo', 'nixos', 'alpine', 'slackware'],
    'nixos':       ['guix', 'void', 'alpine'],
    'alpine':      ['void', 'nixos', 'chimera'],
    'slackware':   ['gentoo', 'void', 'porteus', 'slackware'],
    'solus':       ['arch', 'elementary', 'nitrux'],
    'clear':       ['fedora', 'opensuse', 'ubuntu-core'],
    'pclinuxos':   ['rosa', 'mageia', 'openmandriva'],
    'aerynos':     ['solus', 'fedora'],
    'bedrock':     ['arch', 'debian', 'fedora'],
    'dragora':     ['trisquel', 'parabola', 'pureos'],
    'vendefoul':   ['devuan', 'void', 'slackware'],
    'loss32':      ['zorin', 'mint', 'reactos'],
    'matrixos':    ['gentoo', 'nixos'],
    'enux':        ['bedrock', 'arch'],
    'origami':     ['fedora', 'pop-os'],
    'floppinux':   ['tinycore', 'slitaz'],
    'calculate':   ['gentoo', 'rosa', 'alt'],
    
    // Русские
    'rosa':        ['alt', 'astra', 'calculate', 'pclinuxos'],
    'alt':         ['rosa', 'astra', 'calculate'],
    'astra':       ['alt', 'rosa', 'debian'],
    'calculate':   ['gentoo', 'rosa', 'alt'],
    
    // Игровые
    'nobara':      ['bazzite', 'cachyos', 'garuda', 'fedora'],
    'bazzite':     ['nobara', 'steamos', 'chimeraos', 'fedora-silverblue'],
    'chimeraos':   ['steamos', 'bazzite', 'kazeta', 'batocera'],
    'batocera':    ['kazeta', 'libreelec', 'chimeraos'],
    'libreelec':   ['batocera', 'kodi'],
    'nawaos':      ['nobara', 'bazzite', 'debian'],
    
    // NAS/серверы
    'truenas-scale': ['openmediavault', 'xigmanas', 'rockstor', 'ovios'],
    'openmediavault': ['truenas-scale', 'rockstor', 'easynas'],
    'proxmox':     ['truenas-scale', 'xcp-ng', 'esxi'],
    'easynas':     ['openmediavault', 'truenas-scale'],
    'rockstor':    ['openmediavault', 'truenas-scale', 'xigmanas'],
    'xigmanas':    ['truenas-scale', 'openmediavault', 'rockstor'],
    'ovios':       ['truenas-scale', 'xigmanas'],
    
    // Роутеры
    'openwrt':     ['opnsense', 'pfsense', 'ipfire', 'dd-wrt'],
    'opnsense':    ['pfsense', 'openwrt', 'ipfire'],
    'pfsense':     ['opnsense', 'openwrt', 'ipfire'],
    'ipfire':      ['openwrt', 'opnsense', 'pfsense'],
    
    // Контейнеры/IoT
    'photon':      ['fedora-coreos', 'alpine', 'ubuntu-core'],
    'ubuntu-core': ['fedora-coreos', 'photon', 'alpine'],
    'postmarketos': ['ubuntu-touch', 'alpine', 'mobian'],
    'ubuntu-touch': ['postmarketos', 'mobian'],
    
    // Минимализм
    'tinycore':    ['slitaz', 'puppy', 'antix'],
    'slitaz':      ['tinycore', 'puppy', 'antix'],
    
    // FOSS
    'parabola':    ['trisquel', 'pureos', 'dragora', 'hyperbola'],
    'trisquel':    ['parabola', 'pureos', 'dragora'],
    'pureos':      ['trisquel', 'parabola', 'dragora'],
    
    // Безопасность
    'tails':       ['qubes', 'whonix', 'kali', 'parrot'],
    'qubes':       ['tails', 'whonix', 'kali'],
    
    // IoT
    'homeassistant': ['openhab', 'domoticz'],
    'anotterkiosk': ['raspberry-pi-os', 'debian']
  };

  var NAMES = {
    'ubuntu':'Ubuntu','mint':'Linux Mint','lmde':'LMDE','pop-os':'Pop!_OS','zorin':'Zorin OS',
    'elementary':'elementary OS','debian':'Debian','kali':'Kali Linux','parrot':'Parrot OS',
    'mxlinux':'MX Linux','antix':'antiX','puppy':'Puppy Linux','deepin':'Deepin',
    'raspberry-pi-os':'Raspberry Pi OS','kde-neon':'KDE Neon','lubuntu':'Lubuntu',
    'xubuntu':'Xubuntu','kubuntu':'Kubuntu','ubuntu-budgie':'Ubuntu Budgie',
    'ubuntu-mate':'Ubuntu MATE','ubuntu-studio':'Ubuntu Studio','avlinux':'AV Linux',
    'kde-linux':'KDE Linux','nebios':'NebiOS','anduinos':'AnduinOS','makulu-lindoz':'MakuluLinux LinDoz',
    'mx-moksha':'MX Moksha','bodhi':'Bodhi Linux','regolith':'Regolith Linux','kaisen':'Kaisen Linux',
    'nitrux':'Nitrux','rhino':'Rhino Linux','vanilla':'Vanilla OS','linuxlite':'Linux Lite',
    'vinari':'Vinari OS','fedora':'Fedora','almalinux':'AlmaLinux','rocky':'Rocky Linux',
    'centos-stream':'CentOS Stream','oracle-linux':'Oracle Linux','nobara':'Nobara','bazzite':'Bazzite',
    'fedora-silverblue':'Fedora Silverblue','fedora-kinoite':'Fedora Kinoite','fedora-coreos':'Fedora CoreOS',
    'asahi':'Fedora Asahi','hummingbird':'Fedora Hummingbird','ultramarine':'Ultramarine Linux',
    'vojtux':'Vojtux','arch':'Arch Linux','endeavouros':'EndeavourOS','manjaro':'Manjaro',
    'cachyos':'CachyOS','garuda':'Garuda Linux','steamos':'SteamOS','blackarch':'BlackArch',
    'archcraft':'Archcraft','rebornos':'RebornOS','blendos':'blendOS','noid':'Noid Linux',
    'agarimos':'AgarimOS','shanios':'ShaniOS','omega':'Omega Linux','elysiaos':'ElysiaOS',
    'kazeta':'Kazeta','porteus':'Porteus','chimera':'Chimera Linux','opensuse':'openSUSE',
    'microos':'openSUSE MicroOS','opensuse-aeon':'openSUSE Aeon','opensuse-kalpa':'openSUSE Kalpa',
    'gentoo':'Gentoo','void':'Void Linux','nixos':'NixOS','alpine':'Alpine Linux','slackware':'Slackware',
    'solus':'Solus','clear':'Clear Linux','pclinuxos':'PCLinuxOS','aerynos':'AerynOS','bedrock':'Bedrock Linux',
    'dragora':'Dragora','vendefoul':'Vendefoul Wolf','loss32':'Loss32','matrixos':'matrixOS',
    'enux':'ENux','origami':'Origami Linux','floppinux':'FLOPPINUX','calculate':'Calculate Linux',
    'rosa':'ROSA Linux','alt':'ALT Linux','astra':'Astra Linux','chimeraos':'ChimeraOS','batocera':'Batocera',
    'libreelec':'LibreELEC','nawaos':'NawaOS','truenas-scale':'TrueNAS SCALE','openmediavault':'OpenMediaVault',
    'proxmox':'Proxmox VE','easynas':'EasyNAS','rockstor':'Rockstor','xigmanas':'XigmaNAS','ovios':'OviOS',
    'openwrt':'OpenWrt','opnsense':'OPNsense','pfsense':'pfSense','ipfire':'IPFire','photon':'Photon OS',
    'ubuntu-core':'Ubuntu Core','postmarketos':'postmarketOS','ubuntu-touch':'Ubuntu Touch',
    'tinycore':'Tiny Core','slitaz':'SliTaz','parabola':'Parabola','trisquel':'Trisquel','pureos':'PureOS',
    'tails':'Tails','qubes':'Qubes OS','homeassistant':'Home Assistant OS','anotterkiosk':'AnotterKiosk'
  };

  document.addEventListener('DOMContentLoaded', function() {
    var path = window.location.pathname;
    var match = path.match(/\/distros\/([^/]+)\.html$/);
    if (!match) return;
    
    var slug = match[1];
    if (slug === 'index') return;
    var related = RELATED[slug];
    if (!related || related.length === 0) return;

    var main = document.querySelector('main.page');
    if (!main) return;

    var html = '<section class="similar-section" style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px dashed var(--border);">';
    html += '<h2 style="color: var(--accent);">Похожие дистрибутивы</h2>';
    html += '<div class="cards" style="margin-top: 1rem;">';
    
    related.slice(0, 4).forEach(function(relSlug) {
      var name = NAMES[relSlug];
      if (!name) return;
      html += '<article class="card">';
      html += '<img src="../icons/distros/' + relSlug + '.svg" class="distro-icon" alt="' + name + '" onerror="this.style.display=\'none\'">';
      html += '<h3>' + name + '</h3>';
      html += '<a href="' + relSlug + '.html">Подробнее →</a>';
      html += '</article>';
    });
    
    html += '</div></section>';
    main.insertAdjacentHTML('beforeend', html);
  });
})();