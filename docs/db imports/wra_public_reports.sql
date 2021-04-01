create table reports
(
    report_id      varchar default uuid_generate_v4() not null
        constraint reports_pk
            primary key,
    user_id        varchar
        constraint reports_users_user_id_fk
            references users,
    characteristic varchar,
    latitude       numeric,
    longitude      numeric,
    location       varchar,
    uploadtime     timestamp,
    description    varchar,
    photo          bytea
);

INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('4b235bbc-91aa-11eb-a8b3-0242ac130003', '40e6215d-b5c6-4896-987c-f30f3678f608', 'windy', 49.06651, 18.92399, 'Martin, Slovakia', '2021-03-29 16:35:48.000000', '', '-');
INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('8caae06a-91a9-11eb-a8b3-0242ac130003', '40e6215d-b5c6-4896-987c-f30f3678f608', 'sun', 49.22315, 18.73941, 'Žilina, Slovakia', '2021-03-28 13:10:25.000000', 'still sunny', '-');
INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('06222b9a-91ac-11eb-a8b3-0242ac130003', '3f333df6-90a4-4fda-8dd3-9485d27cee36', 'rain', 48.99839, 21.23393, 'Prešov, Slovakia', '2021-03-22 11:24:57.000000', 'heavy rain', '-');
INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('c6db62de-91ac-11eb-a8b3-0242ac130003', '3f333df6-90a4-4fda-8dd3-9485d27cee36', 'snow', 48.71395, 21.25808, 'Košice, Slovakia', '2021-03-18 09:04:21.000000', 'little snowflakes', '-');
INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('54da7728-91ad-11eb-a8b3-0242ac130003', '6ecd8c99-4036-403d-bf84-cf8400f67836', 'cloudy', 49.74747, 13.37759, 'Plzeň, Czech Republic', '2021-03-30 14:25:27.000000', 'dark clouds everywhere', '-');
INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('6d6b8e2e-f1a0-4b67-aff3-11739a06827a', '6ecd8c99-4036-403d-bf84-cf8400f67836', 'sun', 50.23271, 12.87117, 'Karlovy Vary, Czech Republic', '2021-03-30 17:37:22.000000', '', '-');
INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('8f10794c-e390-4470-a344-5f2068cccc21', 'f258267c-91a7-11eb-a8b3-0242ac130003', 'rain', 47.21725, -1.55336, 'Nantes, France', '2021-03-29 12:31:57.000000', 'light rain', '-');
INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('f89508ee-613c-4f3c-9e33-013ed7796864', 'f258267c-91a7-11eb-a8b3-0242ac130003', 'cloudy', 48.11198, -1.67429, 'Rennes, France', '2021-03-25 19:05:24.000000', '', '-');
INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('61c39541-50ba-4e63-b5ec-ecad5bcd81f6', '4aab1f50-91a8-11eb-a8b3-0242ac130003', 'sun', 41.85003, -87.65005, 'Chicago, United States', '2021-03-23 13:14:15.000000', 'dont forget sunglasses', '-');
INSERT INTO public.reports (report_id, user_id, characteristic, latitude, longitude, location, uploadtime, description, photo) VALUES ('70f87314-06a9-496b-a1f4-f8b1b53743b9', '4aab1f50-91a8-11eb-a8b3-0242ac130003', 'windy', 36.17497, -115.13722, 'Las Vegas, United States', '2021-03-31 15:54:47.000000', 'hold your hats', '-');