document.addEventListener('DOMContentLoaded', function () {
  var path = window.location.pathname;
  var file = path.substring(path.lastIndexOf('/') + 1);
  var name = file.replace('.html', '');
  var themes = ['debian','ubuntu','mint','pop-os','zorin','elementary','kali','parrot','mxlinux','antix','puppy','lubuntu','xubuntu','kubuntu','deepin','raspberry-pi-os','fedora','almalinux','rocky','centos-stream','oracle-linux','arch','manjaro','endeavouros','cachyos','garuda','steamos','blackarch','opensuse','gentoo','slackware','void','nixos','alpine','tails','qubes','kde-neon','ubuntu-budgie','ubuntu-mate','ubuntu-studio','fedora-silverblue','fedora-kinoite','microos','archcraft','regolith','vanilla','blendos','bodhi','pclinuxos','rosa','alt','astra','calculate','solus','clear','kaisen','nitrux','rhino','lmde','nobara','bazzite','chimeraos','batocera','libreelec','truenas-scale','openmediavault','proxmox','openwrt','opnsense','pfsense','fedora-coreos','photon','ubuntu-core','postmarketos','ubuntu-touch','tinycore','slitaz','parabola','trisquel','pureos','artix','rebornos','nebios','aerynos','kde-linux','anduinos','makulu-lindoz','mx-moksha','avlinux','origami','noid','agarimos','matrixos','hummingbird','ultramarine','shanios','omega','floppinux','vojtux','vinari','elysiaos','vendefoul','loss32','exe','bedrock','gobolinux','chimera','ovios','dragora','4mlinux','linuxlite','zorinlite','porteus','easynas','rockstor','xigmanas','homeassistant','ipfire','kazeta','nawaos','enux','asahi','anotterkiosk'];
  if (themes.indexOf(name) !== -1) {
    document.body.classList.add('theme-' + name);
  }
});
