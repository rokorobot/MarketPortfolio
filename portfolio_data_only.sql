--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.5

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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.users VALUES ('1', 'admin', 'admin@placeholder.com', NULL, NULL, NULL, NULL, 'admin', NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-23 20:17:04.26184', '2025-04-23 20:17:04.26184', true, 'temp_password_hash', NULL, false, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('3', 'creator', 'creator@placeholder.com', NULL, NULL, NULL, NULL, 'admin', NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-23 20:17:04.26184', '2025-04-23 20:17:04.26184', true, 'temp_password_hash', NULL, false, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('4', 'visitor', 'visitor@placeholder.com', NULL, NULL, NULL, NULL, 'guest', NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-23 20:17:04.26184', '2025-04-23 20:17:04.26184', true, 'temp_password_hash', NULL, false, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('6', 'ArtistOne', 'robertes@gmail.com', NULL, NULL, NULL, NULL, 'collector', 'ArtistOne', NULL, NULL, NULL, NULL, NULL, '2025-04-24 13:50:20.987684', '2025-04-24 13:51:32.187', true, 'temp_password_hash', NULL, false, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('7', 'ArtistTwo', 'robertkonecny@gmail.com', NULL, NULL, NULL, NULL, 'collector', 'Robert Kon', NULL, NULL, NULL, NULL, NULL, '2025-04-24 14:03:00.551654', '2025-04-24 14:03:15.87', true, 'temp_password_hash', NULL, false, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('5', 'PlayerOne', 'rokoroko@seznam.cz', NULL, NULL, NULL, NULL, 'collector', 'PlayerOne', NULL, NULL, NULL, NULL, NULL, '2025-04-24 08:30:41.116557', '2025-04-24 14:21:33.686', true, 'temp_password_hash', NULL, false, NULL, NULL, NULL);
INSERT INTO public.users VALUES ('2', 'rokoroko', 'rokoroko@placeholder.com', NULL, NULL, NULL, NULL, 'admin', NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-23 20:17:04.26184', '2025-05-11 11:00:22.068', true, 'e6dc2824579f0bdad362fb201c16628912f68d8350a1fc5466fb67a771cc880211a2c6d6343465964a424238fcd612376df6a83aeaaad3252e3a85e2b11e8883.0ac42415d430fc7437276a6b7abe6077', NULL, false, NULL, NULL, NULL);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.categories VALUES (2, 'Robot Face', 'A futuristic collection of robotic faces', '2025-04-10 16:03:25.495995', '2', '/uploads/cb89ccdf1b5197b02c6db9e1a74057c3.webp', 0);
INSERT INTO public.categories VALUES (6, 'Old Canvas', 'Old Canvas Collection', '2025-04-11 17:32:22.618523', '2', '/uploads/aa9509750b5f67b3d0f4263eef94c71f.jfif', 0);
INSERT INTO public.categories VALUES (7, 'Grass Collection', 'Hand-drawn linework with texture shading Grass Collection.', '2025-04-11 17:53:58.87586', '2', '/uploads/b83e885fac140a182cddab477834b0e5.jfif', 0);
INSERT INTO public.categories VALUES (3, ' Portraiture', 'blend of realism and expressionism, with a strong influence from historical portraiture', '2025-04-10 16:58:21.760077', '2', '/uploads/a938a2df90f5cfdc62a3eeb2fb9709f6.jfif', 0);
INSERT INTO public.categories VALUES (4, 'Misappropriate', 'a collection of derivative animations stemming from the cc0 work of the most influential talents in the space spread among different blockchains', '2025-04-10 20:31:54.823161', '2', '/uploads/9084be8c028f17cc36cbab8307908d44.png', 0);
INSERT INTO public.categories VALUES (5, 'Nuances de Délicatesse', 'A collection that explores delicacy in all its nuances, through simple forms and subtle textures. Each scene evokes a visual poetry filled with softness and harmony.', '2025-04-10 21:00:02.881296', '2', '/uploads/ac62d3da8607bd85831f16826e5ca8f7.webp', 0);
INSERT INTO public.categories VALUES (1, 'Trees', 'Collection of Forests with intricate, leafless trees, their branches weaving into swirling, ethereal patterns. The scenes are bathed in soft, misty light, creating a surreal, almost otherworldly atmosphere with rolling, ornate ground textures', '2025-04-10 16:01:27.152606', '2', '/uploads/66ee996e4916be0df9067ecbf877e729.jfif', 0);
INSERT INTO public.categories VALUES (8, 'Dark & lovely', 'Be my friend', '2025-04-14 11:02:52.298994', '3', '/uploads/71c32bbf372c8526ee5386f5bba58321.jfif', 0);
INSERT INTO public.categories VALUES (9, 'Ink and Watercolor Reveries', 'Ink and Watercolor Reveries blends intricate ink drawings with vibrant watercolor overlays,creating elegant,dreamlike scenes.Each piece evokes a sense of mystery and beauty, merging fine detail with ethereal colors.Made with AI and retouching tools.', '2025-04-21 21:04:38.55397', '3', '/uploads/f9567a57a7aeb496a86ac45b4110a50a.webp', 0);
INSERT INTO public.categories VALUES (10, 'RED', '"RED" is a striking collection that fuses abstract geometry with a monochromatic crimson palette. It explores themes of duality and emotion, utilizing bold shapes, shadows, and minimalist textures to evoke intensity, passion, and enigmatic depth', '2025-05-11 14:39:36.629916', '2', '/uploads/fca2669a6fca04b78c642803a1f1ba90.jfif', 0);
INSERT INTO public.categories VALUES (12, ' OrnaMENTAL Space Art', 'The collection includes ornate, steampunk-inspired decorations giving it an industrial, futuristic, and celestial feel. The artwork’s symmetry and complexity resemble an elaborate mechanical mandala, blending science fiction and mysticism themes.', '2025-05-16 08:34:22.290982', '2', '/uploads/9b1212b12a723e007c1faa7e2b4ad181.jfif', 0);
INSERT INTO public.categories VALUES (14, 'Atlas Plantarum', 'Atlas Plantarum is an art collection of vintage-style botanical illustrations of imaginary plants. Each piece blends scientific precision with ornate design, creating a unique fusion of botanical fantasy and art that celebrates the beauty of nature', '2025-05-16 08:34:22.459118', '2', '/uploads/74567a36f42e165d1204fb0177e7000a.jfif', 0);
INSERT INTO public.categories VALUES (13, 'Bionic Girl', 'This artwork collection portrays a bionic girl with a striking fusion of human and machine elements. She wears large, mechanical headphones that have a futuristic design, filled with intricate details and gears, emphasizing the cybernetic theme', '2025-05-16 08:34:22.386948', '2', '/uploads/1eac88a17f5e513677f73ac309061e4e.jfif', 0);
INSERT INTO public.categories VALUES (15, 'Screaming Scull', 'The Screaming Skull Collection is known for vibrant, surreal skull art. It combines pop art''s boldness with darker themes, set against dynamic backgrounds. This mix makes for visually striking, thought-provoking pieces.', '2025-05-16 23:02:56.839515', '2', '/uploads/912ffbd92e7824a1311823e0027c090f.jfif', 0);
INSERT INTO public.categories VALUES (16, 'Otherworld Plants', 'The Otherworld Plants Collection showcases detailed macro photographs of sci-fi inspired plants. Each image focuses on a monochrome or gentle color palette, highlighting the intricate textures and otherworldly patterns of these alien flora', '2025-05-19 09:50:06.166118', '2', '/uploads/fb605700fa22f7fa715d4d6c185ec935.jfif', 0);
INSERT INTO public.categories VALUES (17, 'Glitched Girl', '"Glitched Girl" captures the haunting beauty of digital distortion, blending surreal and cyber elements. This collection explores a blend of melancholic and futuristic themes, with moody, glitch-infused visuals that evoke a sense of mystery and depth', '2025-05-19 09:55:39.588472', '2', '/uploads/427973f1b08f47d10a39d02698d0f220.jfif', 0);
INSERT INTO public.categories VALUES (18, 'Wind Scene (Tezos)', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.
', '2025-05-19 10:03:32.899344', '2', '/uploads/13cdafab90bd393a0a14e843e96c4fea.webp', 0);
INSERT INTO public.categories VALUES (20, 'B&W', '"B&W" is a minimalist collection that captures the interplay of light and shadow in abstract forms. Focusing on contrast and subtle gradients, it evokes a sense of mystery, elegance, and quiet introspection, celebrating the beauty of simplicity.', '2025-05-20 19:25:01.492869', '2', 'https://ipfs.io/ipfs/QmXYhrPbsubfj2a49GSrJqtSwc7buqHALMGv3vLD5nZktq', 0);


--
-- Data for Name: portfolio_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.portfolio_items VALUES (134, 'RED #5', 'This piece of art from the "RED" collection is a striking digital artwork that blends elements of portraiture with abstract and surrealist influences. The dominant color is a vivid red, which is used both for the background and the subject, creating a cohesive and intense visual experience.

The subject of the artwork appears to be a human face, but it is highly stylized and abstracted. The head is encased in geometric shapes, primarily angular and rectangular forms, which give the impression of a mask or a futuristic helmet. These shapes are textured with what looks like cracks or fissures, adding a sense of depth and complexity to the piece. This texture might symbolize fragility, transformation, or the passage of time.

The use of red is significant; it covers the entire face and headgear, creating a monolithic appearance. The red color can evoke a range of emotions and interpretations, from passion and intensity to danger and power. The lips are painted in a matching red, almost blending with the mask, which could suggest a theme of identity being hidden or consumed by external forces.

The background is a gradient of red shades, which enhances the subject by creating a sense of immersion and focus. The lighting is soft, highlighting the contours of the face and the textures of the mask, giving the artwork a three-dimensional quality.

This piece might be interpreted in various ways:
Identity and Masking: The mask-like structure could represent how people hide their true selves behind societal or self-imposed masks.
Transformation: The cracked texture might symbolize change or the breaking down of old identities to form new ones.
Surrealism: The blending of human features with geometric abstraction places this work in a surreal context, challenging viewers to find meaning in the interplay between the organic and the artificial.

Overall, this artwork is a powerful exploration of form, color, and texture, inviting viewers to reflect on themes of identity, transformation, and the human condition through its striking visual language.', 'https://ipfs.io/ipfs/QmNhoxQASaxiqdYSRQDyRwW5knHELcd8UYxdFQSwF8waXA', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/4', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-11 12:40:50.322922', '2025-05-11 12:40:50.322922', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 4, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_4', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"4"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/4', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:50.278', 'published');
INSERT INTO public.portfolio_items VALUES (10, 'DECAY', 'based on DECAY by XCOPY', '/uploads/45516385832f5cf43b83400e3ec98e52.webp', 'Misappropriate', 'https://objkt.com/tokens/KT1G4g9zcdrSw6LykqyJQDHSr8CAit5hKa2W/6', '', 'OBJKT', '', '{XCOPY,DECAY}', 'Gore.gif', 'https://objkt.com/@goregif', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/a119d4c2ecd132b2e283bf7d0e290f05.png', 8, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (148, 'RED #14', 'This piece from the "RED" collection is a digital artwork that combines elements of portraiture with geometric abstraction and a strong use of color. Here''s a detailed description:

Color Scheme: The artwork prominently features shades of red, black, and gray. The background is a gradient of red hues, creating a warm, intense atmosphere. The figure''s face and upper body are rendered in contrasting black and red sections, with the red parts having a reflective, almost metallic quality.
Subject: The subject is a human face and upper torso, but it is highly stylized and abstracted. The face is composed of geometric facets, giving it a fragmented, angular appearance. The red sections of the face and body are particularly reflective, adding a sense of depth and complexity.
Form: The geometric shapes forming the face include sharp edges and flat surfaces, creating a mask-like effect. The red sections, especially on the face, have a reflective, almost mirror-like quality, which contrasts with the matte black areas.
Texture: The textures within the red sections are reflective, giving an impression of a polished or metallic surface. This texture contrasts with the smoother, more matte appearance of the black areas, adding to the visual complexity.
Lighting: The lighting is dramatic, with highlights on the reflective surfaces enhancing the three-dimensionality of the figure. The red background and the reflective surfaces create a dynamic interplay of light and shadow.
Composition: The figure is centrally placed, making it the focal point of the artwork. The use of geometric shapes and the division of the figure into different colored sections draws the viewer''s eye and adds to the complexity of the composition.

Possible interpretations of this artwork could include:

Identity and Fragmentation: The geometric, fragmented appearance of the face might symbolize a fragmented sense of self or identity. The different colors and textures could represent various aspects or facets of a person''s identity.
Emotional Intensity: The red color might symbolize strong emotions such as passion, anger, or intensity. The reflective quality of the red sections could suggest an outward projection of these emotions.
Modernity and Technology: The angular, almost robotic appearance of the figure could comment on the influence of technology on human identity, suggesting themes of transhumanism or the merging of human and machine.

Overall, this piece is a compelling exploration of human identity, emotion, and the impact of modernity, using bold colors, geometric forms, and reflective surfaces to convey its message.', 'https://ipfs.io/ipfs/QmemPz4Bau5FTPNDy1AePunHMuDzVP8yF7fspgKTta8XzA', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/13', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-20 19:25:02.384709', '2025-05-20 19:25:02.384709', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 13, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_13', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"13","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT1Anr...Rj5o","address":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","image":"https://ipfs.io/ipfs/QmXRkTzCvugWULj4MHpmKrgPVW17kLJG91gW4VoFK22BGH"}}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/13', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:02.339', 'published');
INSERT INTO public.portfolio_items VALUES (55, 'Journey to the Land of Chimeras', 'Journey to the Land of Chimeras', '/uploads/88baa26851294249c5d91f091bfc6b72.webp', 'Ink and Watercolor Reveries', 'https://objkt.com/tokens/KT1BthitQEX464sBEutLg1sCSNwM3ioMQyNT/133', '', 'OBJKT', '', '{landscape,colorful,watercolor,ink}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-21 21:39:02.742213', '2025-04-21 21:39:02.742213', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (149, 'RED #15', 'This piece from the "RED" collection is a digital artwork that combines elements of portraiture with geometric abstraction and a strong use of color. Here''s a detailed description:

Color Scheme: The background is a soft, warm pink, which contrasts with the figure''s face and attire. The figure''s face and clothing are rendered in a combination of black, red, and some gray tones. The red sections are particularly vibrant and textured, creating a striking visual contrast against the black and gray.
Subject: The subject is a human face and upper body, but it is highly stylized and abstracted. The face is composed of geometric facets, giving it a sharp, angular appearance. The attire also follows a geometric pattern, with sharp lines and facets that echo the facial structure.
Form: The geometric shapes forming the face and clothing include sharp edges and flat surfaces, creating a mask-like effect. The red sections, especially on the face, have a textured, almost cracked appearance, adding to the visual complexity.
Texture: The textures within the red sections are rough and cracked, suggesting a sense of wear or damage. This texture contrasts with the smoother, more matte appearance of the black areas, adding depth and interest to the piece.
Lighting: The lighting is subtle but effective, with highlights on the reflective surfaces enhancing the three-dimensionality of the figure. The interplay of light and shadow across the geometric facets adds to the dynamic quality of the artwork.
Composition: The figure is centrally placed, making it the focal point of the artwork. The use of geometric shapes and the division of the figure into different colored sections draws the viewer''s eye and adds to the complexity of the composition.

Possible interpretations of this artwork could include:

Identity and Fragmentation: The geometric, fragmented appearance of the face might symbolize a fragmented sense of self or identity. The different colors and textures could represent various aspects or facets of a person''s identity.
Emotional Intensity: The red color might symbolize strong emotions such as passion, anger, or intensity. The cracked texture in the red sections could suggest emotional wounds or scars.
Modernity and Technology: The angular, almost robotic appearance of the figure could comment on the influence of technology on human identity, suggesting themes of transhumanism or the merging of human and machine.
Isolation or Alienation: The mask-like effect and the geometric abstraction might also suggest themes of isolation or alienation, where the individual is distanced from their true self or from others.

Overall, this piece is a compelling exploration of human identity, emotion, and the impact of modernity, using bold colors, geometric forms, and textured surfaces to convey its message.', 'https://ipfs.io/ipfs/QmPMu6ZnXQehAHQFuBHt1mbW9kbFgYPehLLThHX1SHUFLQ', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/14', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-20 19:25:02.689184', '2025-05-20 19:25:02.689184', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 14, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_14', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"14","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT1Anr...Rj5o","address":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","image":"https://ipfs.io/ipfs/QmXRkTzCvugWULj4MHpmKrgPVW17kLJG91gW4VoFK22BGH"}}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/14', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:02.65', 'published');
INSERT INTO public.portfolio_items VALUES (150, 'RED #16', 'This piece from the "RED" collection is a digital artwork that combines elements of portraiture with geometric abstraction and a strong use of color. Here''s a detailed description:

Color Scheme: The background is a vivid, intense red, which dominates the piece and creates a dramatic and intense atmosphere. The figure''s face and attire are rendered in contrasting black and red sections, with the red sections having a more textured and geometric appearance.
Subject: The subject is a human face and upper body, but it is highly stylized and abstracted. The face is composed of geometric facets, giving it a sharp, angular appearance. The attire also follows a geometric pattern, with sharp lines and facets that echo the facial structure.
Form: The geometric shapes forming the face and clothing include sharp edges and flat surfaces, creating a mask-like effect. The red sections, especially on the face, have a textured, almost cracked appearance, adding to the visual complexity.
Texture: The textures within the red sections are rough and cracked, suggesting a sense of wear or damage. This texture contrasts with the smoother, more matte appearance of the black areas, adding depth and interest to the piece.
Lighting: The lighting is subtle but effective, with highlights on the reflective surfaces enhancing the three-dimensionality of the figure. The interplay of light and shadow across the geometric facets adds to the dynamic quality of the artwork.
Composition: The figure is centrally placed, making it the focal point of the artwork. The use of geometric shapes and the division of the figure into different colored sections draws the viewer''s eye and adds to the complexity of the composition.

Possible interpretations of this artwork could include:

Identity and Fragmentation: The geometric, fragmented appearance of the face might symbolize a fragmented sense of self or identity. The different colors and textures could represent various aspects or facets of a person''s identity.
Emotional Intensity: The red color might symbolize strong emotions such as passion, anger, or intensity. The cracked texture in the red sections could suggest emotional wounds or scars.
Modernity and Technology: The angular, almost robotic appearance of the figure could comment on the influence of technology on human identity, suggesting themes of transhumanism or the merging of human and machine.
Isolation or Alienation: The mask-like effect and the geometric abstraction might also suggest themes of isolation or alienation, where the individual is distanced from their true self or from others.

Overall, this piece is a compelling exploration of human identity, emotion, and the impact of modernity,', 'https://ipfs.io/ipfs/QmSGeFuFosDnVke2UngowC4HStXZis2Xp1kyBUH1PfEtCa', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/15', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-20 19:25:02.995507', '2025-05-20 19:25:02.995507', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 15, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_15', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"15","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT1Anr...Rj5o","address":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","image":"https://ipfs.io/ipfs/QmXRkTzCvugWULj4MHpmKrgPVW17kLJG91gW4VoFK22BGH"}}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/15', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:02.957', 'published');
INSERT INTO public.portfolio_items VALUES (151, 'RED #17', 'This piece from the "RED" collection is a digital artwork that masterfully blends elements of portraiture with geometric abstraction and a strong use of color. Here''s a detailed description:

Color Scheme: The artwork predominantly uses shades of red, black, and white. The background is a soft, warm pink, which contrasts with the figure''s face and attire. The face and clothing are rendered in red and black, with white accents highlighting certain geometric shapes.
Subject: The subject is a human face and upper body, but it is highly stylized and abstracted. The face is composed of geometric facets, giving it a sharp, angular appearance. The attire also follows a geometric pattern, with sharp lines and facets that echo the facial structure.
Form: The geometric shapes forming the face and clothing include sharp edges and flat surfaces, creating a mask-like effect. The red sections, especially on the face, have a textured, almost cracked appearance, adding to the visual complexity.
Texture: The textures within the red sections are rough and cracked, suggesting a sense of wear or damage. This texture contrasts with the smoother, more matte appearance of the black areas, adding depth and interest to the piece.
Lighting: The lighting is subtle but effective, with highlights on the reflective surfaces enhancing the three-dimensionality of the figure. The interplay of light and shadow across the geometric facets adds to the dynamic quality of the artwork.
Composition: The figure is centrally placed, making it the focal point of the artwork. The use of geometric shapes and the division of the figure into different colored sections draws the viewer''s eye and adds to the complexity of the composition.

Possible interpretations of this artwork could include:

Identity and Fragmentation: The geometric, fragmented appearance of the face might symbolize a fragmented sense of self or identity. The different colors and textures could represent various aspects or facets of a person''s identity.
Emotional Intensity: The red color might symbolize strong emotions such as passion, anger, or intensity. The cracked texture in the red sections could suggest emotional wounds or scars.
Modernity and Technology: The angular, almost robotic appearance of the figure could comment on the influence of technology on human identity, suggesting themes of trans', 'https://ipfs.io/ipfs/QmXmp63LBPF9EPnZWm9WZbzSkTdLgS8Tro2CFdobaDQbr6', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/16', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-20 19:25:03.289991', '2025-05-20 19:25:03.289991', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 16, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_16', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"16","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT1Anr...Rj5o","address":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","image":"https://ipfs.io/ipfs/QmXRkTzCvugWULj4MHpmKrgPVW17kLJG91gW4VoFK22BGH"}}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/16', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:03.249', 'published');
INSERT INTO public.portfolio_items VALUES (145, 'Screaming Scull #8', 'Screaming Skull #8 portrays a fierce, golden skull with exaggerated, menacing features, including large, hollow eyes and a wide, toothy grin, surrounded by splashes of paint and abstract elements, giving it a dynamic, horror-infused aesthetic.', 'https://ipfs.io/ipfs/QmeLQad2yCrnr6Ycwwg9s6U61ZThDdDdUS67KGY44dD7i2', 'Screaming Scull', 'https://objkt.com/tokens/KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx/8', NULL, 'OBJKT', NULL, '{horror,popart,screaming,scull}', 'rokoroko', '', '2025-05-16 23:02:57.591534', '2025-05-16 23:02:57.591534', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 1, '2', 'KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx_8', 'tezos', '{"contract":"KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx","tokenId":"8","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT1EKf...9Rtx","address":"KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx","image":"https://ipfs.io/ipfs/QmYWjLXVvChRp9s2h5fvK93dWggqRuBHMd4AkoGKibXYYo"}}', 'https://objkt.com/asset/KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx/8', 'OBJKT', NULL, 'XTZ', false, '2025-05-16 23:02:57.555', 'published');
INSERT INTO public.portfolio_items VALUES (159, 'Cindirella', 'Beneath the ground, a heel endures, forgotten by fairy tales and storefronts. It reminds us that imposed elegance was never a form of freedom.', '/uploads/501bcce519f62c6e491bd58a3bdaade7.webp', 'Nuances de Délicatesse', 'https://objkt.com/tokens/KT1GxqKv8tWVxRrWADVcWnKp6UDkqhpcTtKv/41', '', 'OBJKT', 'https://objkt.com/tokens/KT1GxqKv8tWVxRrWADVcWnKp6UDkqhpcTtKv/41', '{freedom,cindirella,delicatesse,heel}', 'NAD-AI-Art', '', '2025-05-20 21:03:56.939598', '2025-05-20 21:03:56.939598', '', 2, '2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (61, 'Spinning OrnaMENTAL Space Machine', 'The moving subject is a spinning orb - a highly detailed, symmetrical, mechanical structure with a central, circular design that radiates outwards in intricate layers. At the center, there’s a large, orb-like element that resembles a polished stone or metallic sphere, which is surrounded by multiple rings adorned with fine engravings and mechanical parts. Radiating from this center, gear-like spokes extend outward, creating a starburst effect that reinforces the symmetrical design.

Around the outer circle, various smaller circular elements and gears are positioned evenly, enhancing the symmetrical layout. The design includes ornate, steampunk-inspired decorations with dark, metallic textures, giving it an industrial, futuristic, and celestial feel. The artwork’s symmetry and complexity make it resemble an elaborate astronomical device or a mechanical mandala, blending themes of science fiction and mysticism.', 'https://ipfs.io/ipfs/Qma21oTS2uqqMsirs4jYpzgbQy8F4sSfHijpTnGfh9Jbnj', ' OrnaMENTAL Space Art', 'https://objkt.com/tokens/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/2', NULL, 'OBJKT', NULL, '{ornamental,scifi,mysticism,orb,space,mandala,spinning}', 'rokoroko', '', '2025-05-11 12:40:38.943228', '2025-05-11 12:40:38.943228', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 2, '2', 'KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL_2', 'tezos', '{"contract":"KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL","tokenId":"2"}', 'https://objkt.com/asset/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/2', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:38.898', 'published');
INSERT INTO public.portfolio_items VALUES (17, 'The Grace', 'A woman in historical attire, painted in an expressionistic style with dark, moody tones. Her elegant dress and pearl earring stand out against a textured, abstract background, evoking mystery and timeless beauty in a dramatic, painterly portrait.', '/uploads/677829371f8d8f798f7c36e855308a76.png', ' Portraiture', 'https://objkt.com/tokens/KT1Br8Lfuav3dbGX1DWESNDkDh3p6dJdKFAv/1', '', 'OBJKT', '', '{portrait,historical,expressionism,woman,lady}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 19, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (18, 'The Sailor', 'The image depicts an elderly sailor with a weathered face, wearing a feathered tricorn hat and a tattered scarf.
His expression is somber, with deep-set eyes and a gray beard.
The dark, muted background and detailed clothing suggest a historical or classical painting style.', '/uploads/922131ca84f659ed3b837bcb03102844.png', ' Portraiture', 'https://objkt.com/tokens/KT1Br8Lfuav3dbGX1DWESNDkDh3p6dJdKFAv/2', '', 'OBJKT', '', '{expressionism,sailor}', 'rokoroko', '', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 21, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (154, 'B&W #3', 'This piece from the "B&W" collection is a striking example of minimalist and abstract art with a focus on the human form. Here''s a detailed description:

Color Scheme: The artwork is rendered in black and white. The background is predominantly black, creating a stark contrast with the illuminated subject, which transitions from light to dark shades of gray.
Subject: The subject appears to be a human torso, specifically focusing on the area around the navel. The form is smooth and curvilinear, with soft contours that suggest the human anatomy without explicit detail.
Form: The form is highly stylized and abstract. It is defined by smooth, flowing lines and curves, with a central light source illuminating part of the torso, creating a gradient from light to dark. The light highlights the contours and gives a sense of volume and depth.
Texture: The texture is subtle and smooth, with the light playing on the surface to create a soft, almost velvety appearance. The contrast between the illuminated and shadowed areas adds to the tactile quality of the piece.
Lighting: The lighting is dramatic and focused, illuminating a small portion of the torso and leaving the rest in shadow. This creates a high contrast effect, emphasizing the interplay of light and shadow and adding a sense of mystery and depth to the artwork.
Composition: The composition is simple yet powerful. The central placement of the illuminated torso against the dark background draws the viewer''s attention directly to the subject. The smooth, flowing lines of the form create a sense of movement and fluidity.

Possible interpretations of this artwork could include:

Human Presence: The abstract human form might symbolize the essence of human presence or the human condition, focusing on the form rather than the identity or details of the person.
Vulnerability and Exposure: The focus on the torso, particularly the navel, could suggest themes of vulnerability, exposure, and the intimate nature of the human body.
Light and Shadow: The use of light and shadow could represent themes of revelation and concealment, knowledge and ignorance, or presence and absence. The interplay of light and dark might also suggest the duality of human experience.
Minimalism: The piece''s simplicity and focus on form and light align with minimalist principles, emphasizing the beauty in simplicity and the impact of basic elements like shape, light, and contrast.
Emotion and Mood: The monochromatic palette and the dramatic lighting can evoke a range of emotions, from contemplation to solitude, depending on the viewer''s interpretation.

Overall, this piece is a compelling exploration of form, light, and minimalism, inviting viewers to reflect on the human body''s form, the interplay of light and shadow.', 'https://ipfs.io/ipfs/QmWEHy4YooN9QeTBg68mLHyLjPjF7xz8Bw3Luudb9Jetjg', 'B&W', 'https://objkt.com/tokens/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/2', NULL, 'OBJKT', NULL, '{B&W,body}', 'rokoroko', '', '2025-05-20 19:25:04.370461', '2025-05-20 19:25:04.370461', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 2, '2', 'KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq_2', 'tezos', '{"contract":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","tokenId":"2","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT19WB...Pviq","address":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","image":"https://ipfs.io/ipfs/QmXYhrPbsubfj2a49GSrJqtSwc7buqHALMGv3vLD5nZktq"}}', 'https://objkt.com/asset/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/2', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:04.329', 'published');
INSERT INTO public.portfolio_items VALUES (37, 'Landscape #8', '#8', '/uploads/61ea33d631b769ad0e67bccb50da3c5e.jfif', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/37', '', 'OBJKT', '', '{dark,nature,autumn,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:43:52.525625', '2025-04-14 11:43:52.525625', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 10, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (40, 'Landscape #10', '#10 - de gooyer', '/uploads/dbf32af1be93c630cb13e4f9bc840e9d.jfif', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/48', '', 'OBJKT', '', '{windmill,nature,linework,amsterdam}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:53:12.693365', '2025-04-14 11:53:12.693365', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 11, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (56, 'The Emerald Valley', 'The Emerald Valley', '/uploads/a162226c864148ce2dbf7a50d5c90e51.png', 'Ink and Watercolor Reveries', 'https://objkt.com/tokens/KT1BthitQEX464sBEutLg1sCSNwM3ioMQyNT/144', '', 'OBJKT', '', '{emerald,valley,enchanted,majectic,tranquil,watercolor}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-21 21:43:43.314803', '2025-04-21 21:43:43.314803', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 2, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (52, 'Fields of Quiet', 'Fields of Quiet', '/uploads/3bfa777c4ae0f2bbb68f73528bcd0513.webp', 'Ink and Watercolor Reveries', 'https://objkt.com/tokens/KT1BthitQEX464sBEutLg1sCSNwM3ioMQyNT/120', '', 'OBJKT', '', '{landscape,nature,ink,watercolor,fields}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-21 21:30:25.361733', '2025-04-21 21:30:25.361733', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 4, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (12, 'The Suspended Moment', 'Seated at the threshold of an unknown world, she savors the moment, serene. Here, everything seems to be suspended, as if time itself were holding its breath. Far from the turmoil, she lets herself be carried by the quietness of the moment. Nothing rushes, everything may unfold.', '/uploads/20fc1637c4bd5768c3219988b58a9d2f.png', 'Nuances de Délicatesse', 'https://objkt.com/tokens/KT1GxqKv8tWVxRrWADVcWnKp6UDkqhpcTtKv/25', '', 'OBJKT', '', '{"NAD AI Art","Nuances de Delicatesse"}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (155, 'B&W #4', 'This piece from the "B&W" collection is a striking example of modern, digital art with a focus on futuristic and possibly robotic themes. Here''s a detailed description:

Color Scheme: The artwork is primarily monochromatic, with a focus on black and shades of gray. The background transitions from light gray at the center to darker shades towards the edges, creating a gradient effect.
Subject: The subject appears to be a humanoid figure, possibly a mannequin or a robotic entity, with a sleek, dark surface that absorbs light. The figure is featureless, with smooth, flowing lines and a texture resembling cracked paint or a dry, parched surface.
Form: The form is highly stylized and abstract, with an elongated neck and a smooth, rounded head. The figure''s torso is also sleek and curvilinear, emphasizing a futuristic or robotic aesthetic. There are subtle white lines on the neck, adding to the mechanical or digital feel of the piece.
Texture: The texture is one of the most distinctive aspects of this artwork. The surface of the figure has a cracked, almost reptilian appearance, which contrasts with the smooth, reflective quality of the rest of the form. This texture adds a layer of complexity, suggesting either decay or an intricate design element.
Lighting: The lighting is soft and diffused, creating a subtle gradient in the background and highlighting the contours of the figure. The light source seems to be from the front, casting gentle shadows that enhance the three-dimensional quality of the subject.
Composition: The composition is minimalist, with the figure centrally placed against a simple background. The lack of facial features and the smooth, abstract form draw attention to the overall shape and texture rather than specific details.

Possible interpretations of this artwork could include:

Futurism and Technology: The sleek, featureless form and the subtle white lines might suggest themes of advanced technology, artificial intelligence, or robotics. The piece could be exploring the relationship between humans and machines or the future of human-like entities.
Isolation and Anonymity: The absence of facial features and the dark, almost void-like appearance could symbolize themes of isolation, anonymity, or the loss of individuality in a digital or robotic future.
Texture and Decay: The cracked texture might represent decay or the passage of time, suggesting that even advanced technology is subject to wear and tear. This could be a commentary on the impermanence of technology or human constructs.
Minimalism: The piece''s simplicity and focus on form and texture align with minimalist principles', 'https://ipfs.io/ipfs/QmNQuivL9xGdARmYX6JN9GoUuAKyN3DqERRACQkx3h4BTS', 'B&W', 'https://objkt.com/tokens/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/3', NULL, 'OBJKT', NULL, '{B&W,body}', 'rokoroko', '', '2025-05-20 19:25:04.659853', '2025-05-20 19:25:04.659853', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 3, '2', 'KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq_3', 'tezos', '{"contract":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","tokenId":"3","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT19WB...Pviq","address":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","image":"https://ipfs.io/ipfs/QmXYhrPbsubfj2a49GSrJqtSwc7buqHALMGv3vLD5nZktq"}}', 'https://objkt.com/asset/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/3', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:04.614', 'published');
INSERT INTO public.portfolio_items VALUES (83, 'Plant #6', 'The illustration from the Atlas Plantarum presents an imaginative and detailed depiction of a floral arrangement with the following characteristics:

Flowers: The flowers are predominantly white with yellow centers, featuring intricate, layered petals that give them a textured appearance. The petals are elongated and pointed, with a soft gradient from white to a creamy hue. The centers of the flowers are detailed with dense, clustered structures, often in shades of yellow or orange, adding depth and complexity.
Buds: Alongside the fully bloomed flowers, there are numerous buds in various stages of opening. Some are closed, with smooth, rounded exteriors, while others are partially open, revealing the intricate details of the petals as they begin to unfurl.
Leaves and Stems: The stems are slender and brown, supporting the flowers and buds. The leaves are sparse but present, with a simple, elegant shape that complements the overall aesthetic of the illustration.
Background: The background is a deep, rich black, creating a stark contrast with the light-colored flowers. Scattered throughout the background are small, star-like shapes and dots, giving the impression of a night sky or a cosmic backdrop. This adds a mystical or celestial element to the illustration.
Color Scheme: The color palette is primarily composed of white, cream, yellow, and orange, with the dark background enhancing the luminosity of the flowers. The use of these colors gives the illustration a warm, glowing effect against the dark backdrop.
Artistic Style: The style is detailed and precise, reminiscent of traditional botanical illustrations but with a fantastical twist. The symmetrical arrangement of the flowers and the meticulous detailing of each petal and bud contribute to the overall imaginative and otherworldly feel of the piece.

The illustration effectively blends elements of botanical realism with imaginative design, creating a visually captivating and artistically rich depiction of an imaginative plant species.', 'https://ipfs.io/ipfs/QmPcPDZUz1k8VqYxQXxCjLk4NVmGpAnTxHvYw53k3doP2J', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/5', NULL, 'OBJKT', NULL, '{atlas,plantarum,botanical,scifi,vintage,illustration,flower,flowers}', 'rokoroko', '', '2025-05-11 12:40:42.393242', '2025-05-11 12:40:42.393242', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 5, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_5', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"5"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/5', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:42.35', 'published');
INSERT INTO public.portfolio_items VALUES (85, 'Plant #8', 'This illustration Plant #8 from the "Atlas Plantarum" collection features a blend of botanical and geometric design elements, creating an intricate and imaginative depiction of plants. Here''s a detailed description:

Color Scheme:
The illustration uses a warm, muted palette with shades of orange, brown, and beige. The background is a light beige, which complements the darker colors of the plants and the intricate border.
Central Design:
At the center of the illustration is a complex, symmetrical geometric pattern that resembles a mandala or a star. This central design is highly detailed, with layers of petals and segments that create a sense of depth and complexity.
Plants and Flowers:
Surrounding the central geometric design are various imaginative plants and flowers. The flowers are predominantly orange with detailed, textured petals that give them a lifelike yet fantastical appearance.
The plants have elongated leaves and slender stems, with some bearing small buds or seed pods. The leaves are stylized, with a mix of rounded and pointed shapes, adding to the variety in the illustration.
Border and Decoration:
The entire illustration is framed by an ornate border that combines geometric and floral motifs. The border is dark, with intricate patterns that echo the complexity of the central design.
The corners of the border feature stylized floral elements, adding to the overall decorative feel of the piece.
Additional Elements:
Small, delicate flowers and buds are interspersed among the larger plants, adding to the richness of the design. These smaller elements provide contrast and balance to the larger, more prominent flowers.
The illustration includes some whimsical touches, such as tendrils and vines that weave through the design, enhancing the imaginative aspect of the artwork.
Artistic Style:
The style blends botanical illustration with geometric precision, creating a harmonious balance between nature and art. The use of symmetry and repetition in both the plants and the border gives the piece a cohesive and unified look.

Overall, the illustration from the "Atlas Plantarum" collection is a captivating mix of natural forms and artistic imagination, rendered with meticulous detail and a warm, inviting color palette.', 'https://ipfs.io/ipfs/QmafU2Qo3FYyV6an3oHMbJAnRqgUpdhVX1RtbUnyAqi5xy', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/7', NULL, 'OBJKT', NULL, '{atlas,plantarum,vintage,illustration,scifi,flower,botanical,flowers}', 'rokoroko', '', '2025-05-11 12:40:42.701709', '2025-05-11 12:40:42.701709', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 7, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_7', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"7"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/7', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:42.656', 'published');
INSERT INTO public.portfolio_items VALUES (57, 'The Light That Listens', 'Her glow is not a blaze.
It’s a presence — soft, slow, attentive.
She doesn’t light the path. She becomes it.', '/uploads/8029cf45fb735a7b0993e5b819e05914.webp', 'Ink and Watercolor Reveries', 'https://objkt.com/tokens/KT1BthitQEX464sBEutLg1sCSNwM3ioMQyNT/149', '', 'OBJKT', '', '{luminal,ethernal,wander,starlight,watercolor,ink}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-21 21:52:06.119999', '2025-04-21 21:52:06.119999', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (11, 'Emilie''s Choice', 'She closed her eyes, not to escape, but to better hear the whisper of the path she’s about to take.
Beneath her shut lids, the world softens, and her decision becomes clear.', '/uploads/e75478266442b129248b89b3cd1f1698.png', 'Nuances de Délicatesse', 'https://objkt.com/tokens/KT1GxqKv8tWVxRrWADVcWnKp6UDkqhpcTtKv/33', '', 'OBJKT', '', '{"NAD AI Art",face,"Nuances de Délicatesse"}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 1, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (87, 'Plant #10', 'The illustration from the collection "Atlas Plantarum" depicts an imaginative plant with a highly stylized and intricate design. 
The plant features a tall, central stem that supports a large, composite flower cluster. The flower cluster is composed of numerous small, star-like flowers, each with five petals, radiating outward in a symmetrical pattern. 

Surrounding the central flower cluster is a circular arrangement of smaller, similarly styled flowers, connected by delicate lines that suggest a network or constellation-like pattern. This gives the impression of a cosmic or celestial theme, as if the plant is mimicking the structure of a star system or galaxy.

The leaves of the plant are large, elongated, and have a gradient of color from green at the base to a golden hue at the tips, adding a touch of realism to the otherwise fantastical design. The leaves are positioned symmetrically around the base of the stem.

The background of the illustration is framed with ornate, baroque-style borders featuring floral and geometric motifs, enhancing the overall decorative and artistic feel of the piece. The use of a limited color palette, primarily gold, green, and black, adds to the vintage and elegant aesthetic of the illustration.

Overall, the plant depicted in this illustration combines elements of botanical realism with fantastical and celestial imagery, creating a unique and visually captivating piece.', 'https://ipfs.io/ipfs/QmX9rdMzUEPEHJG92nkbKGHBdNQUA7PCv1NgMm1zqH2xgB', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/9', NULL, 'OBJKT', NULL, '{atlas,plantarum,botanical,illustration,vintage,flower,flowers}', 'rokoroko', '', '2025-05-11 12:40:43.009896', '2025-05-11 12:40:43.009896', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 9, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_9', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"9"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/9', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:42.965', 'published');
INSERT INTO public.portfolio_items VALUES (51, 'Noble Steps', 'Noble Steps', '/uploads/3b3127c8dea884a24a7f0652c0bf5394.webp', 'Ink and Watercolor Reveries', 'https://objkt.com/tokens/KT1BthitQEX464sBEutLg1sCSNwM3ioMQyNT/116', '', 'OBJKT', '', '{steps,watecolor,ink,aristocracy,noble}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-21 21:16:07.592264', '2025-04-21 21:16:07.592264', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (50, 'Pastel Melancholy', 'Pastel Melancholy', '/uploads/70386eb76b6066524d8d261a148b9dab.webp', 'Ink and Watercolor Reveries', 'https://objkt.com/tokens/KT1BthitQEX464sBEutLg1sCSNwM3ioMQyNT/110', '', 'OBJKT', '', '{pastel,watercolor,melancholy,girl}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-21 21:12:01.940938', '2025-04-21 21:12:01.940938', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (44, 'Rose', 'There may be a lot of flowers in a person’s life but there can only be one rose, that is real.', '/uploads/632e51848bd603ccec8c6b91b11253fa.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/88', '', 'OBJKT', '', '{rose,dark,love,flower}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 12:02:37.373015', '2025-04-14 12:02:37.373015', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 7, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (46, 'Oak', '🐿', '/uploads/604649bbcf99c4fe433cb5d12028a4e3.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/123', '', 'OBJKT', '', '{dark,animal,squirrel,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 12:06:38.185547', '2025-04-14 12:06:38.185547', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (45, 'Gone With the Wind', 'how can a bloosom dance in a spider webs mass !', '/uploads/b1f2be9480a1bcd5b2db0b5eacc5aeba.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/120', '', 'OBJKT', '', '{flower,white}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 12:04:51.966678', '2025-04-14 12:04:51.966678', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 2, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (53, 'Blooming Night', 'Blooming Night', '/uploads/511d7c627918561e940d36b4ec5642bd.webp', 'Ink and Watercolor Reveries', 'https://objkt.com/tokens/KT1BthitQEX464sBEutLg1sCSNwM3ioMQyNT/124', '', 'OBJKT', '', '{blooming,night,watercolor,ink,lake,blue}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-21 21:32:52.60479', '2025-04-21 21:32:52.60479', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (54, 'Wild Wandering', 'Wild Wandering', '/uploads/aa99ec3dd8450bd4feb12cdc973cc82a.webp', 'Ink and Watercolor Reveries', 'https://objkt.com/tokens/KT1BthitQEX464sBEutLg1sCSNwM3ioMQyNT/127', '', 'OBJKT', '', '{yellow,black,nature,watercolor,ink,flowers}', 'NAD-AI-Art', 'https://objkt.com/@nad-ai-art', '2025-04-21 21:35:30.540089', '2025-04-21 21:35:30.540089', '/uploads/7724ba83269a5b467322fa2706fd5a42.webp', 0, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (39, 'the mobile set is off', 'You weren''t in love to understand the pain of lovers
You weren''t in the rain to understand the heartbreak of this weather
You didn''t cry for anyone to know what I''m saying
You weren''t sad, you laughed to tell me about the feeling of longing
You weren''t alone to understand the restless state of the heart
Your beloved didn''t leave to understand the anxiety of the train whistle
You didn''t lose to understand what the fear of losing is
You weren''t in my place to know what the difference is between you and me
You never went to the roadside to understand the wait
You weren''t worried to understand the passing of moments', '/uploads/cc73f3601e1836bffd2839fdafd6410b.jfif', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/39', '', 'OBJKT', '', '{road,dark,woman,car,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:48:58.753154', '2025-04-14 11:48:58.753154', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 4, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (36, 'Landscape #2', 'I find peace in the rain', '/uploads/776bab613dc8b426d43b666e6c76dc4a.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/23', '', 'OBJKT', '', '{dark,linework,rain,storm,darkness}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:22:51.790768', '2025-04-14 11:22:51.790768', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 5, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (34, 'Landscape #7', '#7', '/uploads/c61b71c0537853e894742ac0dc3d10ce.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/34', '', 'OBJKT', '', '{landscape,nature,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:14:12.027618', '2025-04-14 11:14:12.027618', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 7, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (41, 'Landscape 11', '#11', '/uploads/a3b895c7dada748ce35b076a8388f0fd.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/56', '', 'OBJKT', '', '{dark,nature,tree,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:55:23.089049', '2025-04-14 11:55:23.089049', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 10, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (42, 'Landscape 13', '#13', '/uploads/017f8fcccb794947b25536879ab39541.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/66', '', 'OBJKT', '', '{dark,nature,tree,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:58:04.516151', '2025-04-14 11:58:04.516151', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 11, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (43, 'Landscape 14', '#14', '/uploads/e0479bd1ccf929e3d1919a850f158e55.jfif', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/67', '', 'OBJKT', '', '{dark,horse,nature,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:59:55.616818', '2025-04-14 11:59:55.616818', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 12, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (47, 'Landscape - 18', '❤️', '/uploads/0dc4a6e41d00f9395d3eca91580c298b.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/129', '', 'OBJKT', '', '{nature,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 12:08:57.527643', '2025-04-14 12:08:57.527643', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 13, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (48, 'Landscape - 20', '#20', '/uploads/4901ba2e013bbf28ae5f623ed935f182.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/131', '', 'OBJKT', '', '{nature,linework,clouds,landscape}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 12:14:34.640416', '2025-04-14 12:14:34.640416', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 14, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (49, 'Landscape - 28', '#28', '/uploads/198ce8c13e2414ae58e81adf7e8046c7.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/153', '', 'OBJKT', '', '{nature,landscape,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 12:20:24.780197', '2025-04-14 12:20:24.780197', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 15, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (58, 'Landscape-33', '#33', '/uploads/a3af9029296355f5012ae3a0e9b7e70d.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/204', '', 'OBJKT', '', '{linework,nature,landscape}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-23 17:27:56.763508', '2025-04-23 17:27:56.763508', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 16, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (35, 'Palm Grove', 'life is a one time offer', '/uploads/64a041ea7be8fc6bfa2736b8cf891c50.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/13', '', 'OBJKT', '', '{dark,nature,life,linework,palm}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:18:26.326007', '2025-04-14 11:18:26.326007', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 8, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (38, 'Landscape #6', '#6', '/uploads/fb2809beb19bec7e8dd3f625c0087ab4.webp', 'Dark & lovely', 'https://objkt.com/tokens/KT1FgQDPru3yUGcrHvRXWRSGfL2DYJ5ScNaj/31', '', 'OBJKT', '', '{dark,fire,nature,forest,linework}', 'canvaŝ', 'https://objkt.com/users/tz1QaY2HyCLHf7UWUzEQyjb6HUwT2V2kXFae', '2025-04-14 11:46:03.95965', '2025-04-14 11:46:03.95965', '/uploads/e7187231b6b9827bc5ab940da14ff9ff.webp', 9, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (110, 'Wind Scene (Tezos) #47', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmYnaoieHMHg8rgaXZUpfc1rigHSHwgEiyTiQHSZcxPrRZ', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211423', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:46.615453', '2025-05-11 12:40:46.615453', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 6, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211423', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211423"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211423', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:46.556', 'published');
INSERT INTO public.portfolio_items VALUES (88, 'Plant #11', 'The illustration from the collection "Atlas Plantarum" features a highly imaginative and detailed depiction of a plant, combining elements of botanical realism with fantastical design.

Central Flower:
The plant has a large, central flower that dominates the composition. The flower resembles a sunflower, with multiple petals radiating outward. The petals are elongated and have a textured, almost feather-like appearance.
The center of the flower is intricate, with what appears to be a mechanical or steampunk-inspired core, featuring gears and metallic elements, giving it a unique and imaginative twist.

Stem and Leaves:
The stem is robust and detailed with smaller leaves and buds along its length. These smaller elements add complexity and depth to the plant''s structure.
The leaves are large, broad, and have a realistic texture with visible veins. They are arranged symmetrically around the stem, contributing to the plant''s balanced appearance.

Additional Elements:
Surrounding the plant are ornate, baroque-style decorations, including intricate patterns and motifs in the corners and along the border of the illustration. These decorations enhance the antique and artistic feel of the piece.
There are also decorative elements like hanging lanterns or chandeliers on either side of the plant, further emphasizing the imaginative and decorative nature of the illustration.
A braided or coiled tendril extends from the stem, adding an element of whimsy and further complexity to the plant''s design.

Color Scheme:
The illustration uses a limited color palette, primarily in shades of gold, green, and brown. This palette gives the plant a vintage and elegant appearance, reminiscent of old botanical prints.

Overall, the illustration combines botanical accuracy with imaginative and decorative elements, creating a visually striking and unique depiction of a plant that blends nature with art and fantasy.', 'https://ipfs.io/ipfs/QmUCnAz9eBE85wa81EiUAu5CjGkDtpVchX9A7CKEFX2NiM', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/10', NULL, 'OBJKT', NULL, '{atlas,plantarum,vintage,illustration,flower,flowers,scifi}', 'rokoroko', '', '2025-05-11 12:40:43.164968', '2025-05-11 12:40:43.164968', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 10, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_10', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"10"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/10', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:43.119', 'published');
INSERT INTO public.portfolio_items VALUES (96, 'Plant #13', 'This illustration Plant #13 from the "Atlas Plantarum" collection depicts a fantastical arrangement of plants set against a dark, starry background. The plants are intricately detailed, showcasing a blend of botanical accuracy and artistic imagination.

Floral Elements: The flowers are large and prominent, with layered petals that exhibit a gradient from light to dark shades. The petals are elongated and have a delicate, almost ethereal quality to them, with fine lines suggesting texture and depth.
Leaves: The leaves are broad and have a similar gradient effect, with veins meticulously drawn to give a sense of realism. The leaf shapes are varied, with some being more pointed and others more rounded, adding to the diversity of the plant forms.
Stems and Buds: The stems are slender and slightly curved, leading to various stages of buds and flowers. Some buds are closed, while others are in full bloom, showing the life cycle of the plant. The buds are particularly detailed, with a sense of potential and growth.
Background: The dark background is sprinkled with stars, giving the entire illustration a cosmic or otherworldly feel. This celestial theme is reinforced by the presence of a sun-like symbol at the top, radiating lines that could represent light or energy.
Artistic Style: The style is reminiscent of vintage botanical illustrations but with a modern twist. The use of gold highlights adds a luxurious and almost mystical quality to the plants, suggesting they might be from an imagined, exotic world.
Additional Elements: There are small decorative elements at the corners of the illustration, adding to the ornate and detailed nature of the artwork. These could be stylized representations of other plants or abstract designs.

Overall, this illustration combines elements of botanical art with imaginative fantasy, creating a visually rich and captivating depiction of plants that seem to belong to a different realm or universe.', 'https://ipfs.io/ipfs/QmS7EehGBjhhFApiagdVRNj2siYDEK1WLi4PHZEGycTMyZ', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/12', NULL, 'OBJKT', NULL, '{atlas,plantarum,flowers,scifi}', 'rokoroko', '', '2025-05-11 12:40:44.412349', '2025-05-11 12:40:44.412349', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 12, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_12', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"12"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/12', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:44.368', 'published');
INSERT INTO public.portfolio_items VALUES (81, 'Plant #4', 'The illustration from the Atlas Plantarum depicts an imaginative plant with several distinctive features:

Central Flower: At the center of the illustration is a large, vibrant red flower with multiple petals. The flower has a detailed, symmetrical structure, with a central part that appears to be textured and intricate.
Side Flowers: Flanking the central flower are two smaller flowers. On the left, there is a flower with a more compact, rounded shape, also red but with a different petal arrangement. On the right, there is a flower with a spiky, yellow center surrounded by white petals, giving it a dandelion-like appearance.
Leaves: The plant has broad, elongated green leaves with visible veins, growing symmetrically along the stem.
Stem: The stem is straight and green, supporting the flowers and leaves. It appears sturdy and well-defined.
Background and Decorations: The background is a light, parchment-like color with ornate decorations. There are geometric patterns and star-like symbols scattered around, adding a mystical or celestial theme to the illustration. The corners of the image feature circular designs that resemble compasses or suns, enhancing the overall aesthetic.
Text: The word "Ciam" is written near the bottom right of the illustration, possibly indicating the name of the plant or the artist''s signature.

The illustration combines elements of botanical art with a fantastical twist, creating a visually engaging and imaginative representation of a plant.', 'https://ipfs.io/ipfs/QmRRbfpD3CyQJsW9SGrWj2Gei8dyLkPaXUUvepWq1EfTjL', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/3', NULL, 'OBJKT', NULL, '{illustration,flower,botanical,atlas,plantarum,vintage,scifi,flowers}', 'rokoroko', '', '2025-05-11 12:40:42.086334', '2025-05-11 12:40:42.086334', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 3, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_3', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"3"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/3', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:42.041', 'published');
INSERT INTO public.portfolio_items VALUES (108, 'Wind Scene (Tezos) #45', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmQNJ6JX83TLfBPjksMMgnyAvTcaye3BPZHzAfCcdpJrd7', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211421', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:46.263183', '2025-05-11 12:40:46.263183', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 4, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211421', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211421"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211421', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:46.218', 'published');
INSERT INTO public.portfolio_items VALUES (137, 'RED #7', 'This piece of art from the "RED" collection is a digital artwork that blends elements of surrealism and portraiture. The dominant color scheme is a deep, intense red, which sets a dramatic and somewhat somber tone for the piece.

The subject of the artwork is a human face, but it is highly stylized and abstracted. The face is partially covered by geometric shapes that resemble a mask or armor. These shapes are textured with a cracked or fragmented pattern, suggesting themes of fragility, decay, or the passage of time. The mask-like structure covers the top half of the face, including the forehead and eyes, while the lower half, particularly the lips, remains uncovered and is rendered in a realistic style.

Key aspects of the artwork include:
Color: The use of red is striking, creating a sense of intensity and emotion. Red often symbolizes passion, danger, or power, and in this context, it might evoke a sense of raw emotional power or hidden intensity beneath the surface.
Texture: The cracks and fragmentation on the mask add a layer of complexity, possibly symbolizing the breaking down of barriers, the fragility of identity, or the impact of external pressures on the self.
Contrast: The contrast between the realistic lower face and the abstract, geometric upper face could represent the duality of human nature, where the external self (mask) is constructed and fragmented, while the true self (face) remains more authentic and vulnerable.
Lighting: The lighting is soft, with shadows that accentuate the contours of the face and the textures of the mask, giving the piece depth and a three-dimensional quality.

This artwork might be interpreted in several ways:
Identity and Masking: The mask could symbolize how individuals present themselves to the world versus their true selves, exploring themes of identity, authenticity, and the facades people wear.
Emotional State: The intense red and the cracked mask might represent an emotional state of turmoil, passion, or hidden pain.
Surrealism: The blending of realistic and abstract elements places this work in a surreal context, inviting viewers to question reality and perception.

Overall, this piece is a powerful exploration of human emotion, identity, and the masks we wear, using bold color and texture to convey depth and narrative.', 'https://ipfs.io/ipfs/QmbhB5HsJLHS3VJWrwpQDxAWnvKgjuy7d8tRxdd73mmqdR', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/6', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-11 12:40:50.784905', '2025-05-11 12:40:50.784905', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 5, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_6', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"6"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/6', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:50.74', 'published');
INSERT INTO public.portfolio_items VALUES (84, 'Plant #7', 'The illustration Plant #7 from the collection "Atlas Plantarum" features a collection of imaginative and stylized plants. Here''s a detailed description:

Color Scheme: The illustration primarily uses shades of yellow, green, and brown, creating a warm and harmonious palette.
Plant Forms:
Top Left: A plant with large, broad leaves and a central flower with numerous petals, resembling a daisy or sunflower.
Top Center: Two flowers with elongated petals, each with a central disc that is textured and detailed.
Top Right: A flower with pointed petals radiating from a central point, with a textured, almost spiky appearance.
Bottom Left: A flower similar to the top left, with large, broad leaves and a central flower with a textured center.
Bottom Center: A smaller flower with rounded petals and a central disc, simpler in design compared to the others.
Bottom Right: A star-shaped flower with intricate detailing on the petals, which appear to be segmented or scaled.
Leaves and Stems:
The leaves are elongated and vary in shape, some with pointed tips and others with more rounded edges.
The stems are thin and wiry, with some bearing buds or smaller flowers.
Additional Details:
Some plants have additional buds or seed pods, adding to the variety and complexity of the illustration.
The background is a light beige, which contrasts with the darker outlines and details of the plants, making them stand out.
Artistic Style:
The illustration has a vintage, botanical art feel, reminiscent of old scientific illustrations but with a fantastical twist.
The lines are clean and precise, with careful attention to texture and detail, giving the plants a lifelike yet imaginative appearance.

Overall, the illustration combines elements of realism with imaginative design, creating a visually appealing and unique depiction of plant life.', 'https://ipfs.io/ipfs/Qmc5qMQTP7TVGKgJz4szJh8HFZMfRFyQwT5rtb5EBmynEC', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/6', NULL, 'OBJKT', NULL, '{atlas,plantarum,vintage,flowers,scifi,illustration,flower}', 'rokoroko', '', '2025-05-11 12:40:42.546688', '2025-05-11 12:40:42.546688', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 6, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_6', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"6"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/6', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:42.503', 'published');
INSERT INTO public.portfolio_items VALUES (105, 'Wind Scene (Tezos) #42', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmeoswtZGBKQUdyMMc5LtLSpWQgBC5nujoHvuACXpVjybT', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211418', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:45.800451', '2025-05-11 12:40:45.800451', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 1, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211418', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211418"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211418', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:45.755', 'published');
INSERT INTO public.portfolio_items VALUES (118, 'Wind Scene (Tezos) #58', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmejfbwUhNuKmhk22HAs1cYNb8cVujkY4kzvxhuAg6h6xP', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211434', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:47.860823', '2025-05-11 12:40:47.860823', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 14, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211434', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211434"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211434', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:47.816', 'published');
INSERT INTO public.portfolio_items VALUES (119, 'Wind Scene (Tezos) #60', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmU2g4gTwbakQGETfBp9dMzQFE6T5tsNPdchuPX7974pbr', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211436', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:48.01529', '2025-05-11 12:40:48.01529', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 15, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211436', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211436"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211436', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:47.971', 'published');
INSERT INTO public.portfolio_items VALUES (120, 'Wind Scene (Tezos) #62', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmaUDiaDf2BKPVwNadW8N6FpaBkxtpLR9UJ9LN6346C2M3', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211438', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:48.169525', '2025-05-11 12:40:48.169525', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 16, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211438', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211438"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211438', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:48.125', 'published');
INSERT INTO public.portfolio_items VALUES (75, 'Bionic Girl 5 in motion', 'Bionic Girl #5 in motion. Complementary part to the original Bionic Girl #5.', 'https://ipfs.io/ipfs/QmWbgT8QVar1a25zuaSXvAjenE9gifRVXQAsFWvPwt7uz1', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/9', NULL, 'OBJKT', NULL, '{bionic,girl,cyborg,cybernetic,color,futuristic,moving,scifi}', 'rokoroko', '', '2025-05-11 12:40:41.159247', '2025-05-11 12:40:41.159247', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 9, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_9', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"9"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/9', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:41.115', 'published');
INSERT INTO public.portfolio_items VALUES (106, 'Wind Scene (Tezos) #43', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmZ6Vc8sCp6kBX2AsjKAAz8UXjXMGJXgppucGxB96yJsoH', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211419', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:45.955718', '2025-05-11 12:40:45.955718', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 2, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211419', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211419"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211419', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:45.91', 'published');
INSERT INTO public.portfolio_items VALUES (107, 'Wind Scene (Tezos) #44', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmXcJ2svBGoWgVNGd2qpo3YJomq1U7GTDwt97YHEncvY4U', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211420', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:46.110261', '2025-05-11 12:40:46.110261', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 3, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211420', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211420"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211420', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:46.065', 'published');
INSERT INTO public.portfolio_items VALUES (109, 'Wind Scene (Tezos) #46', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmRvZvpYC85jy3xNY35McAQoe1MAAZy4tqmbHWYGieNrra', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211422', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:46.423652', '2025-05-11 12:40:46.423652', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 5, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211422', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211422"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211422', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:46.378', 'published');
INSERT INTO public.portfolio_items VALUES (111, 'Wind Scene (Tezos) #48', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmYewWmuMWTcz3MBiz6hRKQcNhwwk7Snuats81n3hgRTrP', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211424', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:46.787766', '2025-05-11 12:40:46.787766', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 7, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211424', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211424"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211424', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:46.743', 'published');
INSERT INTO public.portfolio_items VALUES (121, 'Wind Scene (Tezos) #63', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmcNrUL14jEHBp5Wz5ixq5CAzCuxBfxehPB9rThmrRfa4X', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211439', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:48.323851', '2025-05-11 12:40:48.323851', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 17, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211439', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211439"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211439', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:48.279', 'published');
INSERT INTO public.portfolio_items VALUES (122, 'Wind Scene (Tezos) #64', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmUQC1rCvvVDqALwQW96PV98gaJ6d9pukGbYAHMHgYpwDH', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211440', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:48.479233', '2025-05-11 12:40:48.479233', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 18, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211440', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211440"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211440', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:48.435', 'published');
INSERT INTO public.portfolio_items VALUES (157, 'B&W #6', 'This piece from the "B&W" collection is a striking example of digital art with a focus on futuristic and possibly dystopian themes. Here''s a detailed description:

Color Scheme: The artwork is rendered in black and white, emphasizing high contrast and dramatic lighting. The dark background contrasts sharply with the illuminated subject, creating a sense of depth and focus.
Subject: The subject appears to be a humanoid figure or a mannequin, with a sleek, dark surface that absorbs light. The figure''s head and neck are prominently featured, with the head having a cracked, almost fragmented appearance, suggesting either damage or a deliberate design choice to convey a sense of deconstruction or decay.
Form: The form is highly stylized and abstract, with an elongated neck and a smooth, rounded head. The head features prominent, angular cracks that add a layer of complexity to the otherwise smooth surface. The ears are distinctly human-like, adding a touch of realism to the otherwise abstract form.
Texture: The texture of the figure''s surface is one of the most distinctive aspects. It has a cracked, almost reptilian appearance, with deep grooves and lines that suggest either wear and tear or an intentional design element. This texture contrasts with the smooth areas, enhancing the visual interest and depth of the piece.
Lighting: The lighting is dramatic, with a strong light source coming from the left side, casting shadows that emphasize the contours and textures of the figure. The light highlights the cracks and smooth areas, creating a play of light and shadow that adds to the three-dimensional quality of the artwork.
Composition: The composition is minimalist, with the figure centrally placed against a dark background. This focus on the figure, along with the high contrast lighting, draws the viewer''s attention directly to the subject, emphasizing its form and texture.

Possible interpretations of this artwork could include:

Futurism and Technology: The sleek, featureless form and the cracked texture might suggest themes of advanced technology, artificial intelligence, or robotics. The piece could be exploring the relationship between humans and machines or the future of human-like entities.
Decay and Impermanence: The cracked texture might represent decay or the passage of time, suggesting that even advanced technology or human constructs are subject to wear and tear. This could be a commentary on the impermanence of technology or the human condition.

', 'https://ipfs.io/ipfs/QmdSnosLiG3YVi4oV44xEUFqVQKQfQWYRoASaoFRnqJetj', 'B&W', 'https://objkt.com/tokens/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/5', NULL, 'OBJKT', NULL, '{B&W,body}', 'rokoroko', '', '2025-05-20 19:25:05.271451', '2025-05-20 19:25:05.271451', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 5, '2', 'KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq_5', 'tezos', '{"contract":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","tokenId":"5","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT19WB...Pviq","address":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","image":"https://ipfs.io/ipfs/QmXYhrPbsubfj2a49GSrJqtSwc7buqHALMGv3vLD5nZktq"}}', 'https://objkt.com/asset/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/5', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:05.223', 'published');
INSERT INTO public.portfolio_items VALUES (158, 'B&W #7', 'This piece from the "B&W" collection is a compelling example of digital art with a focus on themes of identity, anonymity, and possibly dystopian or futuristic elements. Here''s a detailed description:

Color Scheme: The artwork is monochromatic, primarily using shades of black and grey. The background is a gradient of dark gray, creating a moody and atmospheric setting that contrasts with the darker tones of the subject.
Subject: The subject appears to be a humanoid figure or mannequin with a sleek, dark surface. The head is featureless, with a smooth, rounded form that lacks distinct facial features, emphasizing anonymity or a loss of identity. The head is segmented by deep, angular lines or cracks, giving it a fragmented appearance.
Form: The form is highly stylized and abstract, with an elongated neck and a smooth, rounded head. The lack of facial features and the segmented head add to the abstract nature of the piece. The figure''s silhouette is elegant and minimalist, with smooth curves that contrast with the angular lines on the head.
Texture: The texture of the figure''s surface is smooth but features deep, angular lines or cracks that suggest either intentional design or a sense of wear and tear. These lines add depth and complexity to the otherwise smooth form, creating a visual tension between the smooth and the fragmented.
Lighting: The lighting is dramatic, with a strong light source coming from the left side, casting shadows that emphasize the contours and textures of the figure. The play of light and shadow enhances the three-dimensional quality of the artwork, highlighting the segments on the head and the smoothness of the neck and shoulders.
Composition: The composition is minimalist, with the figure centrally placed against a gradient background. This focus on the figure, along with the high contrast lighting, draws the viewer''s attention directly to the subject, emphasizing its form and the interplay of light and shadow.

Possible interpretations of this artwork could include:

Anonymity and Identity: The featureless face and segmented head might symbolize themes of anonymity, the loss of identity, or the dehumanization in a technological or dystopian future. The artwork could be exploring how individuals might lose their individuality in a world dominated by technology or conformity.
Fragmentation and Unity: The segmented head could represent the idea of fragmentation, either of the self or society. It might suggest themes of division, conflict, or the process of breaking down and rebuilding, pointing towards a need for unity
', 'https://ipfs.io/ipfs/QmYyf4vMSSVQXaj6L2SYKZtnzuqRLaS23kjvndWdtooBZD', 'B&W', 'https://objkt.com/tokens/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/6', NULL, 'OBJKT', NULL, '{B&W,body}', 'rokoroko', '', '2025-05-20 19:25:05.564136', '2025-05-20 19:25:05.564136', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 6, '2', 'KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq_6', 'tezos', '{"contract":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","tokenId":"6","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT19WB...Pviq","address":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","image":"https://ipfs.io/ipfs/QmXYhrPbsubfj2a49GSrJqtSwc7buqHALMGv3vLD5nZktq"}}', 'https://objkt.com/asset/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/6', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:05.524', 'published');
INSERT INTO public.portfolio_items VALUES (147, 'RED #13', 'This piece from the "RED" collection is a digital artwork that masterfully blends elements of abstraction, geometry, and portraiture. Here''s a detailed description:

Color Scheme: The artwork uses a vibrant pink background that creates a striking and somewhat surreal atmosphere. The figure''s face is rendered in black, white, and red, with the red sections appearing more textured and cracked.
Subject: The subject is a human face, but it is heavily stylized and abstracted. The face is composed of geometric shapes, with facets and angular lines that give it a fragmented, almost mosaic-like appearance.
Form: The geometric shapes forming the face include sharp angles and flat surfaces, creating a mask-like effect. The red sections, particularly on the cheek, have a rough, cracked texture that contrasts with the smoother black and white areas.
Texture: The texture in the red sections is particularly notable, with visible cracks and a rough surface that suggests wear, damage, or a sense of history and experience. This texture adds depth and complexity to the piece.
Lighting: The lighting is subtle but effective, highlighting the contours of the face and the textures of the different sections. Shadows and highlights are used to give the face a three-dimensional appearance, enhancing the depth of the artwork.
Composition: The figure is centrally placed, making it the focal point of the artwork. The use of geometric shapes and the division of the face into different colored sections draws the viewer''s eye and adds to the complexity of the composition.

Possible interpretations of this artwork could include:

Identity and Fragmentation: The geometric, fragmented appearance of the face might symbolize a fragmented sense of self or identity. The different colors and textures could represent various aspects or facets of a person''s identity.
Emotional Expression: The red sections might symbolize intense emotions such as passion, anger, or pain, while the black and white sections could represent neutrality or calmness. The cracked texture in the red areas might suggest emotional wounds or scars.
Modernity and Technology: The geometric, almost robotic appearance of the face could comment on the influence of technology on human identity, suggesting themes of transhumanism or the merging of human and machine.

Overall, this piece is a compelling exploration of human identity, emotion, and the impact of modernity, using bold colors, geometric forms, and textured surfaces to convey its message.
', 'https://ipfs.io/ipfs/QmXRkTzCvugWULj4MHpmKrgPVW17kLJG91gW4VoFK22BGH', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/12', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-20 19:25:02.014004', '2025-05-20 19:25:02.014004', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 12, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_12', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"12","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT1Anr...Rj5o","address":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","image":"https://ipfs.io/ipfs/QmXRkTzCvugWULj4MHpmKrgPVW17kLJG91gW4VoFK22BGH"}}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/12', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:01.962', 'published');
INSERT INTO public.portfolio_items VALUES (62, 'OrnaMENTAL Space Orb', 'This image showcases an intricate, symmetrical mechanical structure with a central circular pattern that expands outward in detailed layers. In the middle, there’s a large orb that looks like a smooth stone or metal sphere, encircled by several rings filled with fine engravings and mechanical components. From this central point, spoke-like gears fan outwards, creating a radiating, star-like effect that enhances the symmetry.

Surrounding the main circle, smaller circular elements and gears are spaced evenly, adding to the balanced layout. The design features ornate, steampunk-style decorations with dark, metallic tones, giving it an industrial yet futuristic and cosmic vibe. The symmetry and complexity of the piece make it look like an elaborate astronomical instrument or a mechanical mandala, merging elements of sci-fi and mysticism.', 'https://ipfs.io/ipfs/QmeAdFiyKBwcFEr44opPJPLfB9QG7eFePHyQA3uUvvpKPt', ' OrnaMENTAL Space Art', 'https://objkt.com/tokens/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/3', NULL, 'OBJKT', NULL, '{ornamental,space,orb,futuristic,scifi}', 'rokoroko', '', '2025-05-11 12:40:39.098219', '2025-05-11 12:40:39.098219', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 3, '2', 'KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL_3', 'tezos', '{"contract":"KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL","tokenId":"3"}', 'https://objkt.com/asset/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/3', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:39.053', 'published');
INSERT INTO public.portfolio_items VALUES (64, 'OrnaMENTAL Space Machine II', 'This image presents a complex, symmetrical mechanical structure centered around a circular design that extends outward in detailed layers. At its core is a large, orb-like feature that resembles a polished stone or metal sphere, encircled by rings adorned with intricate engravings and mechanical details. Gears and spokes radiate from this center, forming a starburst pattern that reinforces the balanced design.

Around the outer edge, smaller circular elements and gears are evenly spaced, enhancing the symmetry. The piece has an ornate, steampunk-inspired look, with dark, metallic textures that give it an industrial, otherworldly quality. The symmetry and fine detail make it resemble an elaborate cosmic instrument or a mechanical mandala, combining aspects of futuristic design and mystical themes', 'https://ipfs.io/ipfs/QmUXm6oYMhagVP2pRTvceUJBKMcwvf4QrvfQHdoQRYHroE', ' OrnaMENTAL Space Art', 'https://objkt.com/tokens/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/5', NULL, 'OBJKT', NULL, '{ornamental,space,machine,scifi,futuristic,mysticism}', 'rokoroko', '', '2025-05-11 12:40:39.41241', '2025-05-11 12:40:39.41241', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 5, '2', 'KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL_5', 'tezos', '{"contract":"KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL","tokenId":"5"}', 'https://objkt.com/asset/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/5', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:39.368', 'published');
INSERT INTO public.portfolio_items VALUES (66, 'Spinning OrnaMENTAL Space Machine II', 'Spinning addition to OrnaMENTAL Space Machine II 
mage presents a complex, symmetrical mechanical structure centered around a circular design that extends outward in detailed layers. At its core is a large, orb-like feature that resembles a polished stone or metal sphere, encircled by rings adorned with intricate engravings and mechanical details. Gears and spokes radiate from this center, forming a starburst pattern that reinforces the balanced design.

The spinning version reflects the moving dynamics of this mystical space gadget.', 'https://ipfs.io/ipfs/QmUXm6oYMhagVP2pRTvceUJBKMcwvf4QrvfQHdoQRYHroE', ' OrnaMENTAL Space Art', 'https://objkt.com/tokens/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/6', NULL, 'OBJKT', NULL, '{ornamental,space,machine,futuristic,sphere,metal,mysticism,spinning}', 'rokoroko', '', '2025-05-11 12:40:39.718323', '2025-05-11 12:40:39.718323', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 6, '2', 'KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL_6', 'tezos', '{"contract":"KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL","tokenId":"6"}', 'https://objkt.com/asset/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/6', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:39.674', 'published');
INSERT INTO public.portfolio_items VALUES (29, 'The Merchant II', 'The Merchant II', '/uploads/6f903b02f0bd809bb9b8aaa0b49681c0.png', 'Old Canvas', 'https://objkt.com/tokens/KT1U9gqRU3LgqL1avNtjGDPixCZvTu2ekCZU/8', '', 'OBJKT', '', '{canvas,merchant,pointillism}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 18, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (26, 'The Aristocratic Lady', 'The Aristocratic Lady', '/uploads/2e62418e4499ca2b43451c7abb1ac032.png', 'Old Canvas', 'https://objkt.com/tokens/KT1U9gqRU3LgqL1avNtjGDPixCZvTu2ekCZU/5', '', 'OBJKT', '', '{canvas,lady,aristocratic,pointillism}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 23, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (103, 'Glitched Girl #2', 'The second picture from the Glitched Girl Collection features a striking visual of a female figure whose image appears to be corrupted by digital glitches. The artwork is characterized by a dark, abstract background with splashes of vibrant colors, primarily in shades of blue and pink. These colors create a dynamic contrast against the darker tones, giving the image a sense of depth and movement.

The girl''s hair is depicted with dark, flowing strands that blend into the glitch effect, with streaks of lighter colors interspersed, suggesting both the chaos and beauty of digital corruption. The overall aesthetic of the piece conveys a sense of mystery and modernity, with the glitch elements adding a layer of complexity to the traditional subject matter of portraiture. The artwork seems to explore themes of identity in the digital age, where the line between the physical and virtual self is increasingly blurred.', 'https://ipfs.io/ipfs/QmWEcgsfW25nfQUWygnPQv2WTNdciK5aMxXdLtvU6XLeBe', 'Glitched Girl', 'https://objkt.com/tokens/KT1LZDJsHRhvPBt3xBoMee5wL8pgebNCzXUh/1', NULL, 'OBJKT', NULL, '{gliched,girl,dream,color}', 'rokoroko', '', '2025-05-11 12:40:45.488976', '2025-05-11 12:40:45.488976', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 1, '2', 'KT1LZDJsHRhvPBt3xBoMee5wL8pgebNCzXUh_1', 'tezos', '{"contract":"KT1LZDJsHRhvPBt3xBoMee5wL8pgebNCzXUh","tokenId":"1"}', 'https://objkt.com/asset/KT1LZDJsHRhvPBt3xBoMee5wL8pgebNCzXUh/1', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:45.444', 'published');
INSERT INTO public.portfolio_items VALUES (30, 'Grass #1', 'A detailed, vintage-style illustration of a wildflower meadow.
Tall grasses and delicate leaves intertwine with large poppies in shades of red, white, and beige.
The background has a soft, greenish hue with intricate line work, creating a dreamy, natural scene.', '/uploads/a4c9b427092b1bba42509f8c6db4f1c8.PNG', 'Grass Collection', 'https://objkt.com/tokens/KT1LMGbv8afdNvuSkMNQ4myR7rRyLNMrAhJK/0', '', 'OBJKT', '', '{green,botanical,floral,linework,natural,grass}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 2, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (8, 'Robot Face #6', 'A sleek robot with a glowing green cylindrical body and a small head, encased in a futuristic pod with curved metallic arms.
The design is high-tech, with a teal-lit background, giving a sci-fi laboratory vibe.

The hidden robot''s face is behind; step away from the monitor to see it!', '/uploads/c4fd7f9e038ca413f4c17a64d62dbed9.png', 'Robot Face', 'https://objkt.com/tokens/KT19BMu67iJyavkXYd2RbwRB64Fby2bUEi6Q/5', '', 'OBJKT', '', '{robotic,futuristic,scifi,green,bulb}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 16, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (76, 'OrnaMENTAL Space Eye', 'This image presents a surreal and intricate depiction of a "space eye." At its center is a large, lifelike eye with a metallic and futuristic design, resembling a blend of organic and mechanical elements. The iris and pupil area look deep and glossy, evoking a sense of vastness, like a black hole or a window into space.

Surrounding the eye are a variety of small, detailed structures that resemble spacecraft, satellites, gears, and mechanical parts. These elements are intricately layered and appear to radiate outward from the eye, giving a sense of both order and complexity. The entire arrangement is metallic and monochromatic, leaning towards dark shades with hints of reflective surfaces, contributing to a distinctly sci-fi, industrial feel.

The overall composition gives the impression that this "eye" could be an artificial intelligence observing the universe or a massive interstellar machine, symbolizing the fusion of human perception and technology in space exploration.', 'https://ipfs.io/ipfs/QmYALzvgFkCnHm2Pn3YkGB3bNrx6PST98QfnBZz1GjbDqF', ' OrnaMENTAL Space Art', 'https://objkt.com/tokens/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/7', NULL, 'OBJKT', NULL, '{space,eye,scifi,mysticism,futuristic,steampunk,technology,machine}', 'rokoroko', '', '2025-05-11 12:40:41.315039', '2025-05-11 12:40:41.315039', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 7, '2', 'KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL_7', 'tezos', '{"contract":"KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL","tokenId":"7"}', 'https://objkt.com/asset/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/7', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:41.269', 'published');
INSERT INTO public.portfolio_items VALUES (129, 'Stripes Mesh Painting 001', 'Stripes Mesh Painting by Chris Follows - Time-based Neon Screensaver 2000 x 2000 px', 'https://ipfs.io/ipfs/QmTC2tkAfDn47cspKkpVrFP7mWsDCadWixMdLmXaYH5Yp9', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', ' Chris Follows', NULL, '2025-05-11 12:40:49.554319', '2025-05-11 12:40:49.554319', '/uploads/128b6cd9ed91fb7bbd452c25506fc1d6.jfif', 6, '2', 'KT1K7P8DtehNPn8oLFMEmhSFxk91bp8wKLpp_0', 'tezos', '{"contract":"KT1K7P8DtehNPn8oLFMEmhSFxk91bp8wKLpp","tokenId":"0"}', 'https://objkt.com/asset/KT1K7P8DtehNPn8oLFMEmhSFxk91bp8wKLpp/0', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:49.509', 'published');
INSERT INTO public.portfolio_items VALUES (115, 'Wind Scene (Tezos) #52', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmSN77QjDYBQErAoBaVhc9QZrxDGaiYkQWbVpHBsmq2YfN', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211428', NULL, 'OBJKT', NULL, '{scene,wind,fx}', 'Leo Hu', '', '2025-05-11 12:40:47.402489', '2025-05-11 12:40:47.402489', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 11, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211428', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211428"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211428', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:47.358', 'published');
INSERT INTO public.portfolio_items VALUES (77, 'Space Eye in Motion', 'This is in motion version of Space Eye:
This image presents a surreal and intricate depiction of a "space eye." At its center is a large, lifelike eye with a metallic and futuristic design, resembling a blend of organic and mechanical elements. The iris and pupil area look deep and glossy, evoking a sense of vastness, like a black hole or a window into space.

Surrounding the eye are a variety of small, detailed structures that resemble spacecraft, satellites, gears, and mechanical parts. These elements are intricately layered and appear to radiate outward from the eye, giving a sense of both order and complexity. The entire arrangement is metallic and monochromatic, leaning towards dark shades with hints of reflective surfaces, contributing to a distinctly sci-fi, industrial feel.

The overall composition gives the impression that this "eye" could be an artificial intelligence observing the universe or a massive interstellar machine, symbolizing the fusion of human perception and technology in space exploration.', 'https://ipfs.io/ipfs/QmYALzvgFkCnHm2Pn3YkGB3bNrx6PST98QfnBZz1GjbDqF', ' OrnaMENTAL Space Art', 'https://objkt.com/tokens/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/8', NULL, 'OBJKT', NULL, '{space,eye,futuristic,scifi,mysticism,moving,steampunk,technology,machine}', 'rokoroko', '', '2025-05-11 12:40:41.46858', '2025-05-11 12:40:41.46858', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 8, '2', 'KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL_8', 'tezos', '{"contract":"KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL","tokenId":"8"}', 'https://objkt.com/asset/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/8', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:41.424', 'published');
INSERT INTO public.portfolio_items VALUES (63, 'Spinning  OrnaMENTAL Space Orb', 'Spinning  OrnaMENTAL Space Orb is a moving version of OrnaMENTAL Space Orb', 'https://ipfs.io/ipfs/QmeAdFiyKBwcFEr44opPJPLfB9QG7eFePHyQA3uUvvpKPt', ' OrnaMENTAL Space Art', 'https://objkt.com/tokens/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/4', NULL, 'OBJKT', NULL, '{space,orb,mandala,spinning,mysticism,scifi,futuristic}', 'rokoroko', '', '2025-05-11 12:40:39.256162', '2025-05-11 12:40:39.256162', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 4, '2', 'KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL_4', 'tezos', '{"contract":"KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL","tokenId":"4"}', 'https://objkt.com/asset/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/4', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:39.212', 'published');
INSERT INTO public.portfolio_items VALUES (25, 'The Lady with Hat', 'The Lady with Hat', '/uploads/8c043ad5c375aea1308ba841cf5df4a3.png', 'Old Canvas', 'https://objkt.com/tokens/KT1U9gqRU3LgqL1avNtjGDPixCZvTu2ekCZU/4', '', 'OBJKT', '', '{canvas,lady,hat,pointillism}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 22, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (128, 'uNTITLED', 'Arts of Chet Animation 2024
This token is created from 100% hand-drawn digital drawings in 2024 on the tablet application.

Size: 2,048 × 2,048 pixels 30*f .gif
By Arts of Chet

Arts of Chet retains full ownership, including the right to sell all original artworks.', 'https://ipfs.io/ipfs/Qma5zmFM5XAGKRVqDjYUrF4aKVMr8VckSbTko96dYN3sDS', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Arts of Chet', NULL, '2025-05-11 12:40:49.400511', '2025-05-11 12:40:49.400511', '/uploads/b677739201a44be412496e3b97ac9b25.jfif', 0, '2', 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton_861159', 'tezos', '{"contract":"KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton","tokenId":"861159"}', 'https://objkt.com/asset/KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton/861159', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:49.356', 'published');
INSERT INTO public.portfolio_items VALUES (68, 'Bionic Girl #2', 'This artwork portrays a bionic girl with a striking fusion of human and machine elements. Her expression is intense, and her gaze is direct, giving her a powerful and determined presence. She wears large, mechanical headphones that have a futuristic design, filled with intricate details, circuits, and gears, emphasizing the cybernetic theme.

Her hair flows naturally, blending seamlessly with metallic and robotic parts embedded in her body and clothing, creating an elegant, high-tech aesthetic. The background is composed of abstract, geometric patterns, with various mechanical and industrial shapes, adding depth and complexity to the scene. The monochromatic color scheme, with shades of gray, silver, and black, enhances the futuristic, sci-fi feel. This piece combines elements of technology and humanity, capturing the essence of a cybernetic, bionic character.', 'https://ipfs.io/ipfs/QmPrje4C2QvKsX5qsDKh7CM4rquJXVRG7pz8ycNrHLq1rS', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/2', NULL, 'OBJKT', NULL, '{bionic,girl,futuristic,cybernetic,scifi}', 'rokoroko', '', '2025-05-11 12:40:40.026912', '2025-05-11 12:40:40.026912', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 2, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_2', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"2"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/2', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:39.982', 'published');
INSERT INTO public.portfolio_items VALUES (70, 'Bionic Girl #3', 'This image features a bionic girl standing at the center, clad in a sleek, futuristic suit that blends technology with a human form. Her suit has a metallic, biomechanical look, with panels and geometric patterns that highlight her streamlined figure. The suit design is detailed, with darker segments and reflective surfaces, giving it an armor-like quality while maintaining a flexible, functional appearance.

Her stance is confident and straight, with arms at her sides, exuding a strong, composed presence. The background is filled with intricate, abstract, and mechanical elements, such as gears, dials, and circuit-like patterns arranged in a symmetrical and orderly fashion. This setup surrounds her with a sense of technological sophistication, enhancing the sci-fi atmosphere. The monochromatic palette, dominated by black, white, and shades of gray, adds a timeless, high-tech feel that blends themes of human and machine integration.




', 'https://ipfs.io/ipfs/QmZnce7hcap9juGvwEgerqzWbyb8VKBL1z8si8XwhzesFp', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/4', NULL, 'OBJKT', NULL, '{bionic,girl,scifi,futuristic,monochromatic}', 'rokoroko', '', '2025-05-11 12:40:40.334707', '2025-05-11 12:40:40.334707', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 4, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_4', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"4"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/4', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:40.29', 'published');
INSERT INTO public.portfolio_items VALUES (90, 'Plant #1', 'This photographic picture showcases a highly imaginative and intricate plant from the "Otherworld Plants" collection. Here''s a detailed description:

Color Palette: The plant features a striking color scheme dominated by shades of red and white. The central part of the plant is a deep, rich red, transitioning to lighter, almost white tips at the ends of its structures.
Structure and Form: The plant has a symmetrical, almost fractal-like structure. It appears to be composed of numerous small, pointed segments that radiate outward from a central point. Each segment is tipped with a white, claw-like structure, giving the plant a somewhat menacing appearance.
Texture: The texture is smooth and glossy, with the red parts having a slightly velvety look, while the white tips seem to be more rigid and sharp.
Symmetry: The plant exhibits perfect radial symmetry, with each segment mirroring the others around the central axis. This symmetry adds to the plant''s otherworldly and almost mechanical aesthetic.
Detail: The intricate detailing on the plant is remarkable. The central part has tiny, hair-like structures, adding to the complexity and giving it a sense of depth and realism despite its fantastical nature.
Background: The background is blurred, with soft green hues, which helps to emphasize the vivid colors and intricate details of the plant itself.

Overall, the plant looks like it belongs in a science fiction or fantasy setting, with its unusual form and color scheme suggesting an environment far removed from typical Earth flora. The attention to detail and the imaginative design make it a captivating piece from the Otherworld Plants collection.', 'https://ipfs.io/ipfs/QmeELitzxgbh9CN83n1MvoUUKEy77SEspcnSZNkbQeW67Z', 'Otherworld Plants', 'https://objkt.com/tokens/KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR/0', NULL, 'OBJKT', NULL, '{colorful,scifi,botanical,flower,photo}', 'rokoroko', '', '2025-05-11 12:40:43.474532', '2025-05-11 12:40:43.474532', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR_0', 'tezos', '{"contract":"KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR","tokenId":"0"}', 'https://objkt.com/asset/KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR/0', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:43.43', 'published');
INSERT INTO public.portfolio_items VALUES (72, 'Bionic Girl #4', 'This image, titled "Bionic Girl #4," features a woman portrayed as a bionic or cyborg entity with intricate mechanical and futuristic elements. Her face has a serious, stoic expression, and she wears advanced, metallic headgear that resembles headphones or a helmet integrated with gears and circuits. The image combines human and robotic aesthetics, blending organic and mechanical forms. Her outfit has detailed metallic parts, evoking a futuristic armor or exoskeleton with a sleek design. The color palette is predominantly blue and orange, giving a modern and slightly industrial feel, and the background features abstract shapes and gears, enhancing the technological theme. This artwork beautifully fuses human beauty with machine-like elements, creating a compelling vision of a futuristic, bionic character.', 'https://ipfs.io/ipfs/QmXeo6HCQk5Zj9BjUSWC3jy4TN5DAhJDKAZ56pWYoGHadU', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/6', NULL, 'OBJKT', NULL, '{bionic,girl,colorful,metalic,futuristic,scifi}', 'rokoroko', '', '2025-05-11 12:40:40.657879', '2025-05-11 12:40:40.657879', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 6, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_6', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"6"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/6', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:40.605', 'published');
INSERT INTO public.portfolio_items VALUES (74, 'Bionic Girl #5', 'This image, titled "Bionic Girl #5," presents a highly detailed, futuristic depiction of a woman with cyborg features. 
Her face and neck are embedded with metallic plates, gears, and intricate circuits, blending human and machine elements seamlessly. She wears a large, advanced headset, with circular components and metallic textures, giving a sci-fi feel. The design incorporates floral details and organic patterns amidst the mechanical parts, symbolizing a fusion of nature and technology. 
Her expression is calm and composed, and her eyes have a focused intensity. 
The background is filled with abstract mechanical shapes and gears, accentuating the advanced, engineered aesthetic. 
The color scheme is a cool blend of blue, grey, and hints of orange, creating a cohesive, futuristic vibe. This artwork captures the essence of a futuristic being who embodies both humanity and advanced technology.', 'https://ipfs.io/ipfs/QmWbgT8QVar1a25zuaSXvAjenE9gifRVXQAsFWvPwt7uz1', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/8', NULL, 'OBJKT', NULL, '{bionic,girl,futuristic,scifi,color,cybernetic,cyborg,metalic}', 'rokoroko', '', '2025-05-11 12:40:41.006166', '2025-05-11 12:40:41.006166', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 8, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_8', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"8"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/8', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:40.962', 'published');
INSERT INTO public.portfolio_items VALUES (152, 'B&W #1', 'This piece from the "B&W" collection is a striking example of minimalist and abstract art. Here''s a detailed description:

- **Color Scheme**: The artwork is rendered entirely in black and white. The background is predominantly black, creating a stark contrast with the illuminated subject.

- **Subject**: The subject appears to be a human form, possibly a torso or an abstract representation of a human body. The form is smooth and curvilinear, with subtle contours that suggest the shape of a body without explicit detail.

- **Form**: The form is highly stylized and abstract. It is defined by smooth, flowing lines and curves, with a central light source illuminating part of the form, creating a gradient from light to dark. The light highlights the contours and gives a sense of volume and depth.

- **Texture**: The texture is smooth, with the light playing on the surface to create a soft, almost velvety appearance. The contrast between the illuminated and shadowed areas adds to the tactile quality of the piece.

- **Lighting**: The lighting is dramatic and focused, illuminating a small portion of the form and leaving the rest in shadow. This creates a high contrast effect, emphasizing the play of light and shadow and adding a sense of mystery and depth to the artwork.

- **Composition**: The composition is simple yet powerful. The central placement of the illuminated form against the dark background draws the viewer''s attention directly to the subject. The smooth, flowing lines of the form create a sense of movement and fluidity.

Possible interpretations of this artwork could include:

- **Human Presence**: The abstract human form might symbolize the essence of human presence or the human condition, focusing on the form rather than the identity or details of the person.

- **Light and Shadow**: The use of light and shadow could represent themes of revelation and concealment, knowledge and ignorance, or presence and absence. The interplay of light and dark might also suggest the duality of human experience.

- **Minimalism**: The piece''s simplicity and focus on form and light align with minimalist principles, emphasizing the beauty in simplicity and the impact of basic elements like shape, light, and contrast.

- **Emotion and Mood**: The monochromatic palette and the dramatic lighting can evoke a range of emotions, from contemplation to solitude, depending on the viewer''s interpretation.

Overall, this piece is a compelling exploration of form, light, and minimalism, inviting viewers to contemplate the interplay of contrasts and the quiet power of negative space. It encourages a meditative engagement, sparking emotions through its simplicity and depth.', 'https://ipfs.io/ipfs/QmXYhrPbsubfj2a49GSrJqtSwc7buqHALMGv3vLD5nZktq', 'B&W', 'https://objkt.com/tokens/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/0', NULL, 'OBJKT', NULL, '{B&W,body}', 'rokoroko', '', '2025-05-20 19:25:03.690143', '2025-05-20 19:25:03.690143', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq_0', 'tezos', '{"contract":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","tokenId":"0","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT19WB...Pviq","address":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","image":"https://ipfs.io/ipfs/QmXYhrPbsubfj2a49GSrJqtSwc7buqHALMGv3vLD5nZktq"}}', 'https://objkt.com/asset/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/0', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:03.613', 'published');
INSERT INTO public.portfolio_items VALUES (142, 'RED #12', 'This piece from the "RED" collection is a striking digital artwork that combines abstract and geometric elements with a strong use of color. Here''s a detailed description:

Color Scheme: The artwork predominantly uses shades of red, black, and gray. The background is a vivid red, providing a bold and dramatic setting. The figure itself is rendered in black and gray tones, creating a stark contrast against the red background.
Subject: The subject appears to be a human figure, but it is highly stylized and abstracted. The figure is composed of geometric shapes, with sharp angles and facets, giving it a futuristic or robotic appearance.
Form: The figure''s head and upper body are depicted using angular, block-like shapes. The head, in particular, is rendered in a way that suggests a helmet or mask, with distinct sections that are separated by lines and different shades.
Texture: The texture of the figure is notable, with visible cracks and rough edges, especially in the gray sections. This texture might symbolize wear, damage, or a sense of history and experience.
Lighting: The lighting is soft but effective, highlighting the contours and textures of the figure. Shadows and highlights are used to give the figure a three-dimensional appearance, enhancing the depth of the piece.
Composition: The figure is centrally placed, making it the focal point of the artwork. The use of geometric shapes and the division of the figure into different colored sections draws the viewer''s eye and adds to the complexity of the composition.

Possible interpretations of this artwork could include:

Futurism and Technology: The geometric, almost robotic form of the figure might be commenting on the intersection of humanity and technology, suggesting themes of transhumanism or the future of human identity.
Identity and Fragmentation: The cracked and fragmented appearance of the figure could represent a fragmented sense of self or identity, perhaps influenced by external pressures or internal conflicts.
Emotional Intensity: The red background might symbolize intense emotions such as passion, anger, or urgency, contrasting with the cold, mechanical appearance of the figure.

Overall, this piece is a compelling exploration of human identity, technology, and emotion, using bold colors and abstract forms to convey its message.', 'https://ipfs.io/ipfs/QmTTq85aLRKXNL7MgMWRQJGAZg35yYPgGFndTunySm8YQm', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/11', NULL, 'OBJKT', NULL, '{}', 'rokoroko', '', '2025-05-11 12:40:51.554896', '2025-05-11 12:40:51.554896', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 11, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_11', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"11"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/11', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:51.51', 'published');
INSERT INTO public.portfolio_items VALUES (153, 'B&W #2', 'This piece from the "B&W" collection is a study in form, light, and texture, rendered in grayscale. Here''s a detailed description:

Color Scheme: The artwork is monochromatic, using shades of gray ranging from deep black to bright white. This choice emphasizes the play of light and shadow.
Subject: The subject appears to be an abstract representation of a human shoulder and neck. The form is smooth and curvilinear, with soft contours that suggest the human anatomy without explicit detail.
Form: The form is highly stylized and abstract. It is defined by smooth, flowing lines and curves, with a central light source illuminating part of the form, creating a gradient from light to dark. The light highlights the contours, giving a sense of volume and depth.
Texture: The texture is subtle and smooth, with the light playing on the surface to create a soft, almost velvety appearance. The contrast between the illuminated and shadowed areas adds to the tactile quality of the piece.
Lighting: The lighting is dramatic and focused, illuminating a small portion of the form and leaving the rest in shadow. This creates a high contrast effect, emphasizing the interplay of light and shadow and adding a sense of mystery and depth to the artwork.
Composition: The composition is simple yet powerful. The central placement of the illuminated form against the dark background draws the viewer''s attention directly to the subject. The smooth, flowing lines of the form create a sense of movement and fluidity.

Possible interpretations of this artwork could include:

Human Presence: The abstract human form might symbolize the essence of human presence or the human condition, focusing on the form rather than the identity or details of the person.
Light and Shadow: The use of light and shadow could represent themes of revelation and concealment, knowledge and ignorance, or presence and absence. The interplay of light and dark might also suggest the duality of human experience.
Minimalism: The piece''s simplicity and focus on form and light align with minimalist principles, emphasizing the beauty in simplicity and the impact of basic elements like shape, light, and contrast.
Emotion and Mood: The monochromatic palette and the dramatic lighting can evoke a range of emotions, from contemplation to solitude, depending on the viewer''s interpretation.

Overall, this piece is a compelling exploration of form, light, and minimalism, inviting viewers to reflect on the interplay of light and shadow and the abstract representation of the human form.', 'https://ipfs.io/ipfs/QmeEZf3gW7yUR37QV16S3NH72ri7sdntiZwiFMUBSC99gE', 'B&W', 'https://objkt.com/tokens/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/1', NULL, 'OBJKT', NULL, '{B&W,body}', 'rokoroko', '', '2025-05-20 19:25:04.069551', '2025-05-20 19:25:04.069551', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 1, '2', 'KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq_1', 'tezos', '{"contract":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","tokenId":"1","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT19WB...Pviq","address":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","image":"https://ipfs.io/ipfs/QmXYhrPbsubfj2a49GSrJqtSwc7buqHALMGv3vLD5nZktq"}}', 'https://objkt.com/asset/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/1', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:04.022', 'published');
INSERT INTO public.portfolio_items VALUES (24, 'The Merchant', 'The Merchant', '/uploads/3a8ad89f176d03213be52bd9f9c87be9.png', 'Old Canvas', 'https://objkt.com/tokens/KT1U9gqRU3LgqL1avNtjGDPixCZvTu2ekCZU/3', '', 'OBJKT', '', '{canvas,merchant,pointillism}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 19, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (20, 'Old Man', 'The image shows an elderly man with a wrinkled face and flowing white hair, wearing a ruffled shirt and dark coat.
His expression is contemplative, with deep-set eyes and a bushy beard.
The dark, textured background highlights the classical painting style.', '/uploads/b3da09606ff1e882b73cbb85e2e1e016.png', ' Portraiture', 'https://objkt.com/tokens/KT1Br8Lfuav3dbGX1DWESNDkDh3p6dJdKFAv/4', '', 'OBJKT', '', '{portrait,painting,old,man,eldery}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 22, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (102, 'Glitched Girl #1', 'This introductory image from the Glitched Girl Collection presents a young woman with a somber, enigmatic expression, her face partially shrouded in shadow and digital distortion. 
Soft teal, pink, and purple hues blend together, creating an otherworldly aura that contrasts with her solemn gaze. The glitch effects, seen as faint lines, fragmented shapes, and smudged textures, give the impression of a digital breakdown or malfunction, as if she exists in a world between reality and a digital realm.

Her slightly dishevelled, dark hair blends into the abstract background, where layers of geometric forms and splattered textures intensify the image''s moodiness. The circular, faded overlay behind her head hints at something celestial, adding to her mystical and surreal presence. This haunting image sets the tone for the collection, exploring themes of vulnerability, isolation, and the delicate balance between human and machine.', 'https://ipfs.io/ipfs/QmNf65Cf64Wrae5xsaKF7jJPK3EukyqJXBtkJsDmxwbFem', 'Glitched Girl', 'https://objkt.com/tokens/KT1LZDJsHRhvPBt3xBoMee5wL8pgebNCzXUh/0', NULL, 'OBJKT', NULL, '{glitched,girl,color,dream}', 'rokoroko', '', '2025-05-11 12:40:45.335369', '2025-05-11 12:40:45.335369', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1LZDJsHRhvPBt3xBoMee5wL8pgebNCzXUh_0', 'tezos', '{"contract":"KT1LZDJsHRhvPBt3xBoMee5wL8pgebNCzXUh","tokenId":"0"}', 'https://objkt.com/asset/KT1LZDJsHRhvPBt3xBoMee5wL8pgebNCzXUh/0', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:45.292', 'published');
INSERT INTO public.portfolio_items VALUES (21, 'The Lace Maker by the Windmills', 'The Lace Maker by the Windmills', '/uploads/2eb90a2634a8536477cdb1963f127b4d.png', 'Old Canvas', 'https://objkt.com/tokens/KT1U9gqRU3LgqL1avNtjGDPixCZvTu2ekCZU/0', '', 'OBJKT', '', '{canvas,old,lace,windmills,pointillism,young,lady}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 5, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (6, 'Robot Face #4', 'A figure in a futuristic blue and black robotic suit with "TRON" branding, holding a smartphone.
The suit features metallic accents and glowing yellow details, set against a lush green forest path.
The look is sleek and high-tech. 

The hidden robot''s face is behind; step away from the monitor to see it!', '/uploads/f58818c410e89096872fb86dc771a360.png', 'Robot Face', 'https://objkt.com/tokens/KT19BMu67iJyavkXYd2RbwRB64Fby2bUEi6Q/3', '', 'OBJKT', '', '{robotic,robot,futuristic,scifi,face}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 14, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (28, 'The Lady with Hat III', 'The Lady with Hat III', '/uploads/380e44d402ddb43ab3a62eec27622082.png', 'Old Canvas', 'https://objkt.com/tokens/KT1U9gqRU3LgqL1avNtjGDPixCZvTu2ekCZU/7', '', 'OBJKT', '', '{canvas,lady,hat,pointillism,flowers}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 7, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (156, 'B&W #5', 'This piece from the "B&W" collection appears to be a digital or photographic artwork with a focus on high contrast and abstract forms. Here''s a detailed description:

Color Scheme: The artwork is rendered in black and white, utilizing a stark contrast to create a dramatic effect. The background is predominantly black, with the subject illuminated in shades of gray.
Subject: The subject seems to be an abstract form, possibly a close-up of a textured surface or an abstract representation of a natural element like a rock or a cliff face. The texture is intricate, with fine lines and patterns that resemble cracks or veins.
Form: The form is abstract and non-representational. It appears to be an organic shape, possibly resembling a piece of rugged terrain or a natural formation. The form is smooth in some areas and highly detailed in others, creating a juxtaposition of textures.
Texture: The texture is one of the most striking elements of this piece. The surface has a complex, almost organic texture with fine lines that create a network of patterns. This texture might be indicative of weathering, erosion, or a natural geological process.
Lighting: The lighting is dramatic, with a strong light source highlighting the texture of the subject. The light creates a gradient from dark to light, emphasizing the contours and depth of the form. The light appears to come from above, casting shadows that enhance the texture.
Composition: The composition is minimalist, focusing on the interplay between light and shadow on the textured surface. The subject is centrally placed, with the black background providing a stark contrast that draws attention to the illuminated area.

Possible interpretations of this artwork could include:

Nature and Geology: The piece could be exploring themes of natural formations, geological processes, or the beauty found in the textures of nature. The cracked, vein-like patterns might symbolize the passage of time or the forces of nature at work.
Abstraction and Form: The abstract nature of the piece might be an exploration of form and texture for their own sake, without a specific subject. This could be an exercise in visual perception, inviting viewers to interpret the form in their own way.
Contrast and Emotion: The high contrast between black and white could evoke high emotions.', 'https://ipfs.io/ipfs/QmVMSxJZJ4XF7gb7x5BoMsWzHmfMtFzJsTrpy4SfCfYVa2', 'B&W', 'https://objkt.com/tokens/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/4', NULL, 'OBJKT', NULL, '{B&W,body}', 'rokoroko', '', '2025-05-20 19:25:04.970744', '2025-05-20 19:25:04.970744', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 4, '2', 'KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq_4', 'tezos', '{"contract":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","tokenId":"4","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT19WB...Pviq","address":"KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq","image":"https://ipfs.io/ipfs/QmXYhrPbsubfj2a49GSrJqtSwc7buqHALMGv3vLD5nZktq"}}', 'https://objkt.com/asset/KT19WBXWwJ6W9Pu7nDggk1fw12G7NycWPviq/4', 'OBJKT', NULL, 'XTZ', false, '2025-05-20 19:25:04.933', 'published');
INSERT INTO public.portfolio_items VALUES (112, 'Wind Scene (Tezos) #49', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmceFoicNQmmQ6YDiQwY6GP7oGsMzqwFy45CF75MhDaSo4', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211425', NULL, 'OBJKT', NULL, '{wind,scene,FX}', 'Leo Hu', '', '2025-05-11 12:40:46.942478', '2025-05-11 12:40:46.942478', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 8, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211425', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211425"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211425', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:46.898', 'published');
INSERT INTO public.portfolio_items VALUES (116, 'Wind Scene (Tezos) #54', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmcTKR2yJ461NMUov5iZBmwjEAPmb6kc6qEPzV8T5eJ9xk', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211430', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:47.555209', '2025-05-11 12:40:47.555209', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 12, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211430', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211430"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211430', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:47.512', 'published');
INSERT INTO public.portfolio_items VALUES (33, 'Robot Face #1', 'A sleek robotic face with a metallic finish, glowing orange eyes, and "TRON" branding. It features intricate mechanical details, green neon accents, and a futuristic design, set against a cosmic blue background with a high-tech, sci-fi vibe.', '/uploads/1a27d288b45ff5c14d7bc52ce4dfa39f.png', 'Robot Face', 'https://objkt.com/tokens/KT19BMu67iJyavkXYd2RbwRB64Fby2bUEi6Q/0', '', 'OBJKT', '', '{robot,face,futuristic,robotic,neon,scifi,android}', 'rokoroko', '', '2025-04-13 09:52:22.986859', '2025-04-13 09:52:22.986859', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 11, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (123, 'Fluid Edge #204', '~~ FLUID EDGE ~~

Press [s] to save a png at the current resolution.

Press [x] to save a svg at the current resolution.

Press [2/4/6/8/0] to change resolution to 2/4/6/8/10K along the shortest edge.

Press [l] to initiate download of 400 png frames at current resolution. Can be assembled into a perfectly looping video / GIF.

Press [space] to pause/unpause animation.

This work uses p5.js and p5.svg.js libraries.', 'https://ipfs.io/ipfs/QmaGDEZr1RHY21iBn1Xdoszhw77GmPPuAJACVd9apNQ7C1', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:48.633124', '2025-05-11 12:40:48.633124', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211460', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211460"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211460', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:48.589', 'published');
INSERT INTO public.portfolio_items VALUES (124, 'Piet Max #171', 'A 3D Mondrian, with textures inspired by the art of Peter Max.

Press "x" to generate a new version.
Press "s" to save as a 4K png file. Best viewed fullscreen on a 4K monitor.

[Note: this will be the last work of mine published here on fxhash. It''s been a fun community to be a part of (may still collect now and then)]', 'https://ipfs.io/ipfs/QmbgscUuTCo8ke4EXnfss4UfEozCuooaBo4YadvpqPBeNa', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:48.787228', '2025-05-11 12:40:48.787228', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_206838', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"206838"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/206838', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:48.743', 'published');
INSERT INTO public.portfolio_items VALUES (97, 'Phase Separation #2', 'Corralling millions of paths to generate abstract, surreal realms, dreamscapes, places elusive, ephemeral, which can''t quite be described, certainly not held, transient, roiling, weaving threads of alternate realities, or perhaps the separation of existence from reality, as immiscible phases...

Press [2/4/6/8/0] to redraw at 2/4/6/8/10K along the longest edge.

Press [space] to pause drawing.

Press [s] to save a png at current resolution. ', 'https://ipfs.io/ipfs/QmPEQSKvqWPACMWEaRtMBbqJoD2QaZsFHK2g8TRLtscjFF', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:44.566511', '2025-05-11 12:40:44.566511', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_202143', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"202143"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/202143', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:44.522', 'published');
INSERT INTO public.portfolio_items VALUES (60, 'Ornamental Space Machine', 'This image depicts a highly detailed, symmetrical, mechanical structure with a central, circular design that radiates outwards in intricate layers. At the center, there’s a large, orb-like element that resembles a polished stone or metallic sphere, which is surrounded by multiple rings adorned with fine engravings and mechanical parts. Radiating from this center, gear-like spokes extend outward, creating a starburst effect that reinforces the symmetrical design.

Around the outer circle, various smaller circular elements and gears are positioned evenly, enhancing the symmetrical layout. The design includes ornate, steampunk-inspired decorations with dark, metallic textures, giving it an industrial, futuristic, and celestial feel. The artwork’s symmetry and complexity make it resemble an elaborate astronomical device or a mechanical mandala, blending themes of science fiction and mysticism.', 'https://ipfs.io/ipfs/QmRWoUHbYgeXQXRxb9t8shNxpuAjFc42gwJKQPCkJgfNdK', ' OrnaMENTAL Space Art', 'https://objkt.com/tokens/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/1', NULL, 'OBJKT', NULL, '{ornamental,space,machine,scifi,futuristic,mysticism}', 'rokoroko', '', '2025-05-11 12:40:38.788123', '2025-05-11 12:40:38.788123', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 1, '2', 'KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL_1', 'tezos', '{"contract":"KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL","tokenId":"1"}', 'https://objkt.com/asset/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/1', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:38.744', 'published');
INSERT INTO public.portfolio_items VALUES (98, 'Fluid Edge #192', '~~ FLUID EDGE ~~

Press [s] to save a png at the current resolution.

Press [x] to save a svg at the current resolution.

Press [2/4/6/8/0] to change resolution to 2/4/6/8/10K along the shortest edge.

Press [l] to initiate download of 400 png frames at current resolution. Can be assembled into a perfectly looping video / GIF.

Press [space] to pause/unpause animation.

This work uses p5.js and p5.svg.js libraries.', 'https://ipfs.io/ipfs/QmVwigcxicyGy9Q4G8r6yyc5DW82PdcJHEZeYa5RAzuGqp', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:44.720496', '2025-05-11 12:40:44.720496', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211202', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211202"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211202', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:44.676', 'published');
INSERT INTO public.portfolio_items VALUES (99, 'Fluid Edge #199', '~~ FLUID EDGE ~~

Press [s] to save a png at the current resolution.

Press [x] to save a svg at the current resolution.

Press [2/4/6/8/0] to change resolution to 2/4/6/8/10K along the shortest edge.

Press [l] to initiate download of 400 png frames at current resolution. Can be assembled into a perfectly looping video / GIF.

Press [space] to pause/unpause animation.

This work uses p5.js and p5.svg.js libraries.', 'https://ipfs.io/ipfs/QmQP92omHkS9dk67H2n7ahRRvii7ypYfBKVjWKufguYrjY', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:44.87507', '2025-05-11 12:40:44.87507', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211248', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211248"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211248', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:44.83', 'published');
INSERT INTO public.portfolio_items VALUES (100, 'Hoopla #245', 'This one is for the params lovers! 

See the associated article for descriptions of the params.

Press 2/4/6/8/0 to re-size the minimum dimension to 2-10K (slow!), and press ‘s’ to save a PNG.

Have fun!

B.
', 'https://ipfs.io/ipfs/QmUoYwhhJM5yWTc1pLbZxRXTc7vQbq3naDQ4GRZDZcNcVS', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:45.028985', '2025-05-11 12:40:45.028985', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_136273', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"136273"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/136273', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:44.984', 'published');
INSERT INTO public.portfolio_items VALUES (101, 'Hoopla #102', 'This one is for the params lovers! 

See the associated article for descriptions of the params.

Press 2/4/6/8/0 to re-size the minimum dimension to 2-10K (slow!), and press ‘s’ to save a PNG.

Have fun!

B.
', 'https://ipfs.io/ipfs/QmfNbEFVtVc6m6P94NU4F83CYMEqXx8rDQQZwdhR3ebdRn', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:45.182784', '2025-05-11 12:40:45.182784', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_131498', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"131498"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/131498', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:45.138', 'published');
INSERT INTO public.portfolio_items VALUES (125, 'Whispering Depths #135', 'What do you hear?

Press 2/4/6/8/0 to re-size, ''d'' to download a png.

Best enjoyed at high resolution and brightness.', 'https://ipfs.io/ipfs/QmZEqt3Bqm79a88wVsuc7udwBdG8Y9Gfi4L8PsKzpoCbMd', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:48.940441', '2025-05-11 12:40:48.940441', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_212286', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"212286"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/212286', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:48.896', 'published');
INSERT INTO public.portfolio_items VALUES (104, 'Wind Scene (Tezos) #41', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmQViVnXKLvXFGaqu1YQpdQoYKZo4Zr3pYVuYUFxPUJdyV', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211417', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:45.644149', '2025-05-11 12:40:45.644149', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211417', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211417"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211417', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:45.599', 'published');
INSERT INTO public.portfolio_items VALUES (126, 'Whispering Depths #136', 'What do you hear?

Press 2/4/6/8/0 to re-size, ''d'' to download a png.

Best enjoyed at high resolution and brightness.', 'https://ipfs.io/ipfs/QmRt32ruBcghUbNXitHnegk1Gh8ciLyGctEXXNQtFn7e4p', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:49.093191', '2025-05-11 12:40:49.093191', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_212287', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"212287"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/212287', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:49.05', 'published');
INSERT INTO public.portfolio_items VALUES (127, 'Whispering Depths #137', 'What do you hear?

Press 2/4/6/8/0 to re-size, ''d'' to download a png.

Best enjoyed at high resolution and brightness.', 'https://ipfs.io/ipfs/QmZNWoyc3c7V6HQMxS2g99rJD3ucKPDYkFa97SY8siC9t5', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Leo Hu', NULL, '2025-05-11 12:40:49.247113', '2025-05-11 12:40:49.247113', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 0, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_212288', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"212288"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/212288', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:49.202', 'published');
INSERT INTO public.portfolio_items VALUES (136, 'Red all', 'Made with code in 2024 P5.js
3,600 × 3,600 pixels .PNG
By Arts of Chet', 'https://ipfs.io/ipfs/QmYqHDgTfzep8tBhhdHeuyDtRKND3MZWjV5BG9JgS4AFLm', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'Arts of Chet', NULL, '2025-05-11 12:40:50.631026', '2025-05-11 12:40:50.631026', '/uploads/b677739201a44be412496e3b97ac9b25.jfif', 0, '2', 'KT1L1U7SmA2z9uQqhnzjSiwZoRdkk77Cgdxa_3', 'tezos', '{"contract":"KT1L1U7SmA2z9uQqhnzjSiwZoRdkk77Cgdxa","tokenId":"3"}', 'https://objkt.com/asset/KT1L1U7SmA2z9uQqhnzjSiwZoRdkk77Cgdxa/3', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:50.586', 'published');
INSERT INTO public.portfolio_items VALUES (113, 'Wind Scene (Tezos) #50', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmQ3hTJZFQLK8C4qhdrqh8a2Qnqb8C9HF4gEHwiqXqWvF7', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211426', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:47.095963', '2025-05-11 12:40:47.095963', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 9, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211426', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211426"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211426', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:47.051', 'published');
INSERT INTO public.portfolio_items VALUES (114, 'Wind Scene (Tezos) #51', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmeJE3gLCE7wXYuXeqqUUU4x7eMq2z9qpRzpEBtaHKAyd4', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211427', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:47.249454', '2025-05-11 12:40:47.249454', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 10, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211427', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211427"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211427', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:47.205', 'published');
INSERT INTO public.portfolio_items VALUES (117, 'Wind Scene (Tezos) #57', 'WIND SCENE is the third series of the Generative Art collection by RecollectionArts.com. It is an Open Edition NFT, available for FREE mint on the ETH Base and Tezos network. 

WIND SCENE captures the fluidity and dynamics of wind through animated, swinging plates arranged in a grid that dynamically responds to user interactions, creating a visually immersive experience.

Top Hung Plates (Tezos default) sway back and forth, settling in response to wind effects triggered by mouse movements. Fixed Vertical Plates (Base default) oscillate left and right under a constant wind, showcasing a subtle yet perpetual motion. Both construction methods can be toggled by pressing [c] or [double clicking].

[i] / [+]: Show Controls (After Mint)

Graphics Controls
[a]: Reset to original mode
[c] / [double click]: Toggle plate construction mode - from top hung to fixed vertical
[l] / [space]: Toggle draw mode - from line to solid
[m]: Toggle background colors - from original, black, colored, white
[k]: Toggle full color to gray
[e]: Toggle canvas extension (2x original size)
[b]: Hide/unhide border & text
[1] to [9]: Select resolution
[0]: Select highest resolution (may not work during wind effect)
[s]: Save artwork as PNG (select resolution before save, default: 1)

Animation Controls
[mouse over]: Wind effect during top hung mode
[/] / [*]: Decrease / increase wind magnitude
[v]: Toggle volume off/on
[g]: Save animation as GIF (wait for 1-minute; may not work for complicated graphics)

Created using p5.js.
Sound Effect from Pixabay
Wind Scene (Tezos) © 2024 by Leo Hu is licensed under CC BY-NC-SA 4.0.

Remember to tag me:
X / Farcaster: @LeoHuGArt | IG: leohugart', 'https://ipfs.io/ipfs/QmeQXvfi2FRepU7d43BvppSGvsq9LkFe2owqjswYFu4cAi', 'Wind Scene (Tezos)', 'https://objkt.com/tokens/fxparams/211433', NULL, 'OBJKT', NULL, '{wind,scene,fx}', 'Leo Hu', '', '2025-05-11 12:40:47.707783', '2025-05-11 12:40:47.707783', '/uploads/5a244e98f0e5899afe3797b94e8d87dc.webp', 13, '2', 'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr_211433', 'tezos', '{"contract":"KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr","tokenId":"211433"}', 'https://objkt.com/asset/KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr/211433', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:47.663', 'published');
INSERT INTO public.portfolio_items VALUES (93, 'Robot #1', 'The image Robot #1 depicts a robotic head with several notable features:

Design and Structure: The head has a sleek, futuristic design with a smooth, rounded helmet-like appearance. It is predominantly white with metallic accents, giving it a high-tech look.
Eyes: The eyes are particularly striking, with glowing blue and white circular patterns, suggesting advanced visual sensors or cameras. The eyes are large and prominent, adding to the robotic aesthetic.
Headphones: The robot is equipped with headphones that are integrated into its head design. The headphones are modern, with a metal and plastic construction, and they include control knobs and a large, red button, indicating advanced audio capabilities.
Cabling and Details: There are visible cables and wires connected to the head, suggesting that it is part of a larger robotic system or that it requires external power or data connections. The head has various small details and lights, enhancing its technological appearance.
Lighting: The head features small red lights on the sides, possibly indicating active status or serving as indicators for various functions. The lighting gives the robot a dynamic and active appearance.
Color Scheme: The overall color scheme includes metallic silver, blue, and red lighting, which enhances the futuristic and advanced technology feel of the robot.
Expression and Features: The robot''s face is designed with minimalistic features, including a neutral expression, which emphasizes functionality over human-like appearance. The mouth area is slightly open, possibly to suggest some form of communication or ventilation.

This robotic head design suggests a blend of advanced technology and aesthetics, likely intended for applications in fields like robotics, artificial intelligence, or futuristic entertainment. The design elements, such as the glowing eyes and integrated headphones, highlight its role in a high-tech environment.', 'https://ipfs.io/ipfs/QmT63N92sHHzLfjGFEMbdLV7ySJdujVJRq7BqLXXFLwWFh', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'rokoroko', NULL, '2025-05-11 12:40:43.937324', '2025-05-11 12:40:43.937324', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1RksriZwqHdoQmm5bdVBjJhwuCvU27q6C1_0', 'tezos', '{"contract":"KT1RksriZwqHdoQmm5bdVBjJhwuCvU27q6C1","tokenId":"0"}', 'https://objkt.com/asset/KT1RksriZwqHdoQmm5bdVBjJhwuCvU27q6C1/0', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:43.894', 'published');
INSERT INTO public.portfolio_items VALUES (92, 'Plant #3', 'This photograph of Plant #3 from the Otherworld Plants collection features a highly imaginative and surreal plant. 
The image showcases a close-up of a flower with thick, fleshy petals that resemble succulent leaves. The petals are layered in a symmetrical, almost geometric pattern, creating a sense of depth and complexity. The color palette is predominantly muted, with shades of green and hints of pink, giving the plant an ethereal, otherworldly appearance.

The lighting in the photograph is soft, highlighting the textures and contours of the petals, which appear almost sculptural. The central part of the flower is darker, adding contrast and drawing the eye inward. The background is blurred, focusing all attention on the intricate details of the flower, enhancing its alien-like quality.

The overall effect is both mesmerizing and slightly surreal, suggesting a plant that could belong to a fantastical or alien ecosystem, far removed from the flora we are familiar with on Earth.', 'https://ipfs.io/ipfs/QmZ9oyXQQCWhz4ZyBU2gu47Y2TRH7NroDEFCMMYCTXYvFR', 'Otherworld Plants', 'https://objkt.com/tokens/KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR/2', NULL, 'OBJKT', NULL, '{colorful,botanical,flower,scifi,photo}', 'rokoroko', '', '2025-05-11 12:40:43.783797', '2025-05-11 12:40:43.783797', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 2, '2', 'KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR_2', 'tezos', '{"contract":"KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR","tokenId":"2"}', 'https://objkt.com/asset/KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR/2', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:43.739', 'published');
INSERT INTO public.portfolio_items VALUES (95, 'Robot #3', 'The image depicts a Robot #3 with several notable features:

Design and Structure: The robot has a sleek, futuristic design with a smooth, rounded head. The body is streamlined and appears to be made of a metallic material, giving it a modern and high-tech appearance.
Head and Eyes: The head features large, glowing pink eyes that are circular and prominent, suggesting advanced visual sensors or cameras. The eyes are a key element that gives the robot an expressive look.
Color Scheme: The robot is primarily blue with accents of pink and purple lighting, which gives it a cool, futuristic vibe. The lighting elements are strategically placed, likely serving both aesthetic and functional purposes.
Details and Cables: The robot has visible cables and intricate details around the neck and head area, indicating a complex internal structure. These details add to the technological feel of the robot.
Headphones or Audio Sensors: There is a circular component on the side of the head that resembles headphones or an audio sensor, suggesting the robot has capabilities for sound reception or communication.
Expression and Features: The robot''s face is designed with minimalistic features, including a neutral expression, which emphasizes functionality over human-like appearance. The mouth area is simple, possibly for cooling or to suggest communication ability.
Overall Aesthetic: The robot has a clean, polished look with a focus on symmetry and modernity. The use of lighting and the smooth surfaces contribute to a high-tech, futuristic aesthetic.

This robot design is likely intended for applications in fields like robotics, artificial intelligence, or futuristic entertainment, where aesthetics and functionality are both important. The glowing eyes and the detailed design elements highlight its advanced technological capabilities.', 'https://ipfs.io/ipfs/QmdmkVJnHzKMducDLTS3Q4Aa817tJyj1q5zvqaxbCyBYW6', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'rokoroko', NULL, '2025-05-11 12:40:44.257923', '2025-05-11 12:40:44.257923', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1RksriZwqHdoQmm5bdVBjJhwuCvU27q6C1_2', 'tezos', '{"contract":"KT1RksriZwqHdoQmm5bdVBjJhwuCvU27q6C1","tokenId":"2"}', 'https://objkt.com/asset/KT1RksriZwqHdoQmm5bdVBjJhwuCvU27q6C1/2', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:44.213', 'published');
INSERT INTO public.portfolio_items VALUES (9, 'Robot Face #7', 'A figure in a sleek, metallic robotic suit with glowing blue accents stands in a high-tech, teal-lit chamber.
The suit features intricate mechanical details, a high collar, and a futuristic design, evoking a sci-fi laboratory setting.

The hidden robot''s face is behind; step away from the monitor to see it!', '/uploads/e905065da794a4ed2bd787f5806017dd.png', 'Robot Face', 'https://objkt.com/tokens/KT19BMu67iJyavkXYd2RbwRB64Fby2bUEi6Q/6', '', 'OBJKT', '', '{robot,robotic,face,cyborg,green}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 17, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (132, 'RED #3', 'This piece of art from the "RED" collection is a striking sculpture that combines elements of abstraction and realism. The sculpture features a human head and neck, but it is rendered in a fragmented, geometric style. The head is composed of various angular shapes, primarily triangles and rectangles, which interlock to form a cohesive, yet abstract, representation of a human face.

The use of red is dominant, creating a monochromatic effect that emphasizes the texture and form of the sculpture. The surface of the sculpture appears to have a slightly rough, matte finish, adding to its tactile quality. The geometric abstraction of the face could symbolize the complexity and multifaceted nature of human identity, suggesting that our sense of self is composed of many different, sometimes disjointed, parts.

The background is a solid, soft pink, which contrasts with the deep red of the sculpture, making it stand out more vividly. This choice of background color might be intended to soften the overall impact of the piece, balancing the intensity of the red sculpture with a more gentle hue.

The sculpture''s abstract nature invites viewers to interpret it in various ways, perhaps seeing it as a commentary on the fragmentation of identity in modern society, or as an exploration of the human form through non-traditional artistic means. The lack of facial features, apart from the suggestion of eyes, nose, and mouth through the arrangement of shapes, adds an element of anonymity, suggesting a universal human experience rather than an individual one.

Overall, this piece is a powerful example of how abstraction can convey deep emotional and philosophical themes, using form, color, and texture to engage the viewer in contemplation of what it means to be human.', 'https://ipfs.io/ipfs/QmSMzhCRFJuVbhGD3XgZ1mPb5naLPdp1KdUch5KVBWxEHw', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/2', NULL, 'OBJKT', NULL, '{tezos,nft,objkt}', 'rokoroko', '', '2025-05-11 12:40:50.015742', '2025-05-11 12:40:50.015742', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 2, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_2', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"2"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/2', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:49.971', 'published');
INSERT INTO public.portfolio_items VALUES (31, 'Grass #2', 'An intricate, vintage illustration of a wildflower meadow under a stormy sky.
Dark grasses and leaves mix with large flowers in red, white, and green hues.
The scene is detailed with fine line work, creating a moody, natural atmosphere', '/uploads/63eae9cf99f529019e9e327de7dfb7ff.PNG', 'Grass Collection', 'https://objkt.com/tokens/KT1LMGbv8afdNvuSkMNQ4myR7rRyLNMrAhJK/1', '', 'OBJKT', '', '{green,botanical,natural,grass,linework,illustration}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 3, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (22, 'The Aristocrat', 'The Aristocrat', '/uploads/6d5e860f42ebda51fa8642e0fea4113b.png', 'Old Canvas', 'https://objkt.com/tokens/KT1U9gqRU3LgqL1avNtjGDPixCZvTu2ekCZU/1', '', 'OBJKT', '', '{canvas,aristocrat,pointillism}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 6, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (7, 'Robot Face #5', 'A figure in a futuristic suit with a transparent helmet, featuring a blue circular device on the forehead.
The suit is sleek and metallic, with a high-tech design, set against a warm, blurred background with orange lights.

The hidden robot''s face is behind; step away from the monitor to see it!', '/uploads/7260c69594df08034a5109394bc5b047.png', 'Robot Face', 'https://objkt.com/tokens/KT19BMu67iJyavkXYd2RbwRB64Fby2bUEi6Q/4', '', 'OBJKT', '', '{robot,robotic,face,futuristic,girl}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 15, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (13, 'Trees #1', 'Surreal forest of leafless trees with intricate, swirling branches.
Misty light filters through, illuminating a path.
The ground is adorned with ornate, flowing patterns, creating an ethereal, dreamlike scene in shades of gray and blue', '/uploads/216032860a9fedd31cdf253c85c3b95d.PNG', 'Trees', 'https://objkt.com/tokens/KT1UtvzFt67NzxSdAqCJzyZrGXsp4CHX6UQg/0', '', 'OBJKT', '', '{Trees,surreal,dreamlike,forest,orchard,linework}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 8, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (5, 'Robot Face #3', 'A sleek robot with a glowing blue face, metallic body, and curved arm extensions stands on a grassy path lined with trees.
The design is futuristic, with a mix of black, silver, and green, set against a vibrant teal background.
The hidden robot''s face is behind; step away from the monitor to see it!', '/uploads/f312ccdae0b76931ff097410b2e96c4f.png', 'Robot Face', 'https://objkt.com/tokens/KT19BMu67iJyavkXYd2RbwRB64Fby2bUEi6Q/2', '', 'OBJKT', '', '{robot,face,green}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 13, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (27, 'The Lady with Hat II', 'The Lady with Hat II', '/uploads/5278d38e95874e4fb033a6e6c64cbd03.png', 'Old Canvas', 'https://objkt.com/tokens/KT1U9gqRU3LgqL1avNtjGDPixCZvTu2ekCZU/6', '', 'OBJKT', '', '{canvas,lady,hat,pointillism,young}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 20, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (23, 'The Lady with the Floral Crown', 'The Lady with the Floral Crown', '/uploads/e7e339b3b4f73d57dab39a316b6a46fa.png', 'Old Canvas', 'https://objkt.com/tokens/KT1U9gqRU3LgqL1avNtjGDPixCZvTu2ekCZU/2', '', 'OBJKT', '', '{canvas,young,lady,floral,hat,pointillism}', 'rokoroko', '', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 21, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (4, 'Robot Face #2', 'A figure in a futuristic cyberpunk outfit with a high-tech chest piece, glowing green accents, and metallic arms.
They wear a flowing teal skirt, standing on a bridge with a neon-lit cityscape of tall buildings at dusk.
The hidden robot''s face is behind; step away from the monitor to see it!', '/uploads/4f95c806a3782d732ff933c9121f70bd.png', 'Robot Face', 'https://objkt.com/tokens/KT19BMu67iJyavkXYd2RbwRB64Fby2bUEi6Q/1', '', 'OBJKT', '', '{robot,face,futuristic,girl}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 12, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (69, 'Moving Bionic Girl #2', 'A moving version of Bionic Girl #2 ', 'https://ipfs.io/ipfs/QmPrje4C2QvKsX5qsDKh7CM4rquJXVRG7pz8ycNrHLq1rS', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/3', NULL, 'OBJKT', NULL, '{bionic,girl,futuristic,scifi,cybernetic,moving}', 'rokoroko', '', '2025-05-11 12:40:40.180764', '2025-05-11 12:40:40.180764', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 3, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_3', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"3"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/3', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:40.136', 'published');
INSERT INTO public.portfolio_items VALUES (73, 'Bionic Girl #4 in motion', 'Bionic Girl #4 in motion. Complementary part to the original Bionic Girl #4.', 'https://ipfs.io/ipfs/QmXeo6HCQk5Zj9BjUSWC3jy4TN5DAhJDKAZ56pWYoGHadU', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/7', NULL, 'OBJKT', NULL, '{bionic,girl,futuristic,color,scifi,moving,metalic,cybernetic}', 'rokoroko', '', '2025-05-11 12:40:40.851965', '2025-05-11 12:40:40.851965', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 7, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_7', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"7"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/7', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:40.807', 'published');
INSERT INTO public.portfolio_items VALUES (91, 'Plant #2', 'This photograph from the Otherworld Plants collection features a striking and imaginative plant, likely inspired by the aesthetic of alien or fantastical flora. The image is presented in a sepia tone, giving it a vintage, almost otherworldly feel. The central focus is on a single flower with multiple petals radiating symmetrically from its center, creating a star-like appearance. The petals are elongated and pointed, with a gradient of light to dark shades, adding depth and texture to the flower.

The background is blurred, emphasizing the flower''s intricate details and making it stand out prominently. The soft focus on the background suggests a natural, possibly foggy or misty environment, enhancing the mysterious and otherworldly atmosphere of the scene. The composition is balanced, with the flower perfectly centered, drawing the viewer''s eye directly to its unique structure.

The overall effect is both serene and intriguing, inviting viewers to imagine the kind of world this plant might inhabit, far beyond the familiar landscapes of Earth.', 'https://ipfs.io/ipfs/QmPUFUPJDfJXrEHtXX6SUqtoVPBSWGth4RkdDpgzsZnMK8', 'Otherworld Plants', 'https://objkt.com/tokens/KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR/1', NULL, 'OBJKT', NULL, '{colorful,botanical,flower,scifi,photo}', 'rokoroko', '', '2025-05-11 12:40:43.628823', '2025-05-11 12:40:43.628823', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 1, '2', 'KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR_1', 'tezos', '{"contract":"KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR","tokenId":"1"}', 'https://objkt.com/asset/KT1FKWAZPzGnGDSp1tHtHK9cQRvGPntvHxzR/1', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:43.584', 'published');
INSERT INTO public.portfolio_items VALUES (135, 'RED #6', 'This piece of art from the "RED" collection is a digital artwork that employs a minimalist and abstract style. The composition is dominated by a bold red background, which creates a dramatic and intense atmosphere. The subject of the artwork appears to be a stylized human figure, rendered in geometric shapes and a limited color palette of black, gray, and red.

The figure is abstracted into angular, block-like forms, which give it a robotic or futuristic appearance. The head and shoulders are composed of large, faceted shapes, suggesting a mask or helmet. The use of black and gray contrasts sharply with the red background, making the figure stand out prominently.

The artwork''s simplicity in form and color palette might convey several themes:
Identity and Anonymity: The lack of facial features and the use of geometric shapes could symbolize a loss of individuality or the idea of becoming part of a collective or machine-like society.
Futurism: The angular, mechanical look of the figure might reflect themes of technology, artificial intelligence, or the future of human evolution.
Isolation: The stark contrast between the figure and the background might suggest themes of isolation or alienation, where the figure stands out but is also disconnected from its surroundings.

The texture on some of the shapes adds an element of realism to the otherwise abstract form, perhaps indicating wear or age, which could symbolize the passage of time or the impact of environment on identity.

Overall, this piece invites viewers to reflect on the relationship between humanity and technology, the nature of identity in modern society, and the emotional impact of isolation and anonymity. The use of red as the background color reinforces these themes by evoking strong emotions of passion, danger, or alertness.', 'https://ipfs.io/ipfs/QmUZEKFUQUrigA1UjJze1H8LNXCas9wNcyewe8qXMMogXR', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/5', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-11 12:40:50.47719', '2025-05-11 12:40:50.47719', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 5, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_5', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"5"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/5', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:50.432', 'published');
INSERT INTO public.portfolio_items VALUES (138, 'RED #8', 'This piece of art from the "RED" collection is a digital artwork that combines elements of portraiture with a futuristic and abstract aesthetic. The dominant color scheme is red, which sets a dramatic and intense backdrop for the piece.

The subject of the artwork is a human face, but it is highly stylized and abstracted. The face is partially covered by geometric shapes that resemble a mask or helmet. These shapes are angular and faceted, with a mix of red and gray tones, creating a stark contrast against the skin and the red background. The mask-like structure covers the forehead, eyes, and part of the cheeks, while the lower part of the face, particularly the mouth and chin, remains uncovered and is rendered in a more realistic style.

Key aspects of the artwork include:
Color: The intense red background creates a sense of urgency or high emotion, while the gray tones of the mask add a sense of coldness or detachment.
Texture: The mask has a cracked or fragmented texture, suggesting themes of fragility, decay, or the breaking down of barriers. This texture contrasts with the smooth, unblemished skin of the face.
Form: The geometric shapes of the mask are angular and sharp, which could symbolize a constructed or artificial identity, perhaps hinting at themes of technology, artificial intelligence, or the future of human identity.
Lighting: The lighting is soft, highlighting the contours of the face and the textures of the mask, giving the piece a sense of depth and three-dimensionality.

This artwork might be interpreted in several ways:
Identity and Technology: The geometric mask might symbolize the intersection of human identity with technology, suggesting how technology shapes or masks our true selves.
Emotional Conflict: The red background and the mask''s texture could represent an inner turmoil or conflict, where the true self (the face) is hidden or protected by a constructed facade (the mask).
Futurism: The futuristic design of the mask might reflect themes of what humanity might become in the future, exploring ideas of transhumanism or the merging of human and machine.

Overall, this piece is a powerful exploration of human emotion, identity, and the impact of technology, using bold color and texture to convey depth and narrative.
', 'https://ipfs.io/ipfs/QmNyYUQdUVMMZhSzMuNAd1CWVmJvQhddCEt79yk9w79Xhf', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/7', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-11 12:40:50.938667', '2025-05-11 12:40:50.938667', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 7, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_7', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"7"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/7', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:50.894', 'published');
INSERT INTO public.portfolio_items VALUES (141, 'RED #11', 'This piece from the "RED" collection is a digital artwork that combines elements of portraiture with abstract and geometric design. Here''s a detailed description:

Color Scheme: The artwork features a dramatic use of red, black, and gray. The red is particularly striking, creating a focal point and adding intensity and emotion to the piece.
Subject: The subject is a stylized human face, but it is heavily abstracted. The face is divided into geometric sections with sharp, angular lines. These sections are rendered in different shades, with red dominating the left side and gray and black on the right.
Mask: The face appears to be partially covered or composed of a mask-like structure. The mask has a cracked or fractured texture, which could symbolize fragmentation or the complexity of identity.
Texture: The surface of the mask, especially the red sections, has visible cracks and lines, giving it a sense of depth and history. This texture contrasts with the smoother, more polished areas of the face.
Lighting: The lighting is soft yet dramatic, highlighting the contours of the face and the textures of the mask. Shadows and highlights are used effectively to give the piece a three-dimensional quality.
Composition: The face is centrally placed against a light background, which makes it stand out. The use of geometric shapes and the division of the face into different colored sections draws the viewer''s eye and adds to the complexity of the composition.

Possible interpretations of this artwork could include:

Identity and Fragmentation: The fragmented mask might represent a divided or multifaceted identity, suggesting themes of how identity can be both constructed and deconstructed.
Emotional Expression: The use of red could symbolize strong emotions such as passion, anger, or love, while the cracks might indicate emotional scars or the passage of time affecting the self.
Contrast and Duality: The stark contrast between red and gray/black sections might highlight duality in human nature, such as the balance between emotion and reason, or the visible versus the hidden self.

Overall, this piece is a compelling exploration of human identity, emotion, and complexity, using bold colors and abstract forms to convey its message.', 'https://ipfs.io/ipfs/QmfPfEhktBUjyj8g1gaU2KuzCApwinBeGamJR2CnamH6fa', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/10', NULL, 'OBJKT', NULL, '{}', 'rokoroko', '', '2025-05-11 12:40:51.400307', '2025-05-11 12:40:51.400307', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 10, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_10', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"10"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/10', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:51.356', 'published');
INSERT INTO public.portfolio_items VALUES (130, 'RED #1', 'This piece of art from the "RED" collection features a striking use of color and geometric shapes, predominantly in shades of red, black, and white. The composition is abstract, with a central figure silhouetted against a stark red and black background. 

The red elements are angular and block-like, creating a sense of structure or perhaps a stylized urban environment. These red shapes contrast sharply with the black areas, which seem to form a kind of negative space or shadow, enhancing the three-dimensional illusion. The figure in the center is simplistic, almost like a shadow or a cut-out, adding a sense of mystery or anonymity. 

The use of red might symbolize various themes such as danger, passion, or intensity, while the black and white could represent stark contrasts or binary opposites. The composition directs the viewer''s eye towards the figure, creating a focal point amidst the geometric chaos.

Overall, the artwork evokes a sense of drama and intensity, with its bold color palette and abstract forms suggesting a narrative or emotional state that is open to interpretation.', 'https://ipfs.io/ipfs/QmZnYTyBc2XTZ9x1285yDvaCv7ztHC2TLeBCaHYYZSQya1', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/0', NULL, 'OBJKT', NULL, '{RED,Face,geometric}', 'rokoroko', '', '2025-05-11 12:40:49.708016', '2025-05-11 12:40:49.708016', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_0', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"0"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/0', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:49.664', 'published');
INSERT INTO public.portfolio_items VALUES (144, 'Screaming Skull #7', 'Screaming Skull #7 showcases a vibrant, colorful skull with an open, menacing mouth, set against an orange background, surrounded by abstract splashes and geometric patterns, blending horror with a vivid, psychedelic aesthetic.', 'https://ipfs.io/ipfs/QmRJaNRyyUPjheX6xKByh7hQ7qZSpSX5msZd8UJXvp225a', 'Screaming Scull', 'https://objkt.com/tokens/KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx/7', NULL, 'OBJKT', NULL, '{horror,popart,screaming,scull}', 'rokoroko', '', '2025-05-16 23:02:57.521932', '2025-05-16 23:02:57.521932', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx_7', 'tezos', '{"contract":"KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx","tokenId":"7","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT1EKf...9Rtx","address":"KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx","image":"https://ipfs.io/ipfs/QmYWjLXVvChRp9s2h5fvK93dWggqRuBHMd4AkoGKibXYYo"}}', 'https://objkt.com/asset/KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx/7', 'OBJKT', NULL, 'XTZ', false, '2025-05-16 23:02:57.484', 'published');
INSERT INTO public.portfolio_items VALUES (131, 'RED #2', 'This piece of art from the "RED" collection is a striking example of abstract expressionism, combining elements of portraiture with geometric abstraction. The dominant color is a vivid red, which sets an intense and dramatic tone for the piece.

The artwork features a human profile, but it is not a straightforward representation. Instead, the face is fragmented into various geometric shapes, primarily triangles and rectangles, in shades of red, black, and beige. These shapes are layered and interlocked, creating a sense of depth and complexity. The eye, partially visible, is a focal point amidst the geometric chaos, adding a touch of realism and humanity to the abstract form.

The use of red in various tones, from deep crimson to bright scarlet, evokes strong emotions and can be interpreted in multiple ways, such as passion, anger, or even danger. The black elements add contrast and shadow, enhancing the three-dimensional effect and giving the piece a sense of structure and solidity.

The fragmentation of the face could symbolize the complexity of human identity or the idea of breaking down and reconstructing self-perception. The artwork invites viewers to piece together the fragmented elements, much like solving a puzzle, to form a coherent image in their minds, engaging them in a process of interpretation and introspection.

Overall, this piece is a compelling exploration of form, color, and human identity, using abstraction to convey deeper emotional and psychological themes.', 'https://ipfs.io/ipfs/QmTuzZpMyMHtgSq4k5iVgyR427K9r3Jm2sE97LX6L1mxHp', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/1', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-11 12:40:49.862201', '2025-05-11 12:40:49.862201', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 1, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_1', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"1"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/1', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:49.817', 'published');
INSERT INTO public.portfolio_items VALUES (133, 'RED #4', 'This piece of art from the "RED" collection is a digital artwork that employs a cubist style, characterized by its use of geometric shapes and fragmented forms. The dominant color is a deep, rich red, which sets a dramatic and intense tone for the piece.

The figure in the artwork is abstracted into various angular shapes, primarily triangles, rectangles, and trapezoids. These shapes are layered and interlocked to create a sense of depth and structure. The use of red in different shades, from deep crimson to bright scarlet, adds to the complexity and visual interest of the piece.

The figure appears to be a stylized human form, possibly a portrait, but it is highly abstracted. The head and shoulders are the most recognizable parts, but even these are broken down into geometric components. The abstraction could symbolize the multifaceted nature of human identity or the complexity of human emotions, with the red color potentially representing passion, intensity, or even conflict.

The background is also red, though in a slightly darker shade, which helps to unify the composition and emphasizes the figure by creating a cohesive color palette. The use of shadow and light adds to the three-dimensional effect, making the shapes appear to pop out from the background.

This piece invites viewers to interpret the fragmented forms and the intense red color in various ways, possibly seeing it as a reflection on the complexity of human experience or an exploration of abstract art''s ability to convey emotion through form and color. The cubist influence suggests a breaking down of traditional perspectives, encouraging viewers to piece together the fragments to form their own understanding of the subject.', 'https://ipfs.io/ipfs/Qmc44WaUZjUdaVsjBTzLv4VohpNGRpk15N9WzJHPz9De6E', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/3', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-11 12:40:50.169266', '2025-05-11 12:40:50.169266', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 3, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_3', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"3"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/3', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:50.124', 'published');
INSERT INTO public.portfolio_items VALUES (14, 'Trees #2', 'Mystical Trees with tall, leafless trees, their branches forming intricate, swirling patterns. A soft, ethereal light glows through the mist, illuminating a winding path. The ground is covered in ornate, spiraling designs in shades of gray.', '/uploads/5d59c9f138f8f7a08b6ab017556c736a.PNG', 'Trees', 'https://objkt.com/tokens/KT1UtvzFt67NzxSdAqCJzyZrGXsp4CHX6UQg/1', '', 'OBJKT', '', '{trees,mystical,spiral,mist,ornate}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 9, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (15, 'Trees #3', 'Haunting forest with twisted, leafless trees, their branches forming intricate, swirling designs.
A soft glow illuminates a winding path through the misty air, with ornate, spiraling patterns covering the ground in shades of gray.', '/uploads/f42c8948b138df61d1125eb7bd561354.png', 'Trees', 'https://objkt.com/tokens/KT1UtvzFt67NzxSdAqCJzyZrGXsp4CHX6UQg/2', '', 'OBJKT', '', '{trees,grey,mystic,misty,ornate,forest}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 10, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (16, 'The Shadowed', 'depicts a figure in a historical military uniform, likely from the 18th or early 19th century, given the tricorn hat and high-collared coat.
The artistic style of the image appears to be a blend of realism and expressionism, with a strong influence from historical portraiture', '/uploads/3151061e37c26b57f0df0b59c0e85e3f.png', ' Portraiture', 'https://objkt.com/tokens/KT1Br8Lfuav3dbGX1DWESNDkDh3p6dJdKFAv/0', '', 'OBJKT', '', '{portraiture,expressionism,blend,realism,military,dark}', 'rokoroko', 'https://objkt.com/users/tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM', '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 23, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (32, 'Grass #3', 'A detailed, vintage-style illustration of a wildflower field under a dark, swirling sky. Sunflowers, grasses, and clusters of small flowers in muted greens and beige tones are intricately drawn, with a single red bloom adding contrast to the moody scene.', '/uploads/d47922d4b6bfa57cd666e80b251af69a.PNG', 'Grass Collection', 'https://objkt.com/tokens/KT1LMGbv8afdNvuSkMNQ4myR7rRyLNMrAhJK/2', '', 'OBJKT', '', '{grass,dark,meadow,linework,gold,organic}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 4, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (59, 'Ornamental Scull', 'This image features a highly detailed, ornamental skull with a futuristic and mechanical design. The skull has metallic textures, intricate engravings, and gears integrated into the structure, giving it a cybernetic or steampunk aesthetic. The forehead area is adorned with a circular, clock-like mechanism, with gears and intricate patterns that resemble a compass or astrological device. Headphone-like structures on either side of the skull add a sense of symmetry and futuristic design, while the background includes additional metallic elements and patterns that frame the skull, making it the focal point. The overall effect is dark, sci-fi-inspired, and richly detailed, blending elements of technology and mysticism.', 'https://ipfs.io/ipfs/QmS85ibbH22wbX6MQ9tUZPtDGYgRysARwPqdNdEDnhAXYW', ' OrnaMENTAL Space Art', 'https://objkt.com/tokens/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/0', NULL, 'OBJKT', NULL, '{ornamental,space,scull,futuristic,steampunk,technology}', 'rokoroko', '', '2025-05-11 12:40:38.615519', '2025-05-11 12:40:38.615519', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL_0', 'tezos', '{"contract":"KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL","tokenId":"0"}', 'https://objkt.com/asset/KT1AGZRBg5e3rfkCtfUi132iitbWzNmRF3HL/0', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:38.57', 'published');
INSERT INTO public.portfolio_items VALUES (19, 'Old Woman', 'The image portrays an elderly woman with a wrinkled face, adorned with a jeweled headpiece and fur-lined garment.
Her expression is solemn, with deep-set eyes and gray hair.
The dark, textured background enhances the classical, painterly style.', '/uploads/51b40e447ce49035a20a9cdf4dae8455.png', ' Portraiture', 'https://objkt.com/tokens/KT1Br8Lfuav3dbGX1DWESNDkDh3p6dJdKFAv/3', '', 'OBJKT', '', '{portrait,woman,lady,eldery,painted}', 'rokoroko', NULL, '2025-04-11 19:09:30.21817', '2025-04-11 19:09:30.294889', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 23, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'draft');
INSERT INTO public.portfolio_items VALUES (65, 'Bionic Girl #1', 'This artwork portrays a bionic girl with a striking fusion of human and machine elements. Her expression is intense, and her gaze is direct, giving her a powerful and determined presence. She wears large, mechanical headphones that have a futuristic design, filled with intricate details, circuits, and gears, emphasizing the cybernetic theme.
Her hair flows naturally, blending seamlessly with metallic and robotic parts embedded in her body and clothing, creating an elegant, high-tech aesthetic. The background is composed of abstract, geometric patterns, with various mechanical and industrial shapes, adding depth and complexity to the scene. The monochromatic color scheme, with shades of gray, silver, and black, enhances the futuristic, sci-fi feel. This piece combines elements of technology and humanity, capturing the essence of a cybernetic, bionic character.', 'https://ipfs.io/ipfs/QmfAd25fHWQbxpvdDkLy7HPMCKkL9BFWCQfpZp72pKhEXM', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/0', NULL, 'OBJKT', NULL, '{bionic,girl,scifi,futuristic,cybernetic,monochromatic}', 'rokoroko', '', '2025-05-11 12:40:39.565183', '2025-05-11 12:40:39.565183', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_0', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"0"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/0', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:39.522', 'published');
INSERT INTO public.portfolio_items VALUES (67, 'Moving Bionic Girl #1 ', 'A moving version of  Bionic Girl #1 

In motion, this bionic character would come alive with subtle movements and mechanical enhancements. Her intense gaze would shift slightly, adding realism to her determined expression. The intricate details on her large, futuristic headphones would pulse or emit soft glows, highlighting their high-tech design. Tiny circuits and gears might rotate or light up, emphasizing her cybernetic nature. Her hair, blending with metallic parts, could sway gently, adding a lifelike touch.

The abstract, geometric background patterns might pulse or shift, creating a dynamic, layered effect around her. The overall monochromatic, metallic color scheme would enhance the futuristic, sci-fi vibe, immersing viewers in her blend of humanity and machine.', 'https://ipfs.io/ipfs/QmfAd25fHWQbxpvdDkLy7HPMCKkL9BFWCQfpZp72pKhEXM', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/1', NULL, 'OBJKT', NULL, '{bionic,girl,cybernetic,scifi,futuristic,moving}', 'rokoroko', '', '2025-05-11 12:40:39.872579', '2025-05-11 12:40:39.872579', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 1, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_1', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"1"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/1', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:39.828', 'published');
INSERT INTO public.portfolio_items VALUES (71, 'Moving Bionic Girl #3', 'A moving version of Bionic Girl #3', 'https://ipfs.io/ipfs/QmZnce7hcap9juGvwEgerqzWbyb8VKBL1z8si8XwhzesFp', 'Bionic Girl', 'https://objkt.com/tokens/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/5', NULL, 'OBJKT', NULL, '{bionic,girl,monochromatic,cybernetic,scifi,futuristic,moving}', 'rokoroko', '', '2025-05-11 12:40:40.490264', '2025-05-11 12:40:40.490264', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 5, '2', 'KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ_5', 'tezos', '{"contract":"KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ","tokenId":"5"}', 'https://objkt.com/asset/KT1MpYcwB6EX3Nd9XP1WbY49mcjpMfa9U6HJ/5', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:40.444', 'published');
INSERT INTO public.portfolio_items VALUES (78, 'Plant #1', 'The illustration depicts a detailed and ornate botanical composition featuring a variety of flowers and plants. Here are the key elements:

Flowers:
Top Left: A large, golden-yellow flower with layered petals and a central disc covered in small, intricate details.
Top Right: A large white flower with curved petals and a central structure that appears to be a combination of petals and stamens, colored in shades of red and yellow.
Bottom Right: A red flower with broad petals and a central yellow structure, possibly resembling a poppy.
Bottom Left: A smaller, blue flower with a conical shape, resembling a thistle or a similar plant.
Leaves and Buds:
Several green leaves with detailed veining are spread throughout the illustration, attached to the stems of the flowers.
There are also buds and seed pods, including a closed white bud with a net-like texture and a spiky brown bud.
Background and Borders:
The background is a light cream color, providing a stark contrast to the vibrant colors of the flowers and leaves.
The borders are decorated with intricate geometric patterns and small star-like symbols, adding to the ornate aesthetic of the illustration.
Additional Elements:
Small star-like symbols are scattered in the background, giving the illustration a celestial or whimsical touch.
The number "1941" is visible in the top left corner, possibly indicating a date or catalog number.

Overall, the illustration combines elements of botanical art with decorative design, creating a visually rich and detailed piece.', 'https://ipfs.io/ipfs/QmRdzqLj8RgmKGadZoqSdb7gbdT1oCKc1gA9wdN4BmyH2A', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/0', NULL, 'OBJKT', NULL, '{atlas,plantarum,flowers,illustration,botanical,flower,vintage}', 'rokoroko', '', '2025-05-11 12:40:41.622302', '2025-05-11 12:40:41.622302', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_0', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"0"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/0', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:41.578', 'published');
INSERT INTO public.portfolio_items VALUES (79, 'Plant #2', 'This botanical illustration is a detailed and artistic representation of various plants and flowers. Here are the key features:

Flowers:
Top Left (I): A large, symmetrical flower with intricate, layered petals in shades of brown and yellow, resembling a dahlia or a similar composite flower.
Top Center (L): A tall, stylized flower with a central structure that looks like a cluster of buds or seeds, surrounded by elongated leaves.
Top Right: A flower with broad, overlapping petals in green and yellow, radiating from a central disc.
Bottom Left (R): A flower with white, petal-like structures surrounding a central yellow disc, resembling a daisy or anemone.
Bottom Right (D): A conical, tightly spiraled structure, possibly representing a type of seed head or flower bud.
Leaves and Stems:
The central illustration features a large, symmetrical arrangement of leaves, with detailed veining, extending from a central stem.
There are smaller leaves and buds on the stems of the individual flowers, adding to the complexity of the design.
Buds and Fruits:
Small buds and fruits are depicted along the stems, including round fruits (possibly berries or seeds) and closed buds.
Additional buds are shown at the base of the flowers, indicating various stages of plant growth.
Background and Decoration:
The background is a light, parchment-like color, giving the illustration an antique feel.
The borders are adorned with geometric patterns and small star-like symbols, adding to the decorative nature of the piece.
There are also small, star-shaped symbols and circular patterns interspersed throughout the illustration, enhancing its ornamental quality.
Text and Labels:
Each plant part is labeled with letters (I, L, A, R, C, e, P), possibly for identification or educational purposes.
At the bottom, there is a faint text that reads "Finity es and diving dest on," which might be part of a larger phrase or title, though it''s not entirely clear.

The overall style of the illustration combines elements of botanical accuracy with artistic embellishment, creating a visually rich and detailed piece that emphasizes both the beauty and complexity of plant life.', 'https://ipfs.io/ipfs/QmVHmcio8D9kdmbqecBkkPckwaEwhqpxq8wRF6qySMdaL1', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/1', NULL, 'OBJKT', NULL, '{atlas,plantarum,botanical,flowers,vintage,flower,illustration}', 'rokoroko', '', '2025-05-11 12:40:41.77628', '2025-05-11 12:40:41.77628', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 1, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_1', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"1"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/1', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:41.732', 'published');
INSERT INTO public.portfolio_items VALUES (80, 'Plant #3', 'This illustration from the collection Atlas Plantarum showcases a variety of imaginative plants, each with distinct features:

Top Left Plant: This plant has a large flower with petals that resemble those of a sunflower, surrounding a central, spiky structure. The leaves are broad and lobed, giving it a robust appearance.
Top Center Plant: This plant features elongated leaves with serrated edges. The flower is not fully visible, but the leaves suggest a tall, slender stem.
Top Right Plant: This plant has a striking red flower with pointed petals radiating outward. At the center of the flower, there''s a circular element that resembles a clock, adding an imaginative twist.
Bottom Left Plant: This plant has a central stem with large, broad leaves. The leaves are detailed with visible veins, and the plant has smaller buds or flowers at various points along the stem.
Bottom Center Plant: This plant has a more delicate appearance with smaller, daisy-like flowers. The leaves are simpler and more linear compared to the other plants.
Bottom Right Plant: This plant has multiple small flowers with petals that are slightly curved. The leaves are elongated and pointed, giving the plant a more refined look.

The illustration is framed with a decorative border, adding to the artistic and imaginative nature of the depiction. The plants are labeled with names like "Imagitad Platt" and "Citferman," which appear to be creative or fictional names for these imaginative species. The overall style is reminiscent of botanical illustrations, but with a fantastical twist.', 'https://ipfs.io/ipfs/QmZ78Gi2y8EuKtUzKLiHr5HPXKgAdGyYSVxguNcYrY2Kqn', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/2', NULL, 'OBJKT', NULL, '{atlas,plantarum,flowers,botanical,scifi,vintage,illustration,flower}', 'rokoroko', '', '2025-05-11 12:40:41.931507', '2025-05-11 12:40:41.931507', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 2, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_2', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"2"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/2', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:41.887', 'published');
INSERT INTO public.portfolio_items VALUES (82, 'Plant #5', 'The illustration from the Atlas Plantarum showcases an imaginative plant design with the following elements:

Central Flower: The central focus is a large, symmetrical flower with elongated, pointed petals. The petals are intricately detailed with a gradient from pale yellow to a light, creamy color, giving them a textured appearance. The center of the flower is complex, with multiple layers and a star-like pattern.
Side Flowers: Surrounding the central flower are smaller flowers of similar design but varying in size and color intensity. These side flowers have the same elongated petals and intricate detailing, contributing to the cohesive aesthetic of the illustration.
Leaves and Buds: The plant includes several leaves that are broad and slightly curved, with a similar gradient and texture to the petals. There are also buds shown in various stages of opening, adding to the botanical complexity of the piece.
Background: The background is dark, likely black or deep navy, which contrasts sharply with the light-colored plants, making them stand out prominently. Scattered in the background are star-like shapes and circular patterns, adding a celestial or cosmic theme to the illustration.
Color Scheme: The color palette is primarily composed of shades of yellow, cream, orange, and red, with the dark background providing a stark contrast. This choice of colors gives the illustration a warm, glowing effect.
Artistic Style: The overall style is reminiscent of botanical illustrations with a fantasy twist. The detailed and symmetrical design of the flowers, along with the intricate textures, suggests a blend of realism and imagination.

The illustration captures the viewer''s attention with its detailed, symmetrical floral design set against a cosmic backdrop, creating an otherworldly yet aesthetically pleasing botanical artwork.', 'https://ipfs.io/ipfs/QmRdwbq3hZvYwqnzcn3fru5CXJc7M7f3ThrwcW3BCiqXyC', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/4', NULL, 'OBJKT', NULL, '{atlas,plantarum,botanical,vintage,flower,scifi,illustration,flowers}', 'rokoroko', '', '2025-05-11 12:40:42.240101', '2025-05-11 12:40:42.240101', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 4, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_4', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"4"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/4', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:42.195', 'published');
INSERT INTO public.portfolio_items VALUES (86, 'Plant #9', 'This illustration Plant #9 from the "Atlas Plantarum" collection features a vibrant and imaginative depiction of botanical elements. Here''s a detailed description:

Color Scheme:
The illustration uses a rich palette of greens, oranges, and browns. The background is a light beige, which helps the colors of the plants and butterfly pop.
Central Plant:
The centerpiece is a large, fantastical flower with multiple layers of petals. The petals are a bright, vibrant orange with intricate detailing, giving them a textured appearance. The flower has large, broad leaves that are green with detailed veining.
Additional Flowers and Buds:
Surrounding the central flower are several smaller flowers and buds. These smaller flowers are also orange, with some in various stages of bloom, adding a sense of progression and life to the illustration.
There are also buds that are closed, depicted in shades of orange and green, contributing to the variety and richness of the scene.
Butterfly:
A colorful butterfly is included in the illustration, perched on one of the plants. The butterfly has wings that are predominantly orange with black and white patterns, resembling a monarch butterfly but with a more stylized and imaginative design.
Unique Elements:
One of the most striking elements is a flower that appears to be in a pod or shell-like structure, with the flower itself emerging from it. This adds a surreal and imaginative touch to the illustration.
There are also small red flowers and what looks like a cluster of seeds or small buds, adding to the diversity of plant forms depicted.
Border and Decoration:
The illustration is framed by a decorative border with green, swirling patterns at the corners, enhancing the overall aesthetic and giving it a finished, cohesive look.
Artistic Style:
The style combines elements of traditional botanical illustration with a whimsical, almost fantastical approach. The attention to detail in the petals, leaves, and butterfly wings is meticulous, yet the forms are imaginative and not strictly realistic.

Overall, this illustration from the "Atlas Plantarum" collection is a beautiful blend of natural beauty and artistic imagination, showcasing a variety of plants and a butterfly in a visually captivating manner.', 'https://ipfs.io/ipfs/QmSQFHKBX9VCKzw29hmLNmSMNTkGAGcwok4uP9sXekNZqx', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/8', NULL, 'OBJKT', NULL, '{atlas,plantarum,botanical,vintage,illustration,flower,flowers,scifi}', 'rokoroko', '', '2025-05-11 12:40:42.855431', '2025-05-11 12:40:42.855431', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 8, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_8', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"8"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/8', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:42.811', 'published');
INSERT INTO public.portfolio_items VALUES (89, 'Plant #12', 'The illustration Plant #12 from the collection "Atlas Plantarum" showcases an imaginative and richly detailed plant, set within an ornate frame that enhances its fantastical nature.

Central Flower:
The focal point is a large, vibrant red flower with multiple petals. The petals are intricately detailed, with a gradient that adds depth and texture. The flower''s center is dark, possibly indicating a deep, rich core.

Stem and Leaves:
The plant has a sturdy, green stem that supports not only the main flower but also several other elements. The leaves are broad, with visible veins and a realistic texture, adding to the plant''s lifelike appearance.

Surrounding Elements:
The illustration features a variety of other flowers and plants surrounding the central flower. These include:
A sunflower-like flower with yellow petals and a dark center.
A flower with a unique, segmented structure resembling a bud or seed pod.
Smaller, colorful flowers with intricate details, adding variety and richness to the illustration.

Butterflies and Insects:
Several butterflies and insects are depicted around the plant, contributing to the scene''s liveliness. The butterflies are vividly colored, with patterns on their wings that add to the overall aesthetic. They are placed in various positions, some in flight and others perched, enhancing the dynamic feel of the illustration.

Decorative Frame:
The entire scene is enclosed within an ornate, baroque-style frame. The corners of the frame are adorned with intricate designs, possibly floral motifs, which complement the central plant illustration. The frame itself is detailed with patterns and colors that harmonize with the plant''s vibrant hues.

Additional Details:
Small buds, leaves, and other floral elements are scattered throughout the illustration, creating a sense of abundance and natural beauty. The use of a limited color palette, with reds, greens, yellows, and browns, gives the illustration a cohesive and harmonious look.

Overall, this illustration from "Atlas Plantarum" combines botanical realism with imaginative elements, creating a visually captivating and detailed depiction of a fantastical plant surrounded by a lively ecosystem. The ornate framing adds an element of classical art, making the piece both educational and ', 'https://ipfs.io/ipfs/QmXe3UkW4BJcmDBYjC5tKBGbPUZascGWhM5nbD5U3sjdt5', 'Atlas Plantarum', 'https://objkt.com/tokens/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/11', NULL, 'OBJKT', NULL, '{atlas,plantarum,flowers,vintage,illustration,scifi,flower}', 'rokoroko', '', '2025-05-11 12:40:43.319988', '2025-05-11 12:40:43.319988', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 11, '2', 'KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi_11', 'tezos', '{"contract":"KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi","tokenId":"11"}', 'https://objkt.com/asset/KT1SFBBhLasggU5aNiYxisHoPCtdYpc9jNRi/11', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:43.275', 'published');
INSERT INTO public.portfolio_items VALUES (94, 'Robot #2', 'The image Robot #2 depicts a robotic head with several distinctive features:

Design and Structure: The head is sleek and modern, with a smooth, rounded helmet-like appearance. It is predominantly white with metallic accents, giving it a high-tech and futuristic look.
Eyes: The eyes are particularly striking, with glowing blue circular patterns, suggesting advanced visual sensors or cameras. The eyes are large and prominent, adding to the robotic aesthetic.
Headphones: The robot is equipped with headphones that are integrated into its head design. The headphones are modern, with a metal and plastic construction, and they include visible control knobs and a red button, indicating advanced audio capabilities.
Cabling and Details: There are visible cables and wires connected to the head, suggesting that it is part of a larger robotic system or that it requires external power or data connections. The head has various small lights and details, enhancing its technological appearance.
Lighting: The head features small red and blue lights, possibly indicating active status or serving as indicators for various functions. The lighting gives the robot a dynamic and active appearance.
Color Scheme: The overall color scheme includes metallic silver, blue, and red lighting, which enhances the futuristic and advanced technology feel of the robot.
Expression and Features: The robot''s face is designed with minimalistic features, including a neutral expression, which emphasizes functionality over human-like appearance. The mouth area is designed with a vent-like structure, possibly for cooling or to suggest some form of communication.

This robotic design suggests a blend of advanced technology and aesthetics, likely intended for applications in fields like robotics, artificial intelligence, or futuristic entertainment. The design elements, such as the glowing eyes and integrated headphones, highlight its role in a high-tech environment.', 'https://ipfs.io/ipfs/QmSZrVYFQqFnpUwPu85nyDV7A6fJUQUjSomf7QZrDVeJi7', 'NFT', NULL, NULL, NULL, NULL, '{tezos,nft,objkt}', 'rokoroko', NULL, '2025-05-11 12:40:44.094873', '2025-05-11 12:40:44.094873', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 0, '2', 'KT1RksriZwqHdoQmm5bdVBjJhwuCvU27q6C1_1', 'tezos', '{"contract":"KT1RksriZwqHdoQmm5bdVBjJhwuCvU27q6C1","tokenId":"1"}', 'https://objkt.com/asset/KT1RksriZwqHdoQmm5bdVBjJhwuCvU27q6C1/1', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:44.048', 'published');
INSERT INTO public.portfolio_items VALUES (139, 'RED #9', 'This piece of art from the "RED" collection is a digital artwork that employs a stark, geometric style with a limited color palette of red, black, and gray. The subject of the artwork is a stylized human figure, rendered in a highly abstract manner.

Key elements of the artwork include:
Color: The dominant red background creates a dramatic and intense atmosphere, which is a recurring theme in the "RED" collection. The use of red can evoke strong emotions such as passion, anger, or danger.
Form: The figure is composed of angular, faceted shapes, giving it a fragmented, almost robotic or futuristic appearance. This geometric abstraction might suggest themes of dehumanization, technology, or the breakdown of identity.
Texture: The surface of the figure has visible cracks and lines, which could symbolize fragility, decay, or the impact of time and experience on the self.
Composition: The figure is positioned centrally against the red background, which makes it the focal point. The stark contrast between the figure and the background emphasizes its form and texture.

Interpretations of this piece might include:
Identity and Fragmentation: The geometric and fragmented nature of the figure could represent a fractured sense of self or identity, possibly influenced by external pressures or internal conflicts.
Technological Influence: The robotic or futuristic design might comment on the influence of technology on human life, suggesting a merging or conflict between human and machine.
Emotional State: The intense red background combined with the fragmented figure might convey a state of emotional turmoil or intensity, where the individual is grappling with their sense of self amidst overwhelming circumstances.

Overall, this piece is a compelling exploration of human identity, technology, and emotion, using abstract forms and bold colors to create a powerful visual statement.', 'https://ipfs.io/ipfs/QmdDWhjJMSCug6nJU24sLeh2xy9dG2bsqxrhDfUhxeibbQ', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/8', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-11 12:40:51.09307', '2025-05-11 12:40:51.09307', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 8, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_8', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"8"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/8', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:51.048', 'published');
INSERT INTO public.portfolio_items VALUES (140, 'RED #10', 'This piece from the "RED" collection is a digital artwork that combines elements of portraiture with futuristic and abstract aesthetics. Here''s a detailed description:

Color Scheme: The predominant color is a vivid red, which creates a dramatic and intense backdrop. This color choice evokes strong emotions, possibly symbolizing passion, danger, or intensity.
Subject: The subject is a human face, but it is highly stylized and abstracted. The face is partially covered by geometric, angular shapes that resemble a mask or armor. These shapes are rendered in shades of red and black, creating a stark contrast with the skin tone of the face.
Mask: The mask-like structure covers the forehead, eyes, and part of the cheeks, leaving the mouth area exposed. The mask is composed of faceted, almost crystalline shapes with a rough texture, suggesting a sense of fragility or decay.
Texture: The surface of the mask has visible cracks and lines, adding to the sense of wear or damage. This texture might symbolize the passage of time, emotional scars, or the breakdown of identity.
Lighting: The lighting is dramatic, with strong contrasts between light and shadow. The light highlights the contours of the face and the textures of the mask, giving the piece a three-dimensional feel.
Composition: The figure is centrally placed against the red background, making it the focal point. The red background enhances the intensity and focus on the subject''s face and mask.

Possible interpretations of this artwork could include:

Identity and Protection: The mask might symbolize a protective barrier or a constructed identity, suggesting themes of how individuals present themselves to the world versus their true selves.
Emotional Conflict: The red background and the fragmented mask could represent inner turmoil or emotional conflict, with the mask acting as both a shield and a prison.
Technological or Futuristic Themes: The geometric shapes and the mask''s design might hint at futuristic or technological influences on human identity, exploring the intersection of humanity and technology.

Overall, this artwork is a powerful exploration of human emotion, identity, and the impact of external influences, using bold colors and abstract forms to convey its message.', 'https://ipfs.io/ipfs/QmcfUcE89ao7jiRfe3HxH5aVupBogchkgZcP6qH3k5g5ps', 'RED', 'https://objkt.com/tokens/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/9', NULL, 'OBJKT', NULL, '{RED,face}', 'rokoroko', '', '2025-05-11 12:40:51.246966', '2025-05-11 12:40:51.246966', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 9, '2', 'KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o_9', 'tezos', '{"contract":"KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o","tokenId":"9"}', 'https://objkt.com/asset/KT1AnrMQxhKKqzuF27kmw67yJDeMfD9rRj5o/9', 'OBJKT', NULL, 'XTZ', false, '2025-05-11 12:40:51.202', 'published');
INSERT INTO public.portfolio_items VALUES (146, 'Screaming Scull #9', 'Screaming Skull #9 features a bold, comic-style skull with exaggerated features, including large eye sockets and a wide, toothy grin, set against a background of dynamic splashes and geometric shapes, creating an energetic, graphic horror piece.', 'https://ipfs.io/ipfs/QmcJ1ptQ3h82s2kg2tY82Y1AZCcbd2ym1uTJPVXQ8JEUHD', 'Screaming Scull', 'https://objkt.com/tokens/KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx/9', NULL, 'OBJKT', NULL, '{screaming,scull,horror,popart}', 'rokoroko', '', '2025-05-16 23:02:57.663152', '2025-05-16 23:02:57.663152', '/uploads/4cd68357ae3e772b259a35805df8e792.jfif', 2, '2', 'KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx_9', 'tezos', '{"contract":"KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx","tokenId":"9","creator":{"name":"tz2SPs...e8rM","address":"tz2SPspygxvL7RuVmWj5D9DT6aWshUCde8rM","image":""},"collection":{"name":"Collection KT1EKf...9Rtx","address":"KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx","image":"https://ipfs.io/ipfs/QmYWjLXVvChRp9s2h5fvK93dWggqRuBHMd4AkoGKibXYYo"}}', 'https://objkt.com/asset/KT1EKfLK7N7bNM7c4KHkuoDa4yUqPtbo9Rtx/9', 'OBJKT', NULL, 'XTZ', false, '2025-05-16 23:02:57.623', 'published');


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.favorites VALUES ('4', 11, '2025-04-11 20:44:50.930075');
INSERT INTO public.favorites VALUES ('4', 7, '2025-04-11 20:45:17.795369');
INSERT INTO public.favorites VALUES ('4', 28, '2025-04-11 21:08:45.023301');
INSERT INTO public.favorites VALUES ('4', 17, '2025-04-11 21:09:23.150743');
INSERT INTO public.favorites VALUES ('4', 16, '2025-04-11 21:47:03.854536');
INSERT INTO public.favorites VALUES ('4', 18, '2025-04-11 21:47:11.296117');
INSERT INTO public.favorites VALUES ('4', 14, '2025-04-11 21:47:22.84924');
INSERT INTO public.favorites VALUES ('3', 12, '2025-04-11 22:39:12.30923');
INSERT INTO public.favorites VALUES ('3', 11, '2025-04-11 22:39:19.202998');
INSERT INTO public.favorites VALUES ('3', 15, '2025-04-11 22:39:27.213409');
INSERT INTO public.favorites VALUES ('3', 13, '2025-04-11 22:39:35.257566');
INSERT INTO public.favorites VALUES ('3', 10, '2025-04-11 22:44:10.012633');
INSERT INTO public.favorites VALUES ('3', 20, '2025-04-11 22:44:30.49842');
INSERT INTO public.favorites VALUES ('3', 21, '2025-04-14 10:57:51.153756');
INSERT INTO public.favorites VALUES ('3', 35, '2025-04-14 11:35:56.281491');
INSERT INTO public.favorites VALUES ('2', 11, '2025-04-14 17:56:58.477917');
INSERT INTO public.favorites VALUES ('2', 44, '2025-04-14 17:57:25.56652');
INSERT INTO public.favorites VALUES ('2', 12, '2025-04-14 17:58:22.770274');
INSERT INTO public.favorites VALUES ('2', 35, '2025-04-14 17:58:40.237942');
INSERT INTO public.favorites VALUES ('2', 40, '2025-04-14 17:58:54.560348');
INSERT INTO public.favorites VALUES ('2', 38, '2025-04-14 17:59:07.641036');
INSERT INTO public.favorites VALUES ('2', 37, '2025-04-14 17:59:15.847757');
INSERT INTO public.favorites VALUES ('4', 44, '2025-04-14 18:57:37.546051');
INSERT INTO public.favorites VALUES ('2', 129, '2025-05-11 21:39:27.037853');
INSERT INTO public.favorites VALUES ('2', 52, '2025-05-11 21:40:03.719019');
INSERT INTO public.favorites VALUES ('2', 55, '2025-05-11 22:37:16.940597');
INSERT INTO public.favorites VALUES ('2', 56, '2025-05-11 22:37:21.797509');
INSERT INTO public.favorites VALUES ('2', 137, '2025-05-20 20:24:12.975739');


--
-- Data for Name: item_collectors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.item_collectors VALUES (147, '2', '2025-05-20 19:25:02.270671');
INSERT INTO public.item_collectors VALUES (148, '2', '2025-05-20 19:25:02.619257');
INSERT INTO public.item_collectors VALUES (149, '2', '2025-05-20 19:25:02.91745');
INSERT INTO public.item_collectors VALUES (150, '2', '2025-05-20 19:25:03.208926');
INSERT INTO public.item_collectors VALUES (151, '2', '2025-05-20 19:25:03.535973');
INSERT INTO public.item_collectors VALUES (152, '2', '2025-05-20 19:25:03.981368');
INSERT INTO public.item_collectors VALUES (153, '2', '2025-05-20 19:25:04.297775');
INSERT INTO public.item_collectors VALUES (154, '2', '2025-05-20 19:25:04.577496');
INSERT INTO public.item_collectors VALUES (155, '2', '2025-05-20 19:25:04.89975');
INSERT INTO public.item_collectors VALUES (156, '2', '2025-05-20 19:25:05.190312');
INSERT INTO public.item_collectors VALUES (157, '2', '2025-05-20 19:25:05.493891');
INSERT INTO public.item_collectors VALUES (158, '2', '2025-05-20 19:25:05.776165');


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: share_links; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.share_links VALUES (1, 4, '8892f75322da', NULL, NULL, NULL, '2025-04-10T13:49:38.152Z', '2025-04-11T14:15:00.000Z', 1);


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.site_settings VALUES (11, 'email_service', 'sendgrid', '2025-04-24 08:40:12.727791', '2025-04-24 08:40:12.727791');
INSERT INTO public.site_settings VALUES (12, 'email_from', 'noreply@yourdomain.com', '2025-04-24 08:40:17.436374', '2025-04-24 08:40:17.436374');
INSERT INTO public.site_settings VALUES (1, 'twitter_url', 'https://x.com/rokorobot', '2025-04-10 19:58:15.589483', '2025-04-24 15:22:33.487');
INSERT INTO public.site_settings VALUES (2, 'instagram_url', '', '2025-04-10 19:58:16.128442', '2025-04-24 15:22:34.021');
INSERT INTO public.site_settings VALUES (3, 'email_contact', 'custom@nftfolio.app', '2025-04-10 19:58:16.444652', '2025-04-24 15:22:34.34');
INSERT INTO public.site_settings VALUES (4, 'phone_contact', '+420 739605335', '2025-04-11 08:27:30.389227', '2025-04-24 15:22:34.648');
INSERT INTO public.site_settings VALUES (5, 'office_address', '123 Portfolio Street
Creative District
New York, NY 10001', '2025-04-11 08:27:30.750366', '2025-04-24 15:22:34.961');
INSERT INTO public.site_settings VALUES (6, 'grid_columns_desktop', '6', '2025-04-11 18:58:12.353566', '2025-04-24 15:22:35.27');
INSERT INTO public.site_settings VALUES (7, 'grid_columns_tablet', '3', '2025-04-11 18:58:12.684593', '2025-04-24 15:22:35.579');
INSERT INTO public.site_settings VALUES (8, 'grid_columns_mobile', '1', '2025-04-11 18:58:12.993265', '2025-04-24 15:22:35.89');
INSERT INTO public.site_settings VALUES (9, 'items_per_page', '24', '2025-04-11 18:58:13.309474', '2025-04-24 15:22:36.211');
INSERT INTO public.site_settings VALUES (10, 'showcase_interval', '5000', '2025-04-11 22:19:33.960238', '2025-05-17 22:23:24.197');
INSERT INTO public.site_settings VALUES (15, 'site_title', 'NFT Portfolio', '2025-05-22 22:58:17.767161', '2025-05-22 22:58:17.767161');
INSERT INTO public.site_settings VALUES (16, 'showcase_autoplay', 'true', '2025-05-22 22:58:17.767161', '2025-05-22 22:58:17.767161');


--
-- Data for Name: users_backup; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public.users_backup VALUES (1, 'admin', 'da0d8287f9d305ffe20c68c45393bffdc254f6e356820f521a62eba03a568419c4738928f72b39c2b7590bdff824859696bd1ad323eea29448cd8fe0b51579b8.55bf2a7edd4b47e3d94eb69e14edfb7a', 'admin', true, 'admin@placeholder.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, '2025-04-23 20:17:04.26184', '2025-04-23 20:17:04.26184');
INSERT INTO public.users_backup VALUES (2, 'rokoroko', 'fd0efe05b135e48ea2635639acac5f70e2a1080e56fb43abdb4fdef990ce506b60dc88b7a8f7a6fa0bba9c63c0ca553e6c790ce02ab53ebb262de5e222e05bd5.bbcabd3df81a417047ca3e5989c4cec6', 'admin', true, 'rokoroko@placeholder.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, '2025-04-23 20:17:04.26184', '2025-04-23 20:17:04.26184');
INSERT INTO public.users_backup VALUES (3, 'creator', '4e78d95bbb5518b4043bc2e88c71e6ecf16a26a4d813f28545c1c9b61c1bb8f5e6c55575211afb24edaaf0b1533a6861b9437c6b2fa25e84fd65fc2607186b48.1aed268fe60de41ff4ce80163604b89a', 'admin', true, 'creator@placeholder.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, '2025-04-23 20:17:04.26184', '2025-04-23 20:17:04.26184');
INSERT INTO public.users_backup VALUES (4, 'visitor', '10ba29aa9ec043b5e6c3eb81d19d92afd76e6605968d7888e85e1c721b380db1de6c39bf920915bf22896470f08a53ea6537f88e341ae2c828a0e64adbfd38b7.537e9f862ae2afb514fa96d928576379', 'guest', true, 'visitor@placeholder.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, '2025-04-23 20:17:04.26184', '2025-04-23 20:17:04.26184');
INSERT INTO public.users_backup VALUES (6, 'ArtistOne', '336e2b0643003000b9453f47f39392a95871fdbc0668962b838a999b86ca30ceb33ec7d7d6b2b35ef8be01ffa3c68e32bd8dc2c3fedbabe480dde647c568c955.2f2a42f93c0b2d2084b3238503346d14', 'collector', true, 'robertes@gmail.com', 'ArtistOne', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, 'cc1b542a5aa835356a5edfcd2a48b7a3a1323abf1891c55497c95329b3f633db', NULL, NULL, '2025-04-24 13:50:20.987684', '2025-04-24 13:51:32.187');
INSERT INTO public.users_backup VALUES (7, 'ArtistTwo', '43333e172c0c7cec5f83080d9dbd44320aa708ea07e22945c42edfb1d2f7063fe4527b623ec603192b3cb3029da335fd4e297e8c3e98f46f568528592cea8eb6.55160215ba32670717579e8bc2c64958', 'collector', true, 'robertkonecny@gmail.com', 'Robert Kon', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, '55377cf98d452b50893b23b20267cae2543bde2603b72f7f9c4c7b163ed6be42', NULL, NULL, '2025-04-24 14:03:00.551654', '2025-04-24 14:03:15.87');
INSERT INTO public.users_backup VALUES (5, 'PlayerOne', '49fbefc48219aad87e1fb2852d546ff5f4304eb9fe62e84c35cb7cb80af0d1eefaf43c396a86f718ace04830c04034318e437f15ba63b7d4abac604941e7f1df.22a130c5e85c434264a30d9b06eaacba', 'collector', true, 'rokoroko@seznam.cz', 'PlayerOne', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, '2025-04-24 08:30:41.116557', '2025-04-24 14:21:33.686');


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.categories_id_seq', 20, true);


--
-- Name: portfolio_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.portfolio_items_id_seq', 159, true);


--
-- Name: share_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.share_links_id_seq', 1, true);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 17, true);


--
-- PostgreSQL database dump complete
--

