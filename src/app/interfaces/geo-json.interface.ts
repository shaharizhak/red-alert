export interface GeoJsonFeature {
    type: string;
    properties: {
      OBJECTID_1: number,
      OBJECTID: number,
      SETL_CODE: number,
      MGLSDE_LOC: string,
      MGLSDE_L_1: number,
      MGLSDE_L_2: number,
      MGLSDE_L_3: string,
      MGLSDE_L_4: string
    },
    geometry: {
      type: string,
      coordinates: [number, number]
    }
  }
  
  export interface GeoJson {
    type: string;
    name: string;
    crs: {
      type: string;
      properties: {
        name: string;
      }
    },
    features: Array<GeoJsonFeature>
  }