-- Ixtiyoriy Telegram username: foydalanuvchi o'zi /username bilan kiritadi.
-- Faqat MIYA'da o'zaro qabuldan keyin ikkinchi tomonga bot xabarida ko'rsatiladi. Akkaunt bilan birga o'chadi.
alter table users add column telegram_username text
  check (telegram_username ~ '^[A-Za-z][A-Za-z0-9_]{4,31}$');
