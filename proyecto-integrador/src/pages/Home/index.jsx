import React from 'react';
import Card from '../../components/ui/Card';

const Home = () => {
  return (
    <div className="home-page">
      <h2>Bienvenido a la Página de Inicio</h2>
      <Card title="Ejemplo de Tarjeta">
        <p>Contenido de ejemplo para la tarjeta en la página de inicio.</p>
      </Card>
    </div>
  );
};

export default Home;
