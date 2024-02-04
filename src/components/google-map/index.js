import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import styles from './styles.json';

const GoogleMap = () => (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <Map
                center={{
                    lat: parseFloat(process.env.NEXT_PUBLIC_GOOGLE_MAPS_POSITION_LAT),
                    lng: parseFloat(process.env.NEXT_PUBLIC_GOOGLE_MAPS_POSITION_LNG)
                }}
                zoom={5}
                disableDefaultUI
                styles={styles[0].styles}
            >
                <Marker position={{
                    lat: parseFloat(process.env.NEXT_PUBLIC_GOOGLE_MAPS_MARKER_LAT),
                    lng: parseFloat(process.env.NEXT_PUBLIC_GOOGLE_MAPS_MARKER_LNG)
                }} />
            </Map>
        </APIProvider>
    </div>
);

export default GoogleMap;