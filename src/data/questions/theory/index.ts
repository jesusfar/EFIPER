import type { Question, Topic } from '../../../types';
import { redesTheory } from './redes';
import { arquitecturaTheory } from './arquitectura';
import { sistemasOperativosTheory } from './sistemas-operativos';
import { basesDatosTheory } from './bases-datos';
import { algoritmosTheory } from './algoritmos';
import { paradigmasTheory } from './paradigmas';
import { analisisDisenoTheory } from './analisis-diseno';

// Banco TEÓRICO escrito a mano, una por una, con preguntas que obligan a
// razonar (escenarios, "cuál es la INCORRECTA", selección múltiple). Se va
// completando eje por eje hasta 250 por cada uno.
export const THEORY: Record<Topic, Question[]> = {
  redes_comunicaciones: redesTheory,
  arquitectura_computadoras: arquitecturaTheory,
  sistemas_operativos: sistemasOperativosTheory,
  base_de_datos: basesDatosTheory,
  algoritmos_estructuras: algoritmosTheory,
  paradigmas_lenguajes: paradigmasTheory,
  analisis_diseno: analisisDisenoTheory,
};

export const THEORY_TARGET_PER_TOPIC = 250;
