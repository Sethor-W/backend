INSERT INTO products (id, name, category, offer, type, description, photos, price, profilePicture, businessid) VALUES
-- Pastas
(UUID(), 'Spaguetti Boloñesa', 'Pasta', NULL, 'INDIVIDUAL', 'Spaguetti bañado en salsa de tomate con carne molida y lluvia de queso y ciboulette', NULL, 6500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Spaguetti Champiñón', 'Pasta', NULL, 'INDIVIDUAL', 'Spaguetti bañado en salsa de champiñón con lluvia de parmesano', NULL, 7500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Spaguetti Scampi', 'Pasta', NULL, 'INDIVIDUAL', 'Spaguetti bañado en salsa de champiñón con camarones pollo y salmón', NULL, 9500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Spaguetti Mechado', 'Pasta', NULL, 'INDIVIDUAL', 'Spaguetti pesto con tapa de carne mechada', NULL, 11500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Sorentino Di Mare', 'Pasta', NULL, 'INDIVIDUAL', 'Sorentino relleno de mozzarella y tomate, camarón, pulpo de camarón, con crema confitado y suave crema, 8 camarones sobre los Sorentinos', NULL, 12900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Milanesas
(UUID(), 'Milanesa Clásica', 'Milanesa', NULL, 'INDIVIDUAL', 'Vacuno o pollo a la plancha apanada en panko', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Milanesa Napolitana', 'Milanesa', NULL, 'INDIVIDUAL', 'Vacuno o pollo a la plancha apanada en panko con salsa de tomate, jamón, queso y orégano', NULL, 11500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Milanesa Suprem', 'Milanesa', NULL, 'INDIVIDUAL', 'Vacuno o pollo apanado con cubierta de queso mozzarella jamón serrano, tomate, aceitunas negras, rúgula y lluvia de parmesano', NULL, 12900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Milanesa Gran Refugio', 'Milanesa', NULL, 'INDIVIDUAL', 'Vacuno o pollo apanado cubierta con salsa cremosa de champiñón, con lluvia de Ciboulette', NULL, 11900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Milanesa Obama', 'Milanesa', NULL, 'INDIVIDUAL', 'Vacuno o pollo apanado cubierta con queso cheddar salsa BBQ y Tocino frito y ciboulette', NULL, 11900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Carnes
(UUID(), 'Carne Mechada', 'Carne', NULL, 'INDIVIDUAL', 'Plato con carne mechada', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Carne Champiñón', 'Carne', NULL, 'INDIVIDUAL', 'Cubos de carne bañados en salsa de champiñón y ciboulette', NULL, 9500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Lomo Liso', 'Carne', NULL, 'INDIVIDUAL', '250gr de lomo corte americano', NULL, 11200, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Lomo Vetado', 'Carne', NULL, 'INDIVIDUAL', '250gr de lomo corte americano', NULL, 12500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Flat Iron', 'Carne', NULL, 'INDIVIDUAL', '250gr de lomo corte americano', NULL, 16400, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Salmón y Pollo
(UUID(), 'Salmón a la Plancha', 'Salmón y Pollo', NULL, 'INDIVIDUAL', 'Salmón a la plancha en mantequilla y alcaparras con base de pesto', NULL, 11500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Pechuga a la Plancha', 'Salmón y Pollo', NULL, 'INDIVIDUAL', 'Media pechuga a la plancha con toques de mantequilla, sal, pimienta y ajo.', NULL, 8500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Acompañamientos
(UUID(), 'A lo pobre', 'Acompañamiento', NULL, 'INDIVIDUAL', 'Papas fritas, huevo y cebolla', NULL, 3500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe');



INSERT INTO products (id, name, category, offer, type, description, photos, price, profilePicture, businessid) VALUES
-- Tablas
(UUID(), 'Tabla Tradicional', 'Tabla', NULL, 'INDIVIDUAL', 'Base Papas fritas, cebolla caramelizada, Vacuno, cerdo, chorizo, 2 huevo con lluvia de ciboulette', NULL, 18900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tabla Gran Refugio', 'Tabla', NULL, 'INDIVIDUAL', 'Base de Papas fritas, cebolla caramelizada, Vacuno, cerdo, pollo, chorizo, bañado en salsa de champiñón con toques de ciboulette', NULL, 23900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tabla Mar y Tierra', 'Tabla', NULL, 'INDIVIDUAL', 'Base de Papas fritas, cebolla caramelizada, Pollo, camarón, salmón, cebolla morada, mix de mariscos bañado en salsa champiñón, y lluvia de ciboulette', NULL, 24500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tabla Obama', 'Tabla', NULL, 'INDIVIDUAL', 'Base de Papas fritas, cebolla caramelizada, Pollo, vacuno, chorizos , tocino frito, bañados en salsa BBQ, lluvia de queso cheddar y ciboulette', NULL, 23900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tabla Suprema de Pollo', 'Tabla', NULL, 'INDIVIDUAL', 'Base de Papas fritas, cebolla caramelizada, Triple porción de Pollo, champiñón bañados en Champiñon y ciboulette', NULL, 18900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tabla Vegetariana', 'Tabla', NULL, 'INDIVIDUAL', 'Base de Papas fritas, champiñón, pimentón, choclo, cebolla, con carne de soya', NULL, 18500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tabla Apocalipsis', 'Tabla', NULL, 'INDIVIDUAL', 'Hambre de zombi? Base de doble de papas fritas, Extra Pollo, Extra carne, Extra Cerdo, Extra Extra de todo.... te la puedes?', NULL, 33500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Nachos
(UUID(), 'Reloaded Nachos', 'Nachos', NULL, 'INDIVIDUAL', 'Base de Nachos bañados en salsa de queso, carne, tomate pimentón, cebolla con guacamole y sour cream y mozarella.', NULL, 12500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Nachos Carne Queso', 'Nachos', NULL, 'INDIVIDUAL', 'Nachos con salsa de queso cheddar y carnes picadas', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Nachos Queso', 'Nachos', NULL, 'INDIVIDUAL', 'Nachois bañados en salsa de queso cheddar', NULL, 5900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Reloaded Papas', 'Nachos', NULL, 'INDIVIDUAL', 'Base Papas fritas bañadas en salsa de queso, carne, tomate pimentón, cebolla con guacamole y sour cream y mozarella.', NULL, 17900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Empanadas Fritas
(UUID(), '3 Mini Empanadas de Queso', 'Empanadas Fritas', NULL, 'INDIVIDUAL', 'Mini empanadas de queso', NULL, 5500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), '3 Mini Empanadas de Mechada', 'Empanadas Fritas', NULL, 'INDIVIDUAL', 'Mini empanadas de carne mechada', NULL, 7500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), '3 Mini Empanadas de Ceviche de Salmón', 'Empanadas Fritas', NULL, 'INDIVIDUAL', 'Mini empanadas de ceviche de salmón', NULL, 8200, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Cheese Sticks', 'Empanadas Fritas', NULL, 'INDIVIDUAL', 'Bastones de queso empanizado con mix de salsas', NULL, 5500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Para Comenzar
(UUID(), 'Ceviche Vegano', 'Para Comenzar', NULL, 'INDIVIDUAL', 'Variedad de verduras, palta, cebolla en plumas y cilantro marinados en limón', NULL, 6900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Ceviche Salmón Palta', 'Para Comenzar', NULL, 'INDIVIDUAL', 'Ceviche de salmón con palta en limón', NULL, 13500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tartare de Atún', 'Para Comenzar', NULL, 'INDIVIDUAL', 'Cuadraditos de Atun palta en salsa teriyaki con lluvia de sésamo', NULL, 11500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Ensaladas
(UUID(), 'Palta Reina', 'Ensaladas', NULL, 'INDIVIDUAL', 'Base de lechuga con palta rellena de pollo picado con mayonesa', NULL, 7500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Ensalada del César', 'Ensaladas', NULL, 'INDIVIDUAL', 'Base de lechugas, cuadritos de pollo salteado, tomate, crutones, huevos de codorniz, lluvia de queso, salsa sour cream', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Salmón', 'Ensaladas', NULL, 'INDIVIDUAL', 'Ensalada de salmón con mix de hojas verdes, palta, tomate cherry, almendras y semillas de zapallo, salsa de miel', NULL, 9500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Ensalada de Atún Sellado', 'Ensaladas', NULL, 'INDIVIDUAL', 'Atún sellado con sésamo, mix de hojas verdes, aros de cebolla morada, tomate cherry, papas fritas crutones, huevos de codorniz, aceitunas negras, salsa de miel', NULL, 11500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Hamburguesas
(UUID(), 'Viñadlmue Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'La que todos quieren! Queso Brie, salsa de queso cheddar cebolla caramelizada, pimientos saltados y un poco de ají', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Viñadlmue Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'La que todos quieren! Queso Brie, salsa de queso cheddar cebolla caramelizada, pimientos saltados y un poco de ají', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'La Open Mic Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Si quieres probar, esta es tu burger! salsa de queso cheddar, champiñón saltado doble jamón, queso gouda', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'La Open Mic Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Si quieres probar, esta es tu burger! salsa de queso cheddar, champiñón saltado doble jamón, queso gouda', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'La Divina Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Del infierno al cielo en una mordida! Cebolla caramelizada, tocino, salsa de queso páprika, pimentón, choclo, queso cheddar', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'La Divina Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Del infierno al cielo en una mordida! Cebolla caramelizada, tocino, salsa de queso páprika, pimentón, choclo, queso cheddar', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Uan Lainer Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Así empezamos, una burger gourmet! Cebolla, tomate, cheddar, tocino piminetos, mayonesa', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Uan Lainer Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Así empezamos, una burger gourmet! Cebolla, tomate, cheddar, tocino piminetos, mayonesa', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Regla de 3 Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Las 3 reglas de una hamburguesa! queso y Champiñon salsa, con cebolla caramelizada, lechuga', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Regla de 3 Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Las 3 reglas de una hamburguesa! queso y Champiñon salsa, con cebolla caramelizada, lechuga', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'El Remate Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Con esta te rematas... Cebolla caramelizada con BBQ, queso gouda lechuga, tocino, mayonesa', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'El Remate Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Con esta te rematas... Cebolla caramelizada con BBQ, queso gouda lechuga, tocino, mayonesa', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), '15 Minutos Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Solo para valientes! Salsa ají jalapeño, queso gouda y cheddar lechuga, cebolla, tomate', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), '15 Minutos Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Solo para valientes! Salsa ají jalapeño, queso gouda y cheddar lechuga, cebolla, tomate', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Nuevas Hamburguesas
(UUID(), 'Cangre Burguer Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Solo una Cangreburger! Pan, vacuno con camarón, lechuga, mostaza pimineta, queso, sal de mar casera', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Cangre Burguer Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Solo una Cangreburger! Pan, vacuno con camarón, lechuga, mostaza pimineta, queso, sal de mar casera', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Krusty Burguer Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Dooh! Carne de vacuno, queso cheddar fundido, tomate y bacon frito', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Krusty Burguer Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Dooh! Carne de vacuno, queso cheddar fundido, tomate y bacon frito', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Big Kahuna Burguer Simple', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Base de lechuga, Cebolla caramelizada, salsa teriyaki, queso cheddar, ketchup', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Big Kahuna Burguer Doble', 'Hamburguesas', NULL, 'INDIVIDUAL', 'Base de lechuga, Cebolla caramelizada, salsa teriyaki, queso cheddar, ketchup', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Hamburguesas Premium
(UUID(), 'Gaviota de Plata', 'Hamburguesas Premium', NULL, 'INDIVIDUAL', 'Hamburguesa de pollo con toque texturizado, con queso, champiñón, salsa cremosa, papas fritas', NULL, 9500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Hamburguesa Gran Refugio', 'Hamburguesas Premium', NULL, 'INDIVIDUAL', 'Triple carne (la Gran Refugio de Festival Guachaca) queso cheddar, tocino, tomate, cebolla, lechuga, salsa cheddar especial', NULL, 12500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Hamburguesa del Bufón', 'Hamburguesas Premium', NULL, 'INDIVIDUAL', 'Doble carne, doble hamburguesa de 180 grs, doble queso y papas fritas', NULL, 18800, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Hamburguesa del Rey', 'Hamburguesas Premium', NULL, 'INDIVIDUAL', 'Doble Carne de 180 grs con cuatro cheddar, aros de cebolla frita, tocino, papas fritas', NULL, 19900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Sándwiches Clásicos
(UUID(), 'Gran Chacarero', 'Sándwiches Clásicos', NULL, 'INDIVIDUAL', '200 gr carne, tomate, porotos verdes al vapor (opcional Mayonesa)', NULL, 9500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Gran Churrasco', 'Sándwiches Clásicos', NULL, 'INDIVIDUAL', '200gr de carne con tomate, palta y mayonesa', NULL, 9200, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Gran Barros Luco', 'Sándwiches Clásicos', NULL, 'INDIVIDUAL', '200gr de carne con queso fundido', NULL, 7500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe');



INSERT INTO products (id, name, category, offer, type, description, photos, price, profilePicture, businessid) VALUES

-- Quesadillas
(UUID(), 'Quesadillas The Chicken', 'Quesadillas', NULL, '4 piezas', 'Tortillas con pollo salteado, pimentón, champiñones, queso y cebolla morada.', NULL, 7900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Quesadillas The Chicken', 'Quesadillas', NULL, '8 piezas', 'Tortillas con pollo salteado, pimentón, champiñones, queso y cebolla morada.', NULL, 9900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Quesadilla de Vacuno', 'Quesadillas', NULL, '4 piezas', 'Tortillas rellenas con carne de vacuno, cebolla, pimentón, queso.', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Quesadilla de Vacuno', 'Quesadillas', NULL, '8 piezas', 'Tortillas rellenas con carne de vacuno, cebolla, pimentón, queso.', NULL, 11900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Quesadilla Mix', 'Quesadillas', NULL, '4 piezas', 'Tortilla con pollo, vacuno, cerdo, cebolla, queso, pimentón.', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Quesadilla Mix', 'Quesadillas', NULL, '8 piezas', 'Tortilla con pollo, vacuno, cerdo, cebolla, queso, pimentón.', NULL, 11900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Quesadilla Camarón', 'Quesadillas', NULL, '4 piezas', 'Tortilla rellena de Camarón, cebolla, queso, pimentón.', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Quesadilla Camarón', 'Quesadillas', NULL, '8 piezas', 'Tortilla rellena de Camarón, cebolla, queso, pimentón.', NULL, 11900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Quesadilla Vegetal', 'Quesadillas', NULL, '4 piezas', 'Champiñón, pimentón, cebolla, alcachofa, choclo, cilantro y queso.', NULL, 6900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Quesadilla Vegetal', 'Quesadillas', NULL, '8 piezas', 'Champiñón, pimentón, cebolla, alcachofa, choclo, cilantro y queso.', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Cócteles Especiales
(UUID(), '2 Cortos de Pisco + Bebida + Red Bull', 'Cócteles Especiales', NULL, NULL, NULL, NULL, 12000, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tropical Gin', 'Cócteles Especiales', NULL, NULL, 'Gin + Red Bull Yellow', NULL, 8500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Dragon Gin', 'Cócteles Especiales', NULL, NULL, 'Gin + Red Bull Fruta del Dragón', NULL, 8500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Gin 97', 'Cócteles Especiales', NULL, NULL, 'Gin + Red Bull Sugar Free', NULL, 8500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Piña Colada en Piña', 'Cócteles Especiales', NULL, NULL, NULL, NULL, 13500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Sangría Tradicional - Copa', 'Cócteles Especiales', NULL, NULL, 'Vino tinto, naranja, pisco, frutas', NULL, 7000, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Sangría Tradicional - Jarra', 'Cócteles Especiales', NULL, NULL, 'Vino tinto, naranja, pisco, frutas', NULL, 17900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Cervezas
(UUID(), 'Heineken', 'Cervezas', NULL, NULL, NULL, NULL, 5000, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Kross Golden', 'Cervezas', NULL, NULL, NULL, NULL, 5800, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Michelado', 'Cervezas', NULL, NULL, NULL, NULL, 1000, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Botellínes', 'Cervezas', NULL, NULL, NULL, NULL, 4300, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Ron Cocteles
(UUID(), 'Mojito', 'Ron Cocteles', NULL, NULL, 'Ron Blanco, menta Sour Mix', NULL, 5500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Mojito Sabores', 'Ron Cocteles', NULL, NULL, 'Ron Blanco, menta Sour Mix, pulpa de fruta', NULL, 6900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Mojito Kraken', 'Ron Cocteles', NULL, NULL, 'Ron Kraken, menta, Sour Mix', NULL, 7900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Mojito Beer', 'Ron Cocteles', NULL, NULL, 'Ron Blanco, menta, sour mix, cerveza', NULL, 8800, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Mojito Ramazzotti', 'Ron Cocteles', NULL, NULL, 'Ramazzotti, ron blanco, menta, sour mix', NULL, 8900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Piña Colada Copa', 'Ron Cocteles', NULL, NULL, 'Ron blanco, crema de coco, jugo de piña colada rayado', NULL, 7900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Tequila Cocteles
(UUID(), 'Shot de Tequila', 'Tequila Cocteles', NULL, NULL, NULL, NULL, 4500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tequila Margarita', 'Tequila Cocteles', NULL, NULL, 'Tequila, limón triple sec, enfriando en sal', NULL, 6900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Breaking Bad', 'Tequila Cocteles', NULL, NULL, 'Tequila, limón triple sec, curaçao, azúcar', NULL, 7900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Sprits
(UUID(), 'Aperol Sprits', 'Sprits', NULL, NULL, 'Aperol, espumante, soda y naranja', NULL, 7500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Ramazzotti', 'Sprits', NULL, NULL, 'Ramazzotti, espumante, soda, limón, amaretto', NULL, 7500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Saint Germain', 'Sprits', NULL, NULL, 'Licor de flor de Sauco, espumante, soda', NULL, 7900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Le Gran Fizz', 'Sprits', NULL, NULL, 'Vodka, St Germain, limón y soda', NULL, 8500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Tropical Gin', 'Sprits', NULL, NULL, 'RedBull Yellow + Gin', NULL, 8500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Whisky Cocteles
(UUID(), 'Clavo Oxidado', 'Whisky Cocteles', NULL, NULL, 'Whisky, Drambuie, Clavo de olor', NULL, 7200, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Gin Cocteles
(UUID(), 'Gin Tonic', 'Gin Cocteles', NULL, NULL, 'Gin, Sour Mix, Tónica y Merengue', NULL, 5500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Negroni', 'Gin Cocteles', NULL, NULL, 'Gin, Campari, Vermouth Rosso, Piel de Naranja', NULL, 7800, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Negroni Sbagliato', 'Gin Cocteles', NULL, NULL, 'Campari, Vermouth Rosso y Espumante', NULL, 7800, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Hanky Panky', 'Gin Cocteles', NULL, NULL, 'Gin, Vermouth Rosso, Branca', NULL, 7800, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Refugio 45', 'Gin Cocteles', NULL, NULL, 'Gin, Mermezo, Naranja', NULL, 7200, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Hilbili Fizz', 'Gin Cocteles', NULL, NULL, 'Gin, Limón y Romero', NULL, 7600, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'French 75', 'Gin Cocteles', NULL, NULL, 'Gin, sour mix, espumante', NULL, 7800, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Jagermeister
(UUID(), 'Amor Refugiano', 'Jagermeister', NULL, NULL, 'Jager, limón, sprite, frutillas', NULL, 9500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Jagerbomb', 'Jagermeister', NULL, NULL, 'Jager, pomelo macerado y goma', NULL, 7900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Coctel Sour
(UUID(), 'Piscol Amaretto Sour', 'Coctel Sour', NULL, NULL, 'Pisco o Amaretto, limón, goma, azúcar', NULL, 4800, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Vodka Cocteles
(UUID(), 'Ruso Blanco', 'Vodka Cocteles', NULL, NULL, 'Licor de café y vodka, crema', NULL, 6400, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Ruso Negro', 'Vodka Cocteles', NULL, NULL, 'Licor de café y vodka', NULL, 6400, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Moscow Mule', 'Vodka Cocteles', NULL, NULL, 'Vodka, limón, ginger beer y menta', NULL, 7800, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Limonadas
(UUID(), 'Limonada Tradicional', 'Limonadas', NULL, NULL, NULL, NULL, 3500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Limonada Menta', 'Limonadas', NULL, NULL, NULL, NULL, 3900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Limonada Menta Jengibre', 'Limonadas', NULL, NULL, NULL, NULL, 4500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Limonada Sabores', 'Limonadas', NULL, NULL, NULL, NULL, 4900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Limonada Gran Refugio', 'Limonadas', NULL, NULL, 'Limón, Jengibre, Pepino, Tónica, Sprite', NULL, 5900, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Vinos
(UUID(), 'Copa de Vino', 'Vinos', NULL, NULL, NULL, NULL, 6000, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Botella Vino o Espumante', 'Vinos', NULL, NULL, NULL, NULL, 19500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Jugos
(UUID(), 'Frutilla', 'Jugos', NULL, NULL, NULL, NULL, 4500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Frambuesa', 'Jugos', NULL, NULL, NULL, NULL, 4500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Mango', 'Jugos', NULL, NULL, NULL, NULL, 4500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Piña', 'Jugos', NULL, NULL, NULL, NULL, 4500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Bebidas
(UUID(), 'Bebidas', 'Bebidas', NULL, NULL, NULL, NULL, 2500, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),

-- Promoción
(UUID(), 'Promoción Cerveza Schop, Pisco Alto, Mojito', 'Promoción', NULL, NULL, NULL, NULL, 9000, NULL, 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe'),
(UUID(), 'Aperol, Ramazotti', 'Promoción', NULL, NULL, NULL, NULL, NULL, '16:00 a 19:30 y 0:00 a 1:30 am', 'c1c6ad80-e6a0-4c52-a63c-0554d7c066fe');
