import '../styles/landing.css';
import { Link } from 'react-router-dom';
import { BookOpen, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero__content">
          <div className="hero__badge">
            <Sparkles size={16} />
            <span>Sistema de gestión académica</span>
          </div>
          <h1>Gestión académica simple y eficiente</h1>
          <p>Administra docentes, materias, grupos y asistencia en una plataforma moderna y minimalista diseñada para instituciones educativas.</p>
          <div className="hero__cta">
            <Link to="/login" className="btn btn--primary">
              Ingresar
              <ArrowRight size={20} />
            </Link>
            <a href="#features" className="btn btn--ghost">
              Ver características
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="feature">
          <div className="feature__icon">
            <BookOpen size={28} />
          </div>
          <h3>Materias y grupos</h3>
          <p>Organiza la oferta académica con claridad. Crea y gestiona materias, asigna grupos y define horarios de manera intuitiva.</p>
        </div>
        <div className="feature">
          <div className="feature__icon">
            <Users size={28} />
          </div>
          <h3>Gestión de docentes</h3>
          <p>Asigna docentes a grupos y gestiones de forma rápida. Mantén un registro completo y actualizado de tu equipo académico.</p>
        </div>
        <div className="feature">
          <div className="feature__icon">
            <CheckCircle size={28} />
          </div>
          <h3>Control de asistencia</h3>
          <p>Registra y consulta asistencia en tiempo real. Genera reportes detallados y toma decisiones basadas en datos.</p>
        </div>
      </section>
    </div>
  );
}
