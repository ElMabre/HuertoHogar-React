import React, { useEffect, useRef, useState } from 'react';

// Ubicaciones de las tiendas (de tu mapa.js y Caso HuertoHogar)
const locales = [
  { nombre: "Santiago", direccion: "Av. Principal 123", lat: -33.4489, lng: -70.6693 },
  { nombre: "Puerto Montt", direccion: "Costanera 456", lat: -41.4693, lng: -72.9424 },
  { nombre: "Villarica", direccion: "Calle Lagos 789", lat: -39.2856, lng: -72.2276 },
  { nombre: "Viña del Mar", direccion: "Av. del Mar 321", lat: -33.0245, lng: -71.5518 },
  { nombre: "Valparaíso", direccion: "Cerro Alegre 654", lat: -33.0472, lng: -71.6127 },
  { nombre: "Concepción", direccion: "Barrio Universitario 987", lat: -36.8201, lng: -73.0444 }
];

// Centro geográfico de Chile
const centroChile = { lat: -35.6751, lng: -71.5430 };

function MapComponent() {
  const mapRef = useRef(null); // Referencia al div que contendrá el mapa
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    // Función para cargar el script de Google Maps
    const loadGoogleMapsScript = () => {
      // Evitar cargar el script múltiples veces
      if (window.google || document.getElementById('google-maps-script')) {
        setIsApiLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
      
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsApiLoaded(true);
      };
      script.onerror = () => {
        console.error("Error al cargar el script de Google Maps. Verifica la API Key y las restricciones.");
      };
      document.body.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (isApiLoaded && mapRef.current && window.google && window.google.maps) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
        center: centroChile,
      });

      // Añadir marcadores (lógica de tu mapa.js)
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
      // Si la API dice que cargó pero window.google.maps no existe
      console.error("API de Google Maps cargada, pero window.google.maps no está disponible.");
    }
  }, [isApiLoaded]); // Este efecto depende de que la API se haya cargado

  return (
    <div 
      ref={mapRef} 
      id="mapa" 
      style={{ height: '400px', width: '100%', backgroundColor: '#e9ecef', borderRadius: '0.375rem' }} 
      className="shadow-sm"
    >
      {!isApiLoaded && <div className="text-center p-5">Cargando mapa...</div>}
    </div>
  );
}

export default MapComponent;