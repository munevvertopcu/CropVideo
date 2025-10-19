# CropVideoApp

Bu proje, galeriden video seçip 5 saniyelik bir bölümünü kırparak başlık/açıklama ile kaydetmenizi sağlayan bir Expo + React Native uygulamasıdır. Android ve iOS’ta kırpma desteklenir; Web’de arayüz çalışsa da kırpma işlemi desteklenmez.

## Kurulum ve Çalıştırma

1) Bağımlılıkları yükleyin

```
npm install
```

2) Platform seçin

- Android: `npx expo run:android`
- iOS (macOS): `npx expo run:ios`

İlk çalıştırmada galeri/medya izinlerini onaylayın; aksi halde video seçimi/kırpma çalışmaz.

## Özellikler

- Video seç (galeri)
- 5 saniyelik aralık seçerek kırp
- Başlık/açıklama ekle ve kaydet
- Listele, detayını gör, düzenle/sil

## Kullanılan Teknolojiler

- Expo Router (dosya tabanlı yönlendirme)
- NativeWind (Tailwind sınıfları)
- Zustand + AsyncStorage (kalıcı durum) — `store/useVideoStore.ts`
- React Query (işlem durumları)
- expo-video, expo-image-picker, expo-video-thumbnails, expo-trim-video
- react-native-reanimated, react-native-gesture-handler



