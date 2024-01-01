import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import styles from './styles.json';

const position = { lat: 40, lng: -5 };
const marker = { lat: 38.93691027825629, lng: -9.327279967015828 };

const GoogleMap = () => (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <Map
                center={position}
                zoom={5}
                disableDefaultUI
                styles={styles[0].styles}
            >
                <Marker position={marker} />
            </Map>
        </APIProvider>
    </div>
);

export default GoogleMap;