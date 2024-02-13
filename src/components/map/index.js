import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import styles from './styles.json';

const GoogleMap = () => {
    if (
        !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        !process.env.NEXT_PUBLIC_GOOGLE_MAPS_POSITION_LAT ||
        !process.env.NEXT_PUBLIC_GOOGLE_MAPS_POSITION_LNG ||
        !process.env.NEXT_PUBLIC_GOOGLE_MAPS_MARKER_LAT ||
        !process.env.NEXT_PUBLIC_GOOGLE_MAPS_MARKER_LNG
    )
        throw new Error('Missing map required environment variables.');

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                <Map
                    defaultCenter={{
                        lat: parseFloat(process.env.NEXT_PUBLIC_GOOGLE_MAPS_POSITION_LAT),
                        lng: parseFloat(process.env.NEXT_PUBLIC_GOOGLE_MAPS_POSITION_LNG)
                    }}
                    defaultZoom={5}
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
};

export default GoogleMap;
