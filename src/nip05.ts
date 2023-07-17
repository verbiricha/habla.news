export const names = {
  _: "7d4e04503ab26615dd5f29ec08b52943cbe5f17bacc3012b26220caa232ab14c",
  verbiricha:
    "7fa56f5d6962ab1e3cd424e758c3002b8665f7b0d8dcee9fe9e288d7751ac194",
  tony: "7f5c2b4e48a0e9feca63a46b13cdb82489f4020398d60a2070a968caa818d75d",
  moon: "5df413d4c5e5035ff508fd99b38b21ea9a0ac0b9ecc34f3312aba9aa2add4f5b",
  dergigi: "6e468422dfb74a5738702a8823b9b28168abab8655faacb6853cd0ee15deee93",
  corndalorian:
    "f8e6c64342f1e052480630e27e1016dce35fc3a614e60434fef4aa2503328ca9",
  nostreport:
    "2edbcea694d164629854a52583458fd6d965b161e3c48b57d3aff01940558884",
  everexpanding:
    "c9dccd5fbf13605415deb3ca03e9154cd77000f3fb1d98361e5cda4edce00d9a",
  nout: "deba271e547767bd6d8eec75eece5615db317a03b07f459134b03e7236005655",
  sperry: "11d0b66747887ba9a6d34b23eb31287374b45b1a1b161eac54cb183c53e00ef7",
  sikto: "50c59a1cb233d08d5a1fb493f520c6b5d7f77a2ba42e4666801a3e366b0a027e",
  gigabtc: "4d0068338af5ee79c06513deaaf02492247bbf7abd29f116e6e50c158ab6a677",
  xanny: "f0ff87e7796ba86fc84b4807b25a5dee206d724c6f61aa8853975a39deeeff58",
  gzuuus: "40b9c85fffeafc1cadf8c30a4e5c88660ff6e4971a0dc723d5ab674b5e61b451",
  quentin: "89e14be49ed0073da83b678279cd29ba5ad86cf000b6a3d1a4c3dc4aa4fdd02c",
  jonb: "35a8f9c0272c119a620f47c055c8db39e9f805fef1b22d0b7a42b189351dae66",
  karnage: "1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411",
  herald: "7e7224cfe0af5aaf9131af8f3e9d34ff615ff91ce2694640f1f1fee5d8febb7d",
  devstr: "700d3de34b2929478652de1a41738ea4b3589831a76d1adfc612bd6f2529fd22",
  jb55: "32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245",
  gek: "693c2832de939b4af8ccd842b17f05df2edd551e59989d3c4ef9a44957b2f1fb",
  ttdr: "5ada3677187ff024a3cea797e89e1cc8b69f6099a40a6b8f644d3b027c21c9db",
  blowater: "6b9da920c4b6ecbf2c12018a7a2d143b4dfdf9878c3beac69e39bb597841cc6e",
  freakoverse:
    "3cea4806b1e1a9829d30d5cb8a78011d4271c6474eb31531ec91f28110fe3f40",
  opensats: "787338757fc25d65cd929394d5e7713cf43638e8d259e8dcf5c73b834eb851f2",
  nvk: "e88a691e98d9987c964521dff60025f60700378a4879180dcbbb4a5027850411",
  fiatjaf: "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d",
  lou: "18e3af1edeecb70542eb7e000cf5c43ea0d6d3b79ebb64c8e2c98b341d42e5df",
  newton: "c31e22c3715c1bde5608b7e0d04904f22f5fc453ba1806d21c9f2382e1e58c6c",
  guyswann: "b9e76546ba06456ed301d9e52bc49fa48e70a6bf2282be7a1ae72947612023dc",
};

export const featured = ["dergigi", "herald", "nostreport"];

const pubkeyToHandle = Object.entries(names).reduce((acc, item) => {
  const [k, v] = item;
  return { ...acc, [v]: k };
}, {});

export function getHandles() {
  return Object.keys(names).filter((h) => h !== "_");
}

export function getPubkey(handle) {
  return names[handle];
}

export function getHandle(pubkey) {
  return pubkeyToHandle[pubkey];
}
