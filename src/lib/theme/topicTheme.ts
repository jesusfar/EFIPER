import type { Topic } from '../../types';

// Cada eje temático del EFIP tiene su propio color identitario, aplicado de
// forma consistente en todas las secciones (Test, Oral, Caso, Repaso, etc.).
export interface TopicTheme {
  /** Color principal del eje. */
  color: string;
  /** Fondo suave para chips/tarjetas. */
  soft: string;
  /** Borde tenue a juego. */
  border: string;
  /** Degradado para encabezados/estados activos. */
  gradient: string;
}

export const TOPIC_THEME: Record<Topic, TopicTheme> = {
  arquitectura_computadoras: {
    color: '#4F46E5', soft: 'rgba(79,70,229,0.12)', border: 'rgba(79,70,229,0.42)',
    gradient: 'linear-gradient(135deg,#4338CA,#6366F1)',
  },
  sistemas_operativos: {
    color: '#0F766E', soft: 'rgba(15,118,110,0.12)', border: 'rgba(15,118,110,0.42)',
    gradient: 'linear-gradient(135deg,#0F766E,#14B8A6)',
  },
  redes_comunicaciones: {
    color: '#0284C7', soft: 'rgba(2,132,199,0.12)', border: 'rgba(2,132,199,0.42)',
    gradient: 'linear-gradient(135deg,#0369A1,#0EA5E9)',
  },
  base_de_datos: {
    color: '#B45309', soft: 'rgba(180,83,9,0.12)', border: 'rgba(180,83,9,0.42)',
    gradient: 'linear-gradient(135deg,#B45309,#F59E0B)',
  },
  algoritmos_estructuras: {
    color: '#7C3AED', soft: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.42)',
    gradient: 'linear-gradient(135deg,#6D28D9,#A855F7)',
  },
  paradigmas_lenguajes: {
    color: '#008400', soft: 'rgba(0,132,0,0.12)', border: 'rgba(0,132,0,0.42)',
    gradient: 'linear-gradient(135deg,#005E50,#008400)',
  },
  analisis_diseno: {
    color: '#DB2777', soft: 'rgba(219,39,119,0.12)', border: 'rgba(219,39,119,0.42)',
    gradient: 'linear-gradient(135deg,#BE185D,#F472B6)',
  },
};
