create table users
(
    user_id  varchar default uuid_generate_v4() not null
        constraint users_pkey
            primary key,
    email    varchar                            not null,
    password varchar                            not null,
    username varchar                            not null
);

INSERT INTO public.users (user_id, email, password, username) VALUES ('40e6215d-b5c6-4896-987c-f30f3678f608', 'ivanaslezakova1@gmail.com', '$2y$12$.TTx0cbgpMJAWI8SD5SO1eN.6JcuPj/eyxB5THlTqBuGiNin8GRk2', 'IvanaSlezakova');
INSERT INTO public.users (user_id, email, password, username) VALUES ('3f333df6-90a4-4fda-8dd3-9485d27cee36', 'peter.mraz@gmail.com', '$2y$12$MCyWyijBxLLtLlkBTyWdleRRt4x678Ak/kkLdcjzk.8KIE3gsZaCi', 'PeterMraz');
INSERT INTO public.users (user_id, email, password, username) VALUES ('6ecd8c99-4036-403d-bf84-cf8400f67836', 'holenajakub@gmail.com', '$2y$12$5kwdljbs9VGIKNEGXgtF5OU6RKKcGf/3POE8g6Y1TRqgwAYsPfpPW', 'JakubHolena');
INSERT INTO public.users (user_id, email, password, username) VALUES ('f258267c-91a7-11eb-a8b3-0242ac130003', 'jean.lavigne8@gmail.com', '$2y$12$5Pvz1ycInU0zOkwCZY4hdOPw1796FlGS1KtGqgt94ZCOcar9erTpG', 'JeanLavigne');
INSERT INTO public.users (user_id, email, password, username) VALUES ('4aab1f50-91a8-11eb-a8b3-0242ac130003', 'wattsonmarry92@gmail.com', '$2y$12$A2SrJtG8LutmaPBKO0/a/.S2jCDWZVL1QUE7h26rQnYiPiU8UNOJu', 'MarryWattson');
INSERT INTO public.users (user_id, email, password, username) VALUES ('015b7f08-d9d8-4085-93ac-c0bf2894f284', 'johndoe1617211275969@gmail.com', '$2a$10$XgPQiPYLHt1G18greb8lRuLFdMt6Q65C.FmH.zrticEjJMovtu/dm', 'JohnDoe1617211275969');
INSERT INTO public.users (user_id, email, password, username) VALUES ('eec54a8d-6203-49cf-97ef-51181de53cc5', 'johndoe1617211418804@gmail.com', '$2a$10$DyW6NgA62fwGTnrMXKYN7ugoH1JXVwmOCfjpsxKuOydWKsYJuWWs6', 'JohnDoe1617211418804');
INSERT INTO public.users (user_id, email, password, username) VALUES ('86518766-5fce-4983-8889-d3296abee4c1', 'johndoe1617211471954@gmail.com', '$2a$10$75Rv7ExGI200pi/.1FUFLefibRDA3CGcvoqE/1eQ.cmQVSo./oCIK', 'JohnDoe1617211471954');
INSERT INTO public.users (user_id, email, password, username) VALUES ('18f4f12e-0862-44ce-8e58-f7532edcc4b4', 'johndoe1617211599330@gmail.com', '$2a$10$P2VPXmjOhiN5AzBeN8yI3utPSpHLNVhgD3eIqP6KXtwzw3NniUoSy', 'JohnDoe1617211599330');