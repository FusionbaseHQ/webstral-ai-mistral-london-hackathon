import React, { useEffect, useState, useRef } from 'react'
import { number, string, object } from 'prop-types'
import 'mapbox-gl/dist/mapbox-gl.css';
//import mapboxgl from 'mapbox-gl';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";


const Map = (props) => {

    // // eslint-disable-next-line import/no-webpack-loader-syntax
    // mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

    //Change with your own
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2dvc3NsaW5nIiwiYSI6ImNrdHhhdzZoYzFidHQzM3FueXIxNTlqb2cifQ.iSvTaIlhofTa078I3bHfmA'

    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null)

    const [lng, setLng] = useState(props.lng || -70.9);
    const [lat, setLat] = useState(props.lat || 42.35);
    const [zoom, setZoom] = useState(props.zoom || 17);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [lng, lat],
            zoom: zoom
        });

        marker.current = new mapboxgl.Marker({
            color: '#4A89FF'
        })
            .setLngLat([lng, lat])
            .addTo(map.current);

    }, []);

    useEffect(() => {
        setMapCenter(props.lng, props.lat)
        setMarker(props.lng, props.lat)
    }, [props.lat, props.lng])

    const setMapCenter = (lng, lat) => {
        if (map.current) {
            map.current.setCenter([lng, lat]);
        }
    }

    const setMarker = (lng, lat) => {
        if (marker.current) {
            marker.current.setLngLat([lng, lat]);
        }
    }


    if (map.current) {
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    }; // wait for map to initialize

    return (
        <div>
            <div
                ref={mapContainer}
                style={props.style}
                className={props.className} />
        </div>
    );
}

Map.propTypes = {
    lat: number,
    lng: number,
    zoom: number,
    style: object,
    className: string
}

export default Map