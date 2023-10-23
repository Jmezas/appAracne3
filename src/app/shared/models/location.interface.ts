export interface AddressCollection {
    address?: string,
    latitude: string,
    longitude: string,
    postal_code?: string
}

export interface GoogleMapsGeocode {
    plus_code: GoogleMapsPlusCode;
    results:   GoogleMapsResult[];
    status:    string;
}

export interface GoogleMapsPlusCode {
    compound_code: string;
    global_code:   string;
}

export interface GoogleMapsResult {
    address_components: GoogleMapsAddressComponent[];
    formatted_address:  string;
    geometry:           GoogleMapsGeometry;
    place_id:           string;
    plus_code?:         GoogleMapsPlusCode;
    types:              string[];
}

export interface GoogleMapsAddressComponent {
    long_name:  string;
    short_name: string;
    types:      string[];
}

export interface GoogleMapsGeometry {
    location:      GoogleMapsLocation;
    location_type: string;
    viewport:      GoogleMapsBounds;
    bounds?:       GoogleMapsBounds;
}

export interface GoogleMapsBounds {
    northeast: GoogleMapsLocation;
    southwest: GoogleMapsLocation;
}

export interface GoogleMapsLocation {
    lat: number;
    lng: number;
}