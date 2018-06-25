#![allow(dead_code)]
pub use aprs_proto::{Position, Symbol};
use std::collections::{HashMap, hash_map::Keys, hash_map::Values};
use chrono::{DateTime, Utc};

pub const EARTH_R : f32 =  6378137.0;

pub type Point = (f32, f32);

pub fn distance(from: Point, to: Point) -> f32 {
    let lon1 = from.0.to_radians();
    let lat1 = from.1.to_radians();
    let lon2 = to.0.to_radians(); 
    let lat2 = to.1.to_radians();
    let dlon = lon2 - lon1;

    (lat1.sin()*lat2.sin() + lat1.cos()*lat2.cos()*dlon.cos()).acos() * EARTH_R
}

#[derive(Debug, Clone)]
pub enum Feature {
	AprsStation{
		callsign: String,
		symbol: Symbol,
		last_seen: DateTime<Utc>,
		last_pos: Option<Position>, 
		last_packet: Option<String>,
	}
}

impl Feature {
	pub fn id(&self) -> String {
		match self {
			Feature::AprsStation{callsign, ..} => format!("aprs/{}", callsign), 
		}
	}
	
	pub fn position(&self) -> Option<Position> {
		match self {
			Feature::AprsStation{last_pos, ..} => *last_pos, 
		}
	}

	pub fn last_packet(&self) -> Option<&str> {
		match self {
			Feature::AprsStation{last_packet, ..} => last_packet.as_ref().map(|s| &**s), 
		}
	}

	pub fn near_brc(&self) -> bool {
		const BRC_C : (f32, f32) = (-119.2066, 40.7866);
		let pos = self.position();
		pos.is_some() && distance(pos.unwrap().coordinates(), BRC_C) < 10000.0
	}
}

#[derive(Debug, Clone)]
pub struct Collection {
	features_by_id : HashMap<String, Feature>
}

impl Collection {
	pub fn new() -> Collection {
		Collection{ features_by_id : HashMap::new() }
	}

	pub fn contains_id(&self, id: &str) -> bool {
		self.features_by_id.contains_key(id)
	}

	pub fn feature_ids(&self) -> Keys<String, Feature> {
		self.features_by_id.keys()
	}

	pub fn features(&self) -> Values<String, Feature> {
		self.features_by_id.values()
	}

	pub fn feature(&self, id: &str) -> Option<&Feature> {
		self.features_by_id.get(id)
	}

	pub fn update(&mut self, feat : Feature) {
		self.features_by_id.insert(feat.id(), feat);
	}
}
