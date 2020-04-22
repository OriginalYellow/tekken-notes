CREATE TABLE public.move (
    id integer NOT NULL,
    name text NOT NULL,
    startup_frames integer NOT NULL,
    on_block text NOT NULL,
    on_hit text NOT NULL,
    on_counterhit text NOT NULL,
    button_input text NOT NULL,
    note_text text,
    created_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.move_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.move_id_seq OWNED BY public.move.id;
CREATE TABLE public."user" (
    id integer NOT NULL,
    last_seen timestamp with time zone DEFAULT now(),
    auth0_id text NOT NULL
);
CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
ALTER TABLE ONLY public.move ALTER COLUMN id SET DEFAULT nextval('public.move_id_seq'::regclass);
ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
ALTER TABLE ONLY public.move
    ADD CONSTRAINT move_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_auth0_id_key UNIQUE (auth0_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_id_key UNIQUE (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (auth0_id);
ALTER TABLE ONLY public.move
    ADD CONSTRAINT move_created_by_fkey FOREIGN KEY (created_by) REFERENCES public."user"(auth0_id) ON UPDATE RESTRICT ON DELETE RESTRICT;
