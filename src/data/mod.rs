#![allow(dead_code)]
pub mod formats;
pub mod stores;
pub mod model;

use data::model::{Collection};
use data::stores::aprs_log;
use data::formats::{aprs, geojson};
use logger::{OkOrLog, LogLevel};
use std::sync::{Arc, RwLock};
use std::thread;

#[derive(Debug, Clone)]
pub struct PlayaData {
	data : Arc<RwLock<Collection>>,
}

static SEED_LOG: &'static str = include_str!("seed.log");

impl PlayaData {
	pub fn new(log_path: String, digest_path: String) -> PlayaData {
		let data = PlayaData{ data: Arc::new(RwLock::new(Collection::new())) };
	    
	    // Load seed data
		// aprs_log::read_mem(SEED_LOG).filter_map(|raw_packet| aprs::parse(raw_packet)
		// 		.ok_or_log())
		// 	.for_each(|feature| data.data.write().unwrap().update(feature));

		// Load digest
	    if let Ok(iter) = aprs_log::read(&digest_path) {
    		iter.filter_map(|raw_packet| aprs::parse(raw_packet)
    				.ok_or_log())
    			.for_each(|feature| data.data.write().unwrap().update(feature))
	    }

	    // Load full log (in a separate thread)
	    if let Ok(iter) = aprs_log::read(&log_path) {
			let cloned = data.clone();
		    thread::spawn(move || {
	    		iter.filter_map(|raw_packet| aprs::parse(raw_packet)
	    				.ok_or_log_as(LogLevel::Debug))
	    			.for_each(|feature| cloned.data.write().unwrap().update(feature))
		    });	    	
	    }
	    data
	}
	
	pub fn add_aprs_source<Iter>(&mut self, iter : Iter) 
		where Iter: 'static + Send + Iterator<Item = aprs::RawPacket> {
	    let cloned = self.clone();
	    thread::spawn(move || {
	    	iter.filter_map(|raw_packet| aprs::parse(raw_packet).ok_or_log())
	    		.inspect(|f| info!("{:?}", f))
	    		.for_each(|feature| cloned.data.write().unwrap().update(feature))
	    });
	}

	pub fn to_pretty_geojson(&self) -> Vec<u8> {
		geojson::collection_to_vec_pretty(self.data.read().unwrap_or_log_and_exit(-1).clone())
	}
}
