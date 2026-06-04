import { TOPIC_THEME } from '../../lib/theme/topicTheme';
import { TOPIC_LABELS } from '../../store/useStore';
import type { Topic } from '../../types';

import imgArquitectura from '../../assets/modulos/Siggy Arquitectura del Computador.png';
import imgSistemasOperativos from '../../assets/modulos/Siggy Sistemas Operativos.png';
import imgRedes from '../../assets/modulos/Siggy Redes.png';
import imgBaseDatos from '../../assets/modulos/Siggy Base de Datos.png';
import imgAlgoritmos from '../../assets/modulos/Algoritmos y Estructura de datos.png';
import imgParadigmas from '../../assets/modulos/Siggy Paradigmas de Programacion.png';
import imgAnalisis from '../../assets/modulos/Siggy Analisis y Diseño de sistemas.png';

interface Module {
  topic: Topic;
  image: string;
  subtitle: string;
  num: string;
}

const MODULES: Module[] = [
  {
    topic: 'arquitectura_computadoras',
    image: imgArquitectura,
    subtitle: 'Hardware · Procesadores · Memoria · Jerarquías',
    num: '01',
  },
  {
    topic: 'sistemas_operativos',
    image: imgSistemasOperativos,
    subtitle: 'Procesos · Sincronización · Memoria virtual · FS',
    num: '02',
  },
  {
    topic: 'redes_comunicaciones',
    image: imgRedes,
    subtitle: 'OSI/TCP-IP · Protocolos · Topologías · Routing',
    num: '03',
  },
  {
    topic: 'base_de_datos',
    image: imgBaseDatos,
    subtitle: 'Modelo relacional · SQL · Normalización · ACID',
    num: '04',
  },
  {
    topic: 'algoritmos_estructuras',
    image: imgAlgoritmos,
    subtitle: 'Complejidad · Listas · Árboles · Grafos · Sort',
    num: '05',
  },
  {
    topic: 'paradigmas_lenguajes',
    image: imgParadigmas,
    subtitle: 'POO · Herencia · Polimorfismo · Java',
    num: '06',
  },
  {
    topic: 'analisis_diseno',
    image: imgAnalisis,
    subtitle: 'UML · Casos de uso · Clases · Requerimientos',
    num: '07',
  },
];

export function TeoriaPage() {
  return (
    <div className="space-y-6 animate-rise">
      <header className="rounded-2xl p-5 text-white bg-[linear-gradient(135deg,#005E50,#009F92_55%,#008400)] shadow-stud">
        <div className="label text-white/80">Material de estudio</div>
        <h1 className="font-display text-3xl font-black tracking-tight mt-1">Teoría por eje temático</h1>
        <p className="text-sm text-white/70 mt-1">7 módulos · contenidos del EFIP completos</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {MODULES.map((mod) => {
          const theme = TOPIC_THEME[mod.topic];
          return (
            <div
              key={mod.topic}
              className="group rounded-2xl overflow-hidden shadow-stud cursor-default select-none"
              style={{ border: `2px solid ${theme.border}` }}
            >
              {/* Image — landscape, sin overlay */}
              <div className="overflow-hidden bg-panel-2" style={{ aspectRatio: '16 / 9' }}>
                <img
                  src={mod.image}
                  alt={TOPIC_LABELS[mod.topic]}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />
              </div>

              {/* Footer info */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: `3px solid ${theme.color}`, background: theme.soft }}
              >
                <span
                  className="shrink-0 font-mono text-xs font-bold px-2 py-0.5 rounded-md text-white"
                  style={{ background: theme.gradient }}
                >
                  {mod.num}
                </span>
                <div>
                  <p className="font-display font-bold text-sm leading-tight" style={{ color: theme.color }}>
                    {TOPIC_LABELS[mod.topic]}
                  </p>
                  <p className="text-xs text-muted mt-0.5 leading-tight">{mod.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
