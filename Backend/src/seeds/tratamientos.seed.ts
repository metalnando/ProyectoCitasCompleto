/**
 * Seed de Tratamientos Dentales para Bela Sunrise
 *
 * Para ejecutar este seed, puedes:
 * 1. Importarlo en un script de inicialización
 * 2. Usarlo como referencia para insertar manualmente en MongoDB
 * 3. Ejecutarlo como parte del proceso de setup
 */

export const tratamientosSeed = [
  // TRATAMIENTOS PREVENTIVOS
  {
    nombre: "Consulta General / Valoración",
    descripcion: "Evaluación completa del estado de salud bucal, diagnóstico y plan de tratamiento personalizado.",
    precio: 50000,
    duracion: 30,
    imagen: "/tratamientos/consulta.png",
    estado: "activo"
  },
  {
    nombre: "Limpieza Dental Profesional",
    descripcion: "Profilaxis dental completa con ultrasonido y pulido para remover placa bacteriana y sarro.",
    precio: 80000,
    duracion: 45,
    imagen: "/tratamientos/limpieza.png",
    estado: "activo"
  },
  {
    nombre: "Aplicación de Flúor",
    descripcion: "Tratamiento preventivo para fortalecer el esmalte dental y prevenir caries.",
    precio: 40000,
    duracion: 20,
    imagen: "/tratamientos/fluor.png",
    estado: "activo"
  },
  {
    nombre: "Sellantes Dentales",
    descripcion: "Protección de fosas y fisuras de molares para prevenir caries, especialmente en niños.",
    precio: 45000,
    duracion: 30,
    imagen: "/tratamientos/sellantes.png",
    estado: "activo"
  },

  // TRATAMIENTOS RESTAURATIVOS
  {
    nombre: "Resina Simple",
    descripcion: "Restauración estética de caries pequeñas con resina del color del diente.",
    precio: 120000,
    duracion: 45,
    imagen: "/tratamientos/resina.png",
    estado: "activo"
  },
  {
    nombre: "Resina Compuesta",
    descripcion: "Restauración de caries medianas o grandes con técnica de capas para mayor durabilidad.",
    precio: 180000,
    duracion: 60,
    imagen: "/tratamientos/resina-compuesta.png",
    estado: "activo"
  },
  {
    nombre: "Amalgama Dental",
    descripcion: "Restauración tradicional en metal para molares posteriores.",
    precio: 90000,
    duracion: 45,
    imagen: "/tratamientos/amalgama.png",
    estado: "activo"
  },
  {
    nombre: "Incrustación Dental",
    descripcion: "Restauración indirecta en porcelana o resina para cavidades grandes.",
    precio: 350000,
    duracion: 90,
    imagen: "/tratamientos/incrustacion.png",
    estado: "activo"
  },

  // ENDODONCIA
  {
    nombre: "Endodoncia Unirradicular",
    descripcion: "Tratamiento de conducto para dientes con una sola raíz (incisivos, caninos).",
    precio: 280000,
    duracion: 90,
    imagen: "/tratamientos/endodoncia.png",
    estado: "activo"
  },
  {
    nombre: "Endodoncia Birradicular",
    descripcion: "Tratamiento de conducto para dientes con dos raíces (premolares).",
    precio: 350000,
    duracion: 120,
    imagen: "/tratamientos/endodoncia-bi.png",
    estado: "activo"
  },
  {
    nombre: "Endodoncia Multirradicular",
    descripcion: "Tratamiento de conducto para molares con múltiples raíces.",
    precio: 450000,
    duracion: 150,
    imagen: "/tratamientos/endodoncia-multi.png",
    estado: "activo"
  },
  {
    nombre: "Retratamiento Endodóntico",
    descripcion: "Repetición de tratamiento de conducto en casos de fracaso previo.",
    precio: 500000,
    duracion: 180,
    imagen: "/tratamientos/retratamiento.png",
    estado: "activo"
  },

  // CIRUGÍA ORAL
  {
    nombre: "Extracción Simple",
    descripcion: "Extracción de diente con anestesia local, sin complicaciones.",
    precio: 100000,
    duracion: 30,
    imagen: "/tratamientos/extraccion.png",
    estado: "activo"
  },
  {
    nombre: "Extracción Compleja",
    descripcion: "Extracción quirúrgica de dientes con raíces curvadas o fracturadas.",
    precio: 200000,
    duracion: 60,
    imagen: "/tratamientos/extraccion-compleja.png",
    estado: "activo"
  },
  {
    nombre: "Extracción de Cordales",
    descripcion: "Extracción quirúrgica de terceros molares (muelas del juicio).",
    precio: 350000,
    duracion: 90,
    imagen: "/tratamientos/cordales.png",
    estado: "activo"
  },
  {
    nombre: "Cirugía de Frenillo",
    descripcion: "Frenectomía para corregir frenillos labiales o linguales cortos.",
    precio: 250000,
    duracion: 45,
    imagen: "/tratamientos/frenillo.png",
    estado: "activo"
  },

  // PERIODONCIA
  {
    nombre: "Raspado y Alisado Radicular",
    descripcion: "Limpieza profunda de las raíces para tratar enfermedad periodontal.",
    precio: 150000,
    duracion: 60,
    imagen: "/tratamientos/raspado.png",
    estado: "activo"
  },
  {
    nombre: "Tratamiento de Gingivitis",
    descripcion: "Tratamiento para inflamación de encías con limpieza y medicación.",
    precio: 120000,
    duracion: 45,
    imagen: "/tratamientos/gingivitis.png",
    estado: "activo"
  },
  {
    nombre: "Cirugía Periodontal",
    descripcion: "Intervención quirúrgica para casos avanzados de enfermedad periodontal.",
    precio: 400000,
    duracion: 120,
    imagen: "/tratamientos/cirugia-periodontal.png",
    estado: "activo"
  },

  // ORTODONCIA
  {
    nombre: "Valoración Ortodóntica",
    descripcion: "Evaluación completa con radiografías y plan de tratamiento ortodóntico.",
    precio: 80000,
    duracion: 60,
    imagen: "/tratamientos/ortodoncia-valoracion.png",
    estado: "activo"
  },
  {
    nombre: "Brackets Metálicos (Tratamiento Completo)",
    descripcion: "Ortodoncia tradicional con brackets metálicos, incluye controles mensuales.",
    precio: 3500000,
    duracion: 60,
    imagen: "/tratamientos/brackets.png",
    estado: "activo"
  },
  {
    nombre: "Brackets Estéticos",
    descripcion: "Ortodoncia con brackets de cerámica o zafiro, más discretos.",
    precio: 4500000,
    duracion: 60,
    imagen: "/tratamientos/brackets-esteticos.png",
    estado: "activo"
  },
  {
    nombre: "Alineadores Invisibles",
    descripcion: "Ortodoncia invisible con placas removibles transparentes.",
    precio: 6000000,
    duracion: 60,
    imagen: "/tratamientos/invisalign.png",
    estado: "activo"
  },
  {
    nombre: "Control de Ortodoncia",
    descripcion: "Cita de seguimiento y ajuste de aparatos ortodónticos.",
    precio: 60000,
    duracion: 30,
    imagen: "/tratamientos/control-ortodoncia.png",
    estado: "activo"
  },

  // PRÓTESIS DENTAL
  {
    nombre: "Corona Dental en Metal-Porcelana",
    descripcion: "Corona fija que combina resistencia del metal con estética de la porcelana.",
    precio: 600000,
    duracion: 90,
    imagen: "/tratamientos/corona.png",
    estado: "activo"
  },
  {
    nombre: "Corona Dental en Porcelana Pura",
    descripcion: "Corona libre de metal para máxima estética, ideal para dientes anteriores.",
    precio: 800000,
    duracion: 90,
    imagen: "/tratamientos/corona-porcelana.png",
    estado: "activo"
  },
  {
    nombre: "Puente Dental (3 unidades)",
    descripcion: "Prótesis fija para reemplazar diente perdido, soportado por dientes adyacentes.",
    precio: 1800000,
    duracion: 120,
    imagen: "/tratamientos/puente.png",
    estado: "activo"
  },
  {
    nombre: "Prótesis Total Removible",
    descripcion: "Dentadura completa removible para pacientes sin dientes.",
    precio: 1200000,
    duracion: 120,
    imagen: "/tratamientos/protesis-total.png",
    estado: "activo"
  },
  {
    nombre: "Prótesis Parcial Removible",
    descripcion: "Prótesis removible para reemplazar varios dientes faltantes.",
    precio: 800000,
    duracion: 90,
    imagen: "/tratamientos/protesis-parcial.png",
    estado: "activo"
  },

  // IMPLANTES
  {
    nombre: "Implante Dental (Solo Implante)",
    descripcion: "Colocación quirúrgica del implante de titanio en el hueso.",
    precio: 2000000,
    duracion: 120,
    imagen: "/tratamientos/implante.png",
    estado: "activo"
  },
  {
    nombre: "Corona sobre Implante",
    descripcion: "Corona de porcelana sobre implante previamente colocado.",
    precio: 1200000,
    duracion: 90,
    imagen: "/tratamientos/corona-implante.png",
    estado: "activo"
  },
  {
    nombre: "Implante Dental Completo",
    descripcion: "Tratamiento completo: implante + pilar + corona de porcelana.",
    precio: 3500000,
    duracion: 180,
    imagen: "/tratamientos/implante-completo.png",
    estado: "activo"
  },

  // ESTÉTICA DENTAL
  {
    nombre: "Blanqueamiento Dental en Consultorio",
    descripcion: "Blanqueamiento profesional con lámpara LED, resultados inmediatos.",
    precio: 350000,
    duracion: 90,
    imagen: "/tratamientos/blanqueamiento.png",
    estado: "activo"
  },
  {
    nombre: "Blanqueamiento Dental Ambulatorio",
    descripcion: "Kit de blanqueamiento para uso en casa con férulas personalizadas.",
    precio: 250000,
    duracion: 60,
    imagen: "/tratamientos/blanqueamiento-casa.png",
    estado: "activo"
  },
  {
    nombre: "Carillas Dentales en Resina",
    descripcion: "Carillas estéticas directas para mejorar forma y color de dientes.",
    precio: 300000,
    duracion: 60,
    imagen: "/tratamientos/carillas-resina.png",
    estado: "activo"
  },
  {
    nombre: "Carillas Dentales en Porcelana",
    descripcion: "Carillas de alta estética en porcelana, máxima durabilidad.",
    precio: 900000,
    duracion: 90,
    imagen: "/tratamientos/carillas-porcelana.png",
    estado: "activo"
  },
  {
    nombre: "Diseño de Sonrisa",
    descripcion: "Planificación digital completa para transformación estética de la sonrisa.",
    precio: 500000,
    duracion: 90,
    imagen: "/tratamientos/diseno-sonrisa.png",
    estado: "activo"
  },

  // ODONTOPEDIATRÍA
  {
    nombre: "Consulta Odontopediátrica",
    descripcion: "Evaluación dental especializada para niños con técnicas de manejo de conducta.",
    precio: 60000,
    duracion: 30,
    imagen: "/tratamientos/odontopediatria.png",
    estado: "activo"
  },
  {
    nombre: "Pulpotomía (Tratamiento de Nervio en Niños)",
    descripcion: "Tratamiento del nervio en dientes de leche para preservarlos.",
    precio: 150000,
    duracion: 45,
    imagen: "/tratamientos/pulpotomia.png",
    estado: "activo"
  },
  {
    nombre: "Corona de Acero para Niños",
    descripcion: "Corona prefabricada para restaurar dientes de leche muy dañados.",
    precio: 180000,
    duracion: 45,
    imagen: "/tratamientos/corona-acero.png",
    estado: "activo"
  },

  // URGENCIAS
  {
    nombre: "Atención de Urgencia Dental",
    descripcion: "Tratamiento inmediato de dolor, infección o trauma dental.",
    precio: 100000,
    duracion: 45,
    imagen: "/tratamientos/urgencia.png",
    estado: "activo"
  },
  {
    nombre: "Drenaje de Absceso",
    descripcion: "Procedimiento para drenar infección dental aguda.",
    precio: 120000,
    duracion: 30,
    imagen: "/tratamientos/absceso.png",
    estado: "activo"
  },
  {
    nombre: "Reimplante Dental (Trauma)",
    descripcion: "Reubicación de diente avulsionado por trauma, tratamiento de emergencia.",
    precio: 200000,
    duracion: 60,
    imagen: "/tratamientos/reimplante.png",
    estado: "activo"
  },

  // DIAGNÓSTICO
  {
    nombre: "Radiografía Periapical",
    descripcion: "Radiografía de un diente específico para diagnóstico detallado.",
    precio: 25000,
    duracion: 10,
    imagen: "/tratamientos/radiografia.png",
    estado: "activo"
  },
  {
    nombre: "Radiografía Panorámica",
    descripcion: "Radiografía completa de maxilares, dientes y estructuras adyacentes.",
    precio: 60000,
    duracion: 15,
    imagen: "/tratamientos/panoramica.png",
    estado: "activo"
  },
  {
    nombre: "Tomografía Dental 3D",
    descripcion: "Imagen tridimensional para planificación de implantes y cirugías complejas.",
    precio: 150000,
    duracion: 20,
    imagen: "/tratamientos/tomografia.png",
    estado: "activo"
  }
];

// Función para insertar en la base de datos (usar con NestJS o directamente)
export const seedTratamientos = async (tratamientoModel: any) => {
  try {
    // Verificar si ya existen tratamientos
    const count = await tratamientoModel.countDocuments();
    if (count > 0) {
      console.log(`Ya existen ${count} tratamientos en la base de datos.`);
      return;
    }

    // Insertar todos los tratamientos
    const result = await tratamientoModel.insertMany(tratamientosSeed);
    console.log(`Se insertaron ${result.length} tratamientos exitosamente.`);
    return result;
  } catch (error) {
    console.error('Error al insertar tratamientos:', error);
    throw error;
  }
};
