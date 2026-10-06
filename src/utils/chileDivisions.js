/**
 * División político-administrativa de Chile: Región → Provincia → Comuna.
 * Generado a partir del script SQL del proyecto (tablas Region, Provincia y Comuna).
 * Regiones ordenadas de norte a sur; provincias por ID; comunas por orden alfabético.
 * Para actualizar los datos, volver a generar este archivo desde el SQL.
 */
export const regions = [
  {
    id: 15,
    name: "Arica y Parinacota",
    provinces: [
      {
        id: 151,
        name: "Arica",
        communes: [
          { id: 15101, name: "Arica" },
          { id: 15102, name: "Camarones" },
        ],
      },
      {
        id: 152,
        name: "Parinacota",
        communes: [
          { id: 15202, name: "General Lagos" },
          { id: 15201, name: "Putre" },
        ],
      },
    ],
  },
  {
    id: 1,
    name: "Tarapacá",
    provinces: [
      {
        id: 11,
        name: "Iquique",
        communes: [
          { id: 1107, name: "Alto Hospicio" },
          { id: 1101, name: "Iquique" },
        ],
      },
      {
        id: 14,
        name: "Tamarugal",
        communes: [
          { id: 1402, name: "Camiña" },
          { id: 1403, name: "Colchane" },
          { id: 1404, name: "Huara" },
          { id: 1405, name: "Pica" },
          { id: 1401, name: "Pozo Almonte" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Antofagasta",
    provinces: [
      {
        id: 21,
        name: "Antofagasta",
        communes: [
          { id: 2101, name: "Antofagasta" },
          { id: 2102, name: "Mejillones" },
          { id: 2103, name: "Sierra Gorda" },
          { id: 2104, name: "Taltal" },
        ],
      },
      {
        id: 22,
        name: "El Loa",
        communes: [
          { id: 2201, name: "Calama" },
          { id: 2202, name: "Ollagüe" },
          { id: 2203, name: "San Pedro de Atacama" },
        ],
      },
      {
        id: 23,
        name: "Tocopilla",
        communes: [
          { id: 2302, name: "María Elena" },
          { id: 2301, name: "Tocopilla" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Atacama",
    provinces: [
      {
        id: 31,
        name: "Copiapó",
        communes: [
          { id: 3102, name: "Caldera" },
          { id: 3101, name: "Copiapó" },
          { id: 3103, name: "Tierra Amarilla" },
        ],
      },
      {
        id: 32,
        name: "Chañaral",
        communes: [
          { id: 3201, name: "Chañaral" },
          { id: 3202, name: "Diego de Almagro" },
        ],
      },
      {
        id: 33,
        name: "Huasco",
        communes: [
          { id: 3302, name: "Alto del Carmen" },
          { id: 3303, name: "Freirina" },
          { id: 3304, name: "Huasco" },
          { id: 3301, name: "Vallenar" },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Coquimbo",
    provinces: [
      {
        id: 41,
        name: "Elqui",
        communes: [
          { id: 4103, name: "Andacollo" },
          { id: 4102, name: "Coquimbo" },
          { id: 4104, name: "La Higuera" },
          { id: 4101, name: "La Serena" },
          { id: 4105, name: "Paiguano" },
          { id: 4106, name: "Vicuña" },
        ],
      },
      {
        id: 42,
        name: "Choapa",
        communes: [
          { id: 4202, name: "Canela" },
          { id: 4201, name: "Illapel" },
          { id: 4203, name: "Los Vilos" },
          { id: 4204, name: "Salamanca" },
        ],
      },
      {
        id: 43,
        name: "Limarí",
        communes: [
          { id: 4302, name: "Combarbalá" },
          { id: 4303, name: "Monte Patria" },
          { id: 4301, name: "Ovalle" },
          { id: 4304, name: "Punitaqui" },
          { id: 4305, name: "Río Hurtado" },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Valparaíso",
    provinces: [
      {
        id: 51,
        name: "Valparaíso",
        communes: [
          { id: 5102, name: "Casablanca" },
          { id: 5103, name: "Concón" },
          { id: 5104, name: "Juan Fernández" },
          { id: 5105, name: "Puchuncaví" },
          { id: 5107, name: "Quintero" },
          { id: 5101, name: "Valparaíso" },
          { id: 5109, name: "Viña del Mar" },
        ],
      },
      {
        id: 52,
        name: "Isla de Pascua",
        communes: [
          { id: 5201, name: "Isla de Pascua" },
        ],
      },
      {
        id: 53,
        name: "Los Andes",
        communes: [
          { id: 5302, name: "Calle Larga" },
          { id: 5301, name: "Los Andes" },
          { id: 5303, name: "Rinconada" },
          { id: 5304, name: "San Esteban" },
        ],
      },
      {
        id: 54,
        name: "Petorca",
        communes: [
          { id: 5402, name: "Cabildo" },
          { id: 5401, name: "La Ligua" },
          { id: 5403, name: "Papudo" },
          { id: 5404, name: "Petorca" },
          { id: 5405, name: "Zapallar" },
        ],
      },
      {
        id: 55,
        name: "Quillota",
        communes: [
          { id: 5502, name: "Calera" },
          { id: 5503, name: "Hijuelas" },
          { id: 5504, name: "La Cruz" },
          { id: 5506, name: "Nogales" },
          { id: 5501, name: "Quillota" },
        ],
      },
      {
        id: 56,
        name: "San Antonio",
        communes: [
          { id: 5602, name: "Algarrobo" },
          { id: 5603, name: "Cartagena" },
          { id: 5604, name: "El Quisco" },
          { id: 5605, name: "El Tabo" },
          { id: 5601, name: "San Antonio" },
          { id: 5606, name: "Santo Domingo" },
        ],
      },
      {
        id: 57,
        name: "San Felipe de Aconcagua",
        communes: [
          { id: 5702, name: "Catemu" },
          { id: 5703, name: "Llaillay" },
          { id: 5704, name: "Panquehue" },
          { id: 5705, name: "Putaendo" },
          { id: 5701, name: "San Felipe" },
          { id: 5706, name: "Santa María" },
        ],
      },
      {
        id: 58,
        name: "Marga Marga",
        communes: [
          { id: 5802, name: "Limache" },
          { id: 5803, name: "Olmué" },
          { id: 5801, name: "Quilpué" },
          { id: 5804, name: "Villa Alemana" },
        ],
      },
    ],
  },
  {
    id: 13,
    name: "Metropolitana de Santiago",
    provinces: [
      {
        id: 131,
        name: "Santiago",
        communes: [
          { id: 13102, name: "Cerrillos" },
          { id: 13103, name: "Cerro Navia" },
          { id: 13104, name: "Conchalí" },
          { id: 13105, name: "El Bosque" },
          { id: 13106, name: "Estación Central" },
          { id: 13107, name: "Huechuraba" },
          { id: 13108, name: "Independencia" },
          { id: 13109, name: "La Cisterna" },
          { id: 13110, name: "La Florida" },
          { id: 13111, name: "La Granja" },
          { id: 13112, name: "La Pintana" },
          { id: 13113, name: "La Reina" },
          { id: 13114, name: "Las Condes" },
          { id: 13115, name: "Lo Barnechea" },
          { id: 13116, name: "Lo Espejo" },
          { id: 13117, name: "Lo Prado" },
          { id: 13118, name: "Macul" },
          { id: 13119, name: "Maipú" },
          { id: 13120, name: "Ñuñoa" },
          { id: 13121, name: "Pedro Aguirre Cerda" },
          { id: 13122, name: "Peñalolén" },
          { id: 13123, name: "Providencia" },
          { id: 13124, name: "Pudahuel" },
          { id: 13125, name: "Quilicura" },
          { id: 13126, name: "Quinta Normal" },
          { id: 13127, name: "Recoleta" },
          { id: 13128, name: "Renca" },
          { id: 13129, name: "San Joaquín" },
          { id: 13130, name: "San Miguel" },
          { id: 13131, name: "San Ramón" },
          { id: 13101, name: "Santiago" },
          { id: 13132, name: "Vitacura" },
        ],
      },
      {
        id: 132,
        name: "Cordillera",
        communes: [
          { id: 13202, name: "Pirque" },
          { id: 13201, name: "Puente Alto" },
          { id: 13203, name: "San José de Maipo" },
        ],
      },
      {
        id: 133,
        name: "Chacabuco",
        communes: [
          { id: 13301, name: "Colina" },
          { id: 13302, name: "Lampa" },
          { id: 13303, name: "Tiltil" },
        ],
      },
      {
        id: 134,
        name: "Maipo",
        communes: [
          { id: 13402, name: "Buin" },
          { id: 13403, name: "Calera de Tango" },
          { id: 13404, name: "Paine" },
          { id: 13401, name: "San Bernardo" },
        ],
      },
      {
        id: 135,
        name: "Melipilla",
        communes: [
          { id: 13502, name: "Alhué" },
          { id: 13503, name: "Curacaví" },
          { id: 13504, name: "María Pinto" },
          { id: 13501, name: "Melipilla" },
          { id: 13505, name: "San Pedro" },
        ],
      },
      {
        id: 136,
        name: "Talagante",
        communes: [
          { id: 13602, name: "El Monte" },
          { id: 13603, name: "Isla de Maipo" },
          { id: 13604, name: "Padre Hurtado" },
          { id: 13605, name: "Peñaflor" },
          { id: 13601, name: "Talagante" },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Libertador General Bernardo O'Higgins",
    provinces: [
      {
        id: 61,
        name: "Cachapoal",
        communes: [
          { id: 6102, name: "Codegua" },
          { id: 6103, name: "Coinco" },
          { id: 6104, name: "Coltauco" },
          { id: 6105, name: "Doñihue" },
          { id: 6106, name: "Graneros" },
          { id: 6107, name: "Las Cabras" },
          { id: 6108, name: "Machalí" },
          { id: 6109, name: "Malloa" },
          { id: 6110, name: "Mostazal" },
          { id: 6111, name: "Olivar" },
          { id: 6112, name: "Peumo" },
          { id: 6113, name: "Pichidegua" },
          { id: 6114, name: "Quinta de Tilcoco" },
          { id: 6101, name: "Rancagua" },
          { id: 6115, name: "Rengo" },
          { id: 6116, name: "Requínoa" },
          { id: 6117, name: "San Vicente" },
        ],
      },
      {
        id: 62,
        name: "Cardenal Caro",
        communes: [
          { id: 6202, name: "La Estrella" },
          { id: 6203, name: "Litueche" },
          { id: 6204, name: "Marchihue" },
          { id: 6205, name: "Navidad" },
          { id: 6206, name: "Paredones" },
          { id: 6201, name: "Pichilemu" },
        ],
      },
      {
        id: 63,
        name: "Colchagua",
        communes: [
          { id: 6302, name: "Chépica" },
          { id: 6303, name: "Chimbarongo" },
          { id: 6304, name: "Lolol" },
          { id: 6305, name: "Nancagua" },
          { id: 6306, name: "Palmilla" },
          { id: 6307, name: "Peralillo" },
          { id: 6308, name: "Placilla" },
          { id: 6309, name: "Pumanque" },
          { id: 6301, name: "San Fernando" },
          { id: 6310, name: "Santa Cruz" },
        ],
      },
    ],
  },
  {
    id: 7,
    name: "Maule",
    provinces: [
      {
        id: 71,
        name: "Talca",
        communes: [
          { id: 7102, name: "Constitución" },
          { id: 7103, name: "Curepto" },
          { id: 7104, name: "Empedrado" },
          { id: 7105, name: "Maule" },
          { id: 7106, name: "Pelarco" },
          { id: 7107, name: "Pencahue" },
          { id: 7108, name: "Río Claro" },
          { id: 7109, name: "San Clemente" },
          { id: 7110, name: "San Rafael" },
          { id: 7101, name: "Talca" },
        ],
      },
      {
        id: 72,
        name: "Cauquenes",
        communes: [
          { id: 7201, name: "Cauquenes" },
          { id: 7202, name: "Chanco" },
          { id: 7203, name: "Pelluhue" },
        ],
      },
      {
        id: 73,
        name: "Curicó",
        communes: [
          { id: 7301, name: "Curicó" },
          { id: 7302, name: "Hualañé" },
          { id: 7303, name: "Licantén" },
          { id: 7304, name: "Molina" },
          { id: 7305, name: "Rauco" },
          { id: 7306, name: "Romeral" },
          { id: 7307, name: "Sagrada Familia" },
          { id: 7308, name: "Teno" },
          { id: 7309, name: "Vichuquén" },
        ],
      },
      {
        id: 74,
        name: "Linares",
        communes: [
          { id: 7402, name: "Colbún" },
          { id: 7401, name: "Linares" },
          { id: 7403, name: "Longaví" },
          { id: 7404, name: "Parral" },
          { id: 7405, name: "Retiro" },
          { id: 7406, name: "San Javier" },
          { id: 7407, name: "Villa Alegre" },
          { id: 7408, name: "Yerbas Buenas" },
        ],
      },
    ],
  },
  {
    id: 16,
    name: "Ñuble",
    provinces: [
      {
        id: 161,
        name: "Diguillín",
        communes: [
          { id: 16102, name: "Bulnes" },
          { id: 16101, name: "Chillán" },
          { id: 16103, name: "Chillán Viejo" },
          { id: 16104, name: "El Carmen" },
          { id: 16105, name: "Pemuco" },
          { id: 16106, name: "Pinto" },
          { id: 16107, name: "Quillón" },
          { id: 16108, name: "San Ignacio" },
          { id: 16109, name: "Yungay" },
        ],
      },
      {
        id: 162,
        name: "Itata",
        communes: [
          { id: 16202, name: "Cobquecura" },
          { id: 16203, name: "Coelemu" },
          { id: 16204, name: "Ninhue" },
          { id: 16205, name: "Portezuelo" },
          { id: 16201, name: "Quirihue" },
          { id: 16206, name: "Ranquil" },
          { id: 16207, name: "Treguaco" },
        ],
      },
      {
        id: 163,
        name: "Punilla",
        communes: [
          { id: 16302, name: "Coihueco" },
          { id: 16303, name: "Ñiquén" },
          { id: 16301, name: "San Carlos" },
          { id: 16304, name: "San Fabián" },
          { id: 16305, name: "San Nicolás" },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Biobío",
    provinces: [
      {
        id: 81,
        name: "Concepción",
        communes: [
          { id: 8103, name: "Chiguayante" },
          { id: 8101, name: "Concepción" },
          { id: 8102, name: "Coronel" },
          { id: 8104, name: "Florida" },
          { id: 8112, name: "Hualpén" },
          { id: 8105, name: "Hualqui" },
          { id: 8106, name: "Lota" },
          { id: 8107, name: "Penco" },
          { id: 8108, name: "San Pedro de la Paz" },
          { id: 8109, name: "Santa Juana" },
          { id: 8110, name: "Talcahuano" },
          { id: 8111, name: "Tomé" },
        ],
      },
      {
        id: 82,
        name: "Arauco",
        communes: [
          { id: 8202, name: "Arauco" },
          { id: 8203, name: "Cañete" },
          { id: 8204, name: "Contulmo" },
          { id: 8205, name: "Curanilahue" },
          { id: 8201, name: "Lebu" },
          { id: 8206, name: "Los Alamos" },
          { id: 8207, name: "Tirúa" },
        ],
      },
      {
        id: 83,
        name: "Biobío",
        communes: [
          { id: 8314, name: "Alto Biobío" },
          { id: 8302, name: "Antuco" },
          { id: 8303, name: "Cabrero" },
          { id: 8304, name: "Laja" },
          { id: 8301, name: "Los Angeles" },
          { id: 8305, name: "Mulchén" },
          { id: 8306, name: "Nacimiento" },
          { id: 8307, name: "Negrete" },
          { id: 8308, name: "Quilaco" },
          { id: 8309, name: "Quilleco" },
          { id: 8310, name: "San Rosendo" },
          { id: 8311, name: "Santa Bárbara" },
          { id: 8312, name: "Tucapel" },
          { id: 8313, name: "Yumbel" },
        ],
      },
    ],
  },
  {
    id: 9,
    name: "La Araucanía",
    provinces: [
      {
        id: 91,
        name: "Cautín",
        communes: [
          { id: 9102, name: "Carahue" },
          { id: 9121, name: "Cholchol" },
          { id: 9103, name: "Cunco" },
          { id: 9104, name: "Curarrehue" },
          { id: 9105, name: "Freire" },
          { id: 9106, name: "Galvarino" },
          { id: 9107, name: "Gorbea" },
          { id: 9108, name: "Lautaro" },
          { id: 9109, name: "Loncoche" },
          { id: 9110, name: "Melipeuco" },
          { id: 9111, name: "Nueva Imperial" },
          { id: 9112, name: "Padre Las Casas" },
          { id: 9113, name: "Perquenco" },
          { id: 9114, name: "Pitrufquén" },
          { id: 9115, name: "Pucón" },
          { id: 9116, name: "Saavedra" },
          { id: 9101, name: "Temuco" },
          { id: 9117, name: "Teodoro Schmidt" },
          { id: 9118, name: "Toltén" },
          { id: 9119, name: "Vilcún" },
          { id: 9120, name: "Villarrica" },
        ],
      },
      {
        id: 92,
        name: "Malleco",
        communes: [
          { id: 9201, name: "Angol" },
          { id: 9202, name: "Collipulli" },
          { id: 9203, name: "Curacautín" },
          { id: 9204, name: "Ercilla" },
          { id: 9205, name: "Lonquimay" },
          { id: 9206, name: "Los Sauces" },
          { id: 9207, name: "Lumaco" },
          { id: 9208, name: "Purén" },
          { id: 9209, name: "Renaico" },
          { id: 9210, name: "Traiguén" },
          { id: 9211, name: "Victoria" },
        ],
      },
    ],
  },
  {
    id: 14,
    name: "Los Ríos",
    provinces: [
      {
        id: 141,
        name: "Valdivia",
        communes: [
          { id: 14102, name: "Corral" },
          { id: 14103, name: "Lanco" },
          { id: 14104, name: "Los Lagos" },
          { id: 14105, name: "Máfil" },
          { id: 14106, name: "Mariquina" },
          { id: 14107, name: "Paillaco" },
          { id: 14108, name: "Panguipulli" },
          { id: 14101, name: "Valdivia" },
        ],
      },
      {
        id: 142,
        name: "Ranco",
        communes: [
          { id: 14202, name: "Futrono" },
          { id: 14201, name: "La Unión" },
          { id: 14203, name: "Lago Ranco" },
          { id: 14204, name: "Río Bueno" },
        ],
      },
    ],
  },
  {
    id: 10,
    name: "Los Lagos",
    provinces: [
      {
        id: 101,
        name: "Llanquihue",
        communes: [
          { id: 10102, name: "Calbuco" },
          { id: 10103, name: "Cochamó" },
          { id: 10104, name: "Fresia" },
          { id: 10105, name: "Frutillar" },
          { id: 10107, name: "Llanquihue" },
          { id: 10106, name: "Los Muermos" },
          { id: 10108, name: "Maullín" },
          { id: 10101, name: "Puerto Montt" },
          { id: 10109, name: "Puerto Varas" },
        ],
      },
      {
        id: 102,
        name: "Chiloé",
        communes: [
          { id: 10202, name: "Ancud" },
          { id: 10201, name: "Castro" },
          { id: 10203, name: "Chonchi" },
          { id: 10204, name: "Curaco de Vélez" },
          { id: 10205, name: "Dalcahue" },
          { id: 10206, name: "Puqueldón" },
          { id: 10207, name: "Queilén" },
          { id: 10208, name: "Quellón" },
          { id: 10209, name: "Quemchi" },
          { id: 10210, name: "Quinchao" },
        ],
      },
      {
        id: 103,
        name: "Osorno",
        communes: [
          { id: 10301, name: "Osorno" },
          { id: 10302, name: "Puerto Octay" },
          { id: 10303, name: "Purranque" },
          { id: 10304, name: "Puyehue" },
          { id: 10305, name: "Río Negro" },
          { id: 10306, name: "San Juan de la Costa" },
          { id: 10307, name: "San Pablo" },
        ],
      },
      {
        id: 104,
        name: "Palena",
        communes: [
          { id: 10401, name: "Chaitén" },
          { id: 10402, name: "Futaleufú" },
          { id: 10403, name: "Hualaihué" },
          { id: 10404, name: "Palena" },
        ],
      },
    ],
  },
  {
    id: 11,
    name: "Aysén del General Carlos Ibáñez del Campo",
    provinces: [
      {
        id: 111,
        name: "Coihaique",
        communes: [
          { id: 11101, name: "Coihaique" },
          { id: 11102, name: "Lago Verde" },
        ],
      },
      {
        id: 112,
        name: "Aisén",
        communes: [
          { id: 11201, name: "Aisén" },
          { id: 11202, name: "Cisnes" },
          { id: 11203, name: "Guaitecas" },
        ],
      },
      {
        id: 113,
        name: "Capitán Prat",
        communes: [
          { id: 11301, name: "Cochrane" },
          { id: 11302, name: "O'Higgins" },
          { id: 11303, name: "Tortel" },
        ],
      },
      {
        id: 114,
        name: "General Carrera",
        communes: [
          { id: 11401, name: "Chile Chico" },
          { id: 11402, name: "Río Ibáñez" },
        ],
      },
    ],
  },
  {
    id: 12,
    name: "Magallanes y de la Antártica Chilena",
    provinces: [
      {
        id: 121,
        name: "Magallanes",
        communes: [
          { id: 12102, name: "Laguna Blanca" },
          { id: 12101, name: "Punta Arenas" },
          { id: 12103, name: "Río Verde" },
          { id: 12104, name: "San Gregorio" },
        ],
      },
      {
        id: 122,
        name: "Antártica Chilena",
        communes: [
          { id: 12201, name: "Cabo de Hornos" },
        ],
      },
      {
        id: 123,
        name: "Tierra del Fuego",
        communes: [
          { id: 12301, name: "Porvenir" },
          { id: 12302, name: "Primavera" },
          { id: 12303, name: "Timaukel" },
        ],
      },
      {
        id: 124,
        name: "Última Esperanza",
        communes: [
          { id: 12401, name: "Natales" },
          { id: 12402, name: "Torres del Paine" },
        ],
      },
    ],
  },
];

const toOption = ({ id, name }) => ({ id, name });

export const getRegionNames = () => regions.map(toOption);

export const getProvinceNames = (regionId) =>
  regions.find((r) => r.id === regionId)?.provinces.map(toOption) ?? [];

export const getCommuneNames = (regionId, provinceId) =>
  regions.find((r) => r.id === regionId)?.provinces.find((p) => p.id === provinceId)?.communes ?? [];
