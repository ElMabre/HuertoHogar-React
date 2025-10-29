import React, { useEffect, useRef, useState } from 'react';

// Ubicaciones de las tiendas
const locales = [
  { nombre: "Santiago", direccion: "Av. Principal 123", lat: -33.4489, lng: -70.6693 },
  { nombre: "Puerto Montt", direccion: "Costanera 456", lat: -41.4693, lng: -72.9424 },
  { nombre: "Villarica", direccion: "Calle Lagos 789", lat: -39.2856, lng: -72.2276 },
  { nombre: "Viña del Mar", direccion: "Av. del Mar 321", lat: -33.0245, lng: -71.5518 },
  { nombre: "Valparaíso", direccion: "Cerro Alegre 654", lat: -33.0472, lng: -71.6127 },
  { nombre: "Concepción", direccion: "Barrio Universitario 987", lat: -36.8201, lng: -73.0444 }
];

const centroChile = { lat: -35.6751, lng: -71.5430 };

function MapComponent() {
  const mapRef = useRef(null); 
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google || document.getElementById('google-maps-script')) {
        setIsApiLoaded(true);
        return;
      }

      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error("Error: API Key de Google Maps no encontrada. Asegúrate de crear un archivo .env y reiniciar el servidor.");
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      // Construye la URL usando la variable
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      // *** FIN DE LA CORRECCIÓN ***

      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsApiLoaded(true);
      };
      script.onerror = () => {
        console.error("Error al cargar el script de Google Maps.");
      };
      document.body.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    // Añadimos la comprobación 'window.google.maps' para evitar el "crash"
    if (isApiLoaded && mapRef.current && window.google && window.google.maps) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
        center: centroChile,
      });

      locales.forEach(local => {
        const marker = new window.google.maps.Marker({
          position: { lat: local.lat, lng: local.lng },
          map: map,
          title: `${local.nombre} - ${local.direccion}`,
        });

        const info = new window.google.maps.InfoWindow({
          content: `<strong>${local.nombre}</strong><br>${local.direccion}`,
        });

        marker.addListener('click', () => {
          info.open(map, marker);
        });
      });
    } else if (isApiLoaded) {
      console.error("API de Google Maps cargada, pero window.google.maps no está disponible. ¿API Key válida? ¿Facturación habilitada?");
    }
  }, [isApiLoaded]); 

  return (
    <div 
      ref={mapRef} 
      id="mapa" 
      style={{ height: '400px', width: '100%', backgroundColor: '#e9ecef', borderRadius: '0.375rem' }} 
t      className="shadow-sm"
    >
      {!isApiLoaded && <div className="text-center p-5">Cargando mapa...</div>}
    </div>
  );
}

export default MapComponent;