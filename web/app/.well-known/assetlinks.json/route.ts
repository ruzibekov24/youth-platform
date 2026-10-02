// Digital Asset Links: Android ilova (TWA) shu saytga tegishli ekanini tasdiqlaydi,
// shunda ilova brauzer panelisiz to'liq ekranda ochiladi. Barmoq izi ochiq ma'lumot (sir emas).
const ANDROID_APPS = [
  {
    package_name: "uz.yoshlarbase.app",
    sha256_cert_fingerprints: [
      "2A:D8:D9:81:D6:CA:AC:0F:13:C7:70:4A:4B:82:EB:85:6D:ED:7A:D2:60:23:2C:77:A8:D3:94:5D:F1:3A:F1:9D",
    ],
  },
];

export function GET() {
  return Response.json(
    ANDROID_APPS.map((app) => ({
      relation: ["delegate_permission/common.handle_all_urls"],
      target: { namespace: "android_app", ...app },
    })),
  );
}
