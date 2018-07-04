use data::model::{Collection, Feature, Position, Symbol};
use serde_json::{Value as JsonValue, to_vec_pretty};

pub fn from_feature(f: Feature) -> JsonValue {
	match f {
		Feature::AprsStation{callsign, symbol, last_seen, last_pos, last_packet} => json!({
      		"type": "Feature",
      		"geometry": from_opt_position(last_pos),
      		// "id": tr.id(),
      		"properties": {
	      		"aprs": "station",
	      		"callsign": callsign,
	      		"symbol": from_symbol(symbol),
	      		// "comment": st.comment(),
	      		//"path": None,	
	      		// "lastseen": time::strftime("%Y-%m-%dT%H:%M:%SZ", &tr.last_seen).unwrap_or(String::from("")),      			
	      		"lastseen": last_seen.timestamp(), 
	      		"rawpacket": last_packet,     			
      		},
    	}),
    }
}

pub fn from_collection(c: Collection) -> JsonValue {
	let jsf = c.features().map(|f| from_feature(f.clone())).collect::<Vec<JsonValue>>();
	json!({
  		"type": "FeatureCollection",
  		"features": jsf,	      			
	})
}

fn from_opt_position(v: Option<Position>) -> JsonValue {
	match v {
		Some(p) => json!({"type": "Point", "coordinates": p.coordinates()}),
		None => json!(null),
	}
}

pub fn from_symbol(v: Symbol) -> JsonValue {
	json!(format!("{:?}", v))
}

pub fn collection_to_vec_pretty(c: Collection) -> Vec<u8> {
	to_vec_pretty(&from_collection(c)).unwrap()
}
