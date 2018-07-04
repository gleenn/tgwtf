pub mod aprs_log;
pub mod aprs_is;
pub mod aprs_serial;

// use std::thread;
// use std::iter::repeat;
// use std::time::Duration;
// use data::formats::aprs::RawPacket;

// pub fn retry<F>(gen: F) 
// 	where F: Fn() -> Iterator<Item = RawPacket> {
//     repeat(())
//         .inspect(|_| thread::sleep(Duration::new(3,0)))
//         .map(|_| gen())
//         .filter_map(|r| r.ok_or_log())
//         .flat_map(|i| i)
// }
