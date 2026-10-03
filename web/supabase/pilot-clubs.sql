-- Pilot klublar shabloni (Speaking Club va Startuper klub). HOZIRCHA ISHGA TUSHIRILMAGAN.
-- Ishga tushirishdan oldin pastdagi TODO qiymatlarini toʻldiring (kun, vaqt, havola, yosh guruhi),
-- keyin Supabase SQL Editor'da bajaring. Haqiqiy klub: is_sample = false.
-- Namunaviy klublarni oʻchirish: delete from clubs where is_sample;

do $$
declare
  c record;
  club_id uuid;
  w int;
  topics text[];
begin
  for c in
    select * from (values
      -- slug, nom, tavsif, tashkilotchi, jadval matni, boshlanish sanasi, soat (Toshkent), yosh guruhi, havola, mavzular
      (
        'speaking-club', 'Speaking Club',
        'Haftalik ingliz tilida erkin suhbat: 4 hafta, doimiy guruh, oxirida har kim 3 daqiqalik nutq so''zlaydi.',
        'TODO: yetakchi ismi', 'TODO: har ... kuni, ...:00',
        date '2099-01-01',            -- TODO: boshlanish sanasi (1-uchrashuv kuni)
        time '20:00',                  -- TODO: soat (Toshkent vaqti)
        null::text,                    -- TODO: 'under18' yoki 'adult'
        'TODO: Google Meet / Telegram havola',
        array['Tanishuv, qoidalar, maqsadlar', 'Kundalik mavzular: juftliklarda suhbat', 'Fikringni asosla: mini-munozara', 'Demo Day: har kim 3 daqiqalik nutq']
      ),
      (
        'startuper-klub', 'Startuper klub',
        'G''oyadan jamoagacha: 4 haftada muammo topasiz, tekshirasiz, jamoa yig''asiz va Demo Day''da ko''rsatasiz.',
        'TODO: yetakchi ismi', 'TODO: har ... kuni, ...:00',
        date '2099-01-01',            -- TODO: boshlanish sanasi
        time '20:00',                  -- TODO: soat
        null::text,                    -- TODO: 'under18' yoki 'adult'
        'TODO: Google Meet / Telegram havola',
        array['Muammolar: atrofdan 1 ta haqiqiy muammo', 'Tekshirish: 3 ta odam bilan suhbat', 'Jamoalar: rollar va birinchi qadam', 'Demo Day: jamoalar 3 daqiqada ko''rsatadi']
      )
    ) as t(slug, name, descr, organizer, schedule_text, starts_on, at_time, age_group, link, topics)
  loop
    insert into clubs (slug, name, description, organizer, schedule_text, is_sample, seats, min_to_start, cycle_weeks, starts_on, age_group)
    values (c.slug, c.name, c.descr, c.organizer, c.schedule_text, false, 10, 5, 4, c.starts_on, c.age_group)
    returning id into club_id;

    topics := c.topics;
    for w in 1..4 loop
      insert into club_sessions (club_id, starts_at, place_or_link, topic, kind)
      values (
        club_id,
        ((c.starts_on + (w - 1) * 7) + c.at_time) at time zone 'Asia/Tashkent',
        c.link,
        topics[w],
        case when w = 4 then 'demo' else 'regular' end
      );
    end loop;
  end loop;
end $$;
