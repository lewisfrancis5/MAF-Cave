import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_DATA = [{"id":0,"name":"Blanc de Blancs Brut","region":"Alsace","appellation":"Cremant d'Alsace","vineyard":"Dopff & Irion","supplier":"Tanners","vintage":"2021","best":"2025","type":"White","rating":7,"bottles":1,"binNo":"1A13","price":14.95,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":1,"name":"Amand","region":"Basilicata","appellation":"Agilanico del Vulture","vineyard":"Alovini","supplier":"Wine Society","vintage":"2020","best":"2026","type":"Red","rating":null,"bottles":2,"binNo":"2E6, 2F1","price":14,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":2,"name":"Chateau Mazerolles","region":"Bordeaux","appellation":"Blaye","vineyard":"Chateau Mazerolles","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"2A5","price":16,"tastingNotes":"w ham & pastrami risotto - M enjoyed. w Fillet steak rolled in pancetta, roasties and pak choi. Enjoyed, medium body good compliment","dateConsumed":"2024-11-01","decant":"","buy":""},{"id":3,"name":"Lune d'Argent","region":"Bordeaux","appellation":"Bordeaux","vineyard":"Clos des Lunes","supplier":"Tanners","vintage":"2021","best":"2025","type":"White","rating":7,"bottles":2,"binNo":"3B1,3B10","price":12.8,"tastingNotes":"","dateConsumed":"","decant":"","buy":"Y"},{"id":4,"name":"Chateau Lary-Tagot","region":"Bordeaux","appellation":"Bordeaux","vineyard":"Chateau Lary-Tagot","supplier":"Wine Society","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":2,"binNo":"2D1, 2E5","price":8.25,"tastingNotes":"TWS - ripe, full bodied claret with impressive density of fruit. Unoaked to ensure maximum fruit expression.","dateConsumed":"2024-11-01","decant":"","buy":"Y"},{"id":5,"name":"Chame d'Alienor","region":"Bordeaux","appellation":"Bordeaux Superieur","vineyard":"Cave de Sauveterre","supplier":"Vinatis","vintage":"2018","best":"2026","type":"Red","rating":6,"bottles":1,"binNo":"2D2","price":9.65,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":6,"name":"Chateau Pey La Tour","region":"Bordeaux","appellation":"Bordeaux Superieur","vineyard":"Chateau Pey La Tour","supplier":"Wine Society","vintage":"2019","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1B12","price":11.95,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":7,"name":"Chateau Pitray","region":"Bordeaux","appellation":"Castillion Cotes du Bordeaux","vineyard":"Chateau Pitray","supplier":"Wine Society","vintage":"2021","best":"2025","type":"Red","rating":null,"bottles":1,"binNo":"2C4","price":11.5,"tastingNotes":"w Korean spicy chicken & gochujang sauce and duck spring rolls - rich, complex and coped well with the chilli heat.","dateConsumed":"2025-11-01","decant":"","buy":""},{"id":8,"name":"Chateau Brisson","region":"Bordeaux","appellation":"Castillion Cotes du Bordeaux","vineyard":"Chateau Brisson","supplier":"Tanners","vintage":"2021","best":"2025","type":"Red","rating":6,"bottles":3,"binNo":"4B10-12","price":11,"tastingNotes":"w chilli & rice - nice, fruity soft; good quaff","dateConsumed":"","decant":"","buy":""},{"id":9,"name":"Chateau Puygeraud","region":"Bordeaux","appellation":"Cotes du Bordeaux","vineyard":"SCEA Chateau Puygeraud","supplier":"Tanners","vintage":"2019","best":"2026","type":"Red","rating":7,"bottles":1,"binNo":"3E5","price":13.48,"tastingNotes":"w fillet steak wrapped in pancetta and wild mushroom - delicious, good nose, soft & rich","dateConsumed":"2025-01-01","decant":"","buy":""},{"id":10,"name":"Chateau Puygeraud","region":"Bordeaux","appellation":"Cotes du Bordeaux","vineyard":"SCEA Chateau Puygeraud","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":6,"bottles":2,"binNo":"1A20,1H9","price":14.08,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":11,"name":"Chateau Puygeraud","region":"Bordeaux","appellation":"Cotes du Bordeaux","vineyard":"SCEA Chateau Puygeraud","supplier":"Tanners","vintage":"2021","best":"2026","type":"White","rating":7,"bottles":1,"binNo":"3 E8","price":13.7,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":12,"name":"Chateau Le Clos de Notaire","region":"Bordeaux","appellation":"Cotes de Bourg","vineyard":"Chateau Clos de Notaire","supplier":"Wine Society","vintage":"2017","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1G5","price":10.5,"tastingNotes":"w fillet steak, frites & salad - slight hint of spice, dark berries.","dateConsumed":"2026-02-01","decant":"","buy":""},{"id":13,"name":"Chateau Merigot","region":"Bordeaux","appellation":"Cotes de Bourg","vineyard":"Chateau Merigot","supplier":"Vinatis","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"2B2","price":11.67,"tastingNotes":"w beef strog, creamed potatoes and fried courgettes - a fine rich complement and good quaff","dateConsumed":"2024-10-01","decant":"","buy":""},{"id":14,"name":"Entre Deux Mers","region":"Bordeaux","appellation":"Entres deux Mers","vineyard":"Chateau Grand-Jean","supplier":"Vinatis","vintage":"2022","best":"2026","type":"White","rating":7,"bottles":1,"binNo":"4C5","price":9.11,"tastingNotes":"w salmon & prawn risotto - very pleasant. w baked Trout, pesto rice & salade - clean, lemon softness (under £10 Marvellous)","dateConsumed":"2025-06-01","decant":"","buy":"Y"},{"id":15,"name":"Chateau Haut-Lariveau","region":"Bordeaux","appellation":"Fronsac","vineyard":"Chateau Haut-Lariveau","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"4D5","price":15.8,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":16,"name":"Clos Floridene","region":"Bordeaux","appellation":"Graves","vineyard":"Clos Floridene","supplier":"Wine Society","vintage":"2021","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"5D4","price":16.41,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":17,"name":"Les Caleches de Lanessan","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Domaine Bouteiller","supplier":"Tanners","vintage":"2015","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1B15","price":19.2,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":18,"name":"Chateau La Tour Carnet GCC","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Chateau La Tour Carnet","supplier":"Gift","vintage":"2018","best":"2026","type":"Red","rating":null,"bottles":1,"binNo":"1D6","price":25,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":19,"name":"Chateau Barreyres","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Chateau Barreyres","supplier":"Gift","vintage":"2019","best":"2025","type":"Red","rating":null,"bottles":1,"binNo":"1G7","price":15,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":20,"name":"Chateau Cantemerle Premier Cru","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Chateau Cantemerle","supplier":"Tanners","vintage":"2019","best":"2025","type":"Red","rating":7,"bottles":2,"binNo":"1C4, 1D1","price":23.68,"tastingNotes":"With Beef & venison flaky pastry pie, truffle dauphinoise. Full bodied, rich, blackberry finish. W haggis, mash, peas - firm tasty complement and rich robust quaff","dateConsumed":"2025-10-01","decant":"Y","buy":"Y"},{"id":21,"name":"Chateau Cantemerle Premier Cru","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Chateau Cantemerle","supplier":"Tanners","vintage":"2020","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"1D2,1E3,1E5,1H4,1D10,3E9","price":25.1,"tastingNotes":"","dateConsumed":"","decant":"Y","buy":"Y"},{"id":22,"name":"Chateau Senejac","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Chateau Senejac","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":2,"binNo":"2F6,3E1","price":14.08,"tastingNotes":"w toulouse sausages & lentil casserole with slices of venison - rounded mouth with hits of fennel, M enjoyed.","dateConsumed":"2025-01-01","decant":"YES","buy":""},{"id":23,"name":"Chateau Lanessan","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Chataeu Lanessan","supplier":"Tanners","vintage":"2021","best":"2026","type":"Red","rating":7,"bottles":8,"binNo":"3C10,3C11,3D8,4C1,4C2,4D2,4D3","price":15.2,"tastingNotes":"w slow cooked roast chicken - moist and tender - M enjoyed","dateConsumed":"2024-11-01","decant":"","buy":""},{"id":24,"name":"Chateau Les Hautes-Conseillants","region":"Bordeaux","appellation":"Lalande-de-Pomerol","vineyard":"Chateau Les Hauts-Coneillants","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":2,"binNo":"1E12,1E13","price":15.88,"tastingNotes":"w game bird roulade, ham, and christmas veg - delicious, long finish. Hint of chocolate finish.","dateConsumed":"2025-11-01","decant":"","buy":"Y"},{"id":25,"name":"Chateau de Bel-Air","region":"Bordeaux","appellation":"Lalande-de-Pomerol","vineyard":"Chateau du Bel-Air","supplier":"Tanners","vintage":"2022","best":"2028","type":"Red","rating":null,"bottles":12,"binNo":"Boxed","price":15.5,"tastingNotes":"TWS - sweet and juicy fruit, black cherry and plum fool in the mouth. Wonderfully balanced. 3-6 yrs","dateConsumed":"","decant":"","buy":""},{"id":26,"name":"Chateau Froucas Hosten","region":"Bordeaux","appellation":"Listrac-Medoc","vineyard":"Chateau Froucas-Hosten","supplier":"Wine&Co","vintage":"2008","best":"2028","type":"Red","rating":8,"bottles":1,"binNo":"1B21","price":11.7,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":27,"name":"Chateau du Courlet","region":"Bordeaux","appellation":"Lussac-Saint-Emilion","vineyard":"Chateau du Courlet","supplier":"Tanners","vintage":"2020","best":"2026","type":"Red","rating":6,"bottles":5,"binNo":"1A15,1A21,1E21","price":11.08,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":28,"name":"Cuvee Jean-Baptiste","region":"Bordeaux","appellation":"Lussac-Saint-Emilion","vineyard":"Chateau du Courlet","supplier":"Tanners","vintage":"2022","best":"2027","type":"Red","rating":null,"bottles":12,"binNo":"Boxed","price":10.25,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":29,"name":"Chateau d'Angludet","region":"Bordeaux","appellation":"Margaux","vineyard":"Chateau d'Angludet","supplier":"Tanners","vintage":"2020","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"Boxed","price":30.28,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":30,"name":"Chateau La Gurgue","region":"Bordeaux","appellation":"Margaux","vineyard":"Chateau La Gurgue","supplier":"Tanners","vintage":"2021","best":"2026","type":"Red","rating":8,"bottles":4,"binNo":"1A5,1D3,1E6","price":21.1,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":31,"name":"Chateau Dufort-Vivens","region":"Bordeaux","appellation":"Margaux","vineyard":"Chataeu Dufort","supplier":"Tanners","vintage":"2021","best":"2030","type":"Red","rating":null,"bottles":3,"binNo":"1F18,1F20,1F21","price":55.4,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":32,"name":"Alter Ego de Chateau Palmer","region":"Bordeaux","appellation":"Margaux","vineyard":"Chateau Palmer","supplier":"Tanners","vintage":"2021","best":"2028","type":"Red","rating":null,"bottles":3,"binNo":"5E3","price":69.2,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":33,"name":"Chateau La Tour-de-By","region":"Bordeaux","appellation":"Medoc","vineyard":"Chateau La Tour-de-By","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":0,"binNo":"","price":14.38,"tastingNotes":"w venison meatballs - coped with richness, mellow; w Toulouse sausage casserole - fruity, soft","dateConsumed":"2026-02-01","decant":"","buy":""},{"id":34,"name":"Chateau La Tour-de-By","region":"Bordeaux","appellation":"Medoc","vineyard":"Chateau La Tour-de-By","supplier":"Tanners","vintage":"2021","best":"2026","type":"Red","rating":7,"bottles":12,"binNo":"1E8-13,1F9-13","price":14.9,"tastingNotes":"w lightly pan fried venison steaks, pak choi & rice - M thought good","dateConsumed":"","decant":"","buy":""},{"id":35,"name":"Chateau Montaigullion","region":"Bordeaux","appellation":"Montagne Saint-Emilion","vineyard":"Chantal Amart","supplier":"Tanners","vintage":"2019","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1C9","price":16.75,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":36,"name":"Chateau Dulruch Grand Poujeaux","region":"Bordeaux","appellation":"Moulis-en-Medoc","vineyard":"Chateau Dulruch Grand Poujeaux","supplier":"Wine Society","vintage":"2015","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1A4","price":19,"tastingNotes":"w fillet steak wrapped in pancetta & wild mushrooms - well flavoured, interesting finish","dateConsumed":"2024-12-01","decant":"","buy":""},{"id":37,"name":"Chateau Mauvesin-Barton","region":"Bordeaux","appellation":"Moulis-en-Medoc","vineyard":"Chateau Mauvesin-Barton","supplier":"Tanners","vintage":"2022","best":"2027","type":"Red","rating":null,"bottles":12,"binNo":"4A1,4A2,2A1,2A6,4B7,4B8","price":12.95,"tastingNotes":"TWS - Plenty of black cherry fruit with plum, very fresh and zippy. Very drinkable 0-5 yrs","dateConsumed":"","decant":"","buy":""},{"id":38,"name":"Chateau Haut-Bages-Liberal","region":"Bordeaux","appellation":"Pauillac","vineyard":"Chateau Haut-Bages-Liberal","supplier":"Tanners","vintage":"2019","best":"2025","type":"Red","rating":8,"bottles":2,"binNo":"1E15,1E19","price":31.48,"tastingNotes":"w roast duck, dauphinoise - very fine accompaniment - rich, good fruit balance. With venison casserole - rich, good finish.","dateConsumed":"2025-12-01","decant":"Y","buy":"Y"},{"id":39,"name":"Reserve de la Comptesse","region":"Bordeaux","appellation":"Pauillac","vineyard":"Chateau Pichon Longueville","supplier":"Tanners","vintage":"2020","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"Boxed","price":42.26,"tastingNotes":"w salmon & prawn risotto - very pleasant","dateConsumed":"","decant":"","buy":""},{"id":40,"name":"Chateau Hauts-Bages Monpelou","region":"Bordeaux","appellation":"Pauillac","vineyard":"Chataeu Batailley","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1F14","price":23,"tastingNotes":"w confit duck, roasties, pak choi & cav nero - rich nose, excellent quaff.","dateConsumed":"2025-02-01","decant":"","buy":""},{"id":41,"name":"Chateau Batailley","region":"Bordeaux","appellation":"Pauillac","vineyard":"Chateau Batailley","supplier":"Tanners","vintage":"2020","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"Boxed","price":36.6,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":42,"name":"5eme cru Classe","region":"Bordeaux","appellation":"Pauillac","vineyard":"Chateau Grand-Puy Ducasse","supplier":"Tanners","vintage":"2021","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"F","price":32,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":43,"name":"Chateau Haut-Bages Monpelou","region":"Bordeaux","appellation":"Pauillac","vineyard":"Chateau Batailley","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":7,"bottles":6,"binNo":"1A1,1A2,1A3,1A6,1B2,1B3","price":16,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":44,"name":"Legrave-Martillac","region":"Bordeaux","appellation":"Pessac-Leognan","vineyard":"Chateau Latour-Martillac","supplier":"Wine Society","vintage":"2016","best":"2026","type":"Red","rating":7,"bottles":1,"binNo":"1H3","price":22,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":45,"name":"Chateau Lafont-Menaut","region":"Bordeaux","appellation":"Pessac-Leognan","vineyard":"Philibert Perrin","supplier":"Tanners","vintage":"2018","best":"2026","type":"Red","rating":null,"bottles":1,"binNo":"1B19","price":19.5,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":46,"name":"Le Dauphin d'Olivier","region":"Bordeaux","appellation":"Pessac-Leognan","vineyard":"Chateau Olivier","supplier":"Vinatis","vintage":"2019","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"2C6","price":19.34,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":47,"name":"Chateau Carbonnieux GCC","region":"Bordeaux","appellation":"Pessac-Leognan","vineyard":"Chateau Carbonnieux","supplier":"Tanners","vintage":"2020","best":"2026","type":"White","rating":null,"bottles":6,"binNo":"1C2,1C5,1C7,1C8","price":28.78,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":48,"name":"Chateau La Garde","region":"Bordeaux","appellation":"Pessac-Leognan","vineyard":"Chateau La Garde","supplier":"Wine Society","vintage":"2021","best":"2026","type":"Red","rating":null,"bottles":5,"binNo":"5D3","price":16.8,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":49,"name":"Chateau du Domaine de l'Eglise","region":"Bordeaux","appellation":"Pomerol","vineyard":"Chateau du Domaine de l'Eglise","supplier":"Tanners","vintage":"2021","best":"2028","type":"Red","rating":null,"bottles":3,"binNo":"1H14,1H19,1F7","price":35.6,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":50,"name":"Clos de Clocher","region":"Bordeaux","appellation":"Pomerol","vineyard":"Clos de Clocher","supplier":"Tanners","vintage":"2021","best":"2028","type":"Red","rating":null,"bottles":3,"binNo":"1G5,1G6,1F8","price":46,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":51,"name":"Chateau Pipeau","region":"Bordeaux","appellation":"Saint-Emilion Grand Cru","vineyard":"Chateau Pipeau","supplier":"Tanners","vintage":"2019","best":"2025","type":"Red","rating":7,"bottles":0,"binNo":"","price":18.41,"tastingNotes":"w beef strog & rice - delicate terroir nose, soft rich fruit, smooth quaff","dateConsumed":"2025-01-01","decant":"","buy":""},{"id":52,"name":"Chateau Pindefleurs","region":"Bordeaux","appellation":"Saint-Emilion Grand Cru","vineyard":"Chateau Pindefleurs","supplier":"Tanners","vintage":"2019","best":"2025","type":"Red","rating":null,"bottles":6,"binNo":"5B1","price":21.2,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":53,"name":"Chateau Pipeau","region":"Bordeaux","appellation":"Saint-Emilion Grand Cru","vineyard":"Chateau Pipeau","supplier":"Tanners","vintage":"2021","best":"2025","type":"Red","rating":7,"bottles":4,"binNo":"2A3,2A6,2B1,2C2","price":17.8,"tastingNotes":"w fillet steak, salad & frites - delicate but soft rich fruit, smooth quaff","dateConsumed":"","decant":"","buy":""},{"id":54,"name":"Chateau Les Ormes de Pez","region":"Bordeaux","appellation":"Saint-Estephe","vineyard":"Chateau Les Ormes de Pez","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":8,"bottles":2,"binNo":"1C14,1C17","price":25.7,"tastingNotes":"w ham, pastrami & mushroom risotto - delicious, subtle, very soft interesting finish. With roast duck confit - fully rounded and soft rich fruit","dateConsumed":"2025-12-01","decant":"","buy":""},{"id":55,"name":"Marque de Calon","region":"Bordeaux","appellation":"Saint-Estephe","vineyard":"Marque de Calon","supplier":"Tanners","vintage":"2021","best":"2025","type":"Red","rating":null,"bottles":6,"binNo":"5E1","price":27.2,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":56,"name":"Connetable de Talbot","region":"Bordeaux","appellation":"Saint-Julien","vineyard":"Connetable de Talbot Grand Cru","supplier":"Tanners","vintage":"2019","best":"2025","type":"Red","rating":8,"bottles":2,"binNo":"1B4,1B5","price":23.08,"tastingNotes":"","dateConsumed":"2025-01-01","decant":"","buy":""},{"id":57,"name":"1re Cru Les Fournieres","region":"Burgundy","appellation":"Aloxe-Corton","vineyard":"Domaine Talbot-Beauf","supplier":"Tanners","vintage":"2021","best":"2026","type":"Red","rating":null,"bottles":3,"binNo":"3D3,3D4,3D5","price":63.2,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":58,"name":"Auxey-Duresses","region":"Burgundy","appellation":"Auxey-Duresses","vineyard":"Domaine Michel Prunier","supplier":"Tanners","vintage":"2020","best":"2025","type":"White","rating":7,"bottles":4,"binNo":"3D9,3D10,3D11,3D12","price":24.28,"tastingNotes":"w salmon & king prawn risotto - was good as apero next day","dateConsumed":"2024-10-01","decant":"","buy":""},{"id":59,"name":"Premier Cru","region":"Burgundy","appellation":"Auxey-Duresses","vineyard":"Domaine Michel Prunier","supplier":"Tanners","vintage":"2021","best":"2025","type":"Red","rating":6,"bottles":5,"binNo":"1B2,1A10,1A17,1A19,1A7","price":26.6,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":60,"name":"Bourgogne Pinot Noir","region":"Burgundy","appellation":"Bourgogne","vineyard":"Domaine Bachelet-Monnot","supplier":"Tanners","vintage":"2021","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1B17","price":23.6,"tastingNotes":"w salmon & scallop risotto - gentle soft complement","dateConsumed":"2025-02-01","decant":"","buy":""},{"id":61,"name":"Cuvee Messaire de Tremont","region":"Burgundy","appellation":"Bourgogne","vineyard":"Hospices de Beaujeu","supplier":"Gift","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":2,"binNo":"3A4,4C12","price":13,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":62,"name":"Chardonnay","region":"Burgundy","appellation":"Bourgogne","vineyard":"Naudin Pere & Fils","supplier":"Gift","vintage":"2022","best":"2026","type":"White","rating":null,"bottles":1,"binNo":"3B9","price":10,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":63,"name":"Pinot Noir","region":"Burgundy","appellation":"Bourgogne Cotes d'Or","vineyard":"Odoul-Coquard","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1D21","price":20.08,"tastingNotes":"w pastrami, ham & broad bean risotto - M enjoyed. w confit duck, lentils and pommes dauphinoise - fruity dark cherry good quaff too","dateConsumed":"2025-01-01","decant":"","buy":"Y"},{"id":64,"name":"Bourgogne Cotes d'Or","region":"Burgundy","appellation":"Bourgogne Cotes d'Or","vineyard":"Domaine Bachelet-Monnot","supplier":"Tanners","vintage":"2021","best":"2025","type":"White","rating":7,"bottles":4,"binNo":"3C3,3C4,3E3,3E4","price":24.8,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":65,"name":"Bourgogne Hautes-Cotes de Beaune","region":"Burgundy","appellation":"Bourgogne Hautes-Cotes de Beaune","vineyard":"Jean Bouchard","supplier":"Gift","vintage":"2020","best":"2025","type":"Red","rating":null,"bottles":1,"binNo":"1H6","price":15,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":66,"name":"Bourgogne Hautes-Cotes de Beaune","region":"Burgundy","appellation":"Bourgogne Hautes Cotes de Beaune","vineyard":"Domaine Rollin Pere & Fils","supplier":"Tanners","vintage":"2020","best":"2025","type":"White","rating":7,"bottles":1,"binNo":"1D9","price":18.28,"tastingNotes":"w salmon & prawn risotto - rich, deep flavour also excellent quaff","dateConsumed":"2025-11-01","decant":"Y","buy":""},{"id":67,"name":"Bourgogne Hautes Cotes de Beaune W","region":"Burgundy","appellation":"Bourgogne Hautes Cotes de Beaune","vineyard":"Domaine Rollin Pere & Fils","supplier":"Tanners","vintage":"2022","best":"2026","type":"White","rating":null,"bottles":6,"binNo":"Boxed","price":20.6,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":68,"name":"Bourgogne Hautes Cotes de Beaune R","region":"Burgundy","appellation":"Bourgogne Hautes Cotes de Beaune","vineyard":"Domaine Rollin Pere & Fils","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"Boxed","price":20.6,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":69,"name":"Fontaine Saint Martin","region":"Burgundy","appellation":"Bourgogne Hautes Cotes de Nuits","vineyard":"Domain Michel Gros","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":2,"binNo":"1G17,1H15","price":22.48,"tastingNotes":"w poached pheasant, shallots, celery & soy, sesame spinach - gentle, fruity finish","dateConsumed":"","decant":"","buy":""},{"id":70,"name":"Chablis","region":"Burgundy","appellation":"Chablis","vineyard":"Moreau-Naudet","supplier":"Tanners","vintage":"2018","best":"2025","type":"White","rating":7,"bottles":1,"binNo":"?","price":16.48,"tastingNotes":"w salmon & prawn risotto - as always excellent","dateConsumed":"2024-12-01","decant":"","buy":""},{"id":71,"name":"Chablis","region":"Burgundy","appellation":"Chablis","vineyard":"Moreau-Naudet","supplier":"Tanners","vintage":"2020","best":"2025","type":"White","rating":8,"bottles":2,"binNo":"2E2,2E3","price":19.48,"tastingNotes":"w spring rolls & gyoza for lunch - delicious","dateConsumed":"2024-09-01","decant":"","buy":""},{"id":72,"name":"Cuvee Amarine","region":"Burgundy","appellation":"Coteaux Bourguignons","vineyard":"Closerie des Alisiers","supplier":"Vinatis","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":3,"binNo":"4D10,4D11,4D12","price":11.13,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":73,"name":"Grande Cadole","region":"Burgundy","appellation":"Coteaux Bourguignons","vineyard":"Vignerons de Bel Air","supplier":"Vinatis","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":4,"binNo":"4C7,4C8,4C9,4D7","price":10.31,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":74,"name":"L'Eclos de Abeilles","region":"Burgundy","appellation":"Coteaux Bourguignons","vineyard":"Maison Roche de Bellene","supplier":"Tanners","vintage":"2022","best":"2026","type":"White","rating":null,"bottles":6,"binNo":"Boxed","price":19.4,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":75,"name":"Coteaux Bourguignons","region":"Burgundy","appellation":"Coteaux Bourguignons","vineyard":"Albert Bichot","supplier":"Vinatis","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":2,"binNo":"4D8,4D9","price":15.9,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":76,"name":"Grande Cadole","region":"Burgundy","appellation":"Coteaux Bourguignons","vineyard":"Vignerons de Bel Air","supplier":"Vinatis","vintage":"2023","best":"2026","type":"Red","rating":null,"bottles":2,"binNo":"4C10,4D4","price":11.4,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":77,"name":"Vieilles Vignes","region":"Burgundy","appellation":"Gevrey-Chambertin","vineyard":"Louis Boilot et fils","supplier":"Tanners","vintage":"2021","best":"2026","type":"Red","rating":null,"bottles":3,"binNo":"1F15,1G14,1G15","price":57.2,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":78,"name":"Les Cailles","region":"Burgundy","appellation":"Irancy","vineyard":"Domaines des Ramparts","supplier":"Vinatis","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":2,"binNo":"2B6,3C1","price":15.35,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":79,"name":"Nuits Saint-George","region":"Burgundy","appellation":"Nuits Saint-George","vineyard":"Domaine Jean Chauvenet","supplier":"Wine Society","vintage":"2016","best":"2026","type":"Red","rating":null,"bottles":1,"binNo":"1H17","price":32,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":80,"name":"Pernand-Vergelesses","region":"Burgundy","appellation":"Pernand-Vergelesses","vineyard":"Domaine Rollin Pere & Fils","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":8,"bottles":1,"binNo":"1D8","price":23.88,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":81,"name":"Pernand-Vergelesses","region":"Burgundy","appellation":"Pernand-Vergelesses","vineyard":"Domaine Rollin Pere & Fils","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":5,"binNo":"3A7,3A8,3A9,3A10,3B12","price":28.4,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":82,"name":"Tete de Cuvee","region":"Burgundy","appellation":"Pouilly-Fuisse","vineyard":"Chateau Fuisse","supplier":"Tanners","vintage":"2019","best":"2025","type":"White","rating":8,"bottles":1,"binNo":"3A11","price":23.68,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":83,"name":"Tete de Cuvee","region":"Burgundy","appellation":"Pouilly-Fuisse","vineyard":"Chateau Fuisse","supplier":"Tanners","vintage":"2021","best":"2025","type":"White","rating":3,"bottles":3,"binNo":"3C7,3C8,3C9","price":28.4,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":84,"name":"P Cru Sentier du Clou","region":"Burgundy","appellation":"Saint-Aubin","vineyard":"Domaine Henri Prudhon","supplier":"Wine Society","vintage":"2018","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"2F5","price":19.68,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":85,"name":"P Cru Les Frionnes","region":"Burgundy","appellation":"Saint-Aubin","vineyard":"Domaine Henri Prudhon","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":2,"binNo":"1B11,1C19","price":23.68,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":86,"name":"Saint-Romain","region":"Burgundy","appellation":"Saint-Romain","vineyard":"Alain Gras","supplier":"Tanners","vintage":"2018","best":"2025","type":"White","rating":8,"bottles":1,"binNo":"1G4","price":24.28,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":87,"name":"Saint-Romain","region":"Burgundy","appellation":"Saint-Romain","vineyard":"Alain Gras","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":0,"binNo":"","price":24.28,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":88,"name":"Saint-Romain","region":"Burgundy","appellation":"Saint-Romain","vineyard":"Alain Gras","supplier":"Tanners","vintage":"2020","best":"2025","type":"White","rating":7,"bottles":2,"binNo":"3B7,3B8","price":25.48,"tastingNotes":"w one pot tomato & cod casserole - soft yet long finish","dateConsumed":"2025-08-01","decant":"","buy":""},{"id":89,"name":"Vieilles Vignes","region":"Burgundy","appellation":"Santenay","vineyard":"Domaine Borgeot","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1H7","price":20.68,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":90,"name":"Hauts-Marconnes P Cru","region":"Burgundy","appellation":"Savigny-Les-Beaune","vineyard":"Domaine Chanson","supplier":"Tanners","vintage":"2019","best":"2025","type":"White","rating":7,"bottles":1,"binNo":"1G21","price":23.68,"tastingNotes":"w moist salmon & prawn riso - soft complement","dateConsumed":"2024-09-01","decant":"","buy":""},{"id":91,"name":"P Cru Les Caillerets","region":"Burgundy","appellation":"Volnay","vineyard":"Domaine Michel Prunier","supplier":"Tanners","vintage":"2021","best":"2026","type":"Red","rating":null,"bottles":3,"binNo":"1E1,1E4,1D15","price":50,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":92,"name":"Vieilles Vignes","region":"Burgundy","appellation":"Vosne-Romanee","vineyard":"Maison Roche de Bellene","supplier":"Tanners","vintage":"2021","best":"2026","type":"Red","rating":null,"bottles":3,"binNo":"1H1,1H2,1G18","price":59.6,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":93,"name":"Champagne Ponasardin-Brut","region":"Champagne","appellation":"Champagne","vineyard":"Veuve Clicquot","supplier":"60th gift","vintage":"2021","best":"2025","type":"White","rating":null,"bottles":1,"binNo":"1A11","price":45,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":94,"name":"Monopole Blue Top","region":"Champagne","appellation":"Champagne","vineyard":"Heidsieck","supplier":"Waitrose","vintage":"2023","best":"2026","type":"White","rating":null,"bottles":1,"binNo":"","price":25,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":95,"name":"Pombai do Vesuvio","region":"Douro River Valley","appellation":"Douro","vineyard":"Symington","supplier":"Tanners","vintage":"2019","best":"2025","type":"Red","rating":6,"bottles":1,"binNo":"1C21","price":21.28,"tastingNotes":"w sausage, chorizo & lentil casserole - vg, good flavour. w succulent lamb cutlets - a good soft rich complement","dateConsumed":"2024-10-01","decant":"","buy":""},{"id":96,"name":"La Rosine Rouge","region":"Coteaux de L'Ardeche","appellation":"Collines Rhodaniennes","vineyard":"Ogier","supplier":"Wine Society","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"1A14,1A15,1A16,1A18,1B14,1B16","price":25,"tastingNotes":"Drink 2026-2031","dateConsumed":"","decant":"","buy":""},{"id":97,"name":"Vinhas do Sabor","region":"Douro River Valley","appellation":"Douro","vineyard":"Quinta Vale D Maria","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":6,"bottles":3,"binNo":"1E14,1H16,1E7","price":20.08,"tastingNotes":"w slow cooked lamb shank and lentils - good round flavour, rich and mellow","dateConsumed":"2025-09-01","decant":"","buy":""},{"id":98,"name":"Tanners Champagne","region":"Champagne","appellation":"Champagne","vineyard":"Tanners","supplier":"Tanners","vintage":"","best":"2026","type":"White","rating":null,"bottles":2,"binNo":"","price":null,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":99,"name":"Andre Claret Champagne","region":"Champagne","appellation":"Champagne","vineyard":"Andre Claret","supplier":"Tanners","vintage":"","best":"2027","type":"White","rating":null,"bottles":1,"binNo":"","price":null,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":100,"name":"Vintage Port","region":"Douro River Valley","appellation":"Port","vineyard":"Quinta de la Rosa","supplier":"Wine Society","vintage":"2009","best":"2027","type":"Red","rating":null,"bottles":1,"binNo":"1H11","price":42,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":101,"name":"Late Bottled Unfiltered Port","region":"Douro River Valley","appellation":"Port","vineyard":"Quinta Vale D Maria","supplier":"Tanners","vintage":"2014","best":"2028","type":"Red","rating":null,"bottles":1,"binNo":"1H12","price":15.47,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":102,"name":"LBV Port","region":"Douro River Valley","appellation":"Port","vineyard":"The Wine Society","supplier":"Wine Society","vintage":"2017","best":"2025","type":"Red","rating":null,"bottles":1,"binNo":"1H10","price":14.5,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":103,"name":"Fronseca Guimaraens","region":"Douro River Valley","appellation":"Port","vineyard":"Fronseca Guimaraens","supplier":"Tanners","vintage":"2018","best":"2028","type":"Red","rating":7,"bottles":4,"binNo":"1G11,1G12,1G13,1H13","price":26.98,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":104,"name":"Le Grand Clos","region":"Loire","appellation":"Bourgueil","vineyard":"Yannick Amirault","supplier":"Vinatis","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":2,"binNo":"1C1,1C6","price":21.8,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":105,"name":"Le Petit Chambord","region":"Loire","appellation":"Cour-Cheverny","vineyard":"Le Petit Chambord","supplier":"Wine Society","vintage":"2021","best":"2025","type":"White","rating":null,"bottles":2,"binNo":"3A1,3A2","price":14.5,"tastingNotes":"w crostini filled with salmon, quail egg and cod roe - full round and well balanced. M enjoyed.","dateConsumed":"2025-02-01","decant":"","buy":""},{"id":106,"name":"Domaine Thibault","region":"Loire","appellation":"Pouilly-Fume","vineyard":"Andre Dezat","supplier":"Tanners","vintage":"2022","best":"2026","type":"White","rating":null,"bottles":1,"binNo":"1E20","price":18.5,"tastingNotes":"w one pot tomato and cod casserole - light and worked well","dateConsumed":"2025-08-01","decant":"","buy":""},{"id":107,"name":"Les Rouilleres","region":"Loire","appellation":"Saint-Nicolas-de-Bourgueil","vineyard":"Domaine Frederic Mabileau","supplier":"Wine Society","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":1,"binNo":"3A5","price":16.5,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":108,"name":"Les Clos Vieilles Vignes","region":"Loire","appellation":"Saint-Nicolas-de-Bourgueil","vineyard":"Domaine Bruneau","supplier":"Vinatis","vintage":"2023","best":"2026","type":"Red","rating":null,"bottles":2,"binNo":"3A6,3B11","price":10.65,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":109,"name":"Le Becassou","region":"Loire","appellation":"Touraine","vineyard":"Domaine des Echardieres","supplier":"Wine Society","vintage":"2023","best":"2026","type":"Red","rating":6,"bottles":1,"binNo":"2D6","price":10.95,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":110,"name":"Archidamo","region":"Puglia","appellation":"Primitivo di Manduria","vineyard":"Pervini","supplier":"Wine Society","vintage":"2021","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1F3","price":11.5,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":111,"name":"Beaumes de Venise","region":"Rhone","appellation":"Beaumes de Venise","vineyard":"Domaine de Bernardins","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"4B1,4B2,4B3,4B4,4B5,4B6","price":12,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":112,"name":"Coudoulet de Beaucastel","region":"Rhone","appellation":"Cotes de Rhone","vineyard":"Chateau Beaucastel","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"4D6","price":17.48,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":113,"name":"Chateau Courac CdR","region":"Rhone","appellation":"Cotes de Rhone","vineyard":"Chateau Courac","supplier":"Wine Society","vintage":"2022","best":"2026","type":"Red","rating":7,"bottles":7,"binNo":"Boxed","price":5.17,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":114,"name":"Les Terres Saintes Plan de Dieu","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Domaine La Manarine","supplier":"Wine Society","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"2D5","price":14.95,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":115,"name":"Laudun","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Chateau Courac","supplier":"Tanners","vintage":"2021","best":"2025","type":"Red","rating":7,"bottles":3,"binNo":"3C2,3D6,3D7","price":11,"tastingNotes":"w small pate & cheese lunch - fruity & a little spicy - tasted good.","dateConsumed":"2025-01-01","decant":"","buy":""},{"id":116,"name":"Laudun","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Chateau Courac","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":7,"bottles":12,"binNo":"2C8,2C9,2E1,3C2,3C4,3E2","price":11.6,"tastingNotes":"Rich, cherry notes, good quaff","dateConsumed":"","decant":"","buy":""},{"id":117,"name":"Seguret","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Domaine de L'Arandine","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"Boxed","price":7.5,"tastingNotes":"w boeuf bourg - good complement for M","dateConsumed":"2024-10-01","decant":"","buy":""},{"id":118,"name":"Seguret","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Domaine de L'Arandine","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":4,"binNo":"2A7,2A8,2A9,2A10","price":null,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":119,"name":"Plan de Dieu","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Clos Saint Antonin","supplier":"Wine Society","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"Boxed","price":10.83,"tastingNotes":"w venison pate & montalagno lunch - delicious","dateConsumed":"2024-09-01","decant":"","buy":"Y"},{"id":120,"name":"Plan de Dieu","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Clos Saint Antonin","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"Boxed","price":null,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":121,"name":"Rasteau","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Domaine la Soumade","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":5,"binNo":"P","price":10.5,"tastingNotes":"Soft fruit, depth, good quaff","dateConsumed":"","decant":"","buy":""},{"id":122,"name":"Cairanne","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Domaine Marcel Richaud","supplier":"Tanners","vintage":"2022","best":"2026","type":"White","rating":null,"bottles":6,"binNo":"Boxed","price":14.5,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":123,"name":"Crozes-Hermitage","region":"Rhone","appellation":"Crozes-Hermitage","vineyard":"E Guigal","supplier":"Wine Society","vintage":"2019","best":"2025","type":"Red","rating":7,"bottles":0,"binNo":"","price":17,"tastingNotes":"TWS - full flavoured northern Rhone syrah; concentrated yet elegant with cedary, spicy fruit. w roast beef roll - good nose, smooth fruit and spice","dateConsumed":"2024-10-01","decant":"","buy":"Y"},{"id":124,"name":"Domaine de Thalabert","region":"Rhone","appellation":"Crozes-Hermitage","vineyard":"Domaine Thalabert","supplier":"Tanners","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1F16","price":22.48,"tastingNotes":"w duck breasts strips Korean style with noodles & pak choi - lovely soft complement","dateConsumed":"2024-08-01","decant":"","buy":""},{"id":125,"name":"La Tour Sarrasine","region":"Rhone","appellation":"Gigondas","vineyard":"Domaine Le Clos de Cazaux","supplier":"Wine Society","vintage":"2021","best":"2027","type":"Red","rating":7,"bottles":4,"binNo":"4A3,4A4,4A5,4A6","price":17.6,"tastingNotes":"","dateConsumed":"","decant":"","buy":"Y"},{"id":126,"name":"Les Sables d'Arenes VV","region":"Rhone","appellation":"Lirac","vineyard":"Domaine Giraud","supplier":"Tanners","vintage":"2019","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1B8","price":14.68,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":127,"name":"Les Sables d'Arenes VV","region":"Rhone","appellation":"Lirac","vineyard":"Domaine Giraud","supplier":"Tanners","vintage":"2020","best":"2026","type":"Red","rating":null,"bottles":3,"binNo":"1F6,1B20,1B7","price":19,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":128,"name":"Les Sables d'Arenes VV","region":"Rhone","appellation":"Lirac","vineyard":"Domaine Giraud","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":6,"binNo":"2A3,2B3,2C3,2D4,2E4,2F4","price":19.4,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":129,"name":"La Magnaneraie","region":"Rhone","appellation":"Vacqueyras","vineyard":"Domaine de Chantegut","supplier":"Wine&Co","vintage":"2016","best":"2026","type":"Red","rating":8,"bottles":1,"binNo":"1B6","price":16.36,"tastingNotes":"","dateConsumed":"","decant":"","buy":"Y"},{"id":130,"name":"Cuvee des Templiers","region":"Rhone","appellation":"Vacqueyras","vineyard":"Domaine Le Clos de Cazaux","supplier":"Tanners","vintage":"2018","best":"2025","type":"Red","rating":7,"bottles":2,"binNo":"1G20,1H20","price":14.68,"tastingNotes":"w chicken marengo - wonderful!!!","dateConsumed":"2025-01-01","decant":"","buy":""},{"id":131,"name":"Cuvee des Templiers","region":"Rhone","appellation":"Vacqueyras","vineyard":"Domaine Le Clos de Cazaux","supplier":"Wine Society","vintage":"2019","best":"2025","type":"Red","rating":7,"bottles":3,"binNo":"3B4,3B5,3B6","price":14.08,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":132,"name":"Cuvee des Templiers","region":"Rhone","appellation":"Vacqueyras","vineyard":"Domaine Le Clos de Cazaux","supplier":"Tanners","vintage":"2020","best":"2026","type":"Red","rating":7,"bottles":5,"binNo":"3D1,3D2,3E10,3E11,3E12","price":15.88,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":133,"name":"Altitude 420","region":"Rhone","appellation":"Vinsobres","vineyard":"Domaine Jaume","supplier":"Wine Society","vintage":"2020","best":"2025","type":"Red","rating":7,"bottles":0,"binNo":"","price":12.5,"tastingNotes":"w chicken fajita, avocado dip - soft fruits and hint of spice. W chilli and rice - good quaff too","dateConsumed":"2026-02-01","decant":"","buy":"Y"},{"id":134,"name":"QP","region":"Rioja","appellation":"Rioja","vineyard":"Maetierra Dominum","supplier":"Wine Society","vintage":"2010","best":"2025","type":"Red","rating":7,"bottles":1,"binNo":"1B1","price":11.95,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":135,"name":"Tobeios Crianza","region":"Rioja","appellation":"Rioja","vineyard":"Tobelos","supplier":"Tanners","vintage":"2019","best":"2025","type":"Red","rating":null,"bottles":1,"binNo":"1D18","price":17.5,"tastingNotes":"With cheese & biscuits. Light nose, fruity & spicy and smooth round finish.","dateConsumed":"2025-01-01","decant":"","buy":""},{"id":136,"name":"Rioja Vega Crianza","region":"Rioja","appellation":"Rioja","vineyard":"Bodega Rioja Vega","supplier":"Tanners","vintage":"2021","best":"2025","type":"Red","rating":null,"bottles":2,"binNo":"2B3,2B4","price":12.5,"tastingNotes":"w lamb shank, M enjoyed","dateConsumed":"2025-09-02","decant":"","buy":""},{"id":137,"name":"Rioja","region":"Rioja","appellation":"Rioja","vineyard":"Hacienda Don Heman","supplier":"Gift","vintage":"2021","best":"2025","type":"Red","rating":null,"bottles":1,"binNo":"2F2","price":12,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":138,"name":"Renaissance","region":"SW France","appellation":"Gaillac","vineyard":"Domaine Rotier","supplier":"Wine Society","vintage":"2020","best":"2025","type":"Red","rating":null,"bottles":1,"binNo":"1F4","price":13.95,"tastingNotes":"w lamb steaks & pesto rice - rich, complex and very pleasing quaff.","dateConsumed":"","decant":"","buy":""},{"id":139,"name":"L'Ardine","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Chateau Courac","supplier":"Tanners","vintage":"2021","best":"2026","type":"Red","rating":null,"bottles":4,"binNo":"2A7,2A8,2A9,2A10","price":null,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":140,"name":"Chateau Courac CdRV","region":"Rhone","appellation":"Cotes de Rhone Village","vineyard":"Chateau Courac","supplier":"Tanners","vintage":"2022","best":"2026","type":"Red","rating":null,"bottles":2,"binNo":"","price":7,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":141,"name":"Menetou Salon","region":"Sancerre","appellation":"Sancerre","vineyard":"Jean Max Roger","supplier":"","vintage":"2023","best":"","type":"White","rating":null,"bottles":1,"binNo":"","price":null,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":142,"name":"Menetou Salon","region":"Sancerre","appellation":"Sancerre","vineyard":"Jean Max Roger","supplier":"","vintage":"2022","best":"","type":"White","rating":null,"bottles":1,"binNo":"","price":null,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":143,"name":"Champagne Louis Delaunay","region":"Champagne","appellation":"Champagne","vineyard":"Louis Delaunay","supplier":"Gift A&J","vintage":"","best":"2025","type":"White","rating":null,"bottles":2,"binNo":"P","price":15,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":144,"name":"Baron Nathaniel","region":"Bordeaux","appellation":"Pauillac","vineyard":"Baron Phillipe de Rothschild","supplier":"Vinatis","vintage":"2021","best":"2028","type":"Red","rating":null,"bottles":2,"binNo":"1E7,1E8","price":21.58,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":145,"name":"Chateau Citran","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Chateau Citran","supplier":"Vinatis","vintage":"2016","best":"2028","type":"Red","rating":null,"bottles":2,"binNo":"3C12,3C13","price":21.18,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":146,"name":"Cote de Beaune","region":"Burgundy","appellation":"Cotes de Beaune Village","vineyard":"Louis Latour","supplier":"Vinatis","vintage":"2020","best":"2028","type":"Red","rating":null,"bottles":1,"binNo":"4C6","price":23.97,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":147,"name":"Chateau Cantermerle PC Classe","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Chateau Cantemerle","supplier":"Vinatis","vintage":"2019","best":"2028","type":"Red","rating":null,"bottles":2,"binNo":"C6,D6","price":29.61,"tastingNotes":"w bolas de picolat - round, rich & fruity","dateConsumed":"2025-09-01","decant":"","buy":"Y"},{"id":148,"name":"Chateau Vieux Planty","region":"Bordeaux","appellation":"Bordeaux","vineyard":"Chateau Vieux Planty","supplier":"Vinatis","vintage":"2020","best":"2026","type":"Red","rating":null,"bottles":3,"binNo":"3A3,3A4,3B3","price":9.41,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":149,"name":"La Grande Cadole","region":"Burgundy","appellation":"Coteaux Bourguignons","vineyard":"Vignerons de Bel Air","supplier":"Vinatis","vintage":"2023","best":"2027","type":"Red","rating":null,"bottles":2,"binNo":"3B5,3C6","price":9.71,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":150,"name":"Champagne Extra Reserve Magnum","region":"Champagne","appellation":"Champagne","vineyard":"Tanners Extra Reserve Magnum","supplier":"Tanners","vintage":"","best":"2027","type":"White","rating":8,"bottles":1,"binNo":"P","price":63,"tastingNotes":"","dateConsumed":"","decant":"","buy":""},{"id":154,"name":"Chateau Cantemerle Ier Cru Classe","region":"Bordeaux","appellation":"Haut-Medoc","vineyard":"Chateaux Cantemerle","supplier":"Tanners","vintage":"2023","best":"2028","type":"Red","rating":null,"bottles":6,"binNo":"","price":21,"tastingNotes":"","dateConsumed":"","decant":"","buy":"Y"},{"id":155,"name":"Bourgogne Cote D'Or Pinot Noir","region":"Burgundy","appellation":"Bourgogne Cote D'Or","vineyard":"Odoul Coquard","supplier":"Tanners","vintage":"2024","best":"2028","type":"Red","rating":null,"bottles":6,"binNo":"","price":18,"tastingNotes":"","dateConsumed":"","decant":"","buy":"Y"}];

// ─── VINTAGE CHART DATA ───────────────────────────────────────────────────────
const VINTAGE_DATA = {"Bordeaux Left Bank":{color:"bg-red-800",notes:"Cabernet Sauvignon dominant. Left Bank = Medoc, Pauillac, St-Estephe, Margaux, St-Julien.",vintages:{"2016":{score:100,label:"Exceptional",drink:"2024–2055",note:"The greatest modern Bordeaux vintage. Elegant, structured, exceptional balance."},"2015":{score:98,label:"Outstanding",drink:"2022–2050",note:"Rich, opulent, superb concentration. Ready sooner than 2016."},"2022":{score:99,label:"Exceptional",drink:"2027–2060",note:"Heralded as rival to 2016. Remarkable balance despite heat. Buy now."},"2020":{score:97,label:"Excellent",drink:"2025–2050",note:"Exceptional quality, concentrated, structured. Very consistent across appellations."},"2019":{score:98,label:"Outstanding",drink:"2024–2055",note:"Gorgeous, aromatic, finely tuned. One of the decade's best."},"2018":{score:97,label:"Excellent",drink:"2023–2050",note:"Rich and powerful, excellent depth. Many already drinking well."},"2021":{score:92,label:"Very Good",drink:"2024–2040",note:"Elegant, fresher style. Good value relative to its neighbours."},"2023":{score:91,label:"Very Good",drink:"2026–2045",note:"Fresh, aromatic, good acidity. Watch this space."},"2017":{score:88,label:"Good",drink:"2022–2038",note:"Frost affected many estates. Patchy but some gems."}}},"Bordeaux Right Bank":{color:"bg-red-700",notes:"Merlot dominant. Right Bank = St-Emilion, Pomerol, Lalande-de-Pomerol, Fronsac.",vintages:{"2022":{score:100,label:"Exceptional",drink:"2026–2060",note:"Many critics call 2022 the finest ever Right Bank vintage. Buy without hesitation."},"2021":{score:93,label:"Very Good",drink:"2024–2042",note:"Fresh and precise, particularly good in Pomerol."},"2020":{score:97,label:"Excellent",drink:"2025–2050",note:"Stunning across the board. Rich, concentrated, long finish."},"2019":{score:97,label:"Excellent",drink:"2024–2050",note:"Exceptional, generous, intense. Rival to 2015."},"2018":{score:96,label:"Excellent",drink:"2023–2048",note:"Rich and full, excellent uniformity."},"2016":{score:95,label:"Excellent",drink:"2022–2045",note:"More forward than the left bank, beautiful now."},"2015":{score:96,label:"Excellent",drink:"2022–2045",note:"Opulent and generous. Many drinking beautifully."},"2017":{score:91,label:"Very Good",drink:"2022–2038",note:"Surprisingly good in Pomerol and top St-Emilion."}}},"Burgundy Red":{color:"bg-purple-800",notes:"Pinot Noir. The most volatile region — even modest vintages produce great bottles from great producers.",vintages:{"2019":{score:99,label:"Exceptional",drink:"2024–2050",note:"Rich, concentrated, elegant. Many calling it the finest red Burgundy in memory."},"2022":{score:96,label:"Excellent",drink:"2026–2048",note:"Excellent concentration with wonderful freshness. Very consistent."},"2018":{score:96,label:"Excellent",drink:"2023–2045",note:"Rich and generous, lower acidity than classic style but beautiful now."},"2020":{score:95,label:"Excellent",drink:"2024–2045",note:"Warm year producing intensely fruited wines. Great village-level wines."},"2021":{score:93,label:"Very Good",drink:"2024–2042",note:"Classic Burgundy freshness after a difficult summer. Elegant and long-lived."},"2015":{score:95,label:"Excellent",drink:"2022–2045",note:"Rich, ample, very pleasurable. Many drinking beautifully now."},"2017":{score:92,label:"Very Good",drink:"2022–2040",note:"Fresh, elegant, underrated. Good value now."},"2016":{score:92,label:"Very Good",drink:"2023–2042",note:"Later developing, refined. Worth keeping."},"2023":{score:88,label:"Good",drink:"2025–2040",note:"Irregular but some good wines. Select carefully."}}},"Burgundy White":{color:"bg-amber-700",notes:"Chardonnay. Includes Chablis, Meursault, Puligny-Montrachet, Chassagne, Pouilly-Fuisse.",vintages:{"2022":{score:98,label:"Exceptional",drink:"2024–2040",note:"Perhaps the finest white Burgundy vintage in modern times. Buy everything."},"2019":{score:96,label:"Excellent",drink:"2022–2038",note:"Rich, generous, excellent ageing potential."},"2020":{score:95,label:"Excellent",drink:"2023–2040",note:"Superb depth and precision. Some oxidation issues from lesser producers — choose carefully."},"2021":{score:93,label:"Very Good",drink:"2023–2038",note:"Classic freshness and acidity. Excellent for long keeping."},"2017":{score:94,label:"Excellent",drink:"2022–2038",note:"Rich and forward, drinking beautifully now."},"2018":{score:90,label:"Very Good",drink:"2022–2035",note:"Some premox issues but many superb wines. Known producers only."},"2023":{score:90,label:"Very Good",drink:"2025–2038",note:"Good freshness, good balance. Not a blockbuster but very reliable."}}},"Rhone North":{color:"bg-orange-800",notes:"Syrah. Includes Crozes-Hermitage, Hermitage, Cote-Rotie, Cornas, Saint-Joseph.",vintages:{"2020":{score:98,label:"Exceptional",drink:"2025–2055",note:"The finest modern Northern Rhone vintage. Remarkable depth and complexity."},"2015":{score:97,label:"Outstanding",drink:"2022–2050",note:"Rich, concentrated, outstanding concentration and length."},"2019":{score:97,label:"Outstanding",drink:"2024–2050",note:"Elegant, powerful, fantastic balance. Buy aggressively."},"2018":{score:97,label:"Outstanding",drink:"2023–2050",note:"Exceptional. Dense, full, perfect balance."},"2017":{score:96,label:"Excellent",drink:"2022–2045",note:"Very good, more forward than 2015/2016."},"2022":{score:96,label:"Excellent",drink:"2026–2050",note:"Excellent vintage, concentrated with fine tannins."},"2021":{score:92,label:"Very Good",drink:"2024–2042",note:"Good freshness, some excellent wines."}}},"Rhone South":{color:"bg-orange-700",notes:"Grenache dominant blends. Includes Chateauneuf-du-Pape, Gigondas, Vacqueyras, Beaumes-de-Venise, Lirac, Rasteau.",vintages:{"2020":{score:98,label:"Exceptional",drink:"2024–2050",note:"The best Southern Rhone vintage in at least two decades. Outstanding."},"2016":{score:95,label:"Excellent",drink:"2022–2045",note:"Classic structure with terrific balance. One of the best of the decade."},"2019":{score:96,label:"Excellent",drink:"2023–2050",note:"Rich, generous, well-structured. The whole appellation excelled."},"2022":{score:97,label:"Outstanding",drink:"2026–2055",note:"Superb. Broad, rich, textured. Must buy."},"2015":{score:96,label:"Excellent",drink:"2022–2048",note:"Concentrated, powerful, excellent ageing potential."},"2017":{score:92,label:"Very Good",drink:"2022–2040",note:"Good quality across the board, earlier drinking style."},"2021":{score:94,label:"Excellent",drink:"2024–2045",note:"Fresh, vibrant, excellent balance."},"2018":{score:93,label:"Very Good",drink:"2022–2042",note:"Rich, concentrated, some outstanding bottles."}}},"Champagne":{color:"bg-yellow-700",notes:"Vintage Champagne only. Non-vintage blends bypass vintage variation by design.",vintages:{"2018":{score:99,label:"Exceptional",drink:"2025–2045",note:"Near-perfect growing season. Being called one of the finest Champagne vintages ever."},"2012":{score:98,label:"Outstanding",drink:"2022–2042",note:"Stunningly refined, electric acidity. Now drinking magnificently."},"2015":{score:97,label:"Outstanding",drink:"2023–2042",note:"Powerful and concentrated. Rich, full style."},"2019":{score:97,label:"Outstanding",drink:"2026–2045",note:"Exceptional potential. Needs time but superb."},"2008":{score:99,label:"Exceptional",drink:"2022–2055",note:"Perhaps the greatest modern vintage for longevity. Extraordinary now."},"2016":{score:95,label:"Excellent",drink:"2024–2042",note:"Very fine, elegant structure. A collector's vintage."},"2020":{score:93,label:"Very Good",drink:"2025–2040",note:"Good freshness and balance. Watch with interest."}}},"Loire Valley":{color:"bg-green-700",notes:"Cabernet Franc (Bourgueil, Chinon, St-Nicolas) and Sauvignon Blanc (Pouilly-Fume, Sancerre, Menetou-Salon).",vintages:{"2019":{score:97,label:"Outstanding",drink:"2023–2048",note:"The best Loire vintage in many years. Reds are exceptional, whites electric."},"2022":{score:94,label:"Excellent",drink:"2024–2042",note:"Excellent balance and freshness. Strong across red and white."},"2018":{score:96,label:"Excellent",drink:"2022–2045",note:"Outstanding reds with superb depth. Whites very good too."},"2020":{score:93,label:"Very Good",drink:"2022–2040",note:"Good freshness, particularly fine for Sancerre and Pouilly-Fume."},"2021":{score:90,label:"Very Good",drink:"2023–2038",note:"Difficult spring but fine autumn. Variable but some very good."},"2023":{score:88,label:"Good",drink:"2025–2038",note:"Good freshness for whites. Reds lighter style."}}},"Rioja":{color:"bg-red-900",notes:"Tempranillo dominant. Gran Reserva and Reserva styles dominate; Crianza for everyday drinking.",vintages:{"2016":{score:99,label:"Exceptional",drink:"2024–2055",note:"Outstanding, arguably the finest Rioja in decades. Exceptional Gran Reservas."},"2018":{score:97,label:"Outstanding",drink:"2023–2048",note:"Rich, concentrated, beautiful structure. Highly recommended."},"2019":{score:95,label:"Excellent",drink:"2023–2045",note:"Elegance and freshness. Excellent balance."},"2017":{score:96,label:"Excellent",drink:"2022–2045",note:"Exceptional quality. Look for this vintage everywhere."},"2015":{score:96,label:"Excellent",drink:"2022–2045",note:"Outstanding, complex, great structure."},"2022":{score:95,label:"Excellent",drink:"2025–2045",note:"Excellent balance and freshness. Modern, polished style."},"2020":{score:94,label:"Excellent",drink:"2024–2042",note:"Very good quality, concentrated and well-balanced."},"2021":{score:91,label:"Very Good",drink:"2023–2040",note:"Good freshness and aromatic clarity."}}}};

const SCORE_COLOR = (s) => s >= 98 ? "text-amber-300" : s >= 95 ? "text-emerald-400" : s >= 92 ? "text-blue-400" : "text-stone-400";
const SCORE_LABEL_BG = (s) => s >= 98 ? "bg-amber-900/50 text-amber-300 border-amber-700" : s >= 95 ? "bg-emerald-900/50 text-emerald-300 border-emerald-700" : s >= 92 ? "bg-blue-900/50 text-blue-300 border-blue-700" : "bg-stone-800 text-stone-400 border-stone-600";

const YEAR = new Date().getFullYear();
const REGIONS = [...new Set(SEED_DATA.map(w => w.region).filter(Boolean))].sort();

// ─── SUPABASE STORAGE LAYER ───────────────────────────────────────────────────
async function loadFromDB(key) {
  try {
    const { data, error } = await supabase.from('app_data').select('value').eq('key', key).single();
    if (error || !data) return null;
    return data.value;
  } catch { return null; }
}

async function saveToDB(key, value) {
  try {
    await supabase.from('app_data').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  } catch (e) { console.error('Save error', e); }
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const s = { Red: "bg-red-900 text-red-200 border border-red-700", White: "bg-amber-900 text-amber-200 border border-amber-700", Other: "bg-stone-700 text-stone-300 border border-stone-600" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s[type] || s.Other}`}>{type}</span>;
}

function DrinkWindow({ best, compact = false }) {
  if (!best) return null;
  const b = parseInt(best); if (isNaN(b)) return null;
  const isPast = YEAR > b + 2, isNow = YEAR >= b - 1;
  const color = isPast ? "text-red-400" : isNow ? "text-emerald-400" : "text-amber-400";
  if (compact) return <span className={`text-xs ${color}`}>—</span>;
  return <span className={`text-xs ${color}`}>{isPast ? "Past peak" : isNow ? "Drink now" : `From ${b}`}</span>;
}

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 bg-amber-700 text-white px-5 py-2 rounded-full text-sm shadow-lg z-50">{msg}</div>;
}

// ─── WINE CARD ────────────────────────────────────────────────────────────────
function WineCard({ wine, onClick }) {
  const consumed = wine.bottles === 0;
  return (
    <div onClick={() => onClick(wine)} className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-amber-600 ${consumed ? "bg-stone-900/30 border-stone-800 opacity-50" : "bg-stone-900/70 border-stone-700"}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-stone-100 font-semibold text-sm leading-tight">{wine.name}</h3>
          <p className="text-stone-500 text-xs mt-0.5 truncate">{wine.vineyard}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <TypeBadge type={wine.type} />
          {wine.decant && wine.decant !== "" && <span className="text-xs text-amber-500">decant</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-stone-500 mb-2 flex-wrap">
        <span>{wine.appellation}</span>
        {wine.vintage && <><span>·</span><span>{wine.vintage}</span></>}
        {wine.price && <><span>·</span><span>£{wine.price.toFixed(2)}</span></>}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {wine.rating && <span className="text-amber-400 font-bold text-xs">{wine.rating}/10</span>}
          <DrinkWindow best={wine.best} />
        </div>
        <div className="flex items-center gap-2">
          {wine.binNo && <span className="text-xs bg-stone-800 text-stone-400 px-2 py-0.5 rounded font-mono">{wine.binNo.length > 12 ? wine.binNo.slice(0,12)+"..." : wine.binNo}</span>}
          <span className={`text-xs font-bold ${consumed ? "text-stone-600" : "text-emerald-400"}`}>{consumed ? "Gone" : `x${wine.bottles}`}</span>
        </div>
      </div>
      {wine.tastingNotes && <p className="text-stone-600 text-xs mt-2 italic line-clamp-1">{wine.tastingNotes}</p>}
    </div>
  );
}

// ─── CONSUME MODAL ────────────────────────────────────────────────────────────
function ConsumeModal({ wine, onClose, onConfirm }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ date: today, occasion: "", food: "", who: "", notes: "", bottlesOpened: 1, newRating: wine.rating || "" });
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-stone-950 border border-amber-700/50 rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-5 border-b border-stone-800">
          <h3 className="text-stone-100 font-bold text-lg">Log a Bottle</h3>
          <p className="text-stone-500 text-sm mt-0.5">{wine.name} {wine.vintage}</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-stone-500 text-xs uppercase">Date</label><input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" /></div>
            <div><label className="text-stone-500 text-xs uppercase">Bottles</label><input type="number" min="1" max={wine.bottles} value={form.bottlesOpened} onChange={e => setForm(f => ({...f, bottlesOpened: parseInt(e.target.value)||1}))} className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" /></div>
          </div>
          <div><label className="text-stone-500 text-xs uppercase">Occasion</label><input type="text" value={form.occasion} onChange={e => setForm(f => ({...f, occasion: e.target.value}))} placeholder="e.g. Sunday lunch, Anniversary dinner" className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600" /></div>
          <div><label className="text-stone-500 text-xs uppercase">Food Pairing</label><input type="text" value={form.food} onChange={e => setForm(f => ({...f, food: e.target.value}))} placeholder="What did you eat?" className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600" /></div>
          <div><label className="text-stone-500 text-xs uppercase">Who Was There</label><input type="text" value={form.who} onChange={e => setForm(f => ({...f, who: e.target.value}))} placeholder="e.g. Family dinner, just M and I" className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600" /></div>
          <div><label className="text-stone-500 text-xs uppercase">Tasting Notes</label><textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} rows={3} placeholder="How was it? Any thoughts on food match, nose, finish..." className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600 resize-none" /></div>
          <div><label className="text-stone-500 text-xs uppercase">Rating (/10)</label><input type="number" min="1" max="10" value={form.newRating} onChange={e => setForm(f => ({...f, newRating: e.target.value}))} className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" /></div>
        </div>
        <div className="p-5 pt-0 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-stone-700 text-stone-400 text-sm hover:bg-stone-800">Cancel</button>
          <button onClick={() => onConfirm(form)} className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold">Log & Update Cellar</button>
        </div>
      </div>
    </div>
  );
}

// ─── WINE MODAL ───────────────────────────────────────────────────────────────
function WineModal({ wine, onClose, onSave, onConsume }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({...wine});
  const [showConsume, setShowConsume] = useState(false);

  const handleSave = () => { onSave({...form, bottles: parseInt(form.bottles)||0, rating: form.rating ? parseFloat(form.rating) : null, price: form.price ? parseFloat(form.price) : null}); setEditing(false); };
  const inp = (key, type="text") => editing
    ? <input type={type} value={form[key]||""} onChange={e => setForm(f=>({...f,[key]:e.target.value}))} className="w-full mt-1 bg-stone-800 border border-stone-600 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" />
    : <p className="text-stone-100 text-sm mt-1">{wine[key] || <span className="text-stone-600 italic">—</span>}</p>;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 bg-black/75 backdrop-blur-sm overflow-y-auto" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-stone-950 border border-stone-700 rounded-xl w-full max-w-2xl shadow-2xl mb-6">
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <TypeBadge type={wine.type} />
                {wine.decant && wine.decant !== "" && <span className="text-xs bg-stone-800 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full">Decant</span>}
                {wine.buy === "Y" && <span className="text-xs bg-emerald-900 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full">Buy Again</span>}
              </div>
              <h2 className="text-xl font-bold text-stone-100">{wine.name}</h2>
              <p className="text-stone-400 text-sm mt-0.5">{wine.vineyard} · {wine.appellation}</p>
            </div>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-200 text-3xl leading-none ml-4 shrink-0">x</button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {[["Vintage", wine.vintage||"NV","text-stone-100"], ["Bottles", wine.bottles === 0 ? "Consumed" : wine.bottles, wine.bottles===0?"text-stone-500":"text-emerald-400"], ["Rating", wine.rating ? `${wine.rating}/10` : "—", "text-amber-400"]].map(([l,v,c])=>(
              <div key={l} className="bg-stone-900 rounded-lg p-3 text-center">
                <p className="text-stone-500 text-xs uppercase tracking-wide">{l}</p>
                {editing && l !== "Vintage" ? (
                  <input type="number" value={form[l==="Bottles"?"bottles":"rating"]||""} onChange={e=>setForm(f=>({...f,[l==="Bottles"?"bottles":"rating"]:e.target.value}))} className="w-full mt-1 bg-stone-800 border border-stone-600 rounded px-2 py-1 text-stone-100 text-center text-lg font-bold focus:border-amber-500 focus:outline-none" />
                ) : <p className={`font-bold text-lg mt-1 ${c}`}>{v}</p>}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-stone-500 text-xs uppercase">Region</label>{inp("region")}</div>
            <div><label className="text-stone-500 text-xs uppercase">Supplier</label>{inp("supplier")}</div>
            <div><label className="text-stone-500 text-xs uppercase">Bin Number</label>{inp("binNo")}</div>
            <div><label className="text-stone-500 text-xs uppercase">Price</label>
              {editing ? <input type="number" step="0.01" value={form.price||""} onChange={e=>setForm(f=>({...f,price:e.target.value}))} className="w-full mt-1 bg-stone-800 border border-stone-600 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" />
              : <p className="text-stone-100 text-sm mt-1">{wine.price ? `£${wine.price.toFixed(2)}` : "—"}</p>}
            </div>
            <div><label className="text-stone-500 text-xs uppercase">Drink Best From</label><div className="mt-1 flex items-center gap-2">{inp("best")}<DrinkWindow best={wine.best} /></div></div>
            <div><label className="text-stone-500 text-xs uppercase">Last Opened</label>{inp("dateConsumed","date")}</div>
          </div>
          <div>
            <label className="text-stone-500 text-xs uppercase">Tasting Notes</label>
            {editing
              ? <textarea value={form.tastingNotes||""} onChange={e=>setForm(f=>({...f,tastingNotes:e.target.value}))} rows={4} className="w-full mt-2 bg-stone-800 border border-stone-600 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none resize-none" />
              : <div className="mt-2 bg-stone-900 rounded-lg p-4 min-h-16">{wine.tastingNotes ? <p className="text-stone-300 text-sm leading-relaxed italic">{wine.tastingNotes}</p> : <p className="text-stone-600 text-sm italic">No tasting notes yet.</p>}</div>}
          </div>
        </div>
        <div className="p-6 pt-0 flex flex-wrap gap-3 justify-between">
          <div>{wine.bottles > 0 && !editing && (<button onClick={() => setShowConsume(true)} className="px-4 py-2 rounded-lg bg-red-900/50 hover:bg-red-800/70 border border-red-800 text-red-300 text-sm font-semibold">Log a Bottle</button>)}</div>
          <div className="flex gap-3">
            {editing ? <>
              <button onClick={() => { setForm({...wine}); setEditing(false); }} className="px-4 py-2 rounded-lg border border-stone-600 text-stone-400 text-sm hover:bg-stone-800">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold">Save</button>
            </> : (<button onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-sm font-semibold">Edit</button>)}
          </div>
        </div>
      </div>
    </div>
    {showConsume && <ConsumeModal wine={wine} onClose={() => setShowConsume(false)} onConfirm={(entry) => { onConsume(wine, entry); setShowConsume(false); onClose(); }} />}
    </>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ wines, onWineClick }) {
  const inStock = wines.filter(w => w.bottles > 0);
  const totalBottles = wines.reduce((s, w) => s + (w.bottles||0), 0);
  const totalValue = wines.reduce((s, w) => s + ((w.price||0)*(w.bottles||0)), 0);
  const drinkNow = inStock.filter(w => { const b=parseInt(w.best); return !isNaN(b) && YEAR>=b-1 && YEAR<=b+2; });
  const expiringSoon = inStock.filter(w => { const b=parseInt(w.best); return !isNaN(b) && b===YEAR+1; });
  const pastPeak = inStock.filter(w => { const b=parseInt(w.best); return !isNaN(b) && YEAR>b+2; });
  const withNotes = wines.filter(w => w.tastingNotes).length;
  const byRegion = {}; wines.forEach(w => { if(w.region && w.bottles>0) byRegion[w.region]=(byRegion[w.region]||0)+w.bottles; });
  const topRegions = Object.entries(byRegion).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const reds = inStock.filter(w=>w.type==="Red").reduce((s,w)=>s+w.bottles,0);
  const whites = inStock.filter(w=>w.type==="White").reduce((s,w)=>s+w.bottles,0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Total Bottles",totalBottles,`${inStock.length} wines in stock`,"text-amber-400"],["Cellar Value",`£${Math.round(totalValue).toLocaleString()}`,"at purchase price","text-emerald-400"],["Drink Now",drinkNow.length,"wines at peak","text-red-400"],["Tasting Notes",withNotes,`of ${wines.length} wines logged`,"text-stone-300"]].map(([l,v,s,c])=>(
          <div key={l} className="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <p className="text-stone-500 text-xs uppercase tracking-wider mb-2">{l}</p>
            <p className={`text-3xl font-bold ${c}`}>{v}</p>
            <p className="text-stone-600 text-xs mt-1">{s}</p>
          </div>
        ))}
      </div>

      {(pastPeak.length > 0 || expiringSoon.length > 0) && (
        <div className="bg-stone-900 border border-red-900/60 rounded-xl p-5">
          <h3 className="text-red-400 text-xs uppercase tracking-wider mb-4">Drinking Window Alerts</h3>
          {pastPeak.length > 0 && (
            <div className="mb-4">
              <p className="text-red-300 text-xs font-semibold uppercase tracking-wide mb-2">Past Peak — Drink Now ({pastPeak.length})</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {pastPeak.slice(0,6).map(w=>(
                  <div key={w.id} onClick={()=>onWineClick(w)} className="flex items-center justify-between text-sm cursor-pointer hover:text-amber-300 transition-colors py-1 border-b border-stone-800">
                    <span className="text-stone-300">{w.name} <span className="text-stone-500">{w.vintage}</span></span>
                    <span className="text-stone-500 text-xs ml-2">Best by {w.best} · x{w.bottles}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {expiringSoon.length > 0 && (
            <div>
              <p className="text-amber-300 text-xs font-semibold uppercase tracking-wide mb-2">Reaching Peak Soon — Drink by {YEAR+1} ({expiringSoon.length})</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {expiringSoon.map(w=>(
                  <div key={w.id} onClick={()=>onWineClick(w)} className="flex items-center justify-between text-sm cursor-pointer hover:text-amber-300 transition-colors py-1 border-b border-stone-800">
                    <span className="text-stone-300">{w.name} <span className="text-stone-500">{w.vintage}</span></span>
                    <span className="text-stone-500 text-xs ml-2">x{w.bottles} · {w.binNo||"No bin"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
          <h3 className="text-stone-500 text-xs uppercase tracking-wider mb-4">By Type</h3>
          {[["Red",reds,"bg-red-700"],["White",whites,"bg-amber-600"]].map(([t,c,bg])=>(
            <div key={t} className="mb-3">
              <div className="flex justify-between text-sm mb-1"><span className="text-stone-300">{t}</span><span className="text-stone-500">{c} btls</span></div>
              <div className="bg-stone-800 rounded-full h-2"><div className={`${bg} h-2 rounded-full`} style={{width:`${totalBottles?Math.min(100,(c/totalBottles)*100):0}%`}} /></div>
            </div>
          ))}
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
          <h3 className="text-stone-500 text-xs uppercase tracking-wider mb-4">Top Regions</h3>
          <div className="space-y-1.5">{topRegions.map(([r,c])=>(<div key={r} className="flex justify-between"><span className="text-stone-300 text-sm truncate">{r}</span><span className="text-amber-400 text-sm font-semibold ml-2">{c}</span></div>))}</div>
        </div>
      </div>

      {drinkNow.length > 0 && (
        <div className="bg-stone-900 border border-emerald-900/40 rounded-xl p-5">
          <h3 className="text-emerald-400 text-xs uppercase tracking-wider mb-4">Ready to Drink Right Now</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {drinkNow.slice(0,8).map(w=>(
              <div key={w.id} onClick={()=>onWineClick(w)} className="flex items-center justify-between text-sm cursor-pointer hover:text-amber-300 py-1 border-b border-stone-800">
                <span className="text-stone-200">{w.name} <span className="text-stone-500">{w.vintage}</span></span>
                <span className="text-stone-500 text-xs ml-2">{w.binNo||"Boxed"} · x{w.bottles}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CELLAR VIEW ──────────────────────────────────────────────────────────────
function CellarView({ wines, onWineClick }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [type, setType] = useState("All");
  const [stock, setStock] = useState("in-stock");
  const [sort, setSort] = useState("region");
  const [groupBy, setGroupBy] = useState("none");

  const filtered = wines.filter(w => {
    const s = search.toLowerCase();
    return (!s || w.name.toLowerCase().includes(s) || (w.vineyard||"").toLowerCase().includes(s) || (w.region||"").toLowerCase().includes(s) || (w.appellation||"").toLowerCase().includes(s) || (w.binNo||"").toLowerCase().includes(s) || (w.supplier||"").toLowerCase().includes(s)) &&
      (region==="All"||w.region===region) && (type==="All"||w.type===type) &&
      (stock==="all"||(stock==="in-stock"&&w.bottles>0)||(stock==="consumed"&&w.bottles===0));
  }).sort((a,b)=>{ if(sort==="name")return a.name.localeCompare(b.name); if(sort==="region")return (a.region||"").localeCompare(b.region||""); if(sort==="vintage")return (b.vintage||"").localeCompare(a.vintage||""); if(sort==="price")return (b.price||0)-(a.price||0); if(sort==="rating")return (b.rating||0)-(a.rating||0); return 0; });

  const totalValue = filtered.reduce((s,w)=>s+(w.price||0)*(w.bottles||0),0);

  const groups = groupBy === "none" ? {"All": filtered} : filtered.reduce((acc,w)=>{
    const k = groupBy==="region" ? (w.region||"Unknown") : groupBy==="supplier" ? (w.supplier||"Unknown") : groupBy==="type" ? w.type : "All";
    if(!acc[k]) acc[k]=[];
    acc[k].push(w);
    return acc;
  },{});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, bin, region, supplier..." className="flex-1 min-w-40 bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600" />
        {[["region","All Regions",[["All","All Regions"],...REGIONS.map(r=>[r,r])]],["type","Type",[["All","Red & White"],["Red","Red"],["White","White"]]],["stock","Stock",[["in-stock","In Stock"],["all","All"],["consumed","Consumed"]]],["sort","Sort",[["region","By Region"],["name","By Name"],["vintage","By Vintage"],["price","By Price"],["rating","By Rating"]]],["groupBy","Group",[["none","No Group"],["region","By Region"],["supplier","By Supplier"],["type","By Type"]]]].map(([key,placeholder,opts])=>(
          <select key={key} value={key==="region"?region:key==="type"?type:key==="stock"?stock:key==="sort"?sort:groupBy} onChange={e=>{ if(key==="region")setRegion(e.target.value); if(key==="type")setType(e.target.value); if(key==="stock")setStock(e.target.value); if(key==="sort")setSort(e.target.value); if(key==="groupBy")setGroupBy(e.target.value); }} className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-300 text-sm focus:border-amber-500 focus:outline-none">
            {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-stone-600">
        <span>{filtered.length} wines · {filtered.reduce((s,w)=>s+(w.bottles||0),0)} bottles</span>
        {totalValue > 0 && <span>Value: £{Math.round(totalValue).toLocaleString()}</span>}
      </div>
      {Object.entries(groups).map(([group, groupWines]) => (
        <div key={group}>
          {groupBy !== "none" && <h3 className="text-stone-400 text-xs uppercase tracking-wider font-semibold mb-2 mt-4 border-b border-stone-800 pb-1">{group} <span className="text-stone-600 normal-case font-normal">({groupWines.length})</span></h3>}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {groupWines.map(w=><WineCard key={w.id} wine={w} onClick={onWineClick} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── DIARY VIEW ───────────────────────────────────────────────────────────────
function DiaryView({ diary, wines }) {
  const [filter, setFilter] = useState("");
  const sorted = [...diary].sort((a,b) => new Date(b.date) - new Date(a.date));
  const filtered = sorted.filter(e => !filter || e.wineName.toLowerCase().includes(filter.toLowerCase()) || (e.food||"").toLowerCase().includes(filter.toLowerCase()) || (e.occasion||"").toLowerCase().includes(filter.toLowerCase()));

  if (diary.length === 0) return (
    <div className="text-center py-16">
      <h3 className="text-stone-400 font-semibold text-lg mb-2">The Diary is Empty</h3>
      <p className="text-stone-600 text-sm">When you log a bottle using the "Log a Bottle" button on any wine, it will appear here with the date, food pairing, and your notes.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search diary entries..." className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-4 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600" />
        <span className="text-stone-600 text-sm shrink-0">{filtered.length} entries</span>
      </div>
      <div className="space-y-3">
        {filtered.map(entry => {
          const wine = wines.find(w => w.id === entry.wineId);
          return (
            <div key={entry.id} className="bg-stone-900 border border-stone-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-stone-100 font-semibold">{entry.wineName}</h3>
                  {wine && <p className="text-stone-500 text-xs mt-0.5">{wine.region} · {wine.appellation} · {wine.vintage}</p>}
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-amber-400 text-sm font-semibold">{new Date(entry.date).toLocaleDateString("en-GB", {day:"numeric",month:"short",year:"numeric"})}</p>
                  {entry.newRating && <p className="text-amber-400 text-xs">{entry.newRating}/10</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {entry.occasion && <div><span className="text-stone-600 text-xs uppercase">Occasion</span><p className="text-stone-300 text-sm mt-0.5">{entry.occasion}</p></div>}
                {entry.food && <div><span className="text-stone-600 text-xs uppercase">Food</span><p className="text-stone-300 text-sm mt-0.5">{entry.food}</p></div>}
                {entry.who && <div><span className="text-stone-600 text-xs uppercase">Company</span><p className="text-stone-300 text-sm mt-0.5">{entry.who}</p></div>}
              </div>
              {entry.notes && <div className="bg-stone-950 rounded-lg p-3 border border-stone-800"><p className="text-stone-400 text-sm italic leading-relaxed">{entry.notes}</p></div>}
              {entry.bottlesOpened > 1 && <p className="text-stone-600 text-xs mt-2">{entry.bottlesOpened} bottles opened</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SLOT FINDER ─────────────────────────────────────────────────────────────
function SlotFinder({ wines }) {
  const [type, setType] = useState("Red");
  const [region, setRegion] = useState("Bordeaux");
  const [count, setCount] = useState(6);

  const inStock = wines.filter(w => w.bottles > 0 && w.binNo && w.binNo !== "" && w.binNo !== "Boxed" && w.binNo !== "P");
  const similar = inStock.filter(w => w.type === type && w.region === region);
  const allBins = inStock.flatMap(w => w.binNo.split(/[,\s]+/).map(b => b.trim()).filter(Boolean));
  const rackPattern = /^(\d+)([A-Z]+)(\d+)/;
  const racks = {}; allBins.forEach(b => { const m = b.match(rackPattern); if(m){ const rack=m[1]; if(!racks[rack]) racks[rack]=[]; racks[rack].push(b); }});
  const similarBins = similar.flatMap(w => w.binNo.split(/[,\s]+/).map(b=>b.trim()).filter(Boolean));
  const mainRacks = [...new Set(similarBins.map(b=>{const m=b.match(rackPattern);return m?m[1]:null}).filter(Boolean))];
  const suggestedRacks = mainRacks.length > 0 ? mainRacks : Object.keys(racks).slice(0,3);

  return (
    <div className="space-y-5">
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
        <h3 className="text-stone-100 font-semibold mb-1">Slot Finder</h3>
        <p className="text-stone-500 text-sm mb-4">Tell us what you have bought and we will show you where similar wines are stored — so you can put them nearby.</p>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-stone-500 text-xs uppercase">Wine Type</label><select value={type} onChange={e=>setType(e.target.value)} className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none">{["Red","White","Champagne","Other"].map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label className="text-stone-500 text-xs uppercase">Region</label><select value={region} onChange={e=>setRegion(e.target.value)} className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none">{REGIONS.map(r=><option key={r}>{r}</option>)}</select></div>
          <div><label className="text-stone-500 text-xs uppercase">Bottles</label><input type="number" value={count} min="1" max="24" onChange={e=>setCount(parseInt(e.target.value)||1)} className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" /></div>
        </div>
      </div>
      {suggestedRacks.length > 0 && (
        <div className="bg-stone-900 border border-amber-800/40 rounded-xl p-5">
          <h4 className="text-amber-400 text-sm font-semibold mb-3">Suggested Rack Sections</h4>
          <p className="text-stone-500 text-xs mb-4">Based on where your existing {region} {type.toLowerCase()} wines are stored:</p>
          <div className="space-y-3">
            {suggestedRacks.slice(0,3).map(rack => {
              const existing = racks[rack] || [];
              return (
                <div key={rack} className="bg-stone-950 border border-stone-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2"><span className="text-stone-100 font-semibold">Rack {rack}</span><span className="text-stone-500 text-xs">{existing.length} bottles currently</span></div>
                  <p className="text-stone-500 text-xs mb-2">Existing slots: <span className="font-mono text-stone-400">{existing.slice(0,8).join(", ")}{existing.length>8?" ...":""}</span></p>
                  <p className="text-emerald-400 text-xs">Suitable for your {count} new {type.toLowerCase()} {region} bottles</p>
                </div>
              );
            })}
          </div>
          {similar.length > 0 && (
            <div className="mt-4 border-t border-stone-800 pt-4">
              <p className="text-stone-500 text-xs uppercase tracking-wide mb-2">Similar wines already in the cave:</p>
              {similar.slice(0,4).map(w=>(<div key={w.id} className="flex justify-between text-sm py-1"><span className="text-stone-300">{w.name} {w.vintage}</span><span className="font-mono text-stone-500 text-xs">{w.binNo}</span></div>))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── BUYING HUB ──────────────────────────────────────────────────────────────
function BuyingHub({ wines }) {
  const [tab, setTab] = useState("buyagain");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecs, setAiRecs] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  const buyAgain = wines.filter(w => w.buy === "Y");
  const topRated = wines.filter(w => w.rating >= 8).sort((a,b)=>(b.rating||0)-(a.rating||0));
  const runningLow = wines.filter(w => w.bottles > 0 && w.bottles <= 2).sort((a,b)=>a.bottles-b.bottles);

  const bySupplier = {};
  wines.forEach(w => {
    if (!w.supplier) return;
    if (!bySupplier[w.supplier]) bySupplier[w.supplier] = { bottles: 0, value: 0, wines: [], topRated: [] };
    bySupplier[w.supplier].bottles += w.bottles || 0;
    bySupplier[w.supplier].value += (w.price||0)*(w.bottles||0);
    bySupplier[w.supplier].wines.push(w);
    if (w.rating >= 7) bySupplier[w.supplier].topRated.push(w);
  });
  const suppliers = Object.entries(bySupplier).sort((a,b)=>b[1].bottles-a[1].bottles);

  const getAiRecs = async () => {
    setAiLoading(true); setAiRecs("");
    const cellarSummary = `Existing cellar: ${wines.length} wine labels, ~${wines.reduce((s,w)=>s+(w.bottles||0),0)} bottles total.\nMain regions: ${Object.entries(wines.reduce((acc,w)=>{if(w.region&&w.bottles>0)acc[w.region]=(acc[w.region]||0)+w.bottles;return acc;},{})).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([r,c])=>`${r}(${c})`).join(", ")}.\nHighest rated wines (8+/10): ${wines.filter(w=>w.rating>=8).map(w=>`${w.name} ${w.vintage} (${w.rating}/10)`).join(", ")}.\nFlagged to buy again: ${buyAgain.map(w=>`${w.name} from ${w.supplier}`).join(", ")}.\nPreferred suppliers: Tanners, Wine Society, Vinatis.\n${aiPrompt ? `Specific request: ${aiPrompt}` : ""}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200, messages:[{role:"user",content:`You are an expert sommelier and wine buyer advising a private French-focused cellar. Based on this cellar profile, suggest specific wines to buy next — with producer names, appellations, approximate price ranges, and which supplier to use (Tanners, Wine Society, or Vinatis).\n\n${cellarSummary}\n\nGive 6-8 specific recommendations in different price brackets (everyday drinkers, mid-range, and a couple of special bottles). For each: wine name, producer, appellation, approximate UK price, why it suits this cellar, and where to buy it. Be specific and opinionated.`}]})
      });
      const data = await res.json();
      setAiRecs(data.content?.[0]?.text || "Unable to get recommendations.");
    } catch { setAiRecs("Error connecting. Please try again."); }
    setAiLoading(false);
  };

  const TabBtn = ({id,label}) => (
    <button onClick={()=>setTab(id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===id?"bg-amber-800/50 text-amber-300 border border-amber-700/50":"text-stone-400 hover:text-stone-200 hover:bg-stone-800"}`}>{label}</button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-4">
        <TabBtn id="buyagain" label="Buy Again" />
        <TabBtn id="aibuying" label="AI Buying Guide" />
        <TabBtn id="supplier" label="By Supplier" />
        <TabBtn id="vintages" label="Vintage Charts" />
        <TabBtn id="slotfinder" label="Slot Finder" />
      </div>

      {tab === "buyagain" && (
        <div className="space-y-4">
          {buyAgain.length > 0 && (
            <div>
              <h3 className="text-stone-400 text-xs uppercase tracking-wider mb-3">Flagged to Buy Again ({buyAgain.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {buyAgain.map(w=>(
                  <div key={w.id} className="bg-stone-900 border border-stone-800 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div><h4 className="text-stone-100 font-semibold text-sm">{w.name} {w.vintage}</h4><p className="text-stone-500 text-xs mt-0.5">{w.appellation} · {w.supplier}</p></div>
                      <div className="text-right"><span className="text-emerald-400 text-sm font-bold">x{w.bottles} left</span>{w.price&&<p className="text-stone-500 text-xs">£{w.price.toFixed(2)}</p>}</div>
                    </div>
                    {w.tastingNotes && <p className="text-stone-600 text-xs mt-2 italic line-clamp-2">{w.tastingNotes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {topRated.length > 0 && (
            <div>
              <h3 className="text-stone-400 text-xs uppercase tracking-wider mb-3 mt-6">Top Rated (8+/10)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topRated.map(w=>(
                  <div key={w.id} className="bg-stone-900 border border-stone-800 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div><h4 className="text-stone-100 font-semibold text-sm">{w.name} {w.vintage}</h4><p className="text-stone-500 text-xs mt-0.5">{w.appellation} · {w.supplier}</p></div>
                      <div className="text-right"><span className="text-amber-400 font-bold">{w.rating}/10</span>{w.price&&<p className="text-stone-500 text-xs">£{w.price.toFixed(2)}</p>}</div>
                    </div>
                    {w.tastingNotes && <p className="text-stone-600 text-xs mt-2 italic line-clamp-2">{w.tastingNotes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {runningLow.length > 0 && (
            <div>
              <h3 className="text-stone-400 text-xs uppercase tracking-wider mb-3 mt-6">Running Low (1-2 bottles)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {runningLow.map(w=>(
                  <div key={w.id} className="bg-stone-900 border border-stone-800 rounded-lg p-3 flex items-center justify-between">
                    <div><p className="text-stone-200 text-sm font-medium">{w.name} {w.vintage}</p><p className="text-stone-500 text-xs">{w.appellation} · {w.supplier}</p></div>
                    <span className="text-red-400 font-bold text-sm ml-4">x{w.bottles}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "aibuying" && (
        <div className="space-y-4 max-w-2xl">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
            <h3 className="text-stone-100 font-bold text-lg mb-1">AI Buying Guide</h3>
            <p className="text-stone-500 text-sm mb-4">Based on your cellar profile, your highest-rated wines, and what you have flagged to buy again — the AI will suggest specific bottles to buy next, with suppliers and prices.</p>
            <div className="mb-4">
              <label className="text-stone-500 text-xs uppercase">Any specific requests? <span className="text-stone-600 normal-case">(optional)</span></label>
              <input type="text" value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} placeholder="e.g. More Rhone reds under £20, something special for Christmas..." className="w-full mt-2 bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600" />
            </div>
            <button onClick={getAiRecs} disabled={aiLoading} className="w-full py-3 bg-amber-700 hover:bg-amber-600 disabled:bg-stone-800 disabled:text-stone-600 text-white font-semibold rounded-lg transition-colors text-sm">
              {aiLoading ? "Analysing your cellar..." : "Generate Buying Recommendations"}
            </button>
          </div>
          {aiRecs && (
            <div className="bg-stone-900 border border-amber-800/40 rounded-xl p-5">
              <h4 className="text-amber-400 text-xs uppercase tracking-wider mb-4">Sommelier's Buying Guide</h4>
              <div className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">{aiRecs}</div>
            </div>
          )}
        </div>
      )}

      {tab === "supplier" && (
        <div className="space-y-3">
          {suppliers.map(([supplier, data]) => (
            <div key={supplier} className="bg-stone-900 border border-stone-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-stone-100 font-semibold">{supplier}</h3>
                <div className="flex gap-4 text-right">
                  <div><p className="text-amber-400 font-bold">{data.bottles}</p><p className="text-stone-600 text-xs">bottles</p></div>
                  <div><p className="text-emerald-400 font-bold">£{Math.round(data.value).toLocaleString()}</p><p className="text-stone-600 text-xs">value</p></div>
                  <div><p className="text-stone-300 font-bold">{data.wines.length}</p><p className="text-stone-600 text-xs">labels</p></div>
                </div>
              </div>
              {data.topRated.length > 0 && (
                <div>
                  <p className="text-stone-600 text-xs mb-2">Top rated from this supplier:</p>
                  <div className="flex flex-wrap gap-2">{data.topRated.slice(0,4).map(w=>(<span key={w.id} className="text-xs bg-stone-800 text-stone-300 px-2 py-1 rounded">{w.name} {w.vintage} ({w.rating}/10)</span>))}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "vintages" && <VintageCharts />}
      {tab === "slotfinder" && <SlotFinder wines={wines} />}
    </div>
  );
}

// ─── VINTAGE CHARTS ───────────────────────────────────────────────────────────
function VintageCharts() {
  const [activeRegion, setActiveRegion] = useState("Bordeaux Left Bank");
  const region = VINTAGE_DATA[activeRegion];
  const sortedVintages = Object.entries(region.vintages).sort((a,b)=>parseInt(b[0])-parseInt(a[0]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(VINTAGE_DATA).map(r=>(
          <button key={r} onClick={()=>setActiveRegion(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeRegion===r?"bg-amber-800/60 text-amber-300 border border-amber-700":"bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700"}`}>{r}</button>
        ))}
      </div>
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2"><span className={`w-3 h-3 rounded-full ${region.color}`} /><h3 className="text-stone-100 font-bold text-lg">{activeRegion}</h3></div>
        <p className="text-stone-500 text-sm mb-5">{region.notes}</p>
        <div className="space-y-3">
          {sortedVintages.map(([year, data]) => (
            <div key={year} className="bg-stone-950 border border-stone-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3"><span className="text-stone-100 font-bold text-lg">{year}</span><span className={`text-xs px-2 py-0.5 rounded-full border ${SCORE_LABEL_BG(data.score)}`}>{data.label}</span></div>
                <div className="text-right"><span className={`font-bold text-xl ${SCORE_COLOR(data.score)}`}>{data.score}</span><p className="text-stone-600 text-xs">/ 100</p></div>
              </div>
              <div className="bg-stone-800 rounded-full h-1.5 mb-2"><div className={`h-1.5 rounded-full ${data.score>=98?"bg-amber-400":data.score>=95?"bg-emerald-500":data.score>=92?"bg-blue-500":"bg-stone-500"}`} style={{width:`${data.score}%`}} /></div>
              <div className="flex items-start justify-between gap-4">
                <p className="text-stone-400 text-sm">{data.note}</p>
                <span className="text-stone-600 text-xs shrink-0">Drink: {data.drink}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-stone-700 text-xs mt-4">Scores are consensus ratings drawn from major critics. Individual bottles vary by producer and handling.</p>
      </div>
    </div>
  );
}

// ─── AI PAIRING ───────────────────────────────────────────────────────────────
function AIPairing({ wines }) {
  const [meal, setMeal] = useState(""); const [prefs, setPrefs] = useState(""); const [result, setResult] = useState(""); const [loading, setLoading] = useState(false);
  const inStock = wines.filter(w => w.bottles > 0);

  const getPairing = async () => {
    if (!meal.trim()) return; setLoading(true); setResult("");
    const wineList = inStock.map(w=>`- ${w.name} (${w.vintage||'NV'}), ${w.region}, ${w.appellation}, ${w.type}, Bin: ${w.binNo||'Boxed'}, x${w.bottles}${w.rating?`, ${w.rating}/10`:""}${w.tastingNotes?`, Notes: ${w.tastingNotes.substring(0,80)}`:""}${w.decant?", DECANT":""}`).join("\n");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`You are a sommelier for a private cellar. Cellar inventory:\n\n${wineList}\n\nMeal: ${meal}\n${prefs?`Preferences: ${prefs}`:""}\n\nRecommend 2-3 specific wines from the above (only in-stock). For each: name, vintage, bin number, why it pairs well, and any serving notes (temperature, decanting).`}]})});
      const data = await res.json(); setResult(data.content?.[0]?.text||"Unable to get recommendations.");
    } catch { setResult("Error connecting. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6">
        <h2 className="text-stone-100 font-bold text-lg mb-1">AI Wine Pairing</h2>
        <p className="text-stone-500 text-sm mb-5">Tell us what you are cooking and we will find the perfect bottle from the cave.</p>
        <div className="space-y-3">
          <div><label className="text-stone-500 text-xs uppercase">Tonight's Meal</label><input type="text" value={meal} onChange={e=>setMeal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&getPairing()} placeholder="e.g. Roast duck with dauphinoise and pak choi" className="w-full mt-2 bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600" /></div>
          <div><label className="text-stone-500 text-xs uppercase">Any preferences? <span className="text-stone-600 normal-case">(optional)</span></label><input type="text" value={prefs} onChange={e=>setPrefs(e.target.value)} placeholder="e.g. Something ready to drink, prefer Burgundy" className="w-full mt-2 bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-stone-100 text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600" /></div>
          <button onClick={getPairing} disabled={loading||!meal.trim()} className="w-full py-3 bg-amber-700 hover:bg-amber-600 disabled:bg-stone-800 disabled:text-stone-600 text-white font-semibold rounded-lg text-sm">{loading ? "Searching the cave..." : "Find the Perfect Bottle"}</button>
        </div>
      </div>
      {result && (<div className="bg-stone-900 border border-amber-800/40 rounded-xl p-6"><h3 className="text-amber-400 text-xs uppercase tracking-wider mb-4">Sommelier's Recommendation</h3><div className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">{result}</div></div>)}
      <p className="text-center text-stone-700 text-xs">Recommending from {inStock.length} wines in stock</p>
    </div>
  );
}

// ─── ADD WINE FORM ────────────────────────────────────────────────────────────
function AddWineForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({name:"",region:"",appellation:"",vineyard:"",supplier:"",vintage:"",best:"",type:"Red",rating:"",bottles:"1",binNo:"",price:"",tastingNotes:"",decant:"",buy:""});
  const f=(l,k,type="text",opts={})=>(
    <div>
      <label className="text-stone-500 text-xs uppercase">{l}</label>
      {opts.select?<select value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none">{opts.options.map(o=><option key={o} value={o}>{o}</option>)}</select>
      :type==="textarea"?<textarea value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none resize-none" rows={3}/>
      :<input type={type} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} className="w-full mt-1 bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:border-amber-500 focus:outline-none"/>}
    </div>
  );
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
        <h2 className="text-stone-100 font-bold text-lg">Add New Wine</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">{f("Wine Name *","name")}</div>
          {f("Region","region")}{f("Appellation","appellation")}
          {f("Vineyard / Producer","vineyard")}{f("Supplier","supplier")}
          {f("Vintage","vintage")}{f("Drink Best From (Year)","best")}
          {f("Type","type","text",{select:true,options:["Red","White","Other"]})}{f("Bottles","bottles","number")}
          {f("Bin Number","binNo")}{f("Price £","price","number")}
          {f("Rating /10","rating","number")}
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2 text-stone-300 text-sm cursor-pointer"><input type="checkbox" checked={form.decant==="Y"} onChange={e=>setForm(f=>({...f,decant:e.target.checked?"Y":""}))} className="accent-amber-500" />Decant</label>
            <label className="flex items-center gap-2 text-stone-300 text-sm cursor-pointer"><input type="checkbox" checked={form.buy==="Y"} onChange={e=>setForm(f=>({...f,buy:e.target.checked?"Y":""}))} className="accent-emerald-500" />Buy Again</label>
          </div>
          <div className="col-span-2">{f("Tasting Notes","tastingNotes","textarea")}</div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-stone-700 text-stone-400 text-sm hover:bg-stone-800">Cancel</button>
          <button onClick={()=>{ if(!form.name.trim())return; onAdd({...form,id:Date.now(),bottles:parseInt(form.bottles)||0,rating:form.rating?parseFloat(form.rating):null,price:form.price?parseFloat(form.price):null}); }} className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold">Add to Cellar</button>
        </div>
      </div>
    </div>
  );
}

// ─── HELP SECTION ─────────────────────────────────────────────────────────────
function HelpSection() {
  const [open, setOpen] = useState(null);
  const sections = [
    {title:"Browsing the Cellar",steps:["Go to Cellar to see all wines in stock.","Search by name, producer, region, bin number, or supplier.","Filter by region, type (Red/White), or stock status using the dropdowns.","Sort by name, region, vintage, price, or rating.","Group by region, supplier, or type to see the cellar organised differently.","Wines showing 'Gone' have no bottles left but all their records are kept forever.","Tap any wine card to open the full detail view."]},
    {title:"Drinking a Bottle",steps:["Tap the wine card to open it.","Click 'Log a Bottle' to open the diary form.","Fill in the date, occasion, food, who was there, and any tasting notes.","Set a rating out of 10 if you like.","Click 'Log & Update Cellar' — the bottle count drops automatically and the entry goes into the Diary.","Alternatively, hit Edit to manually change any field."]},
    {title:"Adding New Bottles",steps:["Click the + Add button in the top right.","Fill in wine name (required), and as much detail as you like.","Set 'Drink Best From' year to enable drinking window alerts on the Dashboard.","Tick 'Buy Again' or 'Decant' if applicable.","Click Add to Cellar — it appears immediately."]},
    {title:"The Diary",steps:["The Diary builds automatically as you log bottles.","Every entry records the date, occasion, food pairing, who was there, and your notes.","Search the diary by wine name, food, or occasion.","This becomes a permanent record of the cellar's life — every bottle, every meal."]},
    {title:"The Buying Hub",steps:["Buy Again tab: wines you have flagged, top-rated bottles, and anything running low.","AI Buying Guide: tells you what to buy next based on your cellar profile, ratings, and gaps.","By Supplier: see what you have from Tanners, Wine Society, Vinatis etc.","Vintage Charts: detailed scores for every major region by year, with drinking windows and notes.","Slot Finder: pick a wine type and region and it shows which rack sections hold similar wines."]},
    {title:"AI Wine Pairing",steps:["Go to the Pairing tab.","Type in what you are cooking — the more detail the better.","Add optional preferences (e.g. 'something ready to drink', 'prefer Burgundy tonight').","The AI looks at everything in stock and recommends 2-3 bottles with bin numbers.","Only suggests wines you actually have."]},
    {title:"Dashboard",steps:["At-a-glance stats: total bottles, cellar value, wines at peak, tasting notes count.","Drinking Window Alerts: wines past their peak and wines reaching peak next year.","Drink Now list: everything currently at its ideal drinking window.","Type and region breakdown of the cellar."]},
    {title:"Bin Numbers",steps:["The cave uses the existing numbering system (e.g. 1A13, 2E6, Boxed, P).","Multiple bin numbers are comma-separated — one per bottle if needed.","Use 'Boxed' for wines still in wooden cases, 'P' for the pantry.","Search by bin number in the Cellar view to find exact locations."]},
  ];
  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="mb-5"><h2 className="text-stone-100 font-bold text-xl mb-1">How to Use La Cave</h2><p className="text-stone-500 text-sm">Tap any section to expand it.</p></div>
      {sections.map((s,i)=>(
        <div key={i} className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
          <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-800/50 transition-colors">
            <span className="text-stone-100 font-semibold text-sm">{s.title}</span>
            <span className={`text-stone-500 transition-transform text-sm ${open===i?"rotate-180":""}`}>v</span>
          </button>
          {open===i&&<div className="px-5 pb-5 pt-1 border-t border-stone-800"><ol className="space-y-2">{s.steps.map((step,j)=><li key={j} className="flex gap-3 text-sm text-stone-300 leading-relaxed"><span className="text-amber-600 font-bold shrink-0 mt-0.5">{j+1}.</span><span>{step}</span></li>)}</ol></div>}
        </div>
      ))}
      <div className="bg-stone-900 border border-amber-900/30 rounded-xl p-5 mt-4"><p className="text-stone-400 text-sm"><span className="text-amber-400 font-semibold">Built for MAF.</span> This app is yours — new features, tweaks, layout changes, or anything else. Just ask.</p></div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [wines, setWines] = useState([]);
  const [diary, setDiary] = useState([]);
  const [view, setView] = useState("dashboard");
  const [selectedWine, setSelectedWine] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [w, d] = await Promise.all([loadFromDB("wines"), loadFromDB("diary")]);
        if (!w) {
          await saveToDB("wines", SEED_DATA);
          setWines(SEED_DATA);
        } else {
          setWines(w);
        }
        setDiary(d || []);
      } catch (e) {
        console.error("DB init error", e);
        setDbError(true);
        setWines(SEED_DATA);
        setDiary([]);
      }
      setLoaded(true);
    }
    init();
  }, []);

  const save = useCallback(async (newWines, newDiary) => {
    if (newWines !== undefined) { setWines(newWines); await saveToDB("wines", newWines); }
    if (newDiary !== undefined) { setDiary(newDiary); await saveToDB("diary", newDiary); }
  }, []);

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };

  const handleSaveWine = (w) => { const nw = wines.map(x=>x.id===w.id?w:x); save(nw, undefined); setSelectedWine(w); showToast("Saved!"); };
  const handleAddWine = (w) => { const nw = [...wines,w]; save(nw, undefined); setShowAdd(false); showToast(`${w.name} added`); };
  const handleConsume = (wine, entry) => {
    const newBottles = Math.max(0, wine.bottles - (entry.bottlesOpened||1));
    const updatedWine = {...wine, bottles: newBottles, tastingNotes: entry.notes ? (wine.tastingNotes ? wine.tastingNotes + "\n\n[" + entry.date + "] " + entry.notes : entry.notes) : wine.tastingNotes, rating: entry.newRating ? parseFloat(entry.newRating) : wine.rating, dateConsumed: entry.date};
    const nw = wines.map(w=>w.id===wine.id?updatedWine:w);
    const newEntry = { id: Date.now(), wineId: wine.id, wineName: wine.name, ...entry };
    const nd = [newEntry, ...diary];
    save(nw, nd);
    setSelectedWine(null);
    showToast(`${wine.name} logged — ${newBottles} bottle${newBottles!==1?"s":""} remaining`);
  };

  const navItems = [
    {id:"dashboard",label:"Home"},
    {id:"cellar",label:"Cellar"},
    {id:"diary",label:"Diary"},
    {id:"buying",label:"Buying"},
    {id:"pairing",label:"Pairing"},
    {id:"help",label:"Help"},
  ];

  if (!loaded) return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-stone-400 text-sm mb-2">Loading La Cave...</p>
        <p className="text-stone-600 text-xs">Connecting to database</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20 md:pb-6" style={{fontFamily:"'Georgia', serif"}}>
      {dbError && (
        <div className="bg-red-900/50 border-b border-red-800 px-4 py-2 text-center">
          <p className="text-red-300 text-xs">Database connection issue — changes may not be saved. Check your Supabase environment variables.</p>
        </div>
      )}
      <div className="border-b border-stone-800 bg-stone-950/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-amber-400 font-bold text-lg tracking-wide">La Cave</h1>
            <p className="text-stone-600 text-xs tracking-widest uppercase">MAF</p>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({id,label})=>(
              <button key={id} onClick={()=>{setView(id);setShowAdd(false);}} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view===id&&!showAdd?"bg-amber-800/50 text-amber-300 border border-amber-700/50":"text-stone-400 hover:text-stone-200 hover:bg-stone-800"}`}>{label}</button>
            ))}
            <button onClick={()=>{setShowAdd(true);setView("cellar");}} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-1 ${showAdd?"bg-amber-800/50 text-amber-300 border border-amber-700/50":"bg-stone-800 text-stone-200 hover:bg-stone-700"}`}>+ Add</button>
          </div>
          <button onClick={()=>{setShowAdd(true);setView("cellar");}} className="md:hidden bg-amber-700 hover:bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none font-bold">+</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5">
        {view==="dashboard"&&!showAdd&&<Dashboard wines={wines} onWineClick={setSelectedWine}/>}
        {view==="cellar"&&!showAdd&&<CellarView wines={wines} onWineClick={setSelectedWine}/>}
        {view==="diary"&&!showAdd&&<DiaryView diary={diary} wines={wines}/>}
        {view==="buying"&&!showAdd&&<BuyingHub wines={wines}/>}
        {view==="pairing"&&!showAdd&&<AIPairing wines={wines}/>}
        {view==="help"&&!showAdd&&<HelpSection/>}
        {showAdd&&<AddWineForm onAdd={handleAddWine} onCancel={()=>setShowAdd(false)}/>}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-stone-950 border-t border-stone-800 z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({id,label})=>(
            <button key={id} onClick={()=>{setView(id);setShowAdd(false);}} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${view===id&&!showAdd?"text-amber-400":"text-stone-600"}`}>
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedWine&&<WineModal wine={selectedWine} onClose={()=>setSelectedWine(null)} onSave={handleSaveWine} onConsume={handleConsume}/>}
      <Toast msg={toast}/>
    </div>
  );
}
