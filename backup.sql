--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+2)
-- Dumped by pg_dump version 16.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Book" (
    id integer NOT NULL,
    author text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    title text NOT NULL,
    "imageUrl" text,
    description text,
    publisher text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Book" OWNER TO postgres;

--
-- Name: Book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Book_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Book_id_seq" OWNER TO postgres;

--
-- Name: Book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Book_id_seq" OWNED BY public."Book".id;


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL,
    "recipeId" integer NOT NULL
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO postgres;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "recipientId" text
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Movie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Movie" (
    id integer NOT NULL,
    title text NOT NULL,
    director text,
    "releaseDate" timestamp(3) without time zone,
    "imageUrl" text,
    description text,
    genre text,
    "viewedDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    "userId" text NOT NULL
);


ALTER TABLE public."Movie" OWNER TO postgres;

--
-- Name: MovieReview; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MovieReview" (
    id integer NOT NULL,
    "movieId" integer NOT NULL,
    review text NOT NULL,
    rating integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."MovieReview" OWNER TO postgres;

--
-- Name: MovieReview_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MovieReview_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MovieReview_id_seq" OWNER TO postgres;

--
-- Name: MovieReview_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MovieReview_id_seq" OWNED BY public."MovieReview".id;


--
-- Name: Movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Movie_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Movie_id_seq" OWNER TO postgres;

--
-- Name: Movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Movie_id_seq" OWNED BY public."Movie".id;


--
-- Name: NutritionalValue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NutritionalValue" (
    id integer NOT NULL,
    "recipeId" integer NOT NULL,
    calories double precision NOT NULL,
    protein double precision NOT NULL,
    carbs double precision NOT NULL,
    fats double precision NOT NULL,
    fiber double precision,
    sugar double precision,
    sodium double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."NutritionalValue" OWNER TO postgres;

--
-- Name: NutritionalValue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."NutritionalValue_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."NutritionalValue_id_seq" OWNER TO postgres;

--
-- Name: NutritionalValue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."NutritionalValue_id_seq" OWNED BY public."NutritionalValue".id;


--
-- Name: Rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Rating" (
    id integer NOT NULL,
    value integer NOT NULL,
    "userId" text NOT NULL,
    "recipeId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Rating" OWNER TO postgres;

--
-- Name: Rating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Rating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Rating_id_seq" OWNER TO postgres;

--
-- Name: Rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Rating_id_seq" OWNED BY public."Rating".id;


--
-- Name: Recipe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Recipe" (
    id integer NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ingredients text[],
    "userId" text NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "imageUrl" text
);


ALTER TABLE public."Recipe" OWNER TO postgres;

--
-- Name: Recipe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Recipe_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Recipe_id_seq" OWNER TO postgres;

--
-- Name: Recipe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Recipe_id_seq" OWNED BY public."Recipe".id;


--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id integer NOT NULL,
    "bookId" integer NOT NULL,
    review text NOT NULL,
    rating integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: Review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Review_id_seq" OWNER TO postgres;

--
-- Name: Review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Review_id_seq" OWNED BY public."Review".id;


--
-- Name: TBRBook; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TBRBook" (
    id integer NOT NULL,
    title text NOT NULL,
    "addedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."TBRBook" OWNER TO postgres;

--
-- Name: TBRBook_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TBRBook_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TBRBook_id_seq" OWNER TO postgres;

--
-- Name: TBRBook_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TBRBook_id_seq" OWNED BY public."TBRBook".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    bio text,
    "favoriteGenre" text,
    location text,
    theme text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Book id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book" ALTER COLUMN id SET DEFAULT nextval('public."Book_id_seq"'::regclass);


--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: Movie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie" ALTER COLUMN id SET DEFAULT nextval('public."Movie_id_seq"'::regclass);


--
-- Name: MovieReview id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieReview" ALTER COLUMN id SET DEFAULT nextval('public."MovieReview_id_seq"'::regclass);


--
-- Name: NutritionalValue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NutritionalValue" ALTER COLUMN id SET DEFAULT nextval('public."NutritionalValue_id_seq"'::regclass);


--
-- Name: Rating id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating" ALTER COLUMN id SET DEFAULT nextval('public."Rating_id_seq"'::regclass);


--
-- Name: Recipe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe" ALTER COLUMN id SET DEFAULT nextval('public."Recipe_id_seq"'::regclass);


--
-- Name: Review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review" ALTER COLUMN id SET DEFAULT nextval('public."Review_id_seq"'::regclass);


--
-- Name: TBRBook id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TBRBook" ALTER COLUMN id SET DEFAULT nextval('public."TBRBook_id_seq"'::regclass);


--
-- Data for Name: Book; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Book" (id, author, date, title, "imageUrl", description, publisher, "createdAt", "userId") FROM stdin;
2	Yukio Mishima	2025-03-23 00:00:00	Nieve de primavera	http://books.google.com/books/content?id=0LBIYgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	\N	\N	2025-04-15 09:32:24	100100111960712152494
4	Ursula K. Le Guin	2025-04-20 00:00:00	Un mago de Terramar (Historias de Terramar 1)	http://books.google.com/books/content?id=P79WEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	\N	\N	2025-04-20 14:12:36.834	100100111960712152494
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, content, "createdAt", "userId", "recipeId") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "senderId", content, "timestamp", "recipientId") FROM stdin;
\.


--
-- Data for Name: Movie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Movie" (id, title, director, "releaseDate", "imageUrl", description, genre, "viewedDate", "createdAt", "updatedAt", "userId") FROM stdin;
1	Nosferatu	Robert Eggers	2024-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BY2FhZGE3NmEtNWJjOC00NDI1LWFhMTQtMjcxNmQzZmEwNGIzXkEyXkFqcGc@._V1_SX300.jpg	\N	\N	2024-12-29 00:00:00	2025-04-15 09:32:56.201	2025-04-15 09:32:56.201	100100111960712152494
2	Corpse Bride	Tim Burton	2005-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BMTk1MTY1NjU4MF5BMl5BanBnXkFtZTcwNjIzMTEzMw@@._V1_SX300.jpg	\N	\N	2025-01-11 00:00:00	2025-04-15 09:34:16.967	2025-04-15 09:34:16.967	100100111960712152494
3	Subservience	S. K. Dale	2024-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BMjdlNjNlODEtYjA1OS00MDgzLWJiNTMtMDVlMWMyOGM5ZDhkXkEyXkFqcGc@._V1_SX300.jpg	\N	\N	2025-01-05 00:00:00	2025-04-15 09:34:54.596	2025-04-15 09:34:54.596	100100111960712152494
4	American Beauty	Sam Mendes	1999-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BMDI1MDE0OTMtMmI2MS00Yjc2LTg2MTItMWExYTg5NzA1OGUzXkEyXkFqcGc@._V1_SX300.jpg	\N	\N	2025-01-06 00:00:00	2025-04-15 09:35:13.715	2025-04-15 09:35:13.715	100100111960712152494
5	Transformers: Age of Extinction	Michael Bay	2014-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BMjEwNTg1MTA5Nl5BMl5BanBnXkFtZTgwOTg2OTM4MTE@._V1_SX300.jpg	\N	\N	2025-01-12 00:00:00	2025-04-15 09:35:43.505	2025-04-15 09:35:43.505	100100111960712152494
6	Transformers: The Last Knight	Unknown Director	2017-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BYWNlNjU3ZTItYTY3Mi00YTU1LTk4NjQtYjQ3MjFiNjcyODliXkEyXkFqcGc@._V1_SX300.jpg	\N	\N	2025-01-15 00:00:00	2025-04-15 09:36:04.735	2025-04-15 09:36:04.735	100100111960712152494
7	The Suicide Squad	James Gunn	2021-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BMWU3Y2NlZmEtMjJjNS00ZWMxLWE1MzctYWYyMjMzMDdkNTE4XkEyXkFqcGc@._V1_SX300.jpg	\N	\N	2025-01-14 00:00:00	2025-04-15 09:36:49.314	2025-04-15 09:36:49.314	100100111960712152494
8	Boy Kills World	Moritz Mohr	2023-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BODMxNjFlMzYtYjg4NC00ZjIxLWIxODgtMDMxY2ViNTI1NDFlXkEyXkFqcGc@._V1_SX300.jpg	\N	\N	2025-01-16 00:00:00	2025-04-15 09:37:29.173	2025-04-15 09:37:29.173	100100111960712152494
9	The Substance	Coralie Fargeat	2024-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BZDQ1NGE5MGMtYzdlZC00ODExLWJlMDMtNWU4NjA5OWYwMDEwXkEyXkFqcGc@._V1_SX300.jpg	\N	\N	2025-01-17 00:00:00	2025-04-15 09:38:12.375	2025-04-15 09:38:12.375	100100111960712152494
10	Final Fantasy VII: Advent Children	Tetsuya Nomura, Takeshi Nozue	2005-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BMzc3MDg5ZjQtYjZmOS00NWQzLWFjMjAtNzI0NDJhYWE0OWY0XkEyXkFqcGc@._V1_SX300.jpg	\N	\N	2025-01-25 00:00:00	2025-04-15 09:39:02.035	2025-04-15 09:39:02.035	100100111960712152494
11	Pacific Rim	Guillermo del Toro	2013-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BMTY3MTI5NjQ4Nl5BMl5BanBnXkFtZTcwOTU1OTU0OQ@@._V1_SX300.jpg	\N	\N	2025-04-04 00:00:00	2025-04-15 09:39:50.05	2025-04-15 09:39:50.05	100100111960712152494
12	White Chicks	Keenen Ivory Wayans	2004-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BMTY3OTg2OTM3OV5BMl5BanBnXkFtZTYwNzY5OTA3._V1_SX300.jpg	\N	\N	2025-04-12 00:00:00	2025-04-15 09:40:29.188	2025-04-15 09:40:29.188	100100111960712152494
13	The Men Who Stare at Goats	Grant Heslov	2009-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BMjIwOTQwNzg1MV5BMl5BanBnXkFtZTcwODc4MDU4Mg@@._V1_SX300.jpg	\N	\N	2025-04-12 00:00:00	2025-04-15 09:41:03.078	2025-04-15 09:41:03.078	100100111960712152494
14	The Dictator	Larry Charles	2012-01-01 00:00:00	https://m.media-amazon.com/images/M/MV5BM2IwMDM3ZmQtNjQ3NS00OTFiLWI5YzEtYWE3YjI5NTk3YzkwXkEyXkFqcGc@._V1_SX300.jpg	\N	\N	2025-04-13 00:00:00	2025-04-15 09:41:35.6	2025-04-15 09:41:35.6	100100111960712152494
\.


--
-- Data for Name: MovieReview; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MovieReview" (id, "movieId", review, rating, "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: NutritionalValue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NutritionalValue" (id, "recipeId", calories, protein, carbs, fats, fiber, sugar, sodium, "createdAt") FROM stdin;
2	2	700	12	100	20	3	1.5	1000	2025-04-15 11:22:31.058
3	3	950	14	120	45	14	38	500	2025-04-15 13:02:36.31
4	4	460	38	24	15	3	5	450	2025-04-15 13:26:45.729
5	5	0	0	0	0	\N	\N	\N	2025-04-20 16:01:19.014
\.


--
-- Data for Name: Rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Rating" (id, value, "userId", "recipeId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Recipe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Recipe" (id, title, category, description, "createdAt", ingredients, "userId", "isPublic", "imageUrl") FROM stdin;
2	Focaccia tradicional Italiana (para 2 personas)	Snacks	1. Preparar la masa\nDisuelve la levadura en el agua templada con el azúcar. En un bol, mezcla la harina con la sal fina. Agrega el agua con levadura y mezcla bien. Añade los 20 ml de aceite. Amasa hasta tener una masa suave y elástica (8-10 min a mano o con amasadora).\n\n2. Primer levado\nCubre con film o paño húmedo. Deja reposar 1 hora a temperatura ambiente hasta que duplique su volumen.\n\n3. Formado\nEngrasa una bandeja pequeña o sartén de hierro. Vuelca la masa y estírala con los dedos hasta cubrir la base (unos 1.5–2 cm de grosor). Deja reposar 20 minutos.\n\n4. Hendiduras y salmuera\nPresiona con los dedos para hacer las clásicas hendiduras. Mezcla los ingredientes de la salmuera y viértela sobre la superficie, asegurándote de que se introduzca en los huecos. Espolvorea con sal gruesa.\n\n5. Segundo levado\nDeja reposar 20–30 minutos más. Mientras, precalienta el horno a 230 °C con calor arriba y abajo.\n\n6. Horneado\nHornea entre 15–18 minutos hasta que esté dorada, crujiente por fuera y tierna por dentro. Al salir del horno, pincela con más AOVE si deseas un acabado brillante.\n\n* Hornear  en el nivel inferior-medio (una rejilla por debajo del centro del horno)\n\n\n\n*Espolvorea Grana Padano en polvo de forma uniforme.\n\n*Añade una pizca de orégano seco sobre el queso.\n\n*Deja reposar 5 minutos para que el queso se funda ligeramente con el vapor y se adhiera.	2025-04-15 11:22:31.058	{"Harina de trigo tipo 00 o harina de fuerza: 200 g","Agua templada: 130 ml","Levadura fresca: 5 g","Sal fina: 4 g","Aceite de oliva virgen extra: 20 ml (masa) + extra para engrasar y pincelar","Azúcar: 2 g (facilita la fermentación no es para el sabor))","Salmuera final:Agua: 20 ml Aceite de oliva virgen extra: 10 ml Sal gruesa o en escamas: al gusto","Acabado:  Grana Padano en polvo (al gusto) Orégano seco (pizca fina)"}	100100111960712152494	t	https://res.cloudinary.com/dzrfr28xv/image/upload/v1744716148/recipe_images/hymmnifdt597qwhvatlr.jpg
3	Berry Breakfast Crumble Bars 	Snacks	1 - Preheat your oven 180ºC\n2 - Place you dry ingredients in a large cooking bowl (oats, flax seeds, flour, baking powder, salt and cinnamon)\n3 - Melt some coconut oil and transfer it to the dry ingredients with the apple sauce, vanilla extract and white vinegar\n4 - Mix and then put 3/4 of the mix into the baking pan, smash it with your hands\n5 - For the filling cook the berries with lemon, maple syrup and corn starch mixedx with water, cook it 2-3 min\n6 - Add the hot filling straigh into the oats\n7 - Crumble the last mix into the top and cook in the oven 30 minutes!	2025-04-15 13:02:36.31	{"180 g quick cooking oats","1 ½ tbsp ground flax seeds","60 g all-purpose flour","1 tsp baking powder","½ tsp salt","¼ tsp cinnamon","50 g melted coconut oil","2 ½ tbsp applesauce","1 tsp vanilla extract (or a few drops vanilla aroma)","3 tbsp maple syrup","1 tbsp white wine vinegar","210 g frozen raspberries","1 tbsp lemon juice","2 tbsp maple syrup","1 tsp cornstarch mixed into 3 tbsp water"}	100100111960712152494	t	https://res.cloudinary.com/dzrfr28xv/image/upload/v1744723253/recipe_images/fmofrbaw3ii5izrkl3ed.jpg
4	Carrillera Petra	Salt Dishes	1. Preparar las carrilleras\nSalpimienta las carrilleras por ambos lados.\n\nPásalas por harina o maicena para sellarlas mejor durante la fritura.\n\nFríelas en aceite caliente en una sartén. Márcalas bien por ambos lados hasta que estén doradas.\n\nRetíralas y resérvalas.\n\n2. Sofrito de verduras\nEn la olla (preferiblemente express o de cocción lenta), añade un poco de aceite de oliva.\n\nSofríe primero los puerros cortados en rodajas finas.\n\nLuego añade las zanahorias, pimiento verde y pimiento rojo, todos cortados pequeños.\n\nIncorpora los ajos laminados o picados finos.\n\nCocina todo a fuego medio, removiendo con frecuencia, hasta que las verduras estén bien pochadas y blanditas.\n\n3. Añadir el tomate\nPela un tomate maduro, tritúralo y agrégalo al sofrito.\n\nCocina unos minutos más, removiendo, para integrar bien el sabor.\n\nAñade sal al gusto.\n\n4. Integrar las carrilleras\nDevuelve las carrilleras a la olla con las verduras.\n\nMézclalo todo bien durante 1–2 minutos para que se integren los sabores.\n\n5. Liquido y cocción\nAñade 350 ml de vino tinto y remueve para desglasar.\n\nDespués, vierte 400 ml de agua o caldo de carne (puedes usar solo agua como en la receta original).\n\nAgrega una ramita de romero o una pizca si es seco.\n\nTapa la olla.\n\n6. Cocción final\nSi usas olla exprés, cocina durante 50 minutos desde que sube la válvula.\n\nSi es olla tradicional, cocina a fuego medio-bajo durante 1 hora y media, o hasta que la carne esté muy tierna.\n\n📝 Consejos:\nPuedes triturar parte del sofrito al final para obtener una salsa más fina, o dejarla rústica.\n\nIdeal servir con puré de patata, arroz blanco o pan casero para mojar.	2025-04-15 13:26:45.729	{"Carrilleras de cerdo (cantidad al gusto)",sal,"pimienta negra","harina o maicena","aceite de oliva","2 puerros","2 zanahorias","1 pimiento verde","1 pimiento rojo","3 dientes de ajo","1 tomate maduro","350 ml de vino tinto","400 ml de agua o caldo de carne","romero seco o fresco"}	100100111960712152494	t	\N
5	Mabon Buttermilk Bread	Snacks	1. Mezclar la leche de soja con el zumo de limón. Dejar reposar 10 minutos hasta que se corte ligeramente (reacción ácida).\n2. En un bowl grande, mezclar harina, bicarbonato, sal, azúcar y especias. Agregar la fruta deshidratada y mezclar bien para que se recubra con la harina (evita que se hunda en la masa).\n3. Añadir el "buttermilk" vegetal y mezclar con cuchara o espátula hasta obtener una masa suave, un poco pegajosa. Evitar amasar en exceso.\n4. Formar una bola o pan redondo y colocar sobre una bandeja de horno con papel vegetal. Hacer una cruz profunda (1–2 cm) en la superficie con un cuchillo bien afilado (ayuda a la cocción uniforme).\n5. Precalentamiento: 180ºC durante 15 minutos antes de hornear. calor arriba y abajo, sin ventilador, para evitar que se seque demasiado por dentro.\n6. 35–40 minutos o hasta que al insertar un palillo salga limpio.\n\n* Golpea suavemente la base del pan al sacarlo; si suena hueco, está listo.	2025-04-20 16:01:19.014	{"3 ½ tazas de harina de fuerza (aprox. 450 g)","500 ml de leche de soja","2 cucharadas de zumo de limón","1 cucharadita colmada de bicarbonato de sodio","½ cucharadita de sal (potencia los sabores)","2 cucharadas de azúcar o miel (opcional","para equilibrio dulce)","1 taza de fruta deshidratada","1 cucharadita de canela o especias otoñales (opcional)"}	100100111960712152494	t	\N
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, "bookId", review, rating, "createdAt", "userId") FROM stdin;
1	4	Una historia que me ha atrapado desde la primera página. Literatura fantástica clásica. Muy bueno.	5	2025-04-20 14:48:38.013	100100111960712152494
\.


--
-- Data for Name: TBRBook; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TBRBook" (id, title, "addedAt", "userId") FROM stdin;
1	Los hijos del Grial - Peter Berling	2025-04-15 09:42:35.307	100100111960712152494
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, image, "createdAt", bio, "favoriteGenre", location, theme) FROM stdin;
100100111960712152494	Marta P.	marpreal97@gmail.com	https://lh3.googleusercontent.com/a/ACg8ocI2G6ppgbCGFLflJi1QyBWOslqJ3FQfCPfYs8L22rweoEdWBAQ8=s96-c	2025-04-15 09:29:34.364	\N	\N	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3e61a82b-8189-4d94-9dd4-869a25342c2e	17e76dbf8691cc2cdb0d677ff7ad4ecb280e79b69c4bf20d39367fe8ebdc50cb	2025-04-15 09:25:10.63903+00	20250224112213_add_private_messages	\N	\N	2025-04-15 09:25:09.683353+00	1
3cfdc357-3fad-46a1-8fea-7d8c234dfe86	b2f22f9778134eb9bd947d9516421ac68a954da45c6fb2abffe6d64e2512a066	2025-04-15 09:24:40.293189+00	20241223084605_add_user_book_models	\N	\N	2025-04-15 09:24:39.40146+00	1
d2811619-31e8-4f0a-a98b-f2c2e2111fa3	28a7af8ed5e07e6eb845876ab87517fedb3b20f14036a88cf55485dac8be117d	2025-04-15 09:24:59.063955+00	20250207082659_add_users_and_auth	\N	\N	2025-04-15 09:24:58.005832+00	1
33bcabd6-2f2d-4ec1-a112-712df55347b9	00d20a2d91ab0d3ac1d1d1179036ff7383f9b6470ee8b44fb673cb045a88b4bc	2025-04-15 09:24:41.691421+00	20241223095304_remove_user_relation	\N	\N	2025-04-15 09:24:40.699605+00	1
7127ed16-58fb-4b18-a112-258a71eb29e7	7ceb242cd0fa71f2c67dbc44a88fce2a2a63f166c7143ecdc3d26e513fd4eec2	2025-04-15 09:24:43.189661+00	20241223124113_add_date_to_book	\N	\N	2025-04-15 09:24:42.132813+00	1
4a7e98bf-35f4-4353-871a-8ffea4bb5b6a	0833e0c04e600edbfb58649e8a3ebb9f8cf99da03f167afdf56acd41f195f60d	2025-04-15 09:24:44.623372+00	20241224070734_add_image_url_to_book	\N	\N	2025-04-15 09:24:43.579084+00	1
429f1213-2809-43a6-8b2c-0f97e8ceef2a	4510ade106a3084490b909280897f95ff097cc05e2888c8a79344d8071e5a888	2025-04-15 09:25:00.583055+00	20250210171346_use_uuid_for_userid	\N	\N	2025-04-15 09:24:59.439382+00	1
08668dfc-3396-4d1e-8dd7-98438cc6a677	551e77805a998bdc121963c9fefc0987f5eaa389bfe62878d50fcb6390005900	2025-04-15 09:24:46.057178+00	20241224102220_add_reviews_model	\N	\N	2025-04-15 09:24:45.034149+00	1
3ff4f95c-e327-404b-94cc-73da73007823	84ba6c19bdb676040d5633b2b590aebc18f3fc6a9b10ef223560df4aceb4e541	2025-04-15 09:24:47.490838+00	20241229133305_	\N	\N	2025-04-15 09:24:46.469137+00	1
4b69acac-3315-4651-80d5-3d180ba222b8	a5ef510bbc4fa29993e0194f3c2a8d7b91690be418b78293cb788b016af2a91a	2025-04-15 09:24:48.924954+00	20250107133337_add_movies	\N	\N	2025-04-15 09:24:47.900995+00	1
c54da5f5-a0ae-4823-be66-cb65f4cd7a1b	f6ff79ebdc3832ffb081097c77ae2085e520c220628b1661fa11970d3a7e2f8e	2025-04-15 09:25:02.033843+00	20250218101510_add_user_fields	\N	\N	2025-04-15 09:25:01.009056+00	1
674f19ff-5728-4de2-ba60-a73191a0cba9	f0b1b5cb2e76a8c5c4c545abe341021d22dba08ff5b99a4915319ab1a596a56c	2025-04-15 09:24:50.460812+00	20250107140104_add_movie_reviews_relation	\N	\N	2025-04-15 09:24:49.334258+00	1
2913702b-c746-4021-a338-f9ecfa85c9d4	44442b4879925e2d446515ac3c8fc4562e3d97855c2eaee33c969588372ab9ed	2025-04-15 09:24:51.862365+00	20250107143132_make_release_date_optional	\N	\N	2025-04-15 09:24:50.87067+00	1
e6a21201-1250-41dd-a443-5fd2b63f8ba8	cfd9e304e72d26b41bb8a61f483649a4dcfd2f687e051d3b0e921c871420ad67	2025-04-15 09:25:11.968311+00	20250226100419_add_recipe_ratings	\N	\N	2025-04-15 09:25:11.043303+00	1
caba875d-27e1-49ad-83b1-721d54fcb532	496f082569d2a3f72c3fea179d6dbda90182d6e4dec2c759f31d2d394dde1133	2025-04-15 09:24:53.305443+00	20250107170241_update_schema	\N	\N	2025-04-15 09:24:52.2324+00	1
d5610416-8424-4ee2-bdfb-f03230b32897	95d45aba8b5a9104dbed2bd6f045b8306e4e6d5d8fc113dd1dc53aee39062972	2025-04-15 09:25:03.46649+00	20250219130840_add_nutritional_values	\N	\N	2025-04-15 09:25:02.428728+00	1
3ffe8c85-a70f-4380-80c1-2787253a2110	28bbe0f83a224f89e36154598307f7d1432d9a105ef3bc3fa40fca24a85a9b71	2025-04-15 09:24:54.729005+00	20250111135035_add_tbr_books	\N	\N	2025-04-15 09:24:53.73947+00	1
49e3eaf8-5b0d-4b32-906a-ebe369644498	3332f7ab34150e9a4acd1bbcba05fe8659c8db840962093416cbe86bafe74145	2025-04-15 09:24:56.195061+00	20250112155041_add_recipe_model	\N	\N	2025-04-15 09:24:55.173217+00	1
9b32b4b2-83de-4044-8bb6-2638dc22b357	da1041a1d9a69fb502d10366b67b6c97c5d5b27550c5426e6c74c0daad6fca04	2025-04-15 09:24:57.628973+00	20250112155650_add_ingredients_to_recipes	\N	\N	2025-04-15 09:24:56.605388+00	1
55c28d74-1855-4140-8b35-65fe94d9af0c	cbb5f6cc1cd554f8756e89de806b477bd782f41cfc2e42e59cbdbc9213cd7019	2025-04-15 09:25:04.898977+00	20250222183702_add_is_public_to_recipe	\N	\N	2025-04-15 09:25:03.875917+00	1
7c4aa499-5542-4b54-92cd-d460f88c88db	433873ff2b52c7ba9b7790ab82799aa06c6b3c63746adbe05e4c1ec6d50a27d2	2025-04-15 09:25:06.300162+00	20250222195936_add_comments_relation	\N	\N	2025-04-15 09:25:05.309552+00	1
e51d24e6-72f5-4f47-bd0a-b9d764a194ec	1c1369fe988b046446aba8ee3163982e1223faedfc3233793cfb080698651d13	2025-04-15 09:25:13.295603+00	20250226145203_add_image_to_recipes	\N	\N	2025-04-15 09:25:12.326341+00	1
dfc97818-4f0d-44fe-8b5a-ce739502cc5e	57bf8ce689ecf865e9b40bc05b0d7c514dc67b7b3191917b7e77b34bebff7a3d	2025-04-15 09:25:07.766665+00	20250224075004_add_chat	\N	\N	2025-04-15 09:25:06.742446+00	1
d950a315-b865-433c-8bf5-9dfb8be593ff	9a1d729b35d139206d36982f30f731e554b1e3d26d4c7b2f808a3ce08ba2cc87	2025-04-21 11:41:05.067876+00	0000_init		\N	2025-04-21 11:41:05.067876+00	0
031acd89-17d6-487c-9117-f4d92c87ee58	5e18ad78d5e358022326d2acbcbd11c06520a4567e968a006b6c91c8f3ce63d4	2025-04-15 09:25:09.302403+00	20250224080452_public_chat	\N	\N	2025-04-15 09:25:08.17603+00	1
\.


--
-- Name: Book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Book_id_seq"', 4, true);


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 1, false);


--
-- Name: MovieReview_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MovieReview_id_seq"', 1, false);


--
-- Name: Movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Movie_id_seq"', 14, true);


--
-- Name: NutritionalValue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."NutritionalValue_id_seq"', 5, true);


--
-- Name: Rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Rating_id_seq"', 1, false);


--
-- Name: Recipe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Recipe_id_seq"', 5, true);


--
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Review_id_seq"', 1, true);


--
-- Name: TBRBook_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TBRBook_id_seq"', 1, true);


--
-- Name: Book Book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: MovieReview MovieReview_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieReview"
    ADD CONSTRAINT "MovieReview_pkey" PRIMARY KEY (id);


--
-- Name: Movie Movie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie"
    ADD CONSTRAINT "Movie_pkey" PRIMARY KEY (id);


--
-- Name: NutritionalValue NutritionalValue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NutritionalValue"
    ADD CONSTRAINT "NutritionalValue_pkey" PRIMARY KEY (id);


--
-- Name: Rating Rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_pkey" PRIMARY KEY (id);


--
-- Name: Recipe Recipe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: TBRBook TBRBook_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TBRBook"
    ADD CONSTRAINT "TBRBook_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Book Book_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Book"
    ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_recipientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MovieReview MovieReview_movieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieReview"
    ADD CONSTRAINT "MovieReview_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES public."Movie"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MovieReview MovieReview_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieReview"
    ADD CONSTRAINT "MovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Movie Movie_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie"
    ADD CONSTRAINT "Movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NutritionalValue NutritionalValue_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NutritionalValue"
    ADD CONSTRAINT "NutritionalValue_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Rating Rating_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Rating Rating_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rating"
    ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Recipe Recipe_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."Book"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TBRBook TBRBook_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TBRBook"
    ADD CONSTRAINT "TBRBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

