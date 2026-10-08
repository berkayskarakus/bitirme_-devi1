import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    IconButton,
    Divider
} from '@mui/material';

import {
    MapContainer,
    TileLayer,
    Polygon,
    useMap,
    LayersControl
} from 'react-leaflet';

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

// İkonlar
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MapIcon from '@mui/icons-material/Map';
import SaveIcon from '@mui/icons-material/Save';


// ----------------------------------------------------
// HARİTAYI POLİGONA ODAKLAYAN COMPONENT
// ----------------------------------------------------

function FitBounds({
                       coords
                   }: {
    coords: [number, number][]
}) {
    const map = useMap();

    useEffect(() => {
        if (coords.length > 0) {
            const bounds = L.latLngBounds(coords);

            map.fitBounds(bounds, {
                padding: [50, 50]
            });
        }
    }, [coords, map]);

    return null;
}


// ----------------------------------------------------
// GEOMAN KONTROLLERİ
// ----------------------------------------------------

function GeomanControls({
                            setGeoJsonData
                        }: {
    setGeoJsonData: (data: any) => void
}) {
    const map = useMap();

    useEffect(() => {
        const pm = (map as any).pm;

        if (!pm) {
            console.error('Leaflet Geoman yüklenemedi.');
            return;
        }

        // Geoman araçları
        pm.addControls({
            position: 'topleft',

            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,

            drawRectangle: true,
            drawPolygon: true,

            drawCircle: false,
            drawText: false,

            editMode: true,
            dragMode: true,

            cutPolygon: false,
            removalMode: true
        });

        // ------------------------------------------------
        // POLİGON / ALAN OLUŞTURULDUĞUNDA
        // ------------------------------------------------

        const handleCreate = (e: any) => {
            const geojson = e.layer.toGeoJSON();

            console.log(
                'Oluşturulan GeoJSON:',
                geojson
            );

            setGeoJsonData(geojson);

            // Kullanıcı daha sonra alanı düzenlerse
            e.layer.on('pm:update', () => {
                const updatedGeoJson = e.layer.toGeoJSON();

                console.log(
                    'Güncellenmiş GeoJSON:',
                    updatedGeoJson
                );

                setGeoJsonData(updatedGeoJson);
            });
        };


        // ------------------------------------------------
        // ALAN SİLİNDİĞİNDE
        // ------------------------------------------------

        const handleRemove = () => {
            setGeoJsonData(null);
        };


        map.on('pm:create', handleCreate);
        map.on('pm:remove', handleRemove);


        // ------------------------------------------------
        // CLEANUP
        // ------------------------------------------------

        return () => {
            pm.removeControls();

            map.off(
                'pm:create',
                handleCreate
            );

            map.off(
                'pm:remove',
                handleRemove
            );
        };

    }, [map, setGeoJsonData]);

    return null;
}


// ----------------------------------------------------
// ANA ARAZİ COMPONENT'İ
// ----------------------------------------------------

export default function Arazi() {

    const defaultPosition: [number, number] = [
        37.7833,
        29.0963
    ];

    // ------------------------------------------------
    // KOORDİNAT INPUTLARI
    // ------------------------------------------------

    const [inputs, setInputs] = useState<
        {
            id: number;
            lat: string;
            lng: string;
        }[]
    >([
        {
            id: 1,
            lat: '',
            lng: ''
        },
        {
            id: 2,
            lat: '',
            lng: ''
        },
        {
            id: 3,
            lat: '',
            lng: ''
        },
        {
            id: 4,
            lat: '',
            lng: ''
        }
    ]);


    // ------------------------------------------------
    // KOORDİNATLARDAN OLUŞAN POLİGON
    // ------------------------------------------------

    const [polygonCoords, setPolygonCoords] =
        useState<[number, number][]>([]);


    // ------------------------------------------------
    // GEOMAN GEOJSON
    // ------------------------------------------------

    const [geoJsonData, setGeoJsonData] =
        useState<any>(null);


    // ------------------------------------------------
    // YENİ KOORDİNAT EKLE
    // ------------------------------------------------

    const handleAddInput = () => {

        const newId =
            inputs.length > 0
                ? Math.max(
                ...inputs.map(
                    item => item.id
                )
            ) + 1
                : 1;

        setInputs([
            ...inputs,
            {
                id: newId,
                lat: '',
                lng: ''
            }
        ]);
    };


    // ------------------------------------------------
    // KOORDİNAT SİL
    // ------------------------------------------------

    const handleRemoveInput = (id: number) => {

        if (inputs.length > 3) {

            setInputs(
                inputs.filter(
                    item => item.id !== id
                )
            );

        } else {

            alert(
                'Bir alan çizebilmek için en az 3 koordinata ihtiyacınız var!'
            );
        }
    };


    // ------------------------------------------------
    // INPUT DEĞİŞTİR
    // ------------------------------------------------

    const handleChange = (
        id: number,
        field: 'lat' | 'lng',
        value: string
    ) => {

        setInputs(
            inputs.map(item =>
                item.id === id
                    ? {
                        ...item,
                        [field]: value
                    }
                    : item
            )
        );
    };


    // ------------------------------------------------
    // KOORDİNATLARDAN POLİGON ÇİZ
    // ------------------------------------------------

    const handleDrawPolygon = () => {

        const validCoords: [number, number][] = [];

        let hasFormatError = false;
        let hasBoundaryError = false;


        inputs.forEach(input => {

            const latNum =
                parseFloat(
                    input.lat.replace(',', '.')
                );

            const lngNum =
                parseFloat(
                    input.lng.replace(',', '.')
                );


            if (
                isNaN(latNum) ||
                isNaN(lngNum)
            ) {

                hasFormatError = true;

            } else if (
                latNum < -90 ||
                latNum > 90 ||
                lngNum < -180 ||
                lngNum > 180
            ) {

                hasBoundaryError = true;

            } else {

                validCoords.push([
                    latNum,
                    lngNum
                ]);
            }

        });


        if (hasFormatError) {

            alert(
                'Lütfen boş alan bırakmayın ve sadece sayısal değer girin. Örn: 37.78'
            );

            return;
        }


        if (hasBoundaryError) {

            alert(
                'Hata: Enlem (Lat) -90 ile +90 arasında, Boylam (Lng) ise -180 ile +180 arasında olmalıdır!'
            );

            return;
        }


        if (validCoords.length < 3) {

            alert(
                'Bir alan çizebilmek için en az 3 koordinata ihtiyacınız var!'
            );

            return;
        }


        setPolygonCoords(validCoords);
    };


    // ------------------------------------------------
    // ALANI KAYDET
    // ------------------------------------------------

    const handleSaveArea = () => {

        if (!geoJsonData) {

            alert(
                'Lütfen önce harita sol üstündeki araçlarla bir çalışma alanı çizin!'
            );

            return;
        }


        console.log(
            '🚀 MOCK API POST BAŞLADI'
        );

        console.log(
            'Gönderilen GeoJSON:',
            JSON.stringify(
                geoJsonData,
                null,
                2
            )
        );


        alert(
            'Çalışma alanı başarıyla kaydedildi! F12 Konsola bakınız.'
        );
    };


    // ------------------------------------------------
    // UI
    // ------------------------------------------------

    return (

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 80px)'
            }}
        >

            {/* BAŞLIK */}

            <Typography
                variant="h4"
                sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: 'primary.main'
                }}
            >
                Arazi Seçimi
            </Typography>


            <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    flexGrow: 1,
                    overflow: 'hidden'
                }}
            >


                {/* ================================== */}
                {/* SOL PANEL */}
                {/* ================================== */}

                <Paper
                    elevation={3}
                    sx={{
                        width: 350,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2
                    }}
                >

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            fontSize: '1.1rem'
                        }}
                    >
                        Arazi Sınır Koordinatları
                    </Typography>


                    <Divider sx={{ mb: 2 }} />


                    {/* KOORDİNATLAR */}

                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            pr: 1
                        }}
                    >

                        {inputs.map(
                            (input, index) => (

                                <Box
                                    key={input.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 2
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 'bold',
                                            width: '20px'
                                        }}
                                    >
                                        {index + 1}.
                                    </Typography>


                                    {/* LAT */}

                                    <TextField
                                        label="Enlem (Lat)"
                                        size="small"
                                        sx={{
                                            flex: 1
                                        }}
                                        value={input.lat}
                                        onChange={(e) =>
                                            handleChange(
                                                input.id,
                                                'lat',
                                                e.target.value
                                            )
                                        }
                                        placeholder="37.78"
                                    />


                                    {/* LNG */}

                                    <TextField
                                        label="Boylam (Lng)"
                                        size="small"
                                        sx={{
                                            flex: 1
                                        }}
                                        value={input.lng}
                                        onChange={(e) =>
                                            handleChange(
                                                input.id,
                                                'lng',
                                                e.target.value
                                            )
                                        }
                                        placeholder="29.09"
                                    />


                                    {/* DELETE */}

                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            handleRemoveInput(
                                                input.id
                                            )
                                        }
                                        disabled={
                                            inputs.length <= 3
                                        }
                                        size="small"
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>

                                </Box>
                            )
                        )}

                    </Box>


                    {/* YENİ KOORDİNAT */}

                    <Button
                        startIcon={
                            <AddCircleOutlineIcon />
                        }
                        onClick={
                            handleAddInput
                        }
                        sx={{
                            mt: 1,
                            mb: 2,
                            alignSelf: 'flex-start'
                        }}
                    >
                        Yeni Koordinat Ekle
                    </Button>


                    {/* HARİTADA ÇİZ */}

                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        size="large"
                        startIcon={
                            <MapIcon />
                        }
                        onClick={
                            handleDrawPolygon
                        }
                        sx={{
                            mt: 'auto',
                            mb: 2
                        }}
                    >
                        Haritada Çiz
                    </Button>


                    <Divider
                        sx={{
                            mb: 2
                        }}
                    />


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1,
                            textAlign: 'center'
                        }}
                    >
                        Veya haritadan serbest çizip kaydedin
                    </Typography>


                    {/* KAYDET */}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        startIcon={
                            <SaveIcon />
                        }
                        onClick={
                            handleSaveArea
                        }
                    >
                        Çalışma Alanını Kaydet
                    </Button>

                </Paper>


                {/* ================================== */}
                {/* HARİTA */}
                {/* ================================== */}

                <Paper
                    elevation={3}
                    sx={{
                        flexGrow: 1,
                        overflow: 'hidden',
                        borderRadius: 2,
                        position: 'relative'
                    }}
                >

                    <MapContainer
                        center={defaultPosition}
                        zoom={15}
                        scrollWheelZoom={true}
                        style={{
                            height: '100%',
                            width: '100%',
                            zIndex: 1
                        }}
                    >

                        <LayersControl
                            position="topright"
                        >

                            {/* UYDU */}

                            <LayersControl.BaseLayer
                                checked
                                name="Uydu Görünümü (Hybrid)"
                            >

                                <TileLayer
                                    attribution="&copy; Google Maps"
                                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                                />

                            </LayersControl.BaseLayer>


                            {/* OSM */}

                            <LayersControl.BaseLayer
                                name="Sokak Görünümü (OSM)"
                            >

                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                            </LayersControl.BaseLayer>

                        </LayersControl>


                        {/* KOORDİNATLARDAN POLİGON */}

                        {polygonCoords.length > 0 && (

                            <>

                                <Polygon
                                    positions={
                                        polygonCoords
                                    }
                                    pathOptions={{
                                        color: '#8B0000',
                                        weight: 3,
                                        fillColor: '#d32f2f',
                                        fillOpacity: 0.35
                                    }}
                                />

                                <FitBounds
                                    coords={
                                        polygonCoords
                                    }
                                />

                            </>

                        )}


                        {/* GEOMAN */}

                        <GeomanControls
                            setGeoJsonData={
                                setGeoJsonData
                            }
                        />

                    </MapContainer>

                </Paper>

            </Box>

        </Box>
    );
}