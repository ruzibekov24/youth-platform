# Yoshlar Base: Android (TWA)

PWA'ni (`https://yoshlarbase.vercel.app`) Android ilova sifatida ochadigan Trusted Web Activity.
Kod yo'q: `androidbrowserhelper` kutubxonasining `LauncherActivity` ishlatiladi. Sayt yangilansa, ilova ham yangilanadi.

## APK yig'ish

```bash
./gradlew assembleRelease
```

Natija: `app/build/outputs/apk/release/app-release.apk`. Yangi versiyada `app/build.gradle.kts` dagi `versionCode` ni oshiring.

## Imzolash kaliti (MUHIM)

- `keystore/yoshlarbase-release.jks` va `keystore.properties` gitda yo'q. Ularni xavfsiz joyda zaxiralang (parol menejeri yoki shifrlangan disk).
- Kalit yo'qolsa, o'rnatilgan ilovani yangilab bo'lmaydi; Google Play'da ham shu kalit kerak bo'ladi (yoki Play App Signing'ga yuklanadi).
- Kalitning SHA-256 barmoq izi saytdagi `web/app/.well-known/assetlinks.json/route.ts` da. Kalit almashsa, u yer ham yangilanadi, aks holda ilova tepasida brauzer paneli chiqadi.

## Tekshirish

- Paket: `uz.yoshlarbase.app`
- Asset Links: `https://yoshlarbase.vercel.app/.well-known/assetlinks.json`
